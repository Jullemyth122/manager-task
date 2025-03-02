import React, { useState } from 'react'
import { useEffect } from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const Navigation = () => {


    const { currentUser, accBST } = useAuth();

    const navigate = useNavigate()

    const [preferences, setPreferences] = useState({
        theme: accBST?.theme || 'Light',
    });
  
    useEffect(() => {
        if (accBST && accBST.theme) {
            setPreferences((prev) => ({ ...prev, theme: accBST.theme }));
        }
    }, [accBST]);
  
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', preferences.theme.toLowerCase());
    }, [preferences.theme]);
  
    const toggleTheme = async () => {
        const newTheme = preferences.theme === 'Light' ? 'Dark' : 'Light';
        setPreferences((prev) => ({ ...prev, theme: newTheme }));
    
        if (currentUser) {
            try {
            const adminRef = doc(db, "manager", currentUser.uid);
            // Update only the theme field in Firestore
            await updateDoc(adminRef, { theme: newTheme });
            console.log("Theme updated in Firestore:", newTheme);
            } catch (error) {
            console.error("Error updating theme in Firestore:", error);
            }
        }
    };
    
    const handleLogout = async () => {
        try {
            const auth = getAuth();
            await signOut(auth); // Sign out the user from Firebase
            localStorage.removeItem("admin"); // Remove user data from localStorage (if used)
            navigate('/loginmanager'); // Redirect to the login page using useNavigate
        } catch (error) {
            console.error("Error logging out:", error.message);
        }
    };

    return (
        <div className='navigator-comp w-full'>
            <ul className='flex items-center justify-between gap-3 h-full'>
                <div className="nav-side">
                    <h3 className='txt1'> T 4 S K </h3>
                    <h3 className='absolute txt2'> T 4 S K </h3>
                </div>
                <div className="nav-side flex items-center justify-evenly gap-5 px-5 m-0 h-full">
                    {currentUser ? 
                        // If currentUser is logged in, show their name and logout option
                        <>
                            <h5 className='text-white'>
                                {currentUser.displayName && currentUser.displayName.length > 6 
                                    ? `${currentUser.displayName.substring(0, 6)}...` 
                                    : currentUser.displayName || currentUser.email}
                            </h5>
                            <button onClick={handleLogout} className="text-white cursor-pointer">Logout</button>
                        </>
                     : 
                        // If user is not logged in, show the Signup link
                        <Link className='nav-link' to={'/loginmanager'}>
                            <h5 className='normal text-white'> Login </h5>
                        </Link>
                    }
                    <div className="theme-mode" onClick={toggleTheme}>
                        {preferences.theme === 'Light' ? (
                            <svg className='light-mode' width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.37 3.1018C6.19 3.74978 6.09916 4.41928 6.1 5.0918C6.1 9.1718 9.42 12.4918 13.5 12.4918C14.18 12.4918 14.85 12.4018 15.49 12.2218C14.9652 13.5128 14.0674 14.6181 12.9114 15.3965C11.7554 16.1749 10.3936 16.591 9 16.5918C5.14 16.5918 2 13.4518 2 9.5918C2 6.6618 3.81 4.1418 6.37 3.1018ZM9 0.591797C7.21997 0.591797 5.47991 1.11964 3.99987 2.10857C2.51983 3.0975 1.36628 4.50311 0.685088 6.14765C0.00389951 7.79218 -0.17433 9.60178 0.172937 11.3476C0.520203 13.0934 1.37737 14.6971 2.63604 15.9558C3.89472 17.2144 5.49836 18.0716 7.24419 18.4189C8.99002 18.7661 10.7996 18.5879 12.4442 17.9067C14.0887 17.2255 15.4943 16.072 16.4832 14.5919C17.4722 13.1119 18 11.3718 18 9.5918C18 9.1318 17.96 8.6718 17.9 8.2318C17.4003 8.93239 16.7401 9.50315 15.9746 9.89634C15.2091 10.2895 14.3606 10.4937 13.5 10.4918C12.3552 10.4918 11.24 10.1282 10.3152 9.45346C9.39041 8.77868 8.70385 7.82761 8.35454 6.7374C8.00523 5.6472 8.01123 4.47423 8.37167 3.38765C8.73211 2.30108 9.42836 1.35708 10.36 0.691797C9.92 0.631797 9.46 0.591797 9 0.591797Z" fill="#fff"/>
                            </svg>

                        ) : (
                            <svg className='dark-mode' width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 0.591797C7.21997 0.591797 5.47991 1.11964 3.99987 2.10857C2.51983 3.0975 1.36628 4.50311 0.685088 6.14765C0.00389951 7.79218 -0.17433 9.60178 0.172937 11.3476C0.520203 13.0934 1.37737 14.6971 2.63604 15.9558C3.89472 17.2144 5.49836 18.0716 7.24419 18.4189C8.99002 18.7661 10.7996 18.5879 12.4442 17.9067C14.0887 17.2255 15.4943 16.072 16.4832 14.5919C17.4722 13.1119 18 11.3718 18 9.5918C18 9.1318 17.96 8.6718 17.9 8.2318C17.4003 8.93239 16.7401 9.50315 15.9746 9.89634C15.2091 10.2895 14.3606 10.4937 13.5 10.4918C12.3552 10.4918 11.24 10.1282 10.3152 9.45346C9.39041 8.77868 8.70385 7.82761 8.35454 6.7374C8.00523 5.6472 8.01123 4.47423 8.37167 3.38765C8.73211 2.30108 9.42836 1.35708 10.36 0.691797C9.92 0.631797 9.46 0.591797 9 0.591797Z" fill="#fff"/>
                            </svg>
                        )}                          
                    </div>
                </div>
            </ul>
        </div>
    );
}

export default Navigation