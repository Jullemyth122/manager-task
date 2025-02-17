import React, { useState } from 'react'
import { useEffect } from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const Navigation = () => {

    const { currentUser } = useAuth()

    const navigate = useNavigate()

    
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
                </div>
            </ul>
        </div>
    );
}

export default Navigation