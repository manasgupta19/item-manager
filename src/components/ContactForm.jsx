import React, { useState } from "react";

const ContactForm = ({ onToggleView, onAddLead, onRemoveLead }) => {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [error, setError] = useState("");

    // NEW: State for leads added ONLY during this specific visit to the page
    const [sessionLeads, setSessionLeads] = useState([]);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [targetId, setTargetId] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, message } = form;

        // Logic: Validation priority matches the test suite expectations
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

        // Generate a temporary ID for local tracking
        const tempId = crypto.randomUUID();
        const newLead = { ...form, id: tempId, date: new Date().toISOString() };

        // 1. Save globally (to localStorage/useLeads)
        onAddLead(newLead);

        // 2. Save locally (to show only on this page right now)
        setSessionLeads((prev) => [newLead, ...prev]);
        setError("");
        setForm({ name: "", email: "", message: "" }); // Clear inputs like in Blog Post problem
    };

    const confirmDelete = (id) => {
        setTargetId(id);
        setShowModal(true);
    };

    const handleDelete = () => {
        // Remove from local session view
        setSessionLeads((prev) => prev.filter(lead => lead.id !== targetId));
        onRemoveLead(targetId);
        setShowModal(false);
        setTargetId(null);
    };

    return (
        <div className="contact-form-container">
            <div className="form-card">
                <h2 className="form-title">Contact Us</h2>
                {/* FIX: Add noValidate to prevent HTML5 from blocking the test submission */}
                <form onSubmit={handleSubmit} className="vertical-form" noValidate>
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
                            className="back-btn"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            {/* ONLY shows leads submitted in this session */}
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
                            <button className="delete-btn-action" onClick={handleDelete}>Yes, Delete</button>
                            <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactForm;