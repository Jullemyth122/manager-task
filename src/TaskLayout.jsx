import React from 'react';
import { Navigate, Outlet, useLocation, useNavigation } from 'react-router-dom';
import Navigation from './navigation/Navigation';
import LoginManager from './components/LoginManager';
import { useAuth } from './context/useAuth';

const TaskLayout = () => {
    const { currentUser } = useAuth();
    const navigation = useNavigation();
    const location = useLocation();

    const isLoading = navigation.state === "loading";
    const isNavPath = location.pathname === '/';

    // Only redirect if the user is on the homepage
    if (currentUser && isNavPath) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div>
            {isLoading ? <NavigationLoading /> : <Navigation />}
            <main>
                <Outlet />
                {isNavPath && !currentUser && <LoginManager />}
            </main>
        </div>
    );
};

export default TaskLayout;
