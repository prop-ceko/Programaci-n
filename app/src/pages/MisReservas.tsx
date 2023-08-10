import { Card, CardContent, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import { pages } from '../Pages';
import { useContext, useEffect } from 'react';
import { Form, useLoaderData } from 'react-router-dom';
import { EquipamientoType, ReservaEquipamientoType, ReservaType, getEquipamiento, getReservas } from '../context/api';


interface EquipamientoProps {
   nombre: string
   cantidad: number
}

function Equipamiento({nombre, cantidad}: EquipamientoProps) {
   return (
      <TableRow>
         <TableCell>{nombre}</TableCell>
         <TableCell align="right">{cantidad}</TableCell>
      </TableRow>
   )
}

function Reserva({id=null, aula, fecha, desde, hasta, equipamiento}: ReservaType ) {
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
                  <TableContainer component={Paper}>
                     <Table>
                        <TableHead>
                           <TableRow>
                              <TableCell>Equipamiento</TableCell>
                              <TableCell align="right">Cantidad</TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {equipamiento.map(e => {
                              return <Equipamiento key={e.id} nombre={e.nombre} cantidad={e.cantidad}/>
                           })}
                        </TableBody>
                     </Table>
                  </TableContainer>
               }
            </Box>
            {id && <Button href={`${id}`} sx={{ marginTop: 1 }}>Editar</Button>}
         </CardContent>
      </Card>
   )
}

export default function MisReservas() {
   const {reservas} = useLoaderData() as Data

   return (
      <Container component="main" maxWidth="xs" sx={{
         marginY: 4,
         display: 'flex',
         flexDirection: 'column',
         alignItems: 'center'
      }}>
         <Button href='/reservas/nuevo'>Reservar</Button>
         {
            reservas?.length == 0 ? <>No hay reservas</> :
            <Stack direction="column" gap={2} width={1} marginTop={1}>
               {
                  reservas?.map(reserva => <Reserva key={reserva.id} {...reserva}/>)
               }
            </Stack>
         }
      </Container>
   );
}

interface Data {
   reservas: ReservaType[]
}

export async function misReservasLoader(): Promise<Data> {
   const reservas = await getReservas()
   return {
      reservas: reservas?.data
   }
}
