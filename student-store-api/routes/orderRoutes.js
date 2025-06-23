const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderController.js");


router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.get("/:order_id/total", controller.getTotal);
router.get("/:id/items", controller.getWithItems);
router.post("/", controller.create);
router.post("/:id/items", controller.createOrderItems);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);



module.exports = router;
