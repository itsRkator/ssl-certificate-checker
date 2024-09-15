const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const appRoutes = require("./src/app");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const connectDatabaseWithRetryMechanism = () => {
  console.log("Attempting to connect to Database...");
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to the Database"))
    .catch((err) => {
      console.error(`Failed to connect database. Error: ${err}`);
      console.log("Retrying in 5 seconds...");
      setTimeout(connectDatabaseWithRetryMechanism, 5000); // Retry after 5 seconds
    });
};

connectDatabaseWithRetryMechanism();

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.get("/", (req, res) => {
  res.json({ message: "App is running" });
});

app.use("/api", appRoutes);

// app.get("/dashboard", async (req, res) => {
//   const certificates = await Certificate.find({});
//   res.render("dashboard", { certificates });
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
