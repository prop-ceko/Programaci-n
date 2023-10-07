import { Container, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Base from '../Base';
import { pages } from '../Pages';

export default function Register() {
   const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      console.log({
         email: data.get('email'),
         password: data.get('password')
      });
   };

   return (
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
               id="name"
               label="Nombre y Apellido"
               name="name"
               autoComplete="name"
               autoFocus
            />
            <TextField
               margin="normal"
               required
               fullWidth
               name="dni"
               label="DNI"
               id="dni"
               autoComplete="dni"
            />
            <TextField
               margin="normal"
               required
               fullWidth
               id="email"
               label="Correo electrónico"
               name="email"
               autoComplete="email"
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
                  <Link href={pages.login.path} variant="body2">
                     Ya tengo una cuenta. Iniciar sesión
                  </Link>
               </Grid>
               <Grid item>
                  <Link href={pages.registerTemporally.path}variant="body2">
                     No pertenezco a la institución
                  </Link>
               </Grid>
            </Stack>
         </Box>
      </Container>
   );
}
