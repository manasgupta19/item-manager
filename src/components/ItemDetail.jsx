import React, { useState, useEffect } from "react";

const ItemDetail = ({ item, onNext, onBack, onUpdatePrice }) => {
    const [editPrice, setEditPrice] = useState(item.price);

    // Sync internal state if the item changes via "Next Item"
    useEffect(() => {
        setEditPrice(item.price);
    }, [item]);

    const handleSave = () => {
        onUpdatePrice(item.id, editPrice);
        alert("Price updated successfully!");
    };

    return (
        <div className="form-card details-view">
            <div className="detail-header">
                <button onClick={onBack} className="back-btn">← Back</button>
                <h2 className="form-title">Item Profile</h2>
                <button onClick={onNext} className="submit-btn" style={{ width: 'auto' }}>Next Item</button>
            </div>

            <div className="detail-profile">
                <h4>{item.text}</h4>
                <p><strong>Date Added:</strong> {new Date(item.date).toLocaleString()}</p>
                <div className="price-update-section mt-20">
                    <label>Update Unit Price ($):</label>
                    <div className="input-group mt-10">
                        <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="agoda-select"
                            style={{ width: '150px' }}
                        />
                        <button onClick={handleSave} className="submit-btn" style={{ marginLeft: '10px' }}>
                            Save Price
                        </button>
                    </div>
                </div>
                <div className="detail-stats">
                    <span className="upvotes">👍 {item.upvotes}</span>
                    <span className="downvotes">👎 {item.downvotes}</span>
                </div>
            </div>
        </div>
    );
};

export default ItemDetail;