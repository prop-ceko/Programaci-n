import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Toolbar, IconButton, Typography, Stack } from "@mui/material";
import PropTypes from "prop-types";


export function Navbar({title, openMenu, icons}) {
   return (
      <AppBar position="static">
         <Toolbar>
            <IconButton
               size="large"
               edge="start"
               color="inherit"
               aria-label="menu"
               sx={{ mr: 2 }}
               onClick={openMenu}
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
      </AppBar>
   );
}



Navbar.propTypes = {
   title: PropTypes.string.isRequired,
   openMenu: PropTypes.func.isRequired,
   icons: PropTypes.arrayOf(PropTypes.element),
   children: PropTypes.node
};
