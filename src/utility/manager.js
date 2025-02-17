import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from './firebase'; // Ensure that db is imported

// Function to save user data to Firestore
const saveManagerData = async (user, username) => {
    try {
        // Create a document for the user with their UID in Firestore
        await setDoc(doc(db, "manager", user.uid), {
            approval:false,
            username: user.displayName || username,  // use user's displayName if available, or fallback to local username
            email: user.email,
            uid: user.uid,
            createdAt: new Date(), // Optional: Add a timestamp
        });
        console.log("User data saved to Firestore");
    } catch (error) {
        console.error("Error saving user data: ", error);
    }
};

// Export the saveManagerData function
export { saveManagerData };

// Function to fetch all boards from Firestore (🟢 Now includes document ID)
const fetchUserAccounts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "account"));
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

export { fetchUserAccounts };
