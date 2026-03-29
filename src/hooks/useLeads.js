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
    setLeads((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...leadData,
        date: new Date().toISOString(),
      },
    ]);
  }, []);

  return { leads, addLead };
};