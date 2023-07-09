import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import PropTypes from "prop-types";
import { useState } from 'react';
import { Menu } from './Menu';

// https://mui.com/material-ui/getting-started/templates/
// https://github.com/mui/material-ui/tree/v5.13.2/docs/data/material/getting-started/templates/dashboard
// https://github.com/mui/material-ui/tree/v5.13.2/docs/data/material/getting-started/templates/sign-in
// https://github.com/mui/material-ui/tree/v5.13.2/docs/data/material/getting-started/templates/sign-up


function Base({title, icons, children}) {
   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

   document.title = title;

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
               {/* {icons && icons.map((element, index) => {
                  const [icon, onClick] = element
                  return (
                     <IconButton
                        key={index}
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={onClick}
                     >
                        {icon}
                     </IconButton>
                  )
               })} */}
            </Toolbar>
            <Menu isMenuOpen={isDrawerOpen} setIsMenuOpen={setIsDrawerOpen}/>
         </AppBar>
         {children}
      </Box>
   );
   // return (<RouterProvider router={router} />)
   // return <Login></Login>
}

Base.propTypes = {
   title: PropTypes.string.isRequired,
   icons: PropTypes.arrayOf(PropTypes.element),
   children: PropTypes.node
};

export default Base

