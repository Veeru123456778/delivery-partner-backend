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
const delivery_partner = require("./routes/delivery-partner");
app.use("/api/v1/auth", delivery_partner);

const mapsRoutes = require("./routes/maps.routes");
app.use("/api/v1/maps", mapsRoutes);

//activate
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});



// const express = require("express");
// const app = express();
// const http = require("http");
// const server = http.createServer(app);
// const socketIo = require("socket.io");

// const io = socketIo(server, {
//   cors: {
//     origin: "*", // Allow all origins
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("A user connected");
  
//   socket.on("join_room", (workArea) => {
//     console.log(`User joined from: ${workArea}`);
//     socket.join(workArea);
//   });
  
//   socket.on("order-request",(orderDetails)=>{
//     console.log("Order Request Received:", orderDetails);
//     // Emit the order request to the specific work area
//     io.to(orderDetails.workArea).emit("order-request", orderDetails);
//   })

//   socket.on("order-request-accepted", (deliveryPartnerDetails) => {
//     console.log("Order Request Accepted by Delivery Partner: ", deliveryPartnerDetails);
//     // Emit the acceptance message to the specific work area
//     io.to(deliveryPartnerDetails.workArea).emit("order-request-accepted", deliveryPartnerDetails);
//   })

   

//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
//   // You can add more event listeners here
// }
// );

// require("dotenv").config();
// const PORT = process.env.PORT || 4000;

// //cookie-parser - what is this and why we need this ?

// const cookieParser = require("cookie-parser");
// app.use(cookieParser());

// app.use(express.json());

// require("./config/database").connect();

// // Add a default route
// app.get("/", (req, res) => {
//   res.send("Welcome to the dummy route of vendor of CakeWake project!");
// });

// const { auth } = require("./middleware/auth");

// // Apply auth middleware only to protected routes
// const profileRoutes = require("./routes/profile");
// app.use("/api/v1/profile", auth, profileRoutes);

// const locationRoutes = require("./routes/location");
// app.use("/api/v1/location", auth, locationRoutes);

// //route import and mount
// const vendor = require("./routes/delivery-partner");
// const { userInfo } = require("os");
// app.use("/api/v1/auth", vendor);

// const mapsRoutes = require("./routes/maps.routes");
// app.use("/api/v1/maps", mapsRoutes);

// //activate
// // app.listen(PORT, () => {
// //   console.log(`App is listening at ${PORT}`);
// // });

// server.listen(PORT,()=>{
//   console.log(`Server is Listening at ${PORT}`);
// })