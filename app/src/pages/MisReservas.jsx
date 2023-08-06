import { Card, CardContent, MenuItem, Select, Stack, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import { pages } from '../Pages';
import { useContext, useEffect } from 'react';
import { Form, useLoaderData } from 'react-router-dom';
import { getReservas } from '../context/api';


function Reserva({id, aula, fecha, desde, hasta, equipamiento}) {
   return (
      <Card>
         <CardContent>
            <Typography fontWeight="600">{aula.nombre}</Typography>
            <Box mt={1}>
               <Stack direction="row" justifyContent='space-between'>
                  <Typography>Fecha</Typography>
                  <Typography>{fecha}</Typography>
               </Stack>
               <Stack direction="row" justifyContent='space-between'>
                  <Typography>Desde</Typography>
                  <Typography>{desde}</Typography>
               </Stack>
               <Stack direction="row" justifyContent='space-between'>
                  <Typography>Hasta</Typography>
                  <Typography>{hasta}</Typography>
               </Stack>
               {
                  equipamiento?.length > 0 &&
                  <Box>
                     <Typography>Equipamiento</Typography>
                     <Table>
                        <TableBody>
                           {
                              equipamiento.map(e =>
                                 <TableRow key={e}>
                                    <TableCell>{e.nombre}</TableCell>
                                    <TableCell>{e.equipamiento}</TableCell>
                                 </TableRow>
                              )
                           }
                        </TableBody>
                     </Table>
                  </Box>
               }
            </Box>
            <Button href={`${id}`}>Editar</Button>
         </CardContent>
      </Card>
   )
}

export default function MisReservas() {
   const reservas = useLoaderData()

   return (
      <Container component="main" maxWidth="xs" sx={{
         paddingX: 4,
         marginTop: 4,
         display: 'flex',
         flexDirection: 'column',
         alignItems: 'center'
      }}>
         <Box sx={{ mt: 1 }}>
            Mis reservas.
            <Button href='/reservas/nuevo'>Reservar</Button>
            <TextField type='date' onChange={(e) => console.log(e)}/>
            {
               reservas?.length == 0 ? <>No hay reservas</> :
               <Stack direction="column" gap={2}>
                  {
                     reservas?.map(reserva => <Reserva key={reserva.id} {...reserva}/>)
                  }
               </Stack>
            }
         </Box>
      </Container>
   );
}

export async function misReservasLoader() {
   return await getReservas()
}
