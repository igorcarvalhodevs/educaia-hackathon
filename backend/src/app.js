const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./modules/auth/auth.routes");
const planningRoutes = require("./modules/plannings/planning.routes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
    application: "EducaIA",
  });
});

app.use("/auth", authRoutes);

app.use(
  "/plannings",
  planningRoutes
);

module.exports = app;
