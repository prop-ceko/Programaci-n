import { createContext, useState } from "react";
import useAPI from "./useAxios";

const AuthContext = createContext(null)
export default AuthContext;


export const AuthProvider = ({children}) => {
    const [authTokens, _setAuthTokens] = useState(JSON.parse(localStorage.getItem('auth')))
    const [reservas, setReservas] = useState(null)
    const api = useAPI(authTokens.token)

    console.log("Loading tokens", authTokens)

    function setAuthTokens(tokens) {
        localStorage.setItem("auth", JSON.stringify(tokens))
        _setAuthTokens(tokens)
    }

    async function login(email, password) {
        const result = await api.login(email, password)
        if (result.status == 200)
            setAuthTokens(result.data)
    }

    async function logout() {
        if (authTokens === null)
            return

        const result = await api.logout()
        if (result.status == 204) // No content
            setAuthTokens(null)

        console.log(result)
    }

    async function getReservas() {
        if (authTokens === null)
            return

        const result = await api.getReservas()
        if (result.status == 200)
            setReservas(result.data)
    }

    const data = {
        authTokens,
        setAuthTokens,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}
