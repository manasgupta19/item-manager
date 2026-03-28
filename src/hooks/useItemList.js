import { useState, useCallback, useEffect } from "react";

export const useItemList = () => {
  // 1. Persistence & Hydration: Initialize from LocalStorage
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("agoda_item_manager");
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Side Effect: Persist state on change
  useEffect(() => {
    localStorage.setItem("agoda_item_manager", JSON.stringify(items));
  }, [items]);

  // 3. Logic: Add item with systemic validation (Memoized with useCallback)
  const addItem = useCallback((text) => {
    const trimmed = text.trim();
    
    // Systemic Validation: No empty strings and No Duplicates
    if (!trimmed) return;
    
    setItems((prev) => {
      if (prev.some(item => item.text.toLowerCase() === trimmed.toLowerCase())) {
        console.warn("Systemic Check: Duplicate item rejected.");
        return prev;
      }
      
      // Deterministic Key: Using UUID instead of array index
      return [...prev, { id: crypto.randomUUID(), text: trimmed }];
    });
  }, []);

  // Actionable: Stable Callback for Deletion
  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return { items, addItem, removeItem }; // Expose removeItem
};