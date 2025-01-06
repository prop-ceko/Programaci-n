import { Container, MenuItem, TextField, Button, Stack, Typography, Card, Divider, Paper, CardContent, CardActions } from "@mui/material";
import { useLoaderData, useNavigate } from "react-router-dom";
import { AulaType, EquipamientoType, ReservaType, createReserva, deleteReserva, getAulas, getEquipamiento, getReserva, updateReserva } from "../context/api";
import { ReactNode, useState } from "react";
import { FormContainer, SelectElement } from "react-hook-form-mui";
import { DatePickerElement, TimePickerElement } from 'react-hook-form-mui/date-pickers';
import { DateTime } from "luxon";
import { setTitle } from "../context/navbar";
import { useSnackbar } from "../context/snackbar";


interface EquipamientoProps {
   id: number | string
   cantidad: number
   setEquipamiento: (id: number) => void
   setCantidad: (cantidad: number) => void
   opciones: ReactNode | ReactNode[]
   children?: ReactNode
}

function getDefaultValues(reserva: ReservaType) {
   if (!reserva)
      return {}

   return {
      aula: reserva.id,
      fecha: DateTime.fromSQL(reserva.fecha),
      desde: DateTime.fromSQL(reserva.desde),
      hasta: DateTime.fromSQL(reserva.hasta),
   }
}

function Equipamiento({ id, cantidad=0, setEquipamiento, setCantidad, opciones=[], children=null }: EquipamientoProps) {

   function handleCantidad(cantidad) {
      setCantidad(cantidad < 1 ? 1 : parseInt(cantidad))
   }

   const mostrarAcciones = Boolean(children)

   return (
      <Card sx={{ padding: 1 }}>
         <CardContent>
            <Stack direction="row" alignItems="center" gap={2}>
               <TextField
                  name="equipamiento" label="Equipamiento"
                  value={id}
                  onChange={e => setEquipamiento(parseInt(e.target.value))}
                  select
                  sx={{
                     flexGrow: 1
                  }}
               >
                  {opciones}
               </TextField>
               <TextField
                  name="cantidad"
                  value={cantidad}
                  type="number"
                  onChange={e => handleCantidad(e.target.value)}
                  sx={{
                     textAlign: "right",
                     flexBasis: "4em",
                  }}
               />
            </Stack>
         </CardContent>

         {
            mostrarAcciones &&
            <CardActions>
               {children}
            </CardActions>
         }
      </Card>
   )
}

