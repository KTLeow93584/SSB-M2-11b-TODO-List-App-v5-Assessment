import { createContext, useContext } from 'react';
import useLocalStorage from 'use-local-storage';

const ActiveUserContext = createContext(false);
export function ActiveUserContextGet() {
    return useContext(ActiveUserContext);
}

export function ActiveUserContextProvider({ children }) {
    const [activeUserObj, setActiveUserObj] = useLocalStorage("activeUser", {
        user: null,
        lastLogActivity: null,
        token: null
    });

    let users = localStorage.getItem("users");
    users = (users !== null && users !== undefined) ? JSON.parse(users) : [];

    function updateActiveUserProfile(type, newData) {
        const newUser = activeUserObj.user;
        const userIndexFromDB = users.findIndex((user) => user.email === activeUserObj.user.email);

        switch (type.toLowerCase()) {
            case "first-name":
                newUser.firstName = newData;
                users[userIndexFromDB].firstName = newData;

                break;
            case "last-name":
                newUser.lastName = newData;
                users[userIndexFromDB].lastName = newData;

                break;
            case "image":
                newUser.image = newData;
                users[userIndexFromDB].image = newData;

                break;
            case "schedule":
                newUser.tasks = newData;
                users[userIndexFromDB].tasks = newData;

                break;
        }
        //localStorage.setItem("activeUser", JSON.stringify(activeUserObj));

        setActiveUserObj({
            user: newUser,
            lastLogActivity: activeUserObj.lastLogActivity,
            token: activeUserObj.token
        });

        localStorage.setItem("users", JSON.stringify(users));
    }

    return (
        <ActiveUserContext.Provider value={{ activeUserObj: activeUserObj, setActiveUser: updateActiveUserProfile }}>
            {children}
        </ActiveUserContext.Provider>
    );
}