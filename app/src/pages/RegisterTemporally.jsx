import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { setTitle } from '../context/navbar';


export default function RegisterTemporally() {
   setTitle("Registro temporal")

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
               label="Teléfono"
               name="phone"
               type="tel"
               id="phone"
               autoComplete="phone"
            />
            <TextField
               margin="normal"
               required
               fullWidth
               name="message"
               label="Mensaje"
               type="text"
               id="message"
               multiline
               maxRows={5}
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
