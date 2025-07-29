import express from "express";
import Order from "../models/Order.js";
import Menu from "../models/Menu.js";

const router = express.Router();

// Lấy tất cả đơn hàng
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("items.menuItem", "name");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tạo đơn hàng mới
router.post("/", async (req, res) => {
  const { items, tableNumber } = req.body;
  try {
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const menuItem = await Menu.findById(item.menuItem);
        if (!menuItem || !menuItem.available) {
          throw new Error(`Món ${item.menuItem} không khả dụng`);
        }
        return { menuItem: item.menuItem, quantity: item.quantity };
      })
    );
    const order = new Order({ items: orderItems, tableNumber });
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cập nhật trạng thái đơn hàng
router.put("/:id", async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) throw new Error("Đơn hàng không tìm thấy");
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
