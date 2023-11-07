import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Link as RouterLink, LinkProps as RouterLinkProps, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createRoutes } from './Pages';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import React from 'react';

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
            component: LinkBehavior
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
      },
      MuiButton: {
         defaultProps: {
            variant: 'outlined'
         }
      },
      MuiTextField: {
         defaultProps: {
            variant: 'outlined'
         }
      },
      MuiPaper: {
         defaultProps: {
            variant: 'outlined'
         }
      }
   },
});

const router = createBrowserRouter(createRoutes())

function App() {

   return (
      <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="es">
         <ThemeProvider theme={defaultTheme}>
            <CssBaseline/>
            <Box>
               <RouterProvider router={router} fallbackElement />
            </Box>
         </ThemeProvider>
      </LocalizationProvider>
   );
}

export default App
