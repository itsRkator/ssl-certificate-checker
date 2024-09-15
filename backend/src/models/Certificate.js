const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema(
  {
    domain: { type: String, required: true, unique: true },
    valid: { type: Boolean, required: true }, // Validity Status
    expirationDate: { type: String, required: true }, // Expiration Date as string
    issuer: { type: mongoose.Schema.Types.Mixed, required: true }, // Issuer as a JSON object
    subject: { type: mongoose.Schema.Types.Mixed, required: true }, // Subject as a JSON object
    revoked: { type: Boolean, required: true }, // CRL/OCSP Status
    caValidity: { type: Boolean, required: true }, // CA Validity Check
    isSelfSigned: { type: Boolean, required: true }, // Self-Signed Certificate
    checkedAt: { type: Date, default: Date.now }, // Date when the check was performed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", CertificateSchema);
