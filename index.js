const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 4000;

//cookie-parser - what is this and why we need this ?

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());

require("./config/database").connect();

// Add a default route
app.get("/", (req, res) => {
  res.send("Welcome to the dummy route of vendor of CakeWake project!");
});

const { auth } = require("./middleware/auth");

// Apply auth middleware only to protected routes
const profileRoutes = require("./routes/profile");
app.use("/api/v1/profile", auth, profileRoutes);

const locationRoutes = require("./routes/location");
app.use("/api/v1/location", auth, locationRoutes);

//route import and mount
const vendor = require("./routes/delivery-partner");
app.use("/api/v1/auth", vendor);

//activate
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
