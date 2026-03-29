import React, { useState } from "react";

const ContactForm = ({ onToggleView, onAddLead }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = form;

    // Logic: Validation priority
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("All fields are mandatory");
      return;
    }

    if (!email.includes("@")) {
      setError("Email is invalid");
      return;
    }

    if (message.length < 10) {
      setError("Message must be at least 10 characters long");
      return;
    }

    // Success path
    onAddLead(form);
    setError("");
    onToggleView("leads");
  };

  return (
    <div className="form-card">
      <h2 className="form-title">Contact Us</h2>
      <form onSubmit={handleSubmit} className="vertical-form">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          data-testid="name-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          data-testid="email-input"
        />
        <textarea
          placeholder="Message"
          className="form-message-box"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          data-testid="message-input"
        />
        
        {/* Isolated error message tag */}
        {error && (
          <p data-testid="error-message" className="error-text">
            {error}
          </p>
        )}
        
        <div className="button-group">
          <button type="submit" className="submit-btn" data-testid="contact-submit">
            Submit
          </button>
          <button 
            type="button" 
            onClick={() => onToggleView("inventory")} 
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;