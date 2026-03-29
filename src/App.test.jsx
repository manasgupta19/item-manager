import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import App from "./App";

describe("Item Manager Platform - Final Integration Suite", () => {

  afterEach(() => {
    cleanup();
    // Reset to real timers after every test to prevent environment leakage
    vi.useRealTimers();
  });

  /**
   * SECTION 1: INVENTORY & CORE FEATURES
   * Focuses on basic CRUD operations and search functionality.
   */
  describe("Inventory Operations", () => {
    beforeEach(() => {
      localStorage.clear();
      render(<App />);
    });

    it("adds an item and confirms it appears in the list", () => {
      const input = screen.getByTestId("input-field");
      fireEvent.change(input, { target: { value: "Staff Component" } });
      fireEvent.click(screen.getByTestId("add-button"));
      expect(screen.getByText("Staff Component")).toBeInTheDocument();
    });

    it("filters the list based on the search query", () => {
      ["Frontend", "Backend", "Fullstack"].forEach(item => {
        fireEvent.change(screen.getByTestId("input-field"), { target: { value: item } });
        fireEvent.click(screen.getByTestId("add-button"));
      });
      fireEvent.change(screen.getByTestId("search-input"), { target: { value: "back" } });
      expect(screen.getByText("Backend")).toBeInTheDocument();
      expect(screen.queryByText("Frontend")).not.toBeInTheDocument();
    });
  });

  /**
   * SECTION 2: TEMPORAL & SORTING LOGIC
   * Uses fake timers to validate exact timestamp rendering and bi-directional sorting.
   */
  describe("Timestamps & Sorting (Locked Time)", () => {
    beforeEach(() => {
      localStorage.clear();
      vi.useFakeTimers();
      // Lock system time to Sunday, March 29, 2026, 05:30:00 PM
      const mockDate = new Date('2026-03-29T17:30:00');
      vi.setSystemTime(mockDate);
    });

    it("renders timestamps in the required HH:MM:SS AM/PM locale format", () => {
      render(<App />);
      fireEvent.change(screen.getByTestId("input-field"), { target: { value: "Time Check" } });
      fireEvent.click(screen.getByTestId("add-button"));

      const timestamp = screen.getByText((content, element) => {
        const hasText = (t) => element.textContent.includes(t);
        const isLeaf = element.children.length === 0;
        return isLeaf && hasText("05:30:00") && hasText("PM") && hasText("Mar 29, 2026");
      });
      expect(timestamp).toBeDefined();
    });

    it("toggles sorting direction between Ascending and Descending on Name header", () => {
      render(<App />);
      const input = screen.getByTestId("input-field");
      const add = screen.getByTestId("add-button");

      fireEvent.change(input, { target: { value: "Zebra" } });
      fireEvent.click(add);
      vi.advanceTimersByTime(1000); // Advance clock to ensure different timestamps
      fireEvent.change(input, { target: { value: "Apple" } });
      fireEvent.click(add);

      const nameHeader = screen.getByText(/Item Name/i);
      
      // First click: Sorts Name Descending (Z-A)
      fireEvent.click(nameHeader);
      let listItems = screen.getAllByTestId("list-item");
      expect(listItems[0]).toHaveTextContent("Zebra");

      // Second click: Toggles to Ascending (A-Z)
      fireEvent.click(nameHeader);
      listItems = screen.getAllByTestId("list-item");
      expect(listItems[0]).toHaveTextContent("Apple");
    });
  });

  /**
   * SECTION 3: CONTACT FORM VALIDATIONS
   * Uses real timers to ensure asynchronous 'findBy' queries can poll the DOM.
   */
  describe("Contact Form Validations (Async)", () => {
    beforeEach(() => {
      localStorage.clear();
      vi.useRealTimers(); // CRITICAL: findByTestId requires real timers to function
      render(<App />);
      fireEvent.click(screen.getByText(/Contact Us/i));
    });

    it("displays error when mandatory fields are missing", async () => {
      fireEvent.click(screen.getByTestId("contact-submit"));
      const error = await screen.findByTestId("error-message");
      expect(error).toHaveTextContent("All fields are mandatory");
    });

    it("displays error for invalid email format", async () => {
      fireEvent.change(screen.getByTestId("name-input"), { target: { value: "Tester" } });
      fireEvent.change(screen.getByTestId("email-input"), { target: { value: "invalid_email" } });
      fireEvent.change(screen.getByTestId("message-input"), { target: { value: "Valid message length content" } });
      fireEvent.click(screen.getByTestId("contact-submit"));
      
      const error = await screen.findByTestId("error-message");
      expect(error).toHaveTextContent("Email is invalid");
    });

    it("displays error for messages under 10 characters", async () => {
      fireEvent.change(screen.getByTestId("name-input"), { target: { value: "Tester" } });
      fireEvent.change(screen.getByTestId("email-input"), { target: { value: "test@example.com" } });
      fireEvent.change(screen.getByTestId("message-input"), { target: { value: "Short" } });
      fireEvent.click(screen.getByTestId("contact-submit"));
      
      const error = await screen.findByTestId("error-message");
      expect(error).toHaveTextContent("Message must be at least 10 characters long");
    });

    it("navigates to the Leads view and displays data on valid submission", async () => {
      fireEvent.change(screen.getByTestId("name-input"), { target: { value: "Verified Lead" } });
      fireEvent.change(screen.getByTestId("email-input"), { target: { value: "lead@agoda.com" } });
      fireEvent.change(screen.getByTestId("message-input"), { target: { value: "This inquiry meets the required length." } });
      fireEvent.click(screen.getByTestId("contact-submit"));

      // waitFor allows the React navigation/state update to complete
      await waitFor(() => {
        expect(screen.getByText(/Contact Info/i)).toBeInTheDocument();
        expect(screen.getByText("lead@agoda.com")).toBeInTheDocument();
      });
    });
  });
});