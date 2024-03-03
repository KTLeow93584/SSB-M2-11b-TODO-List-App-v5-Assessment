import { Navigate } from 'react-router-dom';
import { ActiveUserContextGet } from '../contexts/ActiveUserContext.jsx';

export default function RequireAuth({ children }) {
    // ===========================
    let userObj = ActiveUserContextGet().activeUserObj;
    // ===========================
    const user = userObj.user;
    const token = userObj.token;

    // Debug
    //console.log("[Page Authentication - Only Accessible to Guests] User Profile.", user);

    if (user !== null && user !== undefined && token !== null && token !== undefined)
        return <Navigate to="/" replace />;

    return children;
}