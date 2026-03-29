import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import App from "./App";

describe("Staff-Level Item Manager - Full Integration", () => {

  // High-value actionable: Ensure test isolation by clearing LocalStorage
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // 1. Existing functionality check
  it("renders the initial empty state correctly", () => {
    render(<App />);
    const inputElement = screen.getByTestId("input-field");
    const listItems = screen.queryAllByTestId("list-item");

    expect(inputElement.value).toBe("");
    expect(listItems).toHaveLength(0);
  });

  // 2. Addition and Reset logic check
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

  // 3. Systemic Validation: Whitespace rejection check
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

  // 4. Persistence Check with hydration verification
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

  // 5. Deletion Flow Check
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

  // 6. Derived State / Search check
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

  // 7. Voting Isolation Check (Critical for Platform role)
  it("ensures voting on one item does not affect the vote counts of another", () => {
    render(<App />);
    const input = screen.getByTestId("input-field");
    const addButton = screen.getByTestId("add-button");

    // Add two items
    const items = ["Item A", "Item B"];
    items.forEach(text => {
      fireEvent.change(input, { target: { value: text } });
      fireEvent.click(addButton);
    });

    // Upvote Item A
    const upvoteButtons = screen.getAllByLabelText("Upvote");
    fireEvent.click(upvoteButtons[0]); // Click first item's upvote

    // Assert Item A has 1 vote, Item B still has 0
    const listItems = screen.getAllByTestId("list-item");
    expect(listItems[0]).toHaveTextContent("1");
    expect(listItems[1]).toHaveTextContent("0");
  });

  // 8. DATA MIGRATION CHECK (Critical for Staff Engineer)
  it("hydrates correctly and prevents NaN when localStorage contains old data schema (no votes)", () => {
    // Stage old data in localStorage (Version without 'upvotes'/'downvotes')
    const oldData = [
      { id: '1-old', text: 'Old Data A' },
      { id: '2-old', text: 'Old Data B' }
    ];
    localStorage.setItem("agoda_item_manager", JSON.stringify(oldData));

    // Mount the app with old data
    render(<App />);

    const listItems = screen.getAllByTestId("list-item");
    expect(listItems).toHaveLength(2);

    // Verify voting system works on old data without showing NaN
    const upvoteButtons = screen.getAllByLabelText("Upvote");
    expect(listItems[0]).toHaveTextContent("0"); // Expect 0, not NaN/blank

    // Click vote on an "old" item
    fireEvent.click(upvoteButtons[0]);

    // Assert migration happened automatically and logic now works
    expect(listItems[0]).toHaveTextContent("1");
  });

  it("displays the date and time in the correct HH:MM:SS AM/PM format", async () => {
    const mockDate = new Date('2026-03-29T17:30:00');
    vi.setSystemTime(mockDate);
    
    render(<App />);
    const input = screen.getByTestId("input-field");
    fireEvent.change(input, { target: { value: "Format Test" } });
    fireEvent.click(screen.getByTestId("add-button"));

    // Logic: Finding split text nodes by checking the textContent of the parent span
    const timestamp = screen.getByText((content, element) => {
      const hasText = (text) => element.textContent.includes(text);
      return hasText("05:30:00") && hasText("PM");
    });

    expect(timestamp).toBeDefined();
  });

  it("maintains sorting order while filtering via search", () => {
    render(<App />);
    // "Alpha" and "Alphabet" contain "Alph". "Beta" does not.
    ["Alpha", "Beta", "Alphabet"].forEach(text => {
      fireEvent.change(screen.getByTestId("input-field"), { target: { value: text } });
      fireEvent.click(screen.getByTestId("add-button"));
    });

    // Click the "Item Name" header to sort A-Z
    fireEvent.click(screen.getByText(/Item Name/i));
    
    fireEvent.change(screen.getByTestId("search-input"), { target: { value: "Alph" } });

    const listItems = screen.getAllByTestId("list-item");
    expect(listItems).toHaveLength(2); 
    expect(listItems[0]).toHaveTextContent("Alpha");
    expect(listItems[1]).toHaveTextContent("Alphabet");
  });

  it("sorts items by Most Upvoted correctly", () => {
    render(<App />);
    const input = screen.getByTestId("input-field");
    const addButton = screen.getByTestId("add-button");

    // Add Item A and Item B
    fireEvent.change(input, { target: { value: "Item A" } });
    fireEvent.click(addButton);
    fireEvent.change(input, { target: { value: "Item B" } });
    fireEvent.click(addButton);

    // Upvote Item B
    const upvoteButtons = screen.getAllByLabelText("Upvote");
    fireEvent.click(upvoteButtons[1]);

    // Switch to Upvoted Sort
    const upvotedTab = screen.getByText("Upvoted");
    fireEvent.click(upvotedTab);

    const listItems = screen.getAllByTestId("list-item");
    expect(listItems[0]).toHaveTextContent("Item B"); // Item B should be first
  });

  it("sorts items alphabetically (A-Z)", () => {
    render(<App />);
    const input = screen.getByTestId("input-field");
    const addButton = screen.getByTestId("add-button");

    ["Zebra", "Apple"].forEach(text => {
      fireEvent.change(input, { target: { value: text } });
      fireEvent.click(addButton);
    });

    fireEvent.click(screen.getByText("A-Z"));

    const listItems = screen.getAllByTestId("list-item");
    expect(listItems[0]).toHaveTextContent("Apple");
  });

  it("sorts alphabetically correctly with case sensitivity ignored", () => {
    render(<App />);
    ["apple", "Banana", "airplane"].forEach(text => {
      fireEvent.change(screen.getByTestId("input-field"), { target: { value: text } });
      fireEvent.click(screen.getByTestId("add-button"));
    });

    fireEvent.click(screen.getByText("A-Z"));
    const listItems = screen.getAllByTestId("list-item");
    expect(listItems[0]).toHaveTextContent(/airplane/i);
    expect(listItems[1]).toHaveTextContent(/apple/i);
  });
});