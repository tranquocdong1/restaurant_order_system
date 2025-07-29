import express from "express";
import Menu from "../models/Menu.js";

const router = express.Router();

// Lấy tất cả món ăn
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Thêm món ăn mới
router.post("/", async (req, res) => {
  const { name, price, category } = req.body;
  const menuItem = new Menu({ name, price, category });
  try {
    const newMenuItem = await menuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
