import { useState } from "react";
import { useItemList } from "./hooks/useItemList";
import { useLeads } from "./hooks/useLeads";
import InventoryTable from "./components/InventoryTable";
import ContactForm from "./components/ContactForm";
import ItemDetail from "./components/ItemDetail";
import "./App.css";

export default function App() {
  const [view, setView] = useState("inventory");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const { items, addItem, removeItem, handleVote } = useItemList();
  const { leads, addLead, removeLead } = useLeads();

  /**
   * Cyclic Navigation Logic:
   * Finds the current item's index and calculates the next index using a modulo operator.
   * This ensures the detail view loops back to the first item after the last one.
   */
  const handleNextItem = () => {
    if (items.length === 0) return;
    const currentIndex = items.findIndex((item) => item.id === selectedItemId);
    const nextIndex = (currentIndex + 1) % items.length;
    setSelectedItemId(items[nextIndex].id);
  };

  /**
   * Navigation Logic:
   * Switches the view to 'details' and sets the specific item to be displayed.
   */
  const openDetails = (id) => {
    setSelectedItemId(id);
    setView("details");
  };

  /**
   * Reset Navigation:
   * Returns to the main inventory list and clears the active selection.
   */
  const handleReturnToInventory = () => {
    setView("inventory");
    setSelectedItemId(null);
  };

  return (
    <div className="container">
      <header className="navbar">
        <div className="nav-content">
          <h1 onClick={handleReturnToInventory} style={{ cursor: "pointer" }}>
            Agoda Platform
          </h1>
          <nav className="nav-actions">
            <button className="nav-btn" onClick={() => setView("contact")}>
              Contact Us
            </button>
            <button
              className="nav-btn secondary"
              onClick={() => setView("leads")}
            >
              View Leads
            </button>
          </nav>
        </div>
      </header>

      <main className="App">
        {/* Main Inventory View */}
        {view === "inventory" && (
          <InventoryTable
            items={items}
            onAdd={addItem}
            onRemove={removeItem}
            onVote={handleVote}
            onViewDetails={openDetails}
          />
        )}

        {/* Detailed Item View with Cyclic Navigation */}
        {view === "details" && selectedItemId && (
          <ItemDetail
            item={items.find((i) => i.id === selectedItemId)}
            onNext={handleNextItem}
            onBack={handleReturnToInventory}
          />
        )}

        {/* Contact Form Submission */}
        {view === "contact" && (
          <ContactForm onToggleView={setView} onAddLead={addLead} onRemoveLead={removeLead}/>
        )}

        {/* Leads Management View */}
        {view === "leads" && (
          <div className="leads-page">
            <div className="table-container">
              <div className="list-header">
                <div className="col-name">Name</div>
                <div className="col-date">Contact Info</div>
                <div className="col-message">Inquiry Message</div>
              </div>
              <ul className="item-list">
                {leads.length === 0 ? (
                  <p className="empty-state">No inquiries found.</p>
                ) : (
                  leads.map((lead) => (
                    <li key={lead.id} className="list-row">
                      <div className="col-name">{lead.name}</div>
                      <div className="col-date">
                        <span className="lead-email">{lead.email}</span>
                        <span className="timestamp">
                          {new Date(lead.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="col-message">{lead.message}</div>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="center-btn-container">
              <button
                onClick={handleReturnToInventory}
                className="inventory-nav-btn"
              >
                ← Return to Inventory
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}