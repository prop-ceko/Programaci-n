import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import PropTypes from "prop-types";
import { getScreenArray } from './Pages';
import logo from './assets/unraf-logo.png';
import { Link } from 'react-router-dom';

export function Menu({ isMenuOpen, setIsMenuOpen }) {
   return <Drawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
      <Link to="https://unraf.edu.ar">
         <img src={logo} width={300} style={{ padding: "8px" }}/>
      </Link>
      <List>
         {
            getScreenArray().map(screen =>
               screen?.showInMenu &&
               <ListItemButton key={screen.path} href={screen.path} onClick={() => setIsMenuOpen(false)}>
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
