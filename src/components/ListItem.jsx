import React from "react";

const ListItem = React.memo(({ item, onRemove, onVote }) => {
  return (
    <li data-testid="list-item" className="list-item">
      <span className="item-text">{item.text}</span>
      
      <div className="item-actions">
        <div className="vote-section">
          {/* Use 'up' and 'down' classes for color distinction */}
          <button 
            onClick={() => onVote(item.id, 'upvotes')} 
            className="vote-btn up"
            aria-label="Upvote"
          >
            👍 <span key={`up-${item.upvotes}`} className="count">{item.upvotes ?? 0}</span>
          </button>
          
          <button 
            onClick={() => onVote(item.id, 'downvotes')} 
            className="vote-btn down"
            aria-label="Downvote"
          >
            👎 <span key={`down-${item.downvotes}`} className="count">{item.downvotes ?? 0}</span>
          </button>
        </div>

        <button 
          onClick={() => onRemove(item.id)} 
          className="delete-btn"
          data-testid="delete-button"
          aria-label={`Delete ${item.text}`}
        >
          &times;
        </button>
      </div>
    </li>
  );
});

ListItem.displayName = "ListItem";
export default ListItem;