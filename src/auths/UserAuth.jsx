import { Navigate } from 'react-router-dom';
import { ActiveUserContextGet } from '../contexts/ActiveUserContext.jsx';

export default function RequireAuth({ children }) {
    // ===========================
    let userObj = ActiveUserContextGet().activeUserObj;
    // ===========================
    const user = userObj.user;
    const token = userObj.token;

    // Debug
    //console.log("[Page Authentication - User Required] User Profile.", userObj);

    if (!user || !token)
        return <Navigate to="/login" replace />;

    return children;
}