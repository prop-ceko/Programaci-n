import MenuIcon from '@mui/icons-material/Menu';
import { Box, AppBar, Toolbar, IconButton, Typography, Stack } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from './Menu';
import PropTypes from "prop-types";


export function Navbar({icons}) {
   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
   const [title, setTitle] = useState("Título");
   // const title = "Título"

   // document.title = title;

   return (
      <Box>
         <AppBar position="static">
            <Toolbar>
               <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={() => setIsDrawerOpen(true)}
               >
                  <MenuIcon/>
               </IconButton>
               <Typography variant="title" component="div" sx={{ flexGrow: 1 }}>
                  {title}
               </Typography>
               <Stack direction="row" gap={1}>
                  {icons && icons.map(icon => icon)}
               </Stack>
            </Toolbar>
            <Menu isMenuOpen={isDrawerOpen} setIsMenuOpen={setIsDrawerOpen}/>
         </AppBar>
            <Outlet/>
      </Box>
   );
}

Navbar.propTypes = {
   icons: PropTypes.arrayOf(PropTypes.element),
   children: PropTypes.node
};
