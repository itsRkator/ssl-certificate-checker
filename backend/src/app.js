const express = require("express");
const sslRoutes = require("./routes/sslRoutes");

const router = express.Router();

router.use("/ssl", sslRoutes);

module.exports = router;
