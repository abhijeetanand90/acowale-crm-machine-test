import { Outlet, Link } from "react-router-dom";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

function WithNav() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Acowale Feedback
          </Typography>

          <Button color="inherit" component={Link} to="/">
            Feedback
          </Button>

          <Button color="inherit" component={Link} to="/admin">
            Admin
          </Button>
        </Toolbar>
      </AppBar>

      <Box>
        <Outlet />
      </Box>
    </>
  );
}

export default WithNav;