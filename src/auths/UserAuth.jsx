
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
    const userProfile = useSelector((state) => state.profile);

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