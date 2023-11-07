import { Snackbar } from "@mui/material";
import { Menu } from "../Menu";
import { Navbar } from "../Navbar";
import { useState } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { NavbarProvider } from "../context/navbar";
import { SnackbarProvider } from "../context/snackbar";

export default function Base() {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [title, setTitle] = useState("Titulo")
    const [snack, setSnack] = useState({
       open: false,
       message: ""
    })

    const show = (message) => setSnack({ open: true, message })
    const hide = () => setSnack({ open: false, message: "" })

    return (
        <NavbarProvider title={title} setTitle={setTitle}>
            <ScrollRestoration/>
            <Snackbar
                open={snack.open}
                autoHideDuration={5000}
                onClose={()=> setSnack({ ...snack, open: false})}
                message={snack.message}
            />
            <Navbar title={title} openMenu={() => setMenuOpen(true)}/>
            <Menu isMenuOpen={isMenuOpen} closeMenu={() => setMenuOpen(false)}/>
            <SnackbarProvider show={show} hide={hide} >
                <Outlet/>
            </SnackbarProvider>
        </NavbarProvider>
    )
}
