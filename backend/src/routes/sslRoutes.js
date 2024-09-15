const express = require("express");
const router = express.Router();
const {
  checkSSL,
  getAllSSLCertificates,
} = require("../controllers/sslController");

router.get("/check", checkSSL);
router.get("/certificates", getAllSSLCertificates);

module.exports = router;
