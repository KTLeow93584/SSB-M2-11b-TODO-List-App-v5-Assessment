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

    // Debug
    //console.log("[Page Authentication - User Required] User Profile.", userProfile);

    if (userProfile === null || userProfile === undefined)
        return <Navigate to="/login" replace />;

    const user = userProfile.user;
    const token = userProfile.token;

    if (!user || !token)
        return <Navigate to="/login" replace />;

    return children;
}