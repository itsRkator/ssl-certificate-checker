import { SSLCheckResult } from "@/types";
import React from "react";

interface CertificateTableProps {
  certificates: SSLCheckResult[];
}

const CertificateResultTable: React.FC<CertificateTableProps> = ({
  certificates,
}) => {
  return (
    <div className="mt-3 p-4 bg-white rounded-lg shadow-lg w-full max-w-[90%]">
      <div className="max-h-[600px] overflow-y-scroll">
        <table className="table-auto w-full border-collapse overflow-scroll">
          <thead>
            <tr>
              <th className="border text-left">S. No</th>
              <th className="border text-left">Domain</th>
              <th className="border text-left">Validity</th>
              <th className="border text-left">Expiration</th>
              <th className="border text-left">Issuer</th>
              <th className="border text-left">Subject</th>
              <th className="border text-left">CRL/OCSP</th>
              <th className="border text-left">CA Validity</th>
              <th className="border text-left">Self-Signed Certificate</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert, index) => (
              <tr key={index}>
                <td className="border">{index + 1}</td>
                <td className="border">{cert.domain}</td>
                <td className="border">{cert.valid ? "Valid" : "Invalid"}</td>
                <td className="border">{cert.expirationDate}</td>
                <td className="border">{cert.issuer.O}</td>
                <td className="border">{cert.subject.CN}</td>
                <td className="border">{cert.revoked ? "Revoked" : "Valid"}</td>
                <td className="border">
                  {cert.caValidity ? "Valid" : "Invalid"}
                </td>
                <td className="border">{cert.isSelfSigned ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CertificateResultTable;
