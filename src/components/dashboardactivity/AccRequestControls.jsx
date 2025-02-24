import React from 'react';
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from '../../context/useAuth';
import { db } from '../../utility/firebase';
import { useTruncateText } from '../../hooks/useTruncateText';

const AccReqControl = () => {
  const { accs, getAccounts } = useAuth(); // Assume getAccounts refreshes the list after an update


  // Sort accounts by createdAt (newest first)
  const sortedAccs = accs.slice().sort((a, b) => {
    const dateA = a.createdAt && a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
    const dateB = b.createdAt && b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
    return dateB - dateA;
  });

  // Handler to update a checkbox field for an account in Firestore
  const handleCheckboxChange = async (accId, field, currentValue) => {
    try {
      const newValue = !currentValue;
      const accDocRef = doc(db, "account", accId);
      const checking = await updateDoc(accDocRef, { [field]: newValue });
      console.log({[field]: newValue})
      console.log(accDocRef)
      console.log(checking)
      // Refresh the accounts list after updating the document.
      if (getAccounts) getAccounts();
    } catch (error) {
      console.error("Error updating account field:", error);
    }
  };

  // Handler to update the card limit
  const handleCardLimitChange = async (accId, newLimit) => {
    try {
      const numericLimit = Number(newLimit);
      const accDocRef = doc(db, "account", accId);
      await updateDoc(accDocRef, { cardLimits: numericLimit });
      if (getAccounts) getAccounts();
    } catch (error) {
      console.error("Error updating card limit:", error);
    }
  };

  // Handler to update the board (or task) limit
  const handleTaskLimitChange = async (accId, newLimit) => {
    try {
      const numericLimit = Number(newLimit);
      const accDocRef = doc(db, "account", accId);
      // Update using the correct field name (e.g., taskLimits or boardLimits)
      await updateDoc(accDocRef, { taskLimits: numericLimit });
      if (getAccounts) getAccounts();
    } catch (error) {
      console.error("Error updating board limit:", error);
    }
  };

  return (
    <div className="recent-list">
      <input 
        type="text" 
        className="search-text"
        placeholder="Search..."
      />
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Username / Email</th>
              <th>Request</th>
              <th>Controls</th>
              <th>Date Creation</th>
            </tr>
          </thead>
          <tbody>
            {sortedAccs.map(acc => {
              const accDate = acc.createdAt && acc.createdAt.toDate
                ? acc.createdAt.toDate()
                : new Date(acc.createdAt);
              return (
                <tr key={acc.id}>
                  <td>
                    {acc.username || '-'}
                    <br />
                    {useTruncateText(acc.email || '-', 35)}
                  </td>
                  <td>"Request Features"</td>
                  <td className="grid gap-3">
                    {/* Tagging Checkbox */}
                    <div className="label-box flex items-center justify-between">
                      <label htmlFor={`tagging-${acc.id}`}>Tagging</label>
                      <input
                        id={`tagging-${acc.id}`}
                        type="checkbox"
                        checked={acc.istagging}
                        onChange={() => handleCheckboxChange(acc.id, 'istagging', acc.istagging)}
                      />
                    </div>

                    {/* Cards Limit (number input) */}
                    <input
                      type="number"
                      placeholder="Cards Limit"
                      value={acc.cardLimits}
                      onChange={(e) => handleCardLimitChange(acc.id, e.target.value)}
                    />

                    {/* Boards Limit (number input) */}
                    <input
                      type="number"
                      placeholder="Boards Limit"
                      value={acc.taskLimits}
                      onChange={(e) => handleTaskLimitChange(acc.id, e.target.value)}
                    />

                    {/* Links Checkbox */}
                    <div className="label-box flex items-center justify-between">
                      <label htmlFor={`links-${acc.id}`}>Links</label>
                      <input
                        id={`links-${acc.id}`}
                        type="checkbox"
                        checked={acc.islinks}
                        onChange={() => handleCheckboxChange(acc.id, 'islinks', acc.islinks)}
                      />
                    </div>
                  </td>
                  <td>{accDate.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccReqControl;
