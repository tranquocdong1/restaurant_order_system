import React, { Suspense, lazy } from "react";
import { Grid } from "@mui/material";
import Header from "./Header";

const MenuSection = lazy(() => import("./MenuSection"));
const OrderFormSection = lazy(() => import("./OrderFormSection"));
const OrderListSection = lazy(() => import("./OrderListSection"));

const Layout = ({ orderItems, setOrderItems, onOrderPlaced, addToOrder }) => {
  return (
    <>
      <Header />
      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        <Grid item xs={12} md={4}>
          <Suspense fallback={<p>Đang tải menu...</p>}>
            <MenuSection
              addToOrder={addToOrder} // Truyền đúng hàm addToOrder
            />
          </Suspense>
        </Grid>
        <Grid item xs={12} md={4}>
          <Suspense fallback={<p>Đang tải form đặt hàng...</p>}>
            <OrderFormSection
              orderItems={orderItems}
              setOrderItems={setOrderItems}
              onOrderPlaced={onOrderPlaced} // Này dùng cho sau khi đặt hàng thành công
            />
          </Suspense>
        </Grid>
        <Grid item xs={12} md={4}>
          <Suspense fallback={<p>Đang tải đơn hàng...</p>}>
            <OrderListSection />
          </Suspense>
        </Grid>
      </Grid>
    </>
  );
};

export default Layout;