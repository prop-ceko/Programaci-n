import { Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PasswordReset from './pages/PasswordReset';
import PasswordRecovery from './pages/PasswordRecovery';
import Register from './pages/Register';
import RegisterTemporally from './pages/RegisterTemporally';
import { Navbar } from './Navbar';

const nav = <Navbar/>

export const pages = {
   root: {
      path: '/',
      element: <Navigate to={'/login'}/>
   },
   login: {
      title: 'Iniciar sesión',
      path: '/login',
      element: <Login />,
      showInMenu: true
   },
   register: {
      title: 'Registro',
      path: '/register',
      element: <Register />,
      showInMenu: true
   },
   recoverPassword: {
      title: 'Recuperar contraseña',
      path: '/recover_password',
      element: <PasswordRecovery />
   },
   registerTemporally: {
      title: 'Registro temporal',
      path: '/temporal_register',
      element: <RegisterTemporally />
   },
   passwordReset: {
      title: 'Restablecer contraseña',
      path: '/reset_password',
      element: <PasswordReset />
   },
};

export function getScreenArray(){
   return Object.values(pages)
}

export function createRoutes() {
   const pageArray = getScreenArray().map(screen => (
      {
         path: screen.path,
         element: screen.element
      }
   ));

   if (nav == null)
      return pageArray

   return [
      {
         path: '/',
         element: nav,
         children: pageArray
      }
   ]
}
