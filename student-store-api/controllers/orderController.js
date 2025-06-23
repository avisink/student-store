const prisma = require("../src/db/db.js");

//controllers for products
const getAll = async (req, res) => {

const orders = await prisma.order.findMany({
  include: { order_items: true },
});

// For each order, calculate and update the total_price
await Promise.all(
  orders.map(async (order) => {
    const total = order.order_items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    // Only update if the total is different (optional optimization)
    if (order.total_price !== total) {
      await prisma.order.update({
        where: { order_id: order.order_id },
        data: { total_price: total },
      });
      order.total_price = total; // Update the value in the returned object
    }
  })
);

res.json(orders);
};

const getById = async (req, res) => {
  const id = Number(req.params.id);
  const order = await prisma.order.findUnique({ where: { order_id: id } });
  if (!order) return res.status(404).json({ error: "Not found!" });
  res.json(order);
};

const getWithItems = async (req, res) => {
  const id = Number(req.params.id);
  const order = await prisma.order.findUnique({
    where: { order_id: id },
    include: { order_items: true },
  });
  if (!order) return res.status(404).json({ error: "Not found!" });
  res.json(order);
};

//update to get total logic
const getTotal = async (req, res) => {
    const order_id = Number(req.params.order_id);
    const order = await prisma.order.findUnique({
      where: { order_id },
      include: { order_items: true },
    });
    if (!order) return res.status(404).json({ error: "Order not found!" });

    const total = order.order_items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    await prisma.order.update({
      where: { order_id },
      data: { total_price: total },
    });

    res.json({ order_id, total });
};

const create = async (req, res) => {
  const { customer_id, status } = req.body;
  const newOrder = await prisma.order.create({
    data: { customer_id, status },
  });
  res.status(201).json(newOrder);
};

const createOrderItems = async (req, res) => {
  const order_id = Number(req.params.id);
  const order = await prisma.order.findUnique({ where: { order_id } });
  if (!order) return res.status(404).json({ error: "Order not found!" });

  // so that i can add one or multiple items
  const items = Array.isArray(req.body) ? req.body : [req.body];

  try {
    const createdItems = await Promise.all(
      items.map((item) =>
        prisma.orderItem.create({
          data: {
            order_id,
            product_id: item.product_id,
            price: item.price,
            quantity: item.quantity,
          },
        })
      )
    );
    res.status(201).json(createdItems);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
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
  getTotal,
  getWithItems,
  create,
  createOrderItems,
  update,
  remove,
};
