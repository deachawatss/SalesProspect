namespace ProspectSync.Api.Models
{
    public class Prospect
    {
        public string Prospect_Key { get; set; } = string.Empty;
        public string? Customer_Key { get; set; }
        public string? Customer_Name { get; set; }
        public string? Address_1 { get; set; }
        public string? Address_2 { get; set; }
        public string? Address_3 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Zip_Code { get; set; }
        public string? Country { get; set; }
        public string? Attn_Name { get; set; }
        public string? Phone_1 { get; set; }
        public string? Contact_Name { get; set; }
        public string? Phone_2 { get; set; }
        public string? Resale_No { get; set; }
        public string? Telex_Or_Twx_No { get; set; }
        public string? Fax_No { get; set; }
        public string? Cred_Card_No { get; set; }
        public string? Cred_Card_Typ { get; set; }
        public DateTime? Expir_Date { get; set; }
        public string? Vendor_Key { get; set; }
        public decimal? Cr_Limit_Amt { get; set; }
        public string? Default_Tax { get; set; }
        public string? Terms_Code { get; set; }
        public string? Fob_Code { get; set; }
        public string? Ship_Via_Code { get; set; }
        public string? Cust_Class_Ky { get; set; }
        public string? Location_Ky { get; set; }
        public string? Territory_Ky { get; set; }
        public string? Salespersn_Ky { get; set; }
        public string? Language_key { get; set; }
        public string? Inv_Comnt_Ky { get; set; }
        public string? Stmt_Cmnt_Ky { get; set; }
        public string? Tax_Country { get; set; }
        public string? Tax_Id { get; set; }
        public string? Reserved_1 { get; set; }
        public string? Reserved_2 { get; set; }
        public decimal? Uninvoiced_Cr { get; set; }
        public string? Spare { get; set; }
        public string? RecUserID { get; set; }
        public DateTime? RecDate { get; set; }
        public string? FinCustKey { get; set; }
        public string? Ship_to_key { get; set; }
        public string? FreightFlag { get; set; }
        public string? RemitTo { get; set; }
        public string? Email { get; set; }
        public string? CustGrpID { get; set; }
        public string? Location { get; set; }
        public string? RemitToKey { get; set; }
        public string? ReqApproval { get; set; }
        public string? CustStatus { get; set; }
        public string? ARTERMSKEY { get; set; }
        public string? ARTERMSDESC { get; set; }
        public string? BILLINGCYCLE { get; set; }
        public string? BILLINGCYCLEDESC { get; set; }
        public string? INTERESTPROFILE { get; set; }
        public string? INTERESTPROFILEDESC { get; set; }
        public string? FreightKey { get; set; }
        public decimal? FreightChkLimitMax { get; set; }
        public decimal? FreightChkLimitMin { get; set; }
        public string? User1 { get; set; }
        public string? User2 { get; set; }
        public string? User3 { get; set; }
        public string? User4 { get; set; }
        public string? User5 { get; set; }
        public string? User6 { get; set; }
        public string? User7 { get; set; }
        public string? User8 { get; set; }
        public string? User9 { get; set; }
        public string? User10 { get; set; }
        public string? User11 { get; set; }
        public string? User12 { get; set; }
        public string? URL { get; set; }
        public string? ESG_REASON { get; set; }
        public string? ESG_APPROVER { get; set; }
        public string? CUSTOM1 { get; set; }
        public string? CUSTOM2 { get; set; }
        public string? CUSTOM3 { get; set; }
        public string? CUSTOM4 { get; set; }
        public string? CUSTOM5 { get; set; }
        public string? CUSTOM6 { get; set; }
        public string? CUSTOM7 { get; set; }
        public string? CUSTOM8 { get; set; }
        public string? CUSTOM9 { get; set; }
        public string? CUSTOM10 { get; set; }
        public string? CorpIdntyNo { get; set; }
    }

    public class ProspectSearchResult
    {
        public string Key { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
    }

    public class ProspectStatus
    {
        public bool ExistsInTfclive { get; set; }
        public bool ExistsInSr { get; set; }
        public Prospect? Data { get; set; }
    }

    public class TransferResult
    {
        public bool Transferred { get; set; }
        public string? Message { get; set; }
    }
} 