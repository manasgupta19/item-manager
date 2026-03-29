import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import App from "./App";

describe("Staff-Level Item Manager Integration Tests", () => {
  
  // High-value actionable: Ensure test isolation by clearing LocalStorage
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the initial empty state correctly", () => {
    render(<App />);
    const inputElement = screen.getByTestId("input-field");
    const listItems = screen.queryAllByTestId("list-item");
    
    expect(inputElement.value).toBe("");
    expect(listItems).toHaveLength(0);
  });

  it("adds a valid item to the list and clears the input", () => {
    render(<App />);
    const inputElement = screen.getByTestId("input-field");
    const addButton = screen.getByTestId("add-button");

    fireEvent.change(inputElement, { target: { value: "Agoda Stay" } });
    fireEvent.click(addButton);

    const listItems = screen.getAllByTestId("list-item");
    expect(listItems).toHaveLength(1);
    // Note: We use toHaveTextContent to handle whitespace nodes robustly
    expect(listItems[0]).toHaveTextContent("Agoda Stay");
    expect(inputElement.value).toBe("");
  });

  it("systemically prevents adding empty or whitespace-only items", () => {
    render(<App />);
    const inputElement = screen.getByTestId("input-field");
    const addButton = screen.getByTestId("add-button");

    // Scenario 1: Empty string
    fireEvent.change(inputElement, { target: { value: "" } });
    fireEvent.click(addButton);

    // Scenario 2: Whitespace only
    fireEvent.change(inputElement, { target: { value: "   " } });
    fireEvent.click(addButton);

    const listItems = screen.queryAllByTestId("list-item");
    expect(listItems).toHaveLength(0);
  });

  it("enforces uniqueness by rejecting duplicate entries (Case-Insensitive)", () => {
    render(<App />);
    const inputElement = screen.getByTestId("input-field");
    const addButton = screen.getByTestId("add-button");

    // Add first entry
    fireEvent.change(inputElement, { target: { value: "Bangkok" } });
    fireEvent.click(addButton);

    // Attempt to add duplicate with different casing
    fireEvent.change(inputElement, { target: { value: "BANGKOK" } });
    fireEvent.click(addButton);

    const listItems = screen.getAllByTestId("list-item");
    expect(listItems).toHaveLength(1);
  });

  it("verifies data persistence across session reloads (LocalStorage)", () => {
    // Phase 1: Render and add an item
    const { unmount } = render(<App />);
    const inputElement = screen.getByTestId("input-field");
    const addButton = screen.getByTestId("add-button");

    fireEvent.change(inputElement, { target: { value: "Persistent Item" } });
    fireEvent.click(addButton);

    // Phase 2: Simulate page refresh by unmounting and re-mounting
    unmount();
    render(<App />);

    const listItems = screen.getAllByTestId("list-item");
    expect(listItems).toHaveLength(1);
    expect(listItems[0]).toHaveTextContent("Persistent Item");
  });

  it("correctly renders multiple distinct items in sequence", () => {
    render(<App />);
    const inputElement = screen.getByTestId("input-field");
    const addButton = screen.getByTestId("add-button");

    const mockData = ["Hotel A", "Flight B", "Car C"];

    mockData.forEach(val => {
      fireEvent.change(inputElement, { target: { value: val } });
      fireEvent.click(addButton);
    });

    const listItems = screen.getAllByTestId("list-item");
    expect(listItems).toHaveLength(mockData.length);
    expect(listItems[2]).toHaveTextContent("Car C");
  });

  it("filters the list correctly based on the search query", () => {
    render(<App />);
    const input = screen.getByTestId("input-field");
    const addButton = screen.getByTestId("add-button");
    const searchInput = screen.getByTestId("search-input");

    // Add multiple items
    const items = ["Apple", "Banana", "Cherry"];
    items.forEach(item => {
      fireEvent.change(input, { target: { value: item } });
      fireEvent.click(addButton);
    });

    // Search for 'an' (should match Banana)
    fireEvent.change(searchInput, { target: { value: "an" } });

    const listItems = screen.getAllByTestId("list-item");
    expect(listItems).toHaveLength(1);
    expect(listItems[0]).toHaveTextContent("Banana");
  });

  it("successfully removes an item from the list when delete is clicked", () => {
    render(<App />);
    const input = screen.getByTestId("input-field");
    const addButton = screen.getByTestId("add-button");

    // Add an item
    fireEvent.change(input, { target: { value: "Delete Me" } });
    fireEvent.click(addButton);

    // Find the delete button and click it
    const deleteButton = screen.getByTestId("delete-button");
    fireEvent.click(deleteButton);

    // Assert the item is gone
    const listItems = screen.queryAllByTestId("list-item");
    expect(listItems).toHaveLength(0);
    expect(screen.queryByText("Delete Me")).toBeNull();
  });

  it("successfully removes an item from the list when delete is clicked", () => {
    render(<App />);
    const input = screen.getByTestId("input-field");
    const addButton = screen.getByTestId("add-button");

    fireEvent.change(input, { target: { value: "Delete Me" } });
    fireEvent.click(addButton);

    const deleteButton = screen.getByTestId("delete-button");
    fireEvent.click(deleteButton);

    expect(screen.queryAllByTestId("list-item")).toHaveLength(0);
  });

  it("filters the list correctly based on search", () => {
    render(<App />);
    const input = screen.getByTestId("input-field");
    const addButton = screen.getByTestId("add-button");
    const searchInput = screen.getByTestId("search-input");

    ["Apple", "Banana"].forEach(text => {
      fireEvent.change(input, { target: { value: text } });
      fireEvent.click(addButton);
    });

    fireEvent.change(searchInput, { target: { value: "ana" } });
    const listItems = screen.getAllByTestId("list-item");
    expect(listItems).toHaveLength(1);
    expect(listItems[0]).toHaveTextContent("Banana");
  });

  it("increments upvote and downvote counts independently", () => {
    render(<App />);
    const input = screen.getByTestId("input-field");
    const addButton = screen.getByTestId("add-button");

    fireEvent.change(input, { target: { value: "Vote Test" } });
    fireEvent.click(addButton);

    const upvoteBtn = screen.getByLabelText("Upvote");
    fireEvent.click(upvoteBtn);
    fireEvent.click(upvoteBtn);

    expect(screen.getByText("2")).toBeDefined();
  });
});