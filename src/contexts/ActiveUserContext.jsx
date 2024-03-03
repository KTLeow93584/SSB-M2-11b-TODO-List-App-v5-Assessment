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

    function login(email, password, onProcessSuccessfulCallback, onProcessFailedCallback) {
        let users = localStorage.getItem("users");
        if (users !== null && users !== undefined)
            users = JSON.parse(users);

        const userIndex = users.findIndex((user) => user.email === email && user.password === password);
        let loggedInUserObj = {
            user: null,
            lastLogActivity: null,
            token: null
        };

        if (userIndex !== -1) {
            const user = users[userIndex];
            const date = new Date();

            loggedInUserObj = {
                user: { email: user.email, firstName: user.firstName, lastName: user.lastName, image: user.image, tasks: user.tasks },
                lastLogActivity: date.toISOString(),
                token: date.toISOString()
            };
        }

        // Debug
        //console.log("[User Logged In] User.", loggedInUserObj);

        setActiveUserObj(loggedInUserObj);
        localStorage.setItem("activeUser", JSON.stringify(loggedInUserObj));

        if (loggedInUserObj.user !== null) {
            if (onProcessSuccessfulCallback)
                onProcessSuccessfulCallback();
        }
        else {
            if (onProcessFailedCallback)
                onProcessFailedCallback();
        }
    }

    function logout(onProcessCompletedCallback) {
        setActiveUserObj({
            user: null,
            lastLogActivity: null,
            token: null
        });

        if (onProcessCompletedCallback)
            onProcessCompletedCallback();
    }

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
            case "tasks":
                newUser.tasks = newData;
                users[userIndexFromDB].tasks = newData;

                break;
        }

        setActiveUserObj({
            user: newUser,
            lastLogActivity: activeUserObj.lastLogActivity,
            token: activeUserObj.token
        });

        localStorage.setItem("users", JSON.stringify(users));
    }

    return (
        <ActiveUserContext.Provider
            value={{ activeUserObj: activeUserObj, login: login, logout: logout, updateActiveUserProfile: updateActiveUserProfile }}>
            {children}
        </ActiveUserContext.Provider>
    );
}