import { SSLCheckResult } from "@/types";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

/**
 * Checks the SSL certificate for a given domain.
 * @param domain The domain to check the SSL certificate for.
 * @returns The SSL certificate check result.
 */
export const checkCertificate = async (
  domain: string
): Promise<SSLCheckResult> => {
  const response = await axios.get<SSLCheckResult>(
    `${API_BASE_URL}/ssl/check?domain=${domain}`
  );
  return response.data;
};

/**
 * Fetches all checked SSL certificates.
 * @returns An array of all checked SSL certificates.
 */
export const fetchAllCertificates = async (): Promise<SSLCheckResult[]> => {
  const response = await axios.get<SSLCheckResult[]>(
    `${API_BASE_URL}/ssl/certificates`
  );
  return response.data;
};
