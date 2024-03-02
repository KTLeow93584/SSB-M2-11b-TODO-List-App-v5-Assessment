import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
    // ===========================
    let userObj = localStorage.getItem("activeUser");

    if (userObj !== null && userObj !== undefined)
        userObj = JSON.parse(userObj);
    else {
        userObj = {
            user: null,
            lastLogActivity: null,
            token: null
        };
    }
    // ===========================
    const userProfile = userObj.user;
    const token = userObj.token;

    // Debug
    //console.log("[Page Authentication - Only Accessible to Guests] User Profile.", userProfile);

    if (userProfile !== null && userProfile !== undefined && token !== null && token !== undefined)
        return <Navigate to="/" replace />;

    return children;
}