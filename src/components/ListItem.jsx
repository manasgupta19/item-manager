import React from "react";

const ListItem = React.memo(({ item, onRemove, onVote }) => {
  // Staff Standard: Use 'en-US' for deterministic testing of AM/PM format
  const formattedDateTime = new Date(item.date).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
  });

  return (
    <li data-testid="list-item" className="list-row">
      <div className="col-name">{item.text}</div>
      <div className="col-date">{formattedDateTime}</div>
      
      <div className="col-votes">
        <button onClick={() => onVote(item.id, 'upvotes')} className="vote-btn up" aria-label="Upvote">
          👍 <span className="count">{item.upvotes ?? 0}</span>
        </button>
      </div>

      <div className="col-votes">
        <button onClick={() => onVote(item.id, 'downvotes')} className="vote-btn down" aria-label="Downvote">
          👎 <span className="count">{item.downvotes ?? 0}</span>
        </button>
      </div>

      <div className="col-actions">
        <button onClick={() => onRemove(item.id)} className="delete-btn-action" data-testid="delete-button">
          Remove
        </button>
      </div>
    </li>
  );
});

ListItem.displayName = "ListItem";
export default ListItem;