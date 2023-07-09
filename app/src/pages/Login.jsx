import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Base from '../Base';
import { pages } from '../Pages';


export default function Login() {
   const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      console.log({
         email: data.get('email'),
         password: data.get('password')
      });
   };

   return (
      <Base title={pages.login.title}>
         <Container component="main" maxWidth="xs" sx={{
            paddingX: 4,
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
         }}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
               <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Correo electrónico"
                  name="email"
                  autoComplete="email"
                  autoFocus
               />
               <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="password"
               />
               <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
               >
                  Continuar
               </Button>
               <Button
                  type="submit"
                  fullWidth
                  variant="contained"
               >
                  Continuar con Google
               </Button>
               <Stack direction="column" alignItems="center" mt={4} gap={1} >
                  <Grid item>
                     <Link href={pages.recoverPassword.path} variant="body2">
                        Olvidé mi contraseña
                     </Link>
                  </Grid>
                  <Grid item>
                     <Link href={pages.register.path} variant="body2">
                        Registrarme
                     </Link>
                  </Grid>
                  <Grid item>
                     <Link href={pages.registerTemporally.path} variant="body2">
                        No pertenezco a la institución
                     </Link>
                  </Grid>
               </Stack>
            </Box>
         </Container>
      </Base>
   );
}
