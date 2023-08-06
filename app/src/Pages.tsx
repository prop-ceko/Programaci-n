import { Navigate, RouteObject } from 'react-router-dom';
import { Navbar } from './Navbar';
import Login from './pages/Login';
import MisReservas, { misReservasLoader } from './pages/MisReservas';
import PasswordRecovery from './pages/PasswordRecovery';
import PasswordReset from './pages/PasswordReset';
import PrivateRoutes from './pages/PrivateRoutes';
import PublicRoutes from './pages/PublicRoutes';
import Register from './pages/Register';
import RegisterTemporally from './pages/RegisterTemporally';
import ReservaDetalle, { reservarLoader } from './pages/ReservaDetalle';

const nav = <Navbar/>

export const routes: RouteObject[] = [
   {
      path: '/',
      element: <Navbar/>,
      children:
      [
         {
            path: '/',
            element: <Navigate to="/login"/>
         },
         {
            element: <PublicRoutes />,
            children: [
               {
                  path: '/login',
                  element: <Login />
               },
               {
                  path: '/register',
                  element: <Register />
               },
               {
                  path: '/recover_password',
                  element: <PasswordRecovery />
               },
               {
                  path: '/temporal_register',
                  element: <RegisterTemporally />
               },
               {
                  path: '/reset_password',
                  element: <PasswordReset />
               },
            ]
         },
         {
            element: <PrivateRoutes/>,
            children: [
               {
                  path: '/reservas',
                  element: <MisReservas />,
                  loader: misReservasLoader
               },
               {
                  path: '/reservas/:id',
                  element: <ReservaDetalle />,
                  loader: reservarLoader
               },
               {
                  path: '/reservas/nuevo',
                  element: <ReservaDetalle />,
                  loader: reservarLoader
               },
            ]
         }
      ]
   }
]

export enum Visibility {
   Public,
   NonAuthOnly,
   AuthOnly,
}

interface Page {
   title? : string
   path? : string
   element? : React.ReactNode
   showInMenu? : boolean
   visibility? : Visibility
}

export const pages: Page[] = [
   {
      path: '/'
   },
   {
      title: 'Iniciar sesión',
      path: '/login',
      showInMenu: true,
      visibility: Visibility.NonAuthOnly
   },
   {
      title: 'Registro',
      path: '/register',
      showInMenu: true,
      visibility: Visibility.NonAuthOnly
   },
   {
      title: 'Mis reservas',
      path: '/reservas',
      showInMenu: true,
      visibility: Visibility.AuthOnly
   },
   {
      title: 'Recuperar contraseña',
      path: '/recover_password',
      visibility: Visibility.NonAuthOnly
   },
   {
      title: 'Registro temporal',
      path: '/temporal_register',
      visibility: Visibility.NonAuthOnly
   },
   {
      title: 'Restablecer contraseña',
      path: '/reset_password',
   },
]

export function getScreenArray(){
   // return Object.values(pages)
   return pages
}

export function createRoutes() {
   // const pageArray = getScreenArray().map(screen => (
   //    {
   //       path: screen.path,
   //       element: screen.element
   //    }
   // ));
   return routes

}
