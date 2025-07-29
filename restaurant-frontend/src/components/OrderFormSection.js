import React, { useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const socket = io("http://localhost:5000");

const OrderFormSection = ({ orderItems, setOrderItems, onOrderPlaced }) => {
  const [tableNumber, setTableNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tableNumber || orderItems.length === 0) {
      setError("Vui lòng nhập số bàn và chọn ít nhất một món!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/orders", {
        items: orderItems.map((item) => ({
          menuItem: item.menuItem || item._id, // Xử lý cả hai trường hợp
          quantity: item.quantity,
        })),
        tableNumber: parseInt(tableNumber),
      });
      onOrderPlaced(response.data);
      socket.emit("newOrder", response.data);
      setOrderItems([]);
      setTableNumber("");
      setError("");
    } catch (error) {
      setError("Lỗi khi đặt đơn hàng: " + error.message);
      console.error("API Error:", error);
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Đặt đơn hàng
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          type="number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          label="Số bàn"
          fullWidth
          required
          style={{ marginBottom: "10px" }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Đặt hàng
        </Button>
        {error && (
          <Typography color="error" style={{ marginTop: "10px" }}>
            {error}
          </Typography>
        )}
      </form>
      <Typography variant="subtitle1" style={{ marginTop: "20px" }}>
        Món đã chọn
      </Typography>
      <List>
        {orderItems.map((item, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={item.name || item.itemName || `Món ${item.menuItem || item._id}`} // Xử lý nhiều trường hợp
              secondary={`Số lượng: ${item.quantity}`}
            />
            <Button
              variant="outlined"
              color="secondary"
              onClick={() =>
                setOrderItems(orderItems.filter((_, i) => i !== index))
              }
            >
              Xóa
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default OrderFormSection;