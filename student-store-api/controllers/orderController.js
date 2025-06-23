const prisma = require("../src/db/db.js");

//controllers for products
const getAll = async (req, res) => {
  const orders = await prisma.order.findMany();
  res.json(orders);
};

const getById = async (req, res) => {
  const id = Number(req.params.id);
  const order = await prisma.order.findUnique({ where: { order_id: id } });
  if (!order) return res.status(404).json({ error: "Not found!" });
  res.json(order);
};

const create = async (req, res) => {
  const { customer_id, total_price, status, order_items } = req.body;
  const newOrder = await prisma.order.create({
    data: { customer_id, total_price, status },
  });
  res.status(201).json(newOrder);
};

const update = async (req, res) => {
  const id = Number(req.params.id);
  const { order_id, customer_id, total_price, status } = req.body;
  const updatedOrder = await prisma.order.update({
    where: { order_id: id },
    data: { order_id, customer_id, total_price, status },
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
  getById,
  create,
  update,
  remove,
};
