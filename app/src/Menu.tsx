import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import { Visibility, getScreenArray } from './Pages';
import logo from './assets/unraf-logo.png';
import { useAuth } from './context/api';

interface ItemButtonProps {
   auth: boolean
   visibility: Visibility
   text: string
   href: string
   onClick: () => void
}

function ItemButton({auth, visibility, text, href, onClick} : ItemButtonProps) {
   if (auth && visibility != Visibility.AuthOnly)
      return
   if (!auth && visibility != Visibility.NonAuthOnly)
      return

   return (
      <ListItemButton href={href} onClick={onClick}>
         <ListItemText primary={text} />
      </ListItemButton>
   )
}

interface MenuProps {
   isMenuOpen: boolean
   closeMenu: () => void
}

export function Menu({ isMenuOpen, closeMenu }: MenuProps) {
   const {auth, logout} = useAuth()

   return (
      <Drawer open={isMenuOpen} onClose={closeMenu}>
         <Link to="https://unraf.edu.ar">
            <img src={logo} width={300} style={{ padding: "8px" }}/>
         </Link>
         <List>
            {getScreenArray().map(screen =>
               screen.showInMenu &&
               <ItemButton
                  key={screen.path}
                  auth={auth}
                  href={screen.path}
                  text={screen.title}
                  visibility={screen.visibility}
                  onClick={closeMenu}
               />
            )}
            {
               auth &&
               <ListItemButton>
                  <ListItemText primary={"Cerrar sesión"} onClick={logout} />
               </ListItemButton>
            }
         </List>
      </Drawer>
   )
}
