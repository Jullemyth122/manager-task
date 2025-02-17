import { db } from './firebase'; // Ensure that db is imported
import { collection, addDoc, getDocs } from "firebase/firestore";

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

export { fetchUserBoards };
