import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/api"

export default function PublicRoutes() {
    const {auth} = useAuth()
    return (
        !auth ? <Outlet/> : <Navigate to="/reservas"/>
    )
}
