using Dapper;
using ProspectSync.Api.Models;
using System.Data;
using Microsoft.Data.SqlClient;

namespace ProspectSync.Api.Services
{
    public interface IProspectService
    {
        Task<IEnumerable<ProspectSearchResult>> SearchAsync(string query);
        Task<ProspectStatus> GetStatusAsync(string key);
        Task<TransferResult> TransferAsync(string key);
    }

    public class ProspectService : IProspectService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<ProspectService> _logger;

        public ProspectService(IConfiguration configuration, ILogger<ProspectService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        private SqlConnection CreateTfcliveConnection()
            => new SqlConnection(_configuration.GetConnectionString("Tfclive"));

        private SqlConnection CreateSrConnection()
            => new SqlConnection(_configuration.GetConnectionString("Sr"));

        public async Task<IEnumerable<ProspectSearchResult>> SearchAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Enumerable.Empty<ProspectSearchResult>();

            const string sql = @"
                SELECT TOP 20 
                    Prospect_Key as [Key], 
                    Customer_Name as CustomerName 
                FROM dbo.ARProspect
                WHERE Prospect_Key LIKE @query + '%'
                ORDER BY Prospect_Key";

            using var connection = CreateTfcliveConnection();
            var results = await connection.QueryAsync<ProspectSearchResult>(sql, new { query });
            return results;
        }

        public async Task<ProspectStatus> GetStatusAsync(string key)
        {
            if (string.IsNullOrWhiteSpace(key))
                throw new ArgumentException("Prospect key is required", nameof(key));

            var status = new ProspectStatus();

            // Check both databases in parallel
            var tfcliveTask = CheckTfcliveAsync(key);
            var srTask = CheckSrAsync(key);

            await Task.WhenAll(tfcliveTask, srTask);

            var (existsInTfclive, prospect) = await tfcliveTask;
            status.ExistsInTfclive = existsInTfclive;
            status.ExistsInSr = await srTask;
            status.Data = prospect;

            return status;
        }

        private async Task<(bool exists, Prospect? prospect)> CheckTfcliveAsync(string key)
        {
            const string sql = @"
                SELECT * FROM dbo.ARProspect 
                WHERE Prospect_Key = @key";

            using var connection = CreateTfcliveConnection();
            var prospect = await connection.QueryFirstOrDefaultAsync<Prospect>(sql, new { key });
            return (prospect != null, prospect);
        }

        private async Task<bool> CheckSrAsync(string key)
        {
            const string sql = @"
                SELECT COUNT(*) FROM dbo.ARProspect 
                WHERE Prospect_Key = @key";

            using var connection = CreateSrConnection();
            var count = await connection.ExecuteScalarAsync<int>(sql, new { key });
            return count > 0;
        }

