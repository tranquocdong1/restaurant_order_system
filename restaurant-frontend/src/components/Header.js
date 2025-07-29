import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Nhà Hàng ABC
        </Typography>
        <Button color="inherit">Đăng xuất</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;