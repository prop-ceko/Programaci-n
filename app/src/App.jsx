import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createRoutes } from './Pages';

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
   }
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
