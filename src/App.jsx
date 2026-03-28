import { useState, useMemo } from "react";
import { useItemList } from "./hooks/useItemList";
import ListItem from "./components/ListItem";
import "./App.css";

function App() {
  const { items, addItem } = useItemList();
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // New state for search

  // Actionable: Derived State + Memoization
  // We compute 'filteredItems' during render. useMemo ensures this only 
  // re-calculates if 'items' or 'searchQuery' changes.
  const filteredItems = useMemo(() => {
    console.log("Systemic Check: Filtering items...");
    return items.filter((item) =>
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addItem(input);
    setInput("");
  };

  return (
    <div className="container">
      <header className="navbar">
        <h1>Platform Item Manager</h1>
      </header>

      <main className="App">
        <section className="controls">
          {/* Add Item Form */}
          <form onSubmit={handleSubmit} className="input-group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add new item..."
              data-testid="input-field"
            />
            <button type="submit" data-testid="add-button">Add Item</button>
          </form>

          {/* Search Input - Actionable: A11y & Clear UI */}
          <div className="search-group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="search-input"
              data-testid="search-input"
            />
          </div>
        </section>

        <section className="list-container">
          <h3>Current Inventory ({filteredItems.length})</h3>
          <ul data-testid="item-list" aria-live="polite">
            {filteredItems.map((item) => (
              <ListItem key={item.id} item={item} />
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;