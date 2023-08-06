import axios from "axios"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import Cookies from "js-cookie"

const baseURL = "http://127.0.0.1:8000/api"

declare interface Credentials {
    token: string,
    expiry?: Date
}

export interface EquipamientoType {
    id: number
    nombre: string
    cantidad: number
}

export interface AulaType {
    id: number
    nombre: string
    equipamiento: any[]
    disponible: boolean
}

export interface ReservaEquipamientoType {
    equipamiento: number,
    cantidad: number
}

export interface ReservaType {
    id?: number
    aula: {
        id: number
        nombre?: string
    },
    fecha: string,
    desde: string,
    hasta: string,
    equipamiento: ReservaEquipamientoType[]
}

function saveCredentials(credentials: Credentials) {
    localStorage.setItem("auth", JSON.stringify(credentials))
}

function clearCredentials() {
    localStorage.removeItem("auth")
}

export function loadCredentials() : Credentials {
    try {
        return JSON.parse(localStorage.getItem('auth'))
    } catch {
        return null
    }
}

export function areCredentialsValid(credentials: Credentials) {
    const now = new Date()
    const then = new Date(credentials?.expiry)
    return credentials && then > now
}

function authHeader(credentials: Credentials) {
    return credentials?.token ? `Token ${credentials.token}` : "F"
}

const axiosInstance = axios.create({
    baseURL
})

async function getTokenInfo(token) {
    return await axiosInstance.post("/token/", {
        token
    }, {
        withCredentials: true,
        headers: {
            'X-CSRFToken': Cookies.get('csrftoken')
        }
    })
}

export async function register(nombre, apellido, dni, email, password) {
    return await axiosInstance.post("/register/", {
        nombre,
        apellido,
        dni,
        email,
        password
    })
}

// function get<T=any>(endpoint) {
//     return async (): Promise<{ status: number; data: T }> => {
//         const {status, data} = await axiosInstance.get(endpoint)
//         return {status, data}
//     }
// }

function get<T=any>(endpoint) {
    return async (): Promise<T> => {
        try {
            const result = await axiosInstance.get(endpoint)
            if (result.status == 200)
                return result.data
        } catch (error) {
            console.log("Error")
        }
        return null
    }
}

// function post(endpoint) {
//     return async () => {
//         const result = await axiosInstance.post(endpoint)
//         if (result.status == 200)
//             return result.data
//         return []
//     }
// }

export const getAulas = get<AulaType[]>("/aulas/")
export const getEquipamiento = get<EquipamientoType[]>("/equipamiento/")
export const getReservas = get<ReservaType[]>("/reservas/")
// export const getReserva = get("/aulas/")

// export async function getAulas() {
//     const {status, data} = await axiosInstance.get("/aulas/")
//     return {status, data}
// }

// export async function getEquipamiento() {
//     return await axiosInstance.get("/equipamiento/")
// }

// export async function getAllReservas() {
//     return await axiosInstance.get("/reservas/")
// }

export async function getReserva(id) {
    const {status, data} = await axiosInstance.get(`/reservas/${id}/`)
    return status == 200 ? data : null
}

export async function createReserva(reserva) {
    const {status, data} = await axiosInstance.post("/reservas/", reserva)
    return status == 201 ? data : null
}

export async function updateReserva(id, reserva) {
    const {status, data} = await axiosInstance.patch(`/reservas/${id}/`, reserva)
    return status == 200 ? data : null
}

export declare interface AuthData {
    auth?: boolean
    login?: (email, password) => Promise<void>
    logout?: () => Promise<void>
}

const AuthContext: React.Context<AuthData> = createContext(null)

export const AuthProvider = ({children} : { children: React.ReactNode }) => {
    const [credentials, _setCredentials] = useState(loadCredentials())
    const [auth, setAuth] = useState(areCredentialsValid(credentials))

    useEffect(() => {
        const requestInterceptor = axiosInstance.interceptors.request.use(
            config => {
                // Attach current access token ref value to outgoing request headers
                config.headers.Authorization = authHeader(credentials);
                return config;
            }
        );

        const responseInterceptor = axiosInstance.interceptors.response.use(null, error => {
            if (error.response.status == 401){
                setCredentials({})
                clearCredentials()
            }
        })

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor)
            axiosInstance.interceptors.response.eject(responseInterceptor)
        };
    }, [])

    function setCredentials(tokens) {
        saveCredentials(tokens)
        _setCredentials(tokens)
        setAuth(areCredentialsValid(tokens))
    }

    async function login(email, password) {
        const result =  await axiosInstance.post("/login/", {
            email,
            password
        })

        if (result.status == 200) // Ok
            setCredentials(result.data)
    }

    async function logout() {
        if (credentials === null)
            return

        const result = await axiosInstance.post("/logout/")
        if (result.status == 204) // No content
            setCredentials(null)

        console.log(result)
    }

    const data = {
        auth,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