        public async Task<TransferResult> TransferAsync(string key)
        {
            if (string.IsNullOrWhiteSpace(key))
                throw new ArgumentException("Prospect key is required", nameof(key));

            // Sanitize key - ASCII varchar(20)
            if (key.Length > 20 || !key.All(c => c <= 127))
                throw new ArgumentException("Invalid prospect key format", nameof(key));

            // Open connections to each database separately
            await using var tfcConnection = CreateTfcliveConnection();
            await using var srConnection = CreateSrConnection();

            await tfcConnection.OpenAsync();
            await srConnection.OpenAsync();

            await using var tfcTransaction = await tfcConnection.BeginTransactionAsync();
            await using var srTransaction = await srConnection.BeginTransactionAsync();

            try
            {
                // Re-check existence in both databases
                var existsInTfclive = await tfcConnection.ExecuteScalarAsync<int>(
                    "SELECT COUNT(*) FROM dbo.ARProspect WHERE Prospect_Key = @key",
                    new { key },
                    tfcTransaction) > 0;

                if (!existsInTfclive)
                {
                    await tfcTransaction.RollbackAsync();
                    await srTransaction.RollbackAsync();
                    return new TransferResult
                    {
                        Transferred = false,
                        Message = "Prospect not found in TFCLIVE"
                    };
                }

                var existsInSr = await srConnection.ExecuteScalarAsync<int>(
                    "SELECT COUNT(*) FROM dbo.ARProspect WHERE Prospect_Key = @key",
                    new { key },
                    srTransaction) > 0;

                if (existsInSr)
                {
                    await tfcTransaction.RollbackAsync();
                    await srTransaction.RollbackAsync();
                    return new TransferResult
                    {
                        Transferred = false,
                        Message = "Prospect already exists in SR"
                    };
                }

                // Fetch the prospect row from TFCLIVE
                var prospectRow = await tfcConnection.QuerySingleOrDefaultAsync<Prospect>(
                    "SELECT * FROM dbo.ARProspect WHERE Prospect_Key = @key",
                    new { key }, tfcTransaction);

                if (prospectRow == null)
                {
                    await tfcTransaction.RollbackAsync();
                    await srTransaction.RollbackAsync();
                    return new TransferResult
                    {
                        Transferred = false,
                        Message = "Prospect data not found in TFCLIVE."
                    };
                }

                // Perform the insert into SR using parameterised values
                const string insertSql = @"
                    INSERT INTO dbo.ARProspect (
                        Prospect_Key, Customer_Key, Customer_Name, Address_1, Address_2, Address_3,
                        City, State, Zip_Code, Country, Attn_Name, Phone_1, Contact_Name, Phone_2,
                        Resale_No, Telex_Or_Twx_No, Fax_No, Cred_Card_No, Cred_Card_Typ, Expir_Date,
                        Vendor_Key, Cr_Limit_Amt, Default_Tax, Terms_Code, Fob_Code, Ship_Via_Code,
                        Cust_Class_Ky, Location_Ky, Territory_Ky, Salespersn_Ky, Language_key,
                        Inv_Comnt_Ky, Stmt_Cmnt_Ky, Tax_Country, Tax_Id, Reserved_1, Reserved_2,
                        Uninvoiced_Cr, Spare, RecUserID, RecDate, FinCustKey, Ship_to_key,
                        FreightFlag, RemitTo, Email, CustGrpID, Location, RemitToKey, ReqApproval,
                        CustStatus, ARTERMSKEY, ARTERMSDESC, BILLINGCYCLE, BILLINGCYCLEDESC,
                        INTERESTPROFILE, INTERESTPROFILEDESC, FreightKey, FreightChkLimitMax,
                        FreightChkLimitMin, User1, User2, User3, User4, User5, User6, User7, User8,
                        User9, User10, User11, User12, URL, ESG_REASON, ESG_APPROVER, CUSTOM1, CUSTOM2,
                        CUSTOM3, CUSTOM4, CUSTOM5, CUSTOM6, CUSTOM7, CUSTOM8, CUSTOM9, CUSTOM10,
                        CorpIdntyNo
                    ) VALUES (
                        @Prospect_Key, @Customer_Key, @Customer_Name, @Address_1, @Address_2, @Address_3,
                        @City, @State, @Zip_Code, @Country, @Attn_Name, @Phone_1, @Contact_Name, @Phone_2,
                        @Resale_No, @Telex_Or_Twx_No, @Fax_No, @Cred_Card_No, @Cred_Card_Typ, @Expir_Date,
                        @Vendor_Key, @Cr_Limit_Amt, @Default_Tax, @Terms_Code, @Fob_Code, @Ship_Via_Code,
                        @Cust_Class_Ky, @Location_Ky, @Territory_Ky, @Salespersn_Ky, @Language_key,
                        @Inv_Comnt_Ky, @Stmt_Cmnt_Ky, @Tax_Country, @Tax_Id, @Reserved_1, @Reserved_2,
                        @Uninvoiced_Cr, @Spare, @RecUserID, @RecDate, @FinCustKey, @Ship_to_key,
                        @FreightFlag, @RemitTo, @Email, @CustGrpID, @Location, @RemitToKey, @ReqApproval,
                        @CustStatus, @ARTERMSKEY, @ARTERMSDESC, @BILLINGCYCLE, @BILLINGCYCLEDESC,
                        @INTERESTPROFILE, @INTERESTPROFILEDESC, @FreightKey, @FreightChkLimitMax,
                        @FreightChkLimitMin, @User1, @User2, @User3, @User4, @User5, @User6, @User7, @User8,
                        @User9, @User10, @User11, @User12, @URL, @ESG_REASON, @ESG_APPROVER, @CUSTOM1, @CUSTOM2,
                        @CUSTOM3, @CUSTOM4, @CUSTOM5, @CUSTOM6, @CUSTOM7, @CUSTOM8, @CUSTOM9, @CUSTOM10,
                        @CorpIdntyNo
                    );";

                var affected = await srConnection.ExecuteAsync(insertSql, prospectRow, srTransaction);

                if (affected == 0)
                {
                    // No rows copied – rollback and inform
                    await tfcTransaction.RollbackAsync();
                    await srTransaction.RollbackAsync();
                    return new TransferResult {
                        Transferred = false,
                        Message = "Prospect copy failed – source row not found."
                    };
                }

                // commit both
                await srTransaction.CommitAsync();
                await tfcTransaction.CommitAsync();

                _logger.LogInformation("Successfully transferred prospect {ProspectKey} from TFCLIVE to SR", key);
                return new TransferResult { Transferred = true };
            }
            catch (Exception ex)
            {
                await tfcTransaction.RollbackAsync();
                await srTransaction.RollbackAsync();
                _logger.LogError(ex, "Error transferring prospect {ProspectKey}", key);
                throw;
            }
        }
    }
} 