import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { RouterProvider, createBrowserRouter, Link as RouterLink } from 'react-router-dom';
import { createRoutes } from './Pages';
import PropTypes from "prop-types";

import React from 'react';

const LinkBehavior = React.forwardRef(function P(props, ref) {
  // @ts-ignore
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
   return (
      <ThemeProvider theme={defaultTheme}>
         <CssBaseline/>
         <RouterProvider router={router} fallbackElement />
      </ThemeProvider>
   );
}

export default App
