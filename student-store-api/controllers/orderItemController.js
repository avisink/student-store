const prisma = require("../src/db/db.js");

//controllers for products
const getAll = async (req, res) => {
    const order_items = await prisma.OrderItem.findMany();
    res.json(order_items);
  };
  
  const getByOrderId = async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "order_id parameter is required" });
    }
    const orderItems = await prisma.OrderItem.findMany({
      where: { order_id: Number(id) },
    });
    res.json(orderItems);
  };
  

const create = async (req, res) => {
    const { order_id, product_id,  price, quantity } = req.body;
    const newOrder = await prisma.OrderItem.create({
      data: { order_id, product_id, price, quantity },
    });
    res.status(201).json(newOrder);
};
  

  
  module.exports = {
    getAll,
    getByOrderId,
    create
  };
  