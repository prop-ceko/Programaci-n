import { Container, Box, Select, MenuItem, TextField, Button, Stack, Grid, Link, Typography, Card, IconButton, Divider } from "@mui/material";
import { Form, useLoaderData, useParams } from "react-router-dom";
import { AulaType, EquipamientoType, ReservaType, getAulas, getEquipamiento, getReserva, updateReserva } from "../context/api";
import { ReactNode, useEffect, useState } from "react";
import { Add, Remove } from "@mui/icons-material";

interface Data {
   aulas: AulaType[]
   equipamientoDisponible: EquipamientoType[]
   reserva: ReservaType
}

interface EquipamientoParams {
   equipamiento: string | number
   cantidad: number
   setEquipamiento: (id: number) => void
   setCantidad: (cantidad: number) => void
   children: ReactNode
}

function Equipamiento({ equipamiento="", cantidad=0, setEquipamiento, setCantidad, children }: EquipamientoParams) {
   function add(n) {
      return () => setCantidad(cantidad + n)
   }

   return (
      <Box>
         <TextField
            name="equipamiento" label="Equipamiento"
            margin="normal"
            value={equipamiento}
            onChange={e => setEquipamiento(parseInt(e.target.value))}
            select
            fullWidth
         >
            {children}
         </TextField>
         <Stack direction="row">
            <IconButton sx={{m:"auto"}} onClick={add(-1)}><Remove/></IconButton>
            <TextField
               name="cantidad"
               value={cantidad}
               onChange={e => setCantidad(parseInt(e.target.value))}
               inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
            <IconButton sx={{m:"auto"}} onClick={add(1)}><Add/></IconButton>
         </Stack>
      </Box>
   )
}

function ErrorTextField({validation=value => value === "", errorMessage= "Error", ...props}) {
   const [error, setError] = useState(false)
   const helpText = error ? errorMessage : ""

   function handleChange(event) {
      setError(!validation(event.target.value))
      props.onChange(event)
   }

   return (
      <TextField
         onChange={handleChange}
         onSubmitCapture={() => console.log("Submit")}
         error={error}
         helperText={helpText}
         {...props}
      />
   )
}


export default function ReservaDetalle() {
   const { aulas, equipamientoDisponible, reserva } = useLoaderData() as Data

   const [aula, setAula] = useState(reserva?.aula.id ?? "")
   const [fecha, setFecha] = useState(reserva?.fecha ?? "")
   const [desde, setDesde] = useState(reserva?.desde ?? "")
   const [hasta, setHasta] = useState(reserva?.hasta ?? "")
   const [equipamiento, setEquipamiento] = useState(reserva?.equipamiento ?? [])

   const [nuevoEquipamiento, setNuevoEquipamiento] = useState<number | string>("")
   const [nuevoCantidad, setNuevoCantidad] = useState(1)

   const [errors, setErrors] = useState(new Map())

   function resetNuevo() {
      setNuevoEquipamiento("")
      setNuevoCantidad(1)
   }

   function num(setter) {
      return e => setter(parseInt(e.target.value))
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

      if (equipamiento.some(e => e.equipamiento == nuevoEquipamiento))
         return

      const nuevo = [
         {
            equipamiento: nuevoEquipamiento,
            cantidad: nuevoCantidad
         }
      ]

      resetNuevo()
      setEquipamiento(equipamiento.concat(nuevo))
   }

   function addError(component, message, condition) {
      if (!condition)
         return

      const modify = errors => errors.set(component, message)
      setErrors(modify)
   }

   // function validate() {
   //    addError("aula", "Debes seleccionar un aula", aula === "")
   //    addError("fecha", "Debes seleccionar la fecha", fecha === "")
   // }

   const handleSubmit = (event) => {
      event.preventDefault();
      // setErrors(new Map())
      // validate()
      // if (typeof aula !== "number")
      //    return

      const nueva : ReservaType = {
         aula: {
            id: aula as number
         },
         fecha,
         desde,
         hasta,
         equipamiento
      }

      console.log(nueva)
      // if (reserva)
         // updateReserva(reserva.id, nueva)
   };

   const equipamientoOptions = equipamientoDisponible.map(a =>
      <MenuItem key={a.id} value={a.id}>{a.nombre}</MenuItem>
   )

   console.log("Au", errors, "aula" in errors)

   return (
      <Container component="main" maxWidth="xs" sx={{
         paddingX: 4,
         marginTop: 4,
         display: 'flex',
         flexDirection: 'column',
         alignItems: 'center'
      }}>
         <Box component={Form} onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} width={1}>
            <ErrorTextField
               label="Aula"
               margin="normal"
               value={aula}
               onChange={num(setAula)}
               select
               fullWidth
            >
               {aulas.map(a =>
                  <MenuItem key={a.id} value={a.id}>{a.nombre}</MenuItem>
               )}
            </ErrorTextField>
            <TextField
               label="Fecha"
               margin="normal"
               value={fecha}
               onChange={num(setFecha)}
               type="date"
               fullWidth
               InputLabelProps={{ shrink: true }}
            />
            <TextField
               name="desde"
               label="Desde"
               margin="normal"
               value={desde}
               onChange={num(setDesde)}
               type="time"
               fullWidth
               InputLabelProps={{ shrink: true }}
            />
            <TextField
               name="hasta"
               label="Hasta"
               margin="normal"
               value={hasta}
               onChange={num(setHasta)}
               type="time"
               fullWidth
               InputLabelProps={{ shrink: true }}
            />
            <Card variant="outlined" sx={{
               padding: 2
            }}>
               <Typography>Equipamiento</Typography>
               {equipamiento.map((e, i) =>
                  <Equipamiento
                     key={e.equipamiento}
                     setEquipamiento={changeEquipamiento(i, "equipamiento")}
                     setCantidad={changeEquipamiento(i, "cantidad")}
                     {...e}
                  >
                     {equipamientoOptions}
                  </Equipamiento>
               )}
               <Divider sx={{ mt: 2, mb: 1 }} />
               <Equipamiento
                  equipamiento={nuevoEquipamiento}
                  cantidad={nuevoCantidad}
                  setEquipamiento={e => setNuevoEquipamiento(e)}
                  setCantidad={setNuevoCantidad}
               >
                  {equipamientoOptions}
               </Equipamiento>
               <Button fullWidth onClick={addEquipamiento} sx={{ mt: 1 }}>Agregar</Button>
            </Card>
            <Button
               type="submit"
               fullWidth
               variant="contained"
               sx={{ mt: 3, mb: 2 }}
            >
               Guardar
            </Button>
         </Box>
      </Container>
   );
}

export async function reservarLoader({params}) {
   const aulas = await getAulas()
   const equipamientoDisponible = await getEquipamiento()
   const reserva = params.id ? await getReserva(params.id) : null
   return { aulas, equipamientoDisponible, reserva }
}
