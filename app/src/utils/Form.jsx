import { TextField } from "@mui/material"
import { createContext, useContext, useState } from "react"


const FormContext = createContext({})

function FormProvider({children}) {
   const [errors, setErrors] = useState({})
   const data = {
      errors,
      setErrors
   }
   return (
      <FormContext.Provider value={data}>
         {children}
      </FormContext.Provider>
   )
}

function Form() {
   return (
      <FormProvider>
         <ErrorTextField/>
      </FormProvider>
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
