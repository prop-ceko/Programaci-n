import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function PasswordReset() {
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
               id="password"
               label="Contraseña"
               name="password"
               autoComplete="password"
               autoFocus
            />
            <TextField
               margin="normal"
               required
               fullWidth
               id="password-repeat"
               label="Repetir contraseña"
               name="password-repeat"
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
         </Box>
      </Container>
   );
}
