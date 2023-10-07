import axios from "axios"
import { useContext } from "react"
import AuthContext from "./AuthContext"

const baseURL = "http://127.0.0.1:8000/api"

export default function useAPI(token) {

    console.log("Tokens", token)

    const axiosInstance = axios.create({
        baseURL,
        headers: {
            Authorization: token ? `Token ${token}` : ""
        }
    })

    async function login(email, password) {
        const response = await axiosInstance.post("/login/", {
            email,
            password
        })
        // if (response.status === 200){
        //     localStorage.setItem("auth", JSON.stringify(response.data))
        //     return response.data
        // }
        return response
    }

    async function logout() {
        const response = await axiosInstance.post("/logout/")
        return response
    }

    async function getReservas() {
        const response = await axiosInstance.post("/reservas/")
        return response.data
    }

    return {
        login, logout, getReservas
    }
}