export default function ReservaDetalle() {
   setTitle("Reserva")

   const { aulas, equipamientoDisponible, reserva } = useLoaderData() as Data
   const defaultValues = getDefaultValues(reserva)

   const [equipamiento, setEquipamiento] = useState(reserva?.equipamiento ?? [])

   const [nuevoEquipamiento, setNuevoEquipamiento] = useState<number | string>("")
   const [nuevoCantidad, setNuevoCantidad] = useState(1)

   const minTime = DateTime.fromObject({hour:8}), maxTime = DateTime.fromObject({hour:23})
   const navigate = useNavigate()
   const snack = useSnackbar()

   function resetNuevo() {
      setNuevoEquipamiento("")
      setNuevoCantidad(1)
   }

   function changeEquipamiento(pos, property) {
      return (value) => {
         const copia = [...equipamiento]
         copia[pos][property] = value
         setEquipamiento(copia)
      }
   }

   function addEquipamiento() {
      if (typeof nuevoEquipamiento !== "number")
         return

      if (equipamiento.some(e => e.id == nuevoEquipamiento))
         return

      const nuevo = [
         {
            id: nuevoEquipamiento,
            cantidad: nuevoCantidad
         }
      ]

      resetNuevo()
      setEquipamiento(equipamiento.concat(nuevo))
   }

   function borrarEquipamiento(id) {
      return () => {
         setEquipamiento(equipamiento.filter(e => e.id != id))
      }
   }

   function eliminar() {
      deleteReserva(reserva.id)
      navigate(-1)
   }

   const handleSubmit = (data) => {
      const nueva : ReservaType = {
         aula: {
            id: data.aula
         },
         fecha: (data.fecha as DateTime)?.toSQLDate(),
         desde: (data.desde as DateTime)?.toSQLTime({ includeOffset: false }),
         hasta: (data.hasta as DateTime)?.toSQLTime({ includeOffset: false }),
         equipamiento
      }

      const enviar = async () => {
         const operacion = reserva ? updateReserva(nueva, reserva.id) : createReserva(nueva)
         const result = await operacion
         if (result.status >= 200 && result.status <= 300){
            navigate("/reservas")
         }
         else {
            snack.show("Ocurrió un error")
            console.error(`Status: ${result.status}, Data:`, result.data)
         }
      }

      enviar()
   };

   const aulaOpciones = aulas?.map(a => ({ id: a.id, label: a.nombre }))
   const equipamientoOpciones = equipamientoDisponible?.map(a =>
      <MenuItem key={a.id} value={a.id}>{a.nombre}</MenuItem>
   )

   return (
      <Container component="main" maxWidth="xs" sx={{
         marginY: 4,
      }}>
         <FormContainer
            values={defaultValues}
            onSuccess={handleSubmit}
         >
            <SelectElement
               name="aula"
               label="Aula"
               margin="normal"
               options={aulaOpciones}
               fullWidth
               required
            />
            <DatePickerElement
               name="fecha"
               label="Fecha"
               required
               sx={{
                  width: 1,
                  marginY: 1
               }}
            />
            <TimePickerElement
               name="desde"
               label="Desde"
               // Marca error pero funciona
               minTime={minTime}
               maxTime={maxTime}
               required
               sx={{
                  width: 1,
                  marginY: 1
               }}
               />
            <TimePickerElement
               name="hasta"
               label="Hasta"
               minTime={minTime}
               maxTime={maxTime}
               required
               sx={{
                  width: 1,
                  marginY: 1
               }}
            />
            <Paper sx={{
               marginTop: 1,
               padding: 2,
               gap: 1
            }}>
               <Typography marginBottom={1}>Equipamiento</Typography>
               <Stack gap={1}>
                  {equipamiento.length == 0 ? <Typography align="center">Ninguno</Typography> :
                  equipamiento.map((e, i) =>
                     <Equipamiento
                        key={e.id}
                        setEquipamiento={changeEquipamiento(i, "equipamiento")}
                        setCantidad={changeEquipamiento(i, "cantidad")}
                        opciones={equipamientoOpciones}
                        {...e}
                     >
                        <Button color="error" onClick={borrarEquipamiento(e.id)}>Quitar</Button>
                     </Equipamiento>
                  )}
               </Stack>
               <Divider sx={{ marginY: 2 }} />
               <Equipamiento
                  id={nuevoEquipamiento}
                  cantidad={nuevoCantidad}
                  setEquipamiento={e => setNuevoEquipamiento(e)}
                  setCantidad={setNuevoCantidad}
                  opciones={equipamientoOpciones}
               >
                  <Button onClick={addEquipamiento}>Agregar</Button>
               </Equipamiento>
            </Paper>
            <Button variant="contained" type="submit" fullWidth sx={{ marginTop: 1 }}>
               Guardar
            </Button>
            <Button variant="contained" color="error" onClick={eliminar} fullWidth sx={{ marginTop: 1 }}>
               Eliminar
            </Button>
         </FormContainer>
      </Container>
   )
}

interface Data {
   aulas: AulaType[]
   equipamientoDisponible: EquipamientoType[]
   reserva: ReservaType
}

export async function reservarLoader({params}): Promise<Data> {
   const aulas = await getAulas()
   const equipamientoDisponible = await getEquipamiento()
   const reserva = params.id ? await getReserva(params.id) : null
   return {
      aulas: aulas?.data,
      equipamientoDisponible: equipamientoDisponible?.data,
      reserva: reserva?.data
   }
}
