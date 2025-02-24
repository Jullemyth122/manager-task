import { db } from './firebase'; // Ensure that db is imported
import { collection, addDoc, getDocs, arrayUnion, updateDoc, doc } from "firebase/firestore";

// Function to fetch all boards from Firestore (🟢 Now includes document ID)
const fetchUserBoards = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "boards"));
        const boards = querySnapshot.docs.map(doc => ({
            id: doc.id, // 🟢 Include Firestore document ID
            ...doc.data()
        }));
        return boards;
    } catch (error) {
        console.error("Error fetching boards: ", error);
        return [];
    }
};

const sendUserNotification = async (userUid, status, messageContent, adminEmail) => {
    try {
        await updateDoc(doc(db, "account", userUid), {
            notifications: arrayUnion({
                status: status,
                message: messageContent,
                notificationDate: new Date(), // More descriptive field name
                admin: adminEmail,
            })
        });
        console.log("Notification sent to user");
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};

export { fetchUserBoards, sendUserNotification };
