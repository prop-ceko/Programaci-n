import { createContext, useContext } from "react"

declare interface SnackbarData {
    show: (message: string) => void
    hide: () => void
}

declare interface SnackbarProviderProps extends SnackbarData {
    children: React.ReactNode
}

const SnackBar: React.Context<SnackbarData> = createContext(null)

export const SnackbarProvider = ({show, hide, children} : SnackbarProviderProps) => {
    const data = {
        show,
        hide
    }

    return (
        <SnackBar.Provider value={data}>
            {children}
        </SnackBar.Provider>
    )
}

export function useSnackbar() {
    return useContext(SnackBar)
}
