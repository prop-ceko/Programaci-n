import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { setTitle } from '../context/navbar';

export default function PasswordRecovery() {
   setTitle("Contraseña perdida")

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
               id="email"
               label="Correo electrónico"
               name="email"
               autoComplete="email"
               autoFocus
            />
            <Button
               type="submit"
               fullWidth
               variant="contained"
               sx={{ mt: 3, mb: 2 }}
            >
               Continuar
            </Button>
         </Box>
      </Container>
   );
}
