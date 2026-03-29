import React, { useState } from "react";

const BudgetEstimator = ({ items }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const availableBalance = 20000.00; // Agoda user limit

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);

    if (value === "") {
      setError("Amount cannot be empty");
    } else {
      const numValue = parseFloat(value);
      if (numValue < 0.01) {
        setError("Amount cannot be less than $0.01");
      } else if (numValue > availableBalance) {
        setError("Amount cannot exceed the available balance");
      } else {
        setError("");
      }
    }
  };

  return (
    <div className="layout-column align-items-center">
      <div className="form-card budget-header-box">
        <h2 className="form-title">Affordability Calculator</h2>
        <label>
          I want to spend $ 
          <input 
            className="budget-input" 
            style={{ width: '150px', display: 'inline-block', margin: '0 10px' }}
            type="number" 
            value={amount} 
            onChange={handleAmountChange}
            placeholder="USD"
          /> 
          of my <strong>${availableBalance.toLocaleString()}</strong>:
        </label>
        {error && (
          <p className="error-text" data-testid="error-message" style={{ marginTop: '10px' }}>
            {error}
          </p>
        )}
      </div>

      <div className="table-container mt-20" style={{ width: '100%' }}>
        <div className="list-header">
          <span>Item Name</span>
          <span>Price (per unit)</span>
          <span>Units Afforded</span>
        </div>
        {items.length === 0 ? (
          <p className="empty-state">No inventory items to calculate.</p>
        ) : (
          items.map((item) => {
            let unitsDisplay = "0";
            
            if (amount !== "") {
              if (error && error !== "Amount cannot be empty") {
                unitsDisplay = "n/a"; // Logic from CryptoRank: range errors show n/a
              } else if (!error) {
                // Calculation: Budget / Item Price
                unitsDisplay = Math.floor(parseFloat(amount) / item.price).toString();
              }
            }

            return (
              <div key={item.id} className="list-row">
                <span>{item.text}</span>
                <span>${item.price.toFixed(2)}</span>
                <span className="units-count" data-testid="units-count">{unitsDisplay}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BudgetEstimator;