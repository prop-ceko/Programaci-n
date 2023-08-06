import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Navigate, RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createRoutes } from './Pages';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

import React from 'react';
import { Navbar } from './Navbar';
import MisReservas from './pages/MisReservas';
import PasswordRecovery from './pages/PasswordRecovery';
import PasswordReset from './pages/PasswordReset';
import PrivateRoutes from './pages/PrivateRoutes';
import PublicRoutes from './pages/PublicRoutes';
import Register from './pages/Register';
import RegisterTemporally from './pages/RegisterTemporally';
import ReservaDetalle from './pages/ReservaDetalle';
import Login from './pages/Login';
import { getAulas, useAuth } from './context/api';

const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (Material UI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

const defaultTheme = createTheme({
   typography: {
      title: {
         fontSize: "1.3rem"
      },
      h1: {
         fontSize: "3.75rem"
      },
      h2: {
         fontSize: "3rem"
      },
      h3: {
         fontSize: "2.125rem"
      },
      h4: {
         fontSize: "1.5rem"
      },
      h5: {
         fontSize: "1.25rem"
      }
   },
   components: {
      MuiLink: {
         defaultProps: {
            component: LinkBehavior,
         },
      },
      MuiButtonBase: {
         defaultProps: {
            LinkComponent: LinkBehavior,
         },
      },
      MuiListItemButton: {
         defaultProps: {
            LinkComponent: LinkBehavior,
         },
      }
   },
});

const router = createBrowserRouter(createRoutes())

function App() {
   // const {auth} = useAuth()
   // console.log("Updating app")
   // const router = createBrowserRouter([
   //    {
   //       path: '/',
   //       element: <Navbar/>,
   //       children:
   //       [
   //          {
   //             path: '/',
   //             element: <Navigate to="/login"/>
   //          },
   //          {
   //             element: <PublicRoutes auth={auth} />,
   //             children: [
   //                {
   //                   path: '/login',
   //                   element: <Login />
   //                },
   //                {
   //                   path: '/register',
   //                   element: <Register />
   //                },
   //                {
   //                   path: '/recover_password',
   //                   element: <PasswordRecovery />
   //                },
   //                {
   //                   path: '/temporal_register',
   //                   element: <RegisterTemporally />
   //                },
   //                {
   //                   path: '/reset_password',
   //                   element: <PasswordReset />
   //                },
   //             ]
   //          },
   //          {
   //             element: <PrivateRoutes auth={auth} />,
   //             children: [
   //                {
   //                   path: '/reservas',
   //                   element: <MisReservas />,
   //                   loader: async () => {
   //                      // getReservas()
   //                      return 1
   //                   }
   //                },
   //                {
   //                   path: '/reservar',
   //                   element: <Reservar />,
   //                   loader: async () => {
   //                      const {data} = await getAulas()
   //                      return data
   //                   }
   //                },
   //             ]
   //          }
   //       ]
   //    }
   // ])

   return (
      <ThemeProvider theme={defaultTheme}>
         <CssBaseline/>
         <RouterProvider router={router} fallbackElement />
      </ThemeProvider>
   );
}

export default App
