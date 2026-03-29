import { useState, useCallback, useEffect } from "react";

export const useLeads = () => {
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem("agoda_leads_manager");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("agoda_leads_manager", JSON.stringify(leads));
  }, [leads]);

  const addLead = useCallback((leadData) => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    setLeads((prev) => [
      ...prev,
      {
        id,
        ...leadData,
        date: new Date().toISOString(),
      },
    ]);
  }, []);

  // NEW: Function to remove a lead by ID
  const removeLead = useCallback((id) => {
    setLeads((prev) => prev.filter(lead => lead.id !== id));
  }, []);

  return { leads, addLead, removeLead };
};