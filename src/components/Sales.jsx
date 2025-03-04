// Sales.jsx
import React, { useEffect, useState } from 'react';
import '../scss/sales.scss';
import '../scss/sidebar.scss';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/useAuth';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../utility/firebase';

const SalesBoard = () => {
    const { accs, getAccounts, currentUser } = useAuth();
    const [managerData, setManagerData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAccs, setFilteredAccs] = useState([]);
    const [editingAccount, setEditingAccount] = useState(null);
    const [editForm, setEditForm] = useState({
        username: '',
        email: '',
        isPremiumUser: false,
        ratePremium: '',
        PremiumPrice: '',
    });

    // Define quota for managers (admins have no quota limit)
    const MANAGER_QUOTA = 10;

    useEffect(() => {
        getAccounts();
    }, []);

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredAccs(accs);
        } else {
            setFilteredAccs(
                accs.filter(acc =>
                acc.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                acc.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [searchTerm, accs]);

    useEffect(() => {
        const fetchManagerData = async () => {
            if (currentUser) {
                const managerDocRef = doc(db, "manager", currentUser.uid);
                const managerDocSnap = await getDoc(managerDocRef);
                if (managerDocSnap.exists()) {
                    setManagerData(managerDocSnap.data());
                }
            }
        };
        fetchManagerData();
    }, [currentUser]);

    const premiumAccounts = accs.filter(acc => acc.isPremiumUser);
    const averagePremiumPrice =
        premiumAccounts.length > 0
        ? (
            premiumAccounts.reduce((sum, curr) => sum + curr.PremiumPrice, 0) /
            premiumAccounts.length
            ).toFixed(2)
        : 0;

    // Open modal for editing and prefill form
    const handleEditClick = (account) => {
        setEditingAccount(account);
        setEditForm({
            username: account.username,
            email: account.email,
            isPremiumUser: account.isPremiumUser,
            ratePremium: account.ratePremium,
            PremiumPrice: account.PremiumPrice,
        });
    };

    // Handle form changes
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setEditForm(prev => ({ ...prev, [name]: checked }));
    };

    // Automatic pricing update effect
    useEffect(() => {
        // If PremiumUser is enabled, update PremiumPrice based on ratePremium automatically
        if (editForm.isPremiumUser) {
        const rate = Number(editForm.ratePremium);
        let computedPrice = 0;
        if (rate === 1) computedPrice = 4.99;
        else if (rate === 2) computedPrice = 9.99;
        else if (rate === 3) computedPrice = 19.99;
        // Update PremiumPrice if computed price is different
        if (computedPrice && computedPrice !== Number(editForm.PremiumPrice)) {
            setEditForm(prev => ({ ...prev, PremiumPrice: computedPrice }));
        }
        } else {
        // If premium is disabled, ensure pricing fields are zeroed
        if (editForm.ratePremium !== 0 || editForm.PremiumPrice !== 0) {
            setEditForm(prev => ({ ...prev, ratePremium: 0, PremiumPrice: 0 }));
        }
        }
    }, [editForm.isPremiumUser, editForm.ratePremium]);

    // Update account data in Firestore
    const handleUpdate = async () => {
        if (!editingAccount) return;

        if (managerData && managerData.quota <= 0) {
            alert("Daily quota exhausted. Please try again tomorrow.");
            return;
        }

        try {
            const accountRef = doc(db, 'account', editingAccount.id);
            await updateDoc(accountRef, {
                username: editForm.username,
                email: editForm.email,
                isPremiumUser: editForm.isPremiumUser,
                ratePremium: Number(editForm.ratePremium),
                PremiumPrice: Number(editForm.PremiumPrice),
                updatedAt: new Date(),
            });

            if (managerData) {
                const managerRef = doc(db, "manager", currentUser.uid);
                await updateDoc(managerRef, { quota: managerData.quota - 1 });
                setManagerData(prev => ({ ...prev, quota: prev.quota - 1 }));
            }

            getAccounts();
            setEditingAccount(null);
        } catch (error) {
            console.error("Error updating account:", error);
        }
    };


    // Delete account (admin-only)
    const handleDelete = async (accountId) => {
        if (window.confirm("Are you sure you want to delete this account?")) {
            try {
                await deleteDoc(doc(db, 'account', accountId));
                getAccounts();
            } catch (error) {
                console.error("Error deleting account:", error);
            }
        }
    };

    const handleCancel = () => {
        setEditingAccount(null);
    };

    return (
        <div className="mainboard">
            <div className="sales-management-board">
                <div className="header">
                    <h2>Sales Management</h2>
                    <input
                        type="text"
                        placeholder="Search Sales"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overview-cards">
                    <div className="card">
                        <h3>Total Accounts</h3>
                        <p>{accs.length}</p>
                    </div>
                    <div className="card">
                        <h3>Premium Accounts</h3>
                        <p>{premiumAccounts.length}</p>
                    </div>
                    <div className="card">
                        <h3>Avg. Premium Price</h3>
                        <p>${averagePremiumPrice}</p>
                    </div>
                    {managerData && managerData.role === "manager" && (
                        <div className="card">
                        <h3>Account Quota</h3>
                        <p>{accs.length} / {managerData.quota}</p>
                        </div>
                    )}
                    {managerData && managerData.role === "admin" && (
                        <div className="card">
                        <h3>Admin Privileges</h3>
                        <p>Full Access</p>
                        </div>
                    )}
                </div>

                <div className="sales-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Premium</th>
                                <th>Rate</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAccs.map((acc, index) => (
                                <tr key={acc.id || index}>
                                <td>{acc.username}</td>
                                <td>{acc.email}</td>
                                <td>{acc.isPremiumUser ? "Yes" : "No"}</td>
                                <td>{acc.ratePremium}</td>
                                <td>${acc.PremiumPrice}</td>
                                <td>
                                    <button onClick={() => handleEditClick(acc)}>Edit</button>
                                    {managerData && managerData.role === "admin" && (
                                    <button onClick={() => handleDelete(acc.id)}>Delete</button>
                                    )}
                                </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal for editing account details */}
                {editingAccount && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Edit Account Pricing</h3>
                        <label>
                            Username:
                            <input
                                type="text"
                                name="username"
                                value={editForm.username}
                                onChange={handleEditChange}
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={editForm.email}
                                onChange={handleEditChange}
                            />
                        </label>
                        <label>
                            Premium User:
                            <input
                                type="checkbox"
                                name="isPremiumUser"
                                checked={editForm.isPremiumUser}
                                onChange={handleCheckboxChange}
                            />
                        </label>
                        <label>
                            Rate Premium:
                            <input
                                type="number"
                                name="ratePremium"
                                value={editForm.ratePremium}
                                onChange={handleEditChange}
                            />
                        </label>
                        <label>
                            Premium Price:
                            <input
                                type="number"
                                name="PremiumPrice"
                                value={editForm.PremiumPrice}
                                onChange={handleEditChange}
                            />
                        </label>
                        <div className="modal-actions">
                            <button onClick={handleUpdate}>Update</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

const Sales = () => {
    return (
        <div className="sales-comp">
        <Sidebar />
        <SalesBoard />
        </div>
    );
};

export default Sales;
