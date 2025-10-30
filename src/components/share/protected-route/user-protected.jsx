import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import Loading from '../loading';


const ProtectedUserRoute = (props) => {
    const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
    const isLoading = useSelector((state) => state.account.isLoading);
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (isLoading) {
                setRedirectToLogin(true);
            }
        }, 1000);

        return () => clearTimeout(timeout);
    }, [isLoading]);

    if (redirectToLogin) {
        return <Navigate to='/login' replace />;
    }

    return (
        <>
            {isLoading === true ? (
                <Loading />
            ) : (
                <>
                    {isAuthenticated === true ? (
                        props.children
                    ) : (
                        <Navigate to='/login' replace />
                    )}
                </>
            )}
        </>
    )
}

export default ProtectedUserRoute