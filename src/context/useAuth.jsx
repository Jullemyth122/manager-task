// useAuth.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../utility/firebase'; // Import providers
import { fetchUserAccounts, saveManagerData } from '../utility/manager';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");  // New state for success messages

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [accs, setAccs] = useState([])

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
            const managerDocRef = doc(db, "manager", user.uid);
            const managerDocSnap = await getDoc(managerDocRef);

            if (managerDocSnap.exists() && managerDocSnap.data().approval) {
                setCurrentUser(user);
            } else {
                setErrorMessage("Your account is pending approval. Please contact the administrator.");
                await auth.signOut();
                setCurrentUser(null);
            }
            } else {
            setCurrentUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const getAccounts = async () => {
        const accs = await fetchUserAccounts();
        console.log(accs);
        setAccs(accs); // Set fetched boards to state
    };
    
    useEffect(() => {
        getAccounts();
    }, []);

    const handleLogin = async () => {
        try {
            // Sign in using Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Fetch the manager's Firestore document using the user's uid
            const managerDocRef = doc(db, "manager", user.uid);
            const managerDocSnap = await getDoc(managerDocRef);
    
            if (managerDocSnap.exists()) {
                const managerData = managerDocSnap.data();
                if (!managerData.approval) {
                    // Not approved: set error, sign out and return false
                    setErrorMessage("Your account is pending approval. Please contact the administrator.");
                    await auth.signOut();
                    return false;
                }
            } else {
                setErrorMessage("No manager record found for this account.");
                await auth.signOut();
                return false;
            }
    
            // If approved, continue with login
            setSuccessMessage("Successfully logged in!");
            localStorage.setItem("manager", JSON.stringify(user));
            return true;
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage("");
            return false;
        }
    };

    const handleRegister = async() => {
        try {
            // Create user with Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user; // Get the user object from the signup response
    
            // Update the user's displayName with the username entered by the user
            await updateProfile(user, {
                displayName: username // This sets the displayName to the username
            });
    
            // Now that we have the user, save to Firestore
            await saveManagerData(user, username); // Pass the correct user object and username
            await auth.signOut();
            window.location.href = "/loginmanager";
    
            setUsername("")
            setPassword("")
            setEmail("")
            setSuccessMessage("Account has been created wait for pending approval...");  // Success message
            
        } catch (error) {
            console.log(error)
            setErrorMessage(error.message);  // Set error message if any
            setSuccessMessage("");  // Clear success message on error

        }
    }


    const value = {
        email, setEmail,
        password,setPassword,
        username, setUsername,
        errorMessage, setErrorMessage,
        successMessage, setSuccessMessage,
        currentUser,setCurrentUser,

        handleLogin,
        handleRegister,

        accs, setAccs, getAccounts
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
