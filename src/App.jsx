import { useState } from "react";
import { useItemList } from "./hooks/useItemList";
import ListItem from "./components/ListItem";
import "./App.css";

function App() {
  const { items, addItem } = useItemList();
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Semantic form handling
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
          <form onSubmit={handleSubmit} className="input-group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter item name..."
              data-testid="input-field"
              aria-label="New item name"
            />
            <button type="submit" data-testid="add-button">
              Add Item
            </button>
          </form>
        </section>

        <section className="list-container">
          <h3>Current Inventory</h3>
          {/* aria-live="polite" notifies screen readers of dynamic updates */}
          <ul data-testid="item-list" aria-live="polite">
            {items.map((item) => (
              <ListItem key={item.id} item={item} />
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;