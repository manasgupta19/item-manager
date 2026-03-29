import React, { useState } from "react";

const ContactForm = ({ onToggleView, onAddLead, onRemoveLead }) => {
  const initialState = { name: "", email: "", message: "" };
  const [form, setForm] = useState(initialState);
  const [sessionLeads, setSessionLeads] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [targetId, setTargetId] = useState(null);

  // --- Real-time Validation Logic ---
  const isNameValid = form.name.length >= 4 && /^[a-zA-Z\s]+$/.test(form.name);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isMessageValid = form.message.length >= 10;

  // The button is only enabled when all individual regex/length conditions are met
  const isFormValid = isNameValid && isEmailValid && isMessageValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      const newLead = { 
        ...form, 
        id: crypto.randomUUID(), 
        date: new Date().toISOString() 
      };
      onAddLead(newLead);
      setSessionLeads((prev) => [newLead, ...prev]);
      setForm(initialState);
    }
  };

  const confirmDelete = (id) => {
    setTargetId(id);
    setShowModal(true);
  };

  const handleDelete = () => {
    setSessionLeads((prev) => prev.filter(lead => lead.id !== targetId));
    onRemoveLead(targetId);
    setShowModal(false);
    setTargetId(null);
  };

  return (
    <div className="contact-page-container">
      <div className="form-card">
        <h2 className="form-title">Contact Us</h2>
        <form onSubmit={handleSubmit} className="vertical-form">
          
          {/* Name Field */}
          <div className="layout-column align-items-start mb-10" data-testid="input-name">
            <input
              type="text" placeholder="Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              data-testid="name-input"
            />
            {!isNameValid && form.name.length > 0 && (
              <p className="error-text" data-testid="error-message">
                Name must be at least 4 characters long and only contain letters and spaces
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="layout-column align-items-start mb-10" data-testid="input-email">
            <input
              type="email" placeholder="Email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              data-testid="email-input"
            />
            {!isEmailValid && form.email.length > 0 && (
              <p className="error-text" data-testid="error-message">Email is invalid</p>
            )}
          </div>

          {/* Message Field */}
          <div className="layout-column align-items-start mb-10" data-testid="input-message">
            <textarea
              placeholder="Message" value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              data-testid="message-input"
              className="form-message-box"
            />
            {!isMessageValid && form.message.length > 0 && (
              <p className="error-text" data-testid="error-message">
                Message must be at least 10 characters long
              </p>
            )}
          </div>
          
          <div className="button-group">
            <button 
              type="submit" 
              className="submit-btn" 
              data-testid="contact-submit"
              disabled={!isFormValid} // THE FIX: Disabled by default
            >
              Submit
            </button>
            <button 
              type="button" 
              onClick={() => onToggleView("inventory")} 
              className="back-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Local Session Submissions (Blog Post Style) */}
      {sessionLeads.length > 0 && (
        <div className="submissions-section">
          <h3 className="section-subtitle">Recent Submissions</h3>
          <div className="submissions-grid">
            {sessionLeads.map((lead) => (
              <div key={lead.id} className="post-box lead-card">
                <h3>{lead.name}</h3>
                <p className="lead-email-sub">{lead.email}</p>
                <p className="lead-msg-sub">{lead.message}</p>
                <button className="delete-btn-action" onClick={() => confirmDelete(lead.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this submission?</p>
            <div className="modal-actions">
              <button className="delete-btn-confirm" onClick={handleDelete}>Yes, Delete</button>
              <button className="back-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactForm;