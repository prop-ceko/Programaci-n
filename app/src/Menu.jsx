import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import PropTypes from "prop-types";
import { getScreenArray } from './Pages';
import logo from './assets/unraf-logo.png';

export function Menu({ isMenuOpen, setIsMenuOpen }) {
   function handleClick(path) {
      if (!window.location.pathname.startsWith(path))
         window.open(path, "_self")
      setIsMenuOpen(false)
   }

   return <Drawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
      <img src={logo} width={300} style={{ padding: "8px" }}/>
      <List>
         {
            getScreenArray().map(screen =>
               screen?.showInMenu &&
               <ListItemButton key={screen.path} onClick={() => handleClick(screen.path)}>
                  <ListItemText primary={screen.title} />
               </ListItemButton>
            )
         }
      </List>
   </Drawer>;
}

Menu.propTypes = {
   isMenuOpen: PropTypes.bool.isRequired,
   setIsMenuOpen: PropTypes.func.isRequired
}
