import React from "react";

const ItemDetail = ({ item, onNext, onBack }) => {
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
        <div className="detail-stats">
          <span className="upvotes">👍 {item.upvotes}</span>
          <span className="downvotes">👎 {item.downvotes}</span>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;