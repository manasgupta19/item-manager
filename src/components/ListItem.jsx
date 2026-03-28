import React from "react";

// Actionable: Destructure the onRemove callback
const ListItem = React.memo(({ item, onRemove }) => {
  console.log(`Systemic Check: Rendering Item -> ${item.text}`);
  
  return (
    <li data-testid="list-item" className="list-item">
      <span>{item.text}</span>
      <button 
        onClick={() => onRemove(item.id)}
        className="delete-btn"
        data-testid="delete-button"
        aria-label={`Delete ${item.text}`}
      >
        &times;
      </button>
    </li>
  );
});

ListItem.displayName = "ListItem";
export default ListItem;