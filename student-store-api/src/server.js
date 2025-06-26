require("dotenv").config();
const express = require("express"); 
const app = express();
const port = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL;
const productRoutes = require("../routes/productRoutes")
const orderRoutes = require("../routes/orderRoutes.js");
const itemOrderRoutes = require("../routes/orderItemRoutes.js");

const cors = require('cors')

const corsOptions = {
  origin: `${FRONTEND_URL}`,
}
app.use(cors(corsOptions));

app.use(express.json());
app.use("/products", productRoutes)
app.use("/orders", orderRoutes);
app.use("/orderItems", itemOrderRoutes);


app.listen(port, () => {
  //2 arguemnts
  console.log(`Server running at http://localhost:${port}!`);
});

//Create - POST, Read - GET, Update- PUT, Delete- Delete
