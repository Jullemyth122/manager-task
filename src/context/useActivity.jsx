import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserBoards, sendUserNotification } from '../utility/activity'; // Import functions

const ActivityContext = createContext();

export const useActivity = () => {
    return useContext(ActivityContext);
};

const ActivityProvider = ({ children }) => {
    const [createBoard, setCreateBoard] = useState();
    const [IsCreateBoard, setIsCreateBoard] = useState(false);
    const [boardAttr, setBoardAttr] = useState({
        boardTitle: '',
        boardVisibility: '',
        boardTemplate: '',
    });

    const [userBoards, setUserBoards] = useState([]); // State to store user boards

    useEffect(() => {
        const getBoards = async () => {
            const boards = await fetchUserBoards();
            setUserBoards(boards); // Set fetched boards to state
        };
        getBoards();
    }, []);

    const [message, setMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(""); // New state for success messages

    const handleSendMessage = async (e, currentUser) => {
        e.preventDefault();

        // Validate required fields
        if (!selectedUser) {
            setError("Please select a user to send a message.");
            return;
        }
        if (!message.trim()) {
            setError("Message cannot be empty.");
            return;
        }
        if (!status) {
            setError("Please select a status.");
            return;
        }
        if (!currentUser || !currentUser.email) {
            setError("Admin email is missing.");
            return;
        }

        // Clear any previous error and success message
        setError("");
        setSuccess("");

        try {
            await sendUserNotification(selectedUser.uid, status, message, currentUser.email);
            setMessage("");
            setSuccess("Message sent successfully!"); // Set success message

            // Optionally clear the success message after a few seconds
            setTimeout(() => {
                setSuccess("");
                setError("");
            }, 3000);
        } catch (err) {
            setError("Error sending notification: " + err.message);
        }
    };

    const value = {
        createBoard, setCreateBoard,
        IsCreateBoard, setIsCreateBoard,
        boardAttr, setBoardAttr,
        userBoards, setUserBoards,
        message, setMessage,
        selectedUser, setSelectedUser,
        status, setStatus,
        error, setError,
        success, setSuccess,
        handleSendMessage,
    };

    return (
        <ActivityContext.Provider value={value}>
            {children}
        </ActivityContext.Provider>
    );
};

export default ActivityProvider;
