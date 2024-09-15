const axios = require("axios");
const https = require("https");
const ocsp = require("ocsp");
const Certificate = require("../models/Certificate");

// Function to check SSL certificate of a domain
const checkSSL = async (req, res) => {
  const { domain } = req.query;

  try {
    const agent = new https.Agent({ rejectUnauthorized: false });

    const response = await axios.get(`https://${domain}`, {
      httpsAgent: agent.httpsAgent,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });

    const cert = response.request.socket.getPeerCertificate();

    if (!cert || !Object.keys(cert).length) {
      return res
        .status(400)
        .json({ valid: false, message: "No certificate found" });
    }

    // Extract necessary information from the certificate
    const isSelfSigned = cert.issuer.CN === cert.subject.CN;
    const isExpired = new Date(cert.valid_to) < new Date();
    const caValidity = cert.issuerCertificate ? true : false;

    let revoked = false;
    try {
      const ocspResponse = await new Promise((resolve, reject) => {
        ocsp.check(
          {
            cert: cert.raw,
            issuer: cert.issuerCertificate.raw,
          },
          (err, ocspResult) => {
            if (err) return reject(err);
            resolve(ocspResult);
          }
        );
      });

      revoked = ocspResponse.type === "revoked";
    } catch (e) {
      console.error("OCSP Check failed:", e.message);
    }

    // Save the certificate details in the database
    await Certificate.findOneAndUpdate(
      { domain }, // Filter by domain name
      {
        domain,
        valid: !isExpired && !isSelfSigned && !revoked, // Validity Status
        expirationDate: cert.valid_to, // Expiration Date
        issuer: cert.issuer, // Issuer details
        subject: cert.subject, // Subject details
        revoked, // CRL/OCSP Status
        caValidity, // CA Validity Check
        isSelfSigned, // Self-Signed Certificate status
        checkedAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Prepare the response
    const result = {
      domain,
      valid: !isExpired && !isSelfSigned && !revoked,
      expirationDate: cert.valid_to,
      issuer: cert.issuer,
      subject: cert.subject,
      revoked,
      caValidity,
      isSelfSigned,
    };

    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching SSL details", message: error.message });
  }
};

// Function to get all checked SSL certificates
const getAllSSLCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({});
    res.json(certificates);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching certificates", message: error.message });
  }
};

module.exports = { checkSSL, getAllSSLCertificates };
