require("dotenv").config();
const colors = require("colors");
const express = require("express");
const cors = require("cors");
const connectDB = require("./Database/Config");
const app = express();
const userRoutes = require("./Routes/userRoutes");

//calling the function to connect backend to database
connectDB();

//use some middlewares
app.use(cors()); // here if we use this we can collect any data through api request from any port number
app.use(express.json()); //it is mainly used to accept json formated request in  backend req body

//Routes defining seems like
app.get("/", (req, res) => {
  res.send("Welcome to API");
});

//defining router handler function for receiving form data from frontend
app.use("/api/users", userRoutes);

//setting the PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`.blue);
});
