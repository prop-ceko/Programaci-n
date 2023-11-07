import { createContext, useContext, useEffect, useState } from "react"

export declare interface NavbarData {
    title: string
    setTitle: (title: string) => void
}

declare interface NavbarProviderProps {
    title: string
    setTitle: (title: string) => void
    children: React.ReactNode
}

const NavbarContext: React.Context<NavbarData> = createContext(null)

export const NavbarProvider = ({title, setTitle, children} : NavbarProviderProps) => {
    const data = {
        title,
        setTitle
    }

    return (
        <NavbarContext.Provider value={data}>
            {children}
        </NavbarContext.Provider>
    )
}

export function useNavbar() {
    return useContext(NavbarContext)
}

export function setTitle(title: string) {
    const nav = useNavbar()
    useEffect(() => {
        document.title = title;
        nav.setTitle(title)
    })
}
