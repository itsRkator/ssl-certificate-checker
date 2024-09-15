export interface SSLCheckResult {
  domain: string; // Domain Name
  valid: boolean; // Validity Status
  expirationDate: string; // Expiration Date
  issuer: IssuerSubject; // Issuer details as a structured object
  subject: IssuerSubject; // Subject details as a structured object
  revoked: boolean; // CRL/OCSP Status
  caValidity: boolean; // CA Validity Check
  isSelfSigned: boolean; // Self-Signed Certificate
  checkedAt: string; // Timestamp of when the SSL check was performed
}

// Define a specific type for issuer and subject details
export interface IssuerSubject {
  C: string; // Country
  ST: string; // State or province name
  L: string; // Locality name
  O: string; // Organization name
  OU: string; // Organizational unit name
  CN: string; // Common name
  [key: string]: string | undefined; // Allow additional properties if needed
}
