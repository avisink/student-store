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
  
const update = async (req, res) => {
  const id = Number(req.params.id);
  const { order_id, total_price, status } = req.body;
  const updatedOrder = await prisma.order.update({
    where: { order_id: id },
    data: { order_id, total_price, status },
  });
  res.json(updatedOrder);
};

const remove = async (req, res) => {
  const id = Number(req.params.id);
  await prisma.order.delete({ where: { order_id: id } });
  res.status(204).end();
};
  
  module.exports = {
    getAll,
    getByOrderId,
    create,
    update,
    remove
  };
  