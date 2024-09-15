'use client';

import { useState, useEffect } from 'react';

import CertificateResultTable from '../components/CertificateResult';
import { SSLCheckResult } from '@/types';
import { checkCertificate, fetchAllCertificates } from './services/apiService';
import axios from 'axios';


export default function Home() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<SSLCheckResult | null>(null);
  const [error, setError] = useState('');
  const [certificates, setCertificates] = useState<SSLCheckResult[]>([]);
  const [loading, setLoading] = useState(false); // State for loading
  const [fetchingCertificates, setFetchingCertificates] = useState(false); // State for fetching certificates

  const handleCheckCertificate = async () => {
    setLoading(true); // Show loader when checking SSL
    try {
      const data = await checkCertificate(domain);
      setResult(data);
      setError('');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error occurred');
      } else {
        setError('An unexpected error occurred');
      }
      setResult(null);
    } finally {
      setLoading(false); // Hide loader after SSL check
    }
  };

  const loadAllCertificates = async () => {
    setFetchingCertificates(true); // Show loader when fetching certificates
    try {
      const data = await fetchAllCertificates();
      setCertificates(data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setFetchingCertificates(false); // Hide loader after fetching
    }
  };

  useEffect(() => {
    loadAllCertificates();
  }, [result]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[84vh] bg-gray-100">
      <input
        type="text"
        placeholder="Enter domain name"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        className="border p-2 w-full max-w-md mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleCheckCertificate}
        className="w-full max-w-md bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        disabled={loading} // Disable button while loading
      >
        {loading ? 'Checking...' : 'Check SSL'} {/* Show loader text */}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {result && <CertificateResultTable certificates={[result]} />}

      <h2 className="mt-8 text-xl font-bold">All Checked SSL Certificates</h2>
      {fetchingCertificates ? ( // Show loader while fetching certificates
        <p>Loading certificates...</p>
      ) : certificates.length === 0 ? ( // Show message when no certificates
        <p>No saved certificates available.</p>
      ) : (
        <CertificateResultTable certificates={certificates} />
      )}
    </div>
  );
}
