require("dotenv").config();
const express = require("express"); //importing express
const app = express(); //gets all express functions n the app variable, acts as an obj key, so i can do app.get or sumn
const port = process.env.port || 3000;
const productRoutes = require("./routes/productRoutes")
const orderRoutes = require("./routes/orderRoutes");
app.use(express.json());
app.use("/products", productRoutes)
app.use("/orders", orderRoutes);

app.listen(port, () => {
  //2 arguemnts
  console.log(`Server running at http://localhost:${port}!`);
});

//Create - POST, Read - GET, Update- PUT, Delete- Delete
