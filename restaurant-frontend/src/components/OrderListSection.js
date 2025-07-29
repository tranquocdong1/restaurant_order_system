import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { memo } from "react";

const OrderList = memo(() => {
  const [orders, setOrders] = useState([]);
  const socket = io("http://localhost:5000", { autoConnect: false });

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders");
      console.log("Fetched orders:", response.data);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("Connected to Socket.io server");
    });

    socket.on("orderUpdate", (newOrder) => {
      console.log("Received order update:", newOrder);
      setOrders((prevOrders) => {
        if (!prevOrders.some((order) => order._id === newOrder._id)) {
          return [...prevOrders, newOrder];
        }
        return prevOrders;
      });
    });

    socket.on("statusUpdate", ({ orderId, status }) => {
      console.log("Received status update:", { orderId, status });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.io server");
    });

    fetchOrders();

    return () => {
      socket.off("connect");
      socket.off("orderUpdate");
      socket.off("statusUpdate");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  const updateStatus = (orderId, status) => {
    // Cập nhật state local ngay lập tức
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status } : order
      )
    );
    // Gửi request API và emit sự kiện
    axios
      .put(`http://localhost:5000/api/orders/${orderId}`, { status })
      .then(() => {
        socket.emit("updateStatus", { orderId, status });
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        // Rollback state nếu API thất bại
        fetchOrders(); // Fetch lại để đồng bộ
      });
  };

  return (
    <div>
      <h2>Danh sách đơn hàng</h2>
      <ul>
        {orders.length === 0 ? (
          <p>Chưa có đơn hàng nào.</p>
        ) : (
          orders.map((order) => (
            <li key={order._id}>
              Bàn {order.tableNumber} - Trạng thái:
              <select
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
              >
                <option value="pending">Chờ xử lý</option>
                <option value="preparing">Đang chuẩn bị</option>
                <option value="completed">Hoàn thành</option>
              </select>
              <ul>
                {order.items.map((item) => (
                  <li key={item._id || item.menuItem._id}>
                    {typeof item.menuItem === "object"
                      ? item.menuItem.name
                      : "Món không xác định"}{" "}
                    x{item.quantity}
                  </li>
                ))}
              </ul>
            </li>
          ))
        )}
      </ul>
    </div>
  );
});

export default OrderList;
