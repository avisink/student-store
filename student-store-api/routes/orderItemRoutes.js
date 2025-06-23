const express = require("express");
const router = express.Router();
const orderItemController = require("../controllers/orderItemController.js");

router.get("/", orderItemController.getAll);
router.get("/:id/items", orderItemController.getByOrderId);
router.post("/:id/items", orderItemController.create);

module.exports = router;