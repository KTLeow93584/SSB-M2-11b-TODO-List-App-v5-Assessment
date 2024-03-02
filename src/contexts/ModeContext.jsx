import { createContext, useContext } from 'react';
import useLocalStorage from 'use-local-storage';

const ModeContext = createContext(false);
export function ModeContextGet() {
    return useContext(ModeContext);
}

export function ModeContextProvider({ children }) {
    const [useDarkMode, setUseDarkMode] = useLocalStorage("use-dark-mode", false);

    return (
        <ModeContext.Provider value={{ useDarkMode: useDarkMode, setUseDarkMode: setUseDarkMode }}>
            {children}
        </ModeContext.Provider>
    );
}