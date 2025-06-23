const prisma = require("../src/db/db.js");

//controllers for products
const getAll = async (req, res) => {
  const products = await prisma.product.findMany(); 
  const { name, category, price, sort } = req.query;
  let filteredProducts = products;

  //Filter by name if query param exsists
  if (name) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  //Filter by type
  if (category) {
    filteredProducts = filteredProducts.filter((p) =>
      p.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (price) {
    filteredProducts = filteredProducts.filter((p) => p.price == price);
  }

  //for ther sorting logic
  if (sort === "price") {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "name") {
    filteredProducts = filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  res.json(filteredProducts);
};

const getById = async (req, res) => {
  const id = Number(req.params.id); 
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ error: "Not found!" });
  res.json(product);
};

const create = async (req, res) => {
  const { name, description, price, image_url, category } = req.body;
  const newProduct = await prisma.product.create({
    data: { name, description, price, image_url, category },
  });
  res.status(201).json(newProduct);
};

const update = async (req, res) => {
  const id = Number(req.params.id);
  const { name, description, price, image_url, category } = req.body;
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: { name, description, price, image_url, category },
  });
  res.json(updatedProduct);
};

const remove = async (req, res) => {
  const id = Number(req.params.id);
  await prisma.product.delete({ where: { id } });
  res.status(204).end();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
}