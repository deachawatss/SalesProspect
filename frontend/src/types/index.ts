export interface Prospect {
  prospect_Key: string;
  customer_Key?: string;
  customer_Name?: string;
  address_1?: string;
  address_2?: string;
  address_3?: string;
  city?: string;
  state?: string;
  zip_Code?: string;
  country?: string;
  attn_Name?: string;
  phone_1?: string;
  contact_Name?: string;
  phone_2?: string;
  resale_No?: string;
  telex_Or_Twx_No?: string;
  fax_No?: string;
  cred_Card_No?: string;
  cred_Card_Typ?: string;
  expir_Date?: string;
  vendor_Key?: string;
  cr_Limit_Amt?: number;
  default_Tax?: string;
  terms_Code?: string;
  fob_Code?: string;
  ship_Via_Code?: string;
  cust_Class_Ky?: string;
  location_Ky?: string;
  territory_Ky?: string;
  salespersn_Ky?: string;
  language_key?: string;
  inv_Comnt_Ky?: string;
  stmt_Cmnt_Ky?: string;
  tax_Country?: string;
  tax_Id?: string;
  reserved_1?: string;
  reserved_2?: string;
  uninvoiced_Cr?: number;
  spare?: string;
  recUserID?: string;
  recDate?: string;
  finCustKey?: string;
  ship_to_key?: string;
  freightFlag?: string;
  remitTo?: string;
  email?: string;
  custGrpID?: string;
  location?: string;
  remitToKey?: string;
  reqApproval?: string;
  custStatus?: string;
  artermskey?: string;
  artermsdesc?: string;
  billingcycle?: string;
  billingcycledesc?: string;
  interestprofile?: string;
  interestprofiledesc?: string;
  freightKey?: string;
  freightChkLimitMax?: number;
  freightChkLimitMin?: number;
  user1?: string;
  user2?: string;
  user3?: string;
  user4?: string;
  user5?: string;
  user6?: string;
  user7?: string;
  user8?: string;
  user9?: string;
  user10?: string;
  user11?: string;
  user12?: string;
  url?: string;
  esg_REASON?: string;
  esg_APPROVER?: string;
  custom1?: string;
  custom2?: string;
  custom3?: string;
  custom4?: string;
  custom5?: string;
  custom6?: string;
  custom7?: string;
  custom8?: string;
  custom9?: string;
  custom10?: string;
  corpIdntyNo?: string;
}

export interface ProspectSearchResult {
  key: string;
  customerName: string;
}

export interface ProspectStatus {
  existsInTfclive: boolean;
  existsInSr: boolean;
  data?: Prospect;
}

export interface TransferResult {
  transferred: boolean;
  message?: string;
}

 