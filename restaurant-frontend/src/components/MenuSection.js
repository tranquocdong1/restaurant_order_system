import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";

const MenuSection = ({ addToOrder }) => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/menu");
        console.log("Menu data:", response.data);
        setMenu(response.data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  if (loading) return <Typography>Đang tải menu...</Typography>;

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Menu
      </Typography>
      <Grid container spacing={2}>
        {menu.map((item) => (
          <Grid item xs={12} sm={6} md={12} key={item._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography color="textSecondary">
                  {item.price} VNĐ - {item.category}
                </Typography>
                <Typography color="textSecondary">
                  {item.available ? "Còn hàng" : "Hết hàng"}
                </Typography>
                {item.available && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      addToOrder({ 
                        menuItem: item._id, 
                        name: item.name,
                        _id: item._id,
                        price: item.price,
                        category: item.category
                      }, 1)
                    }
                    style={{ marginTop: "10px" }}
                  >
                    Thêm vào đơn
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default MenuSection;