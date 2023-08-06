import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import { Visibility, getScreenArray } from './Pages';
import logo from './assets/unraf-logo.png';
import { useAuth } from './context/api';

function ItemButton({auth, visibility, text, href, onClick} : { auth: boolean, visibility: Visibility, text: string, href: string, onClick: () => void}) {
   // const {auth} = useAuth()
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

export function Menu({ isMenuOpen, setIsMenuOpen }) {
   const {auth, logout} = useAuth()

   // const screens = getScreenArray()
   // const public_ = screens.filter(s => s.visibility == Visibility.Public)
   // const authOnly = screens.filter(s => s.visibility == Visibility.AuthOnly)
   // const nonAuthOnly = screens.filter(s => s.visibility == Visibility.NonAuthOnly)

   return <Drawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
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
               onClick={() => setIsMenuOpen(false)}
            />
         )}
         {/* {public_.map(page =>
            <ListItemButton key={page.path} href={page.path} onClick={() => setIsMenuOpen(false)}>
               <ListItemText primary={page.title} />
            </ListItemButton>
         )} */}
         {
            auth &&
            <ListItemButton>
               <ListItemText primary={"Cerrar sesión"} onClick={logout} />
            </ListItemButton>
         }
      </List>
   </Drawer>;
}

Menu.propTypes = {
   isMenuOpen: PropTypes.bool.isRequired,
   setIsMenuOpen: PropTypes.func.isRequired
}
