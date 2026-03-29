import { useState, useCallback, useEffect } from "react";

export const useItemList = () => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("agoda_item_manager");
    const parsed = saved ? JSON.parse(saved) : [];
    // Data Migration: Ensure all items have a date AND a price
    return parsed.map(item => ({
      ...item,
      upvotes: item.upvotes ?? 0,
      downvotes: item.downvotes ?? 0,
      date: item.date ?? new Date().toISOString(),
      price: item.price ?? 100.00 // Default price for existing items
    }));
  });

  useEffect(() => {
    localStorage.setItem("agoda_item_manager", JSON.stringify(items));
  }, [items]);

  // Updated to accept an optional price
  const addItem = useCallback((text, price = 100) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setItems((prev) => {
      if (prev.some(i => i.text.toLowerCase() === trimmed.toLowerCase())) return prev;
      return [...prev, { 
        id: crypto.randomUUID(), 
        text: trimmed, 
        upvotes: 0, 
        downvotes: 0,
        date: new Date().toISOString(),
        price: parseFloat(price) || 100.00 // Store price as a number
      }];
    });
  }, []);

  // NEW: Function to update price
  const updatePrice = useCallback((id, newPrice) => {
    setItems(prev => prev.map(i => 
      i.id === id ? { ...i, price: parseFloat(newPrice) || 0 } : i
    ));
  }, []);

  const handleVote = useCallback((id, type) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [type]: i[type] + 1 } : i));
  }, []);

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  return { items, addItem, removeItem, handleVote, updatePrice };
};