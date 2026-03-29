import React, { useState, useMemo } from "react";
import ListItem from "./ListItem";

const InventoryTable = ({ items, onAdd, onRemove, onVote, onViewDetails }) => {
    const [input, setInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [jumpId, setJumpId] = useState("0");
    const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });

    // Logic: Handles the "Show" button for direct navigation (Medical Records Pattern)
    const handleJump = () => {
        if (jumpId === "0") {
            alert("Please select an item name");
            return;
        }
        onViewDetails(jumpId);
    };

    const handleAdd = () => {
        if (!input.trim()) return;
        onAdd(input);
        setInput("");
    };

    const handleSort = (key) => {
        let direction = "desc";
        if (sortConfig.key === key && sortConfig.direction === "desc") {
            direction = "asc";
        }
        setSortConfig({ key, direction });
    };

    // Logic: Processing sorting and searching
    const processedItems = useMemo(() => {
        let filtered = items.filter((item) =>
            item.text.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return filtered.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (sortConfig.key === "text") {
                return sortConfig.direction === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
        });
    }, [items, searchQuery, sortConfig]);

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return "↕️";
        return sortConfig.direction === "asc" ? "🔼" : "🔽";
    };

    return (
        <section className="inventory-section">
            {/* SECTION 1: Jump to Details (Pattern from Patient Medical Records) */}
            <div className="jump-controls">
                <div className="select-container">
                    <select
                        className="agoda-select"
                        value={jumpId}
                        onChange={(e) => setJumpId(e.target.value)}
                        data-testid="jump-dropdown"
                    >
                        <option value="0" disabled>Select Item to View Details</option>
                        {items.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.text}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleJump} className="show-btn" data-testid="show-details-btn">
                        Show Details
                    </button>
                </div>
            </div>

            {/* SECTION 2: Standard Inventory Controls */}
            <div className="controls">
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Add new item..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAdd()}
                        data-testid="input-field"
                    />
                    <button onClick={handleAdd} data-testid="add-button" className="add-btn">
                        Add Item
                    </button>
                </div>
                <div className="search-group">
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        data-testid="search-input"
                        className="search-input"
                    />
                </div>
            </div>

            {/* SECTION 3: Inventory Data Table */}
            <div className="table-container">
                <div className="list-header">
                    {/* Note: "Item Name" is required to pass the integration tests */}
                    <div className="col-name sortable" onClick={() => handleSort("text")}>
                        Item Name {getSortIcon("text")}
                    </div>
                    {/* NEW: Amount Header */}
                    <div className="col-amount">
                        Amount ($)
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

                <ul className="item-list">
                    {processedItems.length === 0 ? (
                        <div className="empty-state">
                            <p>No items found matching your criteria.</p>
                        </div>
                    ) : (
                        processedItems.map((item) => (
                            <ListItem
                                key={item.id}
                                item={item}
                                onRemove={onRemove}
                                onVote={onVote}
                                onViewDetails={onViewDetails}
                            />
                        ))
                    )}
                </ul>
            </div>
        </section>
    );
};

export default InventoryTable;