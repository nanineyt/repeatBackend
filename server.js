const express = require("express");
const dotenv = require("dotenv").config();
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const errorHandler = require("./middleware/errorMiddleware");
const db = require("./config/dbconfig");

const app = express();
app.use(helmet());
app.use(cors());
app.use(
  morgan(
    ":remote-addr :remote-user [:date[iso]] :method :url HTTP/:http-version :status :res[content-length] - :response-time ms"
  )
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
db();

//////// transaction
const userRoute = require("./routes/userRoute");
const scheduleRoute = require("./routes/scheduleRoute");
const reservationRoute = require("./routes/reservationRoute");
const customerRoute = require("./routes/customerRoute");

//////  masterData
const branchRoute = require("./routes/branchRoute");
const tableRoute = require("./routes/tableRoute");

///////////////////////////////
app.use("/api/user", userRoute);
app.use("/api/branch", branchRoute);
app.use("/api/table", tableRoute);
app.use("/api/customer", customerRoute);

app.use("/api/schedule", scheduleRoute);
app.use("/api/reserve", reservationRoute);

app.use(errorHandler);

const port = process.env.SERVER_PORT || 3000;
app.listen(port, () => {
  console.log(`Server starting at port :${port}`);
});
