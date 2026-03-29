import { useState, useMemo } from "react";
import { useItemList } from "./hooks/useItemList";
import ListItem from "./components/ListItem";
import "./App.css";

function App() {
  const { items, addItem, removeItem, handleVote } = useItemList();
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Requirement: Toggleable sort state for Name, Date, Upvotes, and Downvotes
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const processedItems = useMemo(() => {
    let result = items.filter((item) =>
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return result.sort((a, b) => {
      const { key, direction } = sortConfig;
      let comparison = 0;

      if (key === "text") {
        comparison = a.text.localeCompare(b.text);
      } else if (key === "date") {
        comparison = new Date(a.date) - new Date(b.date);
      } else {
        comparison = (a[key] ?? 0) - (b[key] ?? 0);
      }

      return direction === "desc" ? -comparison : comparison;
    });
  }, [items, searchQuery, sortConfig]);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "desc" ? "↓" : "↑";
  };

  return (
    <div className="container">
      <header className="navbar">
        <h1>Agoda Platform: Item Inventory</h1>
      </header>

      <main className="App">
        <section className="controls">
          <form onSubmit={(e) => { e.preventDefault(); addItem(input); setInput(""); }} className="input-group">
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
            placeholder="Search inventory..."
            className="search-input"
            data-testid="search-input"
          />
        </section>

        <div className="table-container">
          <div className="list-header">
            <div className="col-name sortable" onClick={() => handleSort("text")}>
              Item Name {getSortIcon("text")}
            </div>
            <div className="col-date sortable" onClick={() => handleSort("date")}>
              Date Added {getSortIcon("date")}
            </div>
            <div className="col-votes sortable" onClick={() => handleSort("upvotes")}>
              Upvotes {getSortIcon("upvotes")}
            </div>
            <div className="col-votes sortable" onClick={() => handleSort("downvotes")}>
              Downvotes {getSortIcon("downvotes")}
            </div>
            <div className="col-actions">Actions</div>
          </div>

          <ul data-testid="item-list" className="item-list">
            {processedItems.map((item) => (
              <ListItem key={item.id} item={item} onRemove={removeItem} onVote={handleVote} />
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;