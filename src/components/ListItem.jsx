import React from "react";

// React.memo prevents unnecessary re-renders when parent state (input) changes
const ListItem = React.memo(({ item }) => {
  return (
    <li data-testid="list-item" className="list-item">{item.text}</li>
  );
});

// Setting a display name for easier debugging in React DevTools
ListItem.displayName = "ListItem";

export default ListItem;