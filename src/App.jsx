import { useState, useMemo } from "react";
import { useItemList } from "./hooks/useItemList";
import { useLeads } from "./hooks/useLeads";
import InventoryTable from "./components/InventoryTable";
import ContactForm from "./components/ContactForm";
import "./App.css";

export default function App() {
  const [view, setView] = useState("inventory");
  const { items, addItem, removeItem, handleVote } = useItemList();
  const { leads, addLead } = useLeads();

  return (
    <div className="container">
      <header className="navbar">
        <div className="nav-content">
          <h1 onClick={() => setView("inventory")} style={{ cursor: 'pointer' }}>
            Agoda Platform
          </h1>
          <nav className="nav-actions">
            <button className="nav-btn" onClick={() => setView("contact")}>Contact Us</button>
            <button className="nav-btn secondary" onClick={() => setView("leads")}>View Leads</button>
          </nav>
        </div>
      </header>

      <main className="App">
        {view === "inventory" && (
          <InventoryTable 
            items={items} 
            onAdd={addItem} 
            onRemove={removeItem} 
            onVote={handleVote} 
          />
        )}

        {view === "contact" && (
          <ContactForm onToggleView={setView} onAddLead={addLead} />
        )}

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
                        <span className="timestamp">{new Date(lead.date).toLocaleDateString()}</span>
                      </div>
                      <div className="col-message">{lead.message}</div>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="center-btn-container">
              <button onClick={() => setView("inventory")} className="inventory-nav-btn">
                ← Return to Inventory
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}