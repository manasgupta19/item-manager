import { useState, useMemo } from "react";
import { useItemList } from "./hooks/useItemList";
import ListItem from "./components/ListItem";
import "./App.css";

function App() {
  const { items, addItem, removeItem, handleVote } = useItemList();
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
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

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="search-input"
            data-testid="search-input"
          />
        </section>

        <ul data-testid="item-list" className="item-list" aria-live="polite">
          {filteredItems.map((item) => (
            <ListItem 
              key={item.id} 
              item={item} 
              onRemove={removeItem}
              onVote={handleVote}
            />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;