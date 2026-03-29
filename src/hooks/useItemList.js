import { useState, useCallback, useEffect } from "react";

export const useItemList = () => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("agoda_item_manager");
    const parsed = saved ? JSON.parse(saved) : [];

    // Data Migration: Ensure every item has voting fields to prevent NaN
    return parsed.map(item => ({
      ...item,
      upvotes: item.upvotes ?? 0,
      downvotes: item.downvotes ?? 0
    }));
  });

  useEffect(() => {
    localStorage.setItem("agoda_item_manager", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    
    setItems((prev) => {
      if (prev.some(item => item.text.toLowerCase() === trimmed.toLowerCase())) return prev;
      return [...prev, { 
        id: crypto.randomUUID(), 
        text: trimmed, 
        upvotes: 0, 
        downvotes: 0 
      }];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleVote = useCallback((id, type) => {
    setItems((prev) => 
      prev.map((item) => 
        item.id === id ? { ...item, [type]: (item[type] ?? 0) + 1 } : item
      )
    );
  }, []);

  return { items, addItem, removeItem, handleVote };
};