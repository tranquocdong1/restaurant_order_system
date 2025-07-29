import React, { useState } from "react";
import Layout from "./components/Layout";
import { Container } from "@mui/material";

const App = () => {
  const [orderItems, setOrderItems] = useState([]);

  // Hàm thêm món vào giỏ hàng (được gọi từ MenuSection)
  const addToOrder = (item, quantity) => {
    console.log("addToOrder called with:", item, quantity);

    // Kiểm tra nếu món đã có trong giỏ hàng
    const existingItemIndex = orderItems.findIndex(
      (orderItem) =>
        orderItem.menuItem === item.menuItem || orderItem.menuItem === item._id
    );

    if (existingItemIndex > -1) {
      // Nếu món đã có, tăng số lượng
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setOrderItems(updatedItems);
      console.log("Updated existing item quantity");
    } else {
      // Nếu món chưa có, thêm mới
      const newOrderItem = {
        menuItem: item.menuItem || item._id, // ID để gửi API
        name: item.name, // Tên để hiển thị
        quantity: quantity,
        price: item.price,
        category: item.category,
      };
      setOrderItems((prevItems) => [...prevItems, newOrderItem]);
      console.log("Added new item to order:", newOrderItem);
    }
  };

  // Hàm xử lý sau khi đặt hàng thành công (được gọi từ OrderFormSection)
  const handleOrderPlaced = (orderData) => {
    console.log("Order placed successfully:", orderData);
    // Có thể thêm logic khác như hiển thị thông báo thành công
    // setOrderItems([]) - này đã được xử lý trong OrderFormSection
  };

  return (
    <Container>
      <Layout
        orderItems={orderItems}
        setOrderItems={setOrderItems}
        onOrderPlaced={handleOrderPlaced}
        addToOrder={addToOrder} // Truyền hàm addToOrder xuống Layout
      />
    </Container>
  );
};

export default App;
