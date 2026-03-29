import { render, screen, fireEvent, cleanup, waitFor, within } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import App from "./App";

describe("Item Manager Platform - Final 16-Test Suite", () => {

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  // Helper to isolate the inventory table list from the navigation dropdown
  const getInventoryList = () => screen.getByRole('list');

  /**
   * SECTION 1: INVENTORY OPERATIONS (5 Tests)
   */
  describe("Inventory Operations", () => {
    beforeEach(() => {
      localStorage.clear();
      render(<App />);
    });

    it("adds a new item and confirms its presence in the list", () => {
      const input = screen.getAllByTestId("input-field")[0];
      fireEvent.change(input, { target: { value: "Quality Assurance Item" } });
      fireEvent.click(screen.getByTestId("add-button"));

      const list = getInventoryList();
      expect(within(list).getByText("Quality Assurance Item")).toBeInTheDocument();
    });

    it("successfully removes an item from the list", () => {
      const input = screen.getAllByTestId("input-field")[0];
      fireEvent.change(input, { target: { value: "Discardable Item" } });
      fireEvent.click(screen.getByTestId("add-button"));

      fireEvent.click(screen.getByTestId("delete-button"));
      const list = getInventoryList();
      expect(within(list).queryByText("Discardable Item")).not.toBeInTheDocument();
    });

    it("filters the inventory list based on search input", () => {
      const input = screen.getAllByTestId("input-field")[0];
      ["Apple", "Banana", "Cherry"].forEach(text => {
        fireEvent.change(input, { target: { value: text } });
        fireEvent.click(screen.getByTestId("add-button"));
      });

      fireEvent.change(screen.getByTestId("search-input"), { target: { value: "nan" } });
      const list = getInventoryList();
      expect(within(list).queryByText("Apple")).not.toBeInTheDocument();
      expect(within(list).getByText("Banana")).toBeInTheDocument();
    });

    it("updates upvote and downvote counts correctly", () => {
      const input = screen.getAllByTestId("input-field")[0];
      fireEvent.change(input, { target: { value: "Vote Test" } });
      fireEvent.click(screen.getByTestId("add-button"));

      fireEvent.click(screen.getAllByLabelText("Upvote")[0]);
      fireEvent.click(screen.getAllByLabelText("Upvote")[0]);
      expect(screen.getByText("2", { selector: ".up .count" })).toBeInTheDocument();

      fireEvent.click(screen.getAllByLabelText("Downvote")[0]);
      expect(screen.getByText("1", { selector: ".down .count" })).toBeInTheDocument();
    });

    it("persists items in localStorage across renders", async () => {
      const input = screen.getAllByTestId("input-field")[0];
      fireEvent.change(input, { target: { value: "Persistent Item" } });
      fireEvent.click(screen.getByTestId("add-button"));

      // Wait for item to appear to ensure useEffect has triggered storage write
      await within(getInventoryList()).findByText("Persistent Item");

      cleanup();
      render(<App />);
      expect(within(getInventoryList()).getByText("Persistent Item")).toBeInTheDocument();
    });
  });

  /**
   * SECTION 2: SORTING & TIMESTAMPS (3 Tests)
   */
  describe("Timestamps & Sorting", () => {
    beforeEach(() => {
      localStorage.clear();
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-03-29T17:30:00'));
    });

    it("renders timestamps in the correct HH:MM:SS AM/PM locale format", () => {
      render(<App />);
      fireEvent.change(screen.getAllByTestId("input-field")[0], { target: { value: "Time Test" } });
      fireEvent.click(screen.getByTestId("add-button"));

      const timestamp = screen.getByText((content, element) => {
        const hasText = (t) => element.textContent.includes(t);
        return element.children.length === 0 && hasText("05:30:00") && hasText("PM");
      });
      expect(timestamp).toBeDefined();
    });

    it("toggles sorting between Ascending and Descending on header click", () => {
      render(<App />);
      const input = screen.getAllByTestId("input-field")[0];
      fireEvent.change(input, { target: { value: "Zebra" } }); fireEvent.click(screen.getByTestId("add-button"));
      vi.advanceTimersByTime(1000);
      fireEvent.change(input, { target: { value: "Apple" } }); fireEvent.click(screen.getByTestId("add-button"));

      const header = screen.getByText(/Item Name/i);
      fireEvent.click(header); // Desc
      fireEvent.click(header); // Asc
      expect(screen.getAllByTestId("list-item")[0]).toHaveTextContent("Apple");
    });

    it("sorts the inventory by Upvotes in descending order", () => {
      render(<App />);
      const input = screen.getAllByTestId("input-field")[0];
      fireEvent.change(input, { target: { value: "Low" } }); fireEvent.click(screen.getByTestId("add-button"));
      fireEvent.change(input, { target: { value: "High" } }); fireEvent.click(screen.getByTestId("add-button"));

      fireEvent.click(screen.getAllByLabelText("Upvote")[1]);
      fireEvent.click(screen.getByText(/Upvotes/i));
      expect(screen.getAllByTestId("list-item")[0]).toHaveTextContent("High");
    });
  });

  /**
   * SECTION 3: CYCLIC NAVIGATION (3 Tests)
   */
  describe("Cyclic Navigation", () => {
    beforeEach(() => {
      localStorage.clear();
      render(<App />);
      fireEvent.change(screen.getAllByTestId("input-field")[0], { target: { value: "Item A" } });
      fireEvent.click(screen.getByTestId("add-button"));
      fireEvent.change(screen.getAllByTestId("input-field")[0], { target: { value: "Item B" } });
      fireEvent.click(screen.getByTestId("add-button"));
    });

    it("triggers mandatory alert for empty dropdown selection", () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { });
      fireEvent.click(screen.getByTestId("show-details-btn"));
      expect(alertSpy).toHaveBeenCalledWith("Please select an item name");
    });

    it("navigates to the correct profile via the jump dropdown", () => {
      const dropdown = screen.getByTestId("jump-dropdown");
      fireEvent.change(dropdown, { target: { value: dropdown.options[1].value } });
      fireEvent.click(screen.getByTestId("show-details-btn"));
      expect(screen.getByText("Item Profile")).toBeInTheDocument();
      expect(screen.getByText("Item A")).toBeInTheDocument();
    });

    it("cycles through the inventory indefinitely using Next Item", () => {
      const dropdown = screen.getByTestId("jump-dropdown");
      fireEvent.change(dropdown, { target: { value: dropdown.options[1].value } });
      fireEvent.click(screen.getByTestId("show-details-btn"));

      fireEvent.click(screen.getByText("Next Item"));
      expect(screen.getByText("Item B")).toBeInTheDocument();
      fireEvent.click(screen.getByText("Next Item"));
      expect(screen.getByText("Item A")).toBeInTheDocument();
    });
  });

  /**
   * SECTION 4: CONTACT & LEADS (5 Tests)
   */
  describe("Contact Form & Leads", () => {
    beforeEach(() => {
      localStorage.clear();
      vi.useRealTimers();
      render(<App />);
      fireEvent.click(screen.getByText(/Contact Us/i));
    });

    it("displays validation error for empty fields", async () => {
      fireEvent.click(screen.getByTestId("contact-submit"));
      expect(await screen.findByTestId("error-message")).toHaveTextContent("All fields are mandatory");
    });

    it("displays validation error for invalid email format", async () => {
      fireEvent.change(screen.getByTestId("name-input"), { target: { value: "User" } });
      fireEvent.change(screen.getByTestId("email-input"), { target: { value: "invalid" } });
      fireEvent.change(screen.getByTestId("message-input"), { target: { value: "Valid Length Message" } });
      fireEvent.click(screen.getByTestId("contact-submit"));
      expect(await screen.findByTestId("error-message")).toHaveTextContent("Email is invalid");
    });

    it("displays validation error for short messages", async () => {
      fireEvent.change(screen.getByTestId("name-input"), { target: { value: "User" } });
      fireEvent.change(screen.getByTestId("email-input"), { target: { value: "test@agoda.com" } });
      fireEvent.change(screen.getByTestId("message-input"), { target: { value: "Short" } });
      fireEvent.click(screen.getByTestId("contact-submit"));
      expect(await screen.findByTestId("error-message")).toHaveTextContent("Message must be at least 10 characters long");
    });

    it("submits the form successfully and redirects to Leads view", async () => {
      fireEvent.change(screen.getByTestId("name-input"), { target: { value: "Lead" } });
      fireEvent.change(screen.getByTestId("email-input"), { target: { value: "lead@agoda.com" } });
      fireEvent.change(screen.getByTestId("message-input"), { target: { value: "This is a valid long message." } });
      fireEvent.click(screen.getByTestId("contact-submit"));
      await waitFor(() => expect(screen.getByText("lead@agoda.com")).toBeInTheDocument());
    });

    it("navigates back to inventory when the Cancel button is clicked", () => {
      fireEvent.click(screen.getByText("Cancel"));
      expect(screen.getAllByTestId("input-field")[0]).toBeInTheDocument();
    });
  });

  describe("Contact Page - Session Logic & Modal (New Functionality)", () => {
    beforeEach(() => {
      localStorage.clear();
      // Pre-populate global storage to test session isolation
      const historicalLead = [{
        id: 'old-123',
        name: 'Historical User',
        email: 'old@agoda.com',
        message: 'This is an old message from a previous session.'
      }];
      localStorage.setItem("agoda_leads_manager", JSON.stringify(historicalLead));

      render(<App />);
      fireEvent.click(screen.getByText(/Contact Us/i));
    });

    it("does NOT show historical leads on the contact page initially", () => {
      expect(screen.queryByText("Historical User")).not.toBeInTheDocument();
    });

    it("shows only the newly added lead in the 'Recent Submissions' section", () => {
      const nameInput = screen.getByTestId("name-input");
      const emailInput = screen.getByTestId("email-input");
      const msgInput = screen.getByTestId("message-input");

      fireEvent.change(nameInput, { target: { value: "New User" } });
      fireEvent.change(emailInput, { target: { value: "new@agoda.com" } });
      fireEvent.change(msgInput, { target: { value: "This is a fresh session message." } });
      fireEvent.click(screen.getByTestId("contact-submit"));

      expect(screen.getByText("Recent Submissions")).toBeInTheDocument();
      expect(screen.getByText("New User")).toBeInTheDocument();
    });

    it("opens the confirmation modal when the delete button is clicked", () => {
      // Add a lead first
      fireEvent.change(screen.getByTestId("name-input"), { target: { value: "Deletable" } });
      fireEvent.change(screen.getByTestId("email-input"), { target: { value: "del@agoda.com" } });
      fireEvent.change(screen.getByTestId("message-input"), { target: { value: "Delete me please." } });
      fireEvent.click(screen.getByTestId("contact-submit"));

      // Click delete
      fireEvent.click(screen.getByText("Delete"));

      // Check for modal
      expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
      expect(screen.getByText("Are you sure you want to delete this submission?")).toBeInTheDocument();
    });

    it("removes the item only after 'Yes, Delete' is clicked in the modal", () => {
      fireEvent.change(screen.getByTestId("name-input"), { target: { value: "ConfirmMe" } });
      fireEvent.change(screen.getByTestId("email-input"), { target: { value: "conf@agoda.com" } });
      fireEvent.change(screen.getByTestId("message-input"), { target: { value: "Valid message length" } });
      fireEvent.click(screen.getByTestId("contact-submit"));

      fireEvent.click(screen.getByText("Delete"));
      fireEvent.click(screen.getByText("Yes, Delete"));

      expect(screen.queryByText("ConfirmMe")).not.toBeInTheDocument();
      expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
    });

    it("keeps the item if 'Cancel' is clicked in the modal", () => {
      fireEvent.change(screen.getByTestId("name-input"), { target: { value: "StayPut" } });
      fireEvent.change(screen.getByTestId("email-input"), { target: { value: "stay@agoda.com" } });
      fireEvent.change(screen.getByTestId("message-input"), { target: { value: "I am staying here." } });
      fireEvent.click(screen.getByTestId("contact-submit"));

      fireEvent.click(screen.getByText("Delete"));
      // Click Cancel inside the modal (selecting specifically by class or text)
      const cancelButtons = screen.getAllByText("Cancel");
      fireEvent.click(cancelButtons[cancelButtons.length - 1]);

      expect(screen.getByText("StayPut")).toBeInTheDocument();
      expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
    });

    it("clears the session list when navigating away and back", () => {
      // Add a lead
      fireEvent.change(screen.getByTestId("name-input"), { target: { value: "SessionUser" } });
      fireEvent.change(screen.getByTestId("email-input"), { target: { value: "sess@agoda.com" } });
      fireEvent.change(screen.getByTestId("message-input"), { target: { value: "This should disappear." } });
      fireEvent.click(screen.getByTestId("contact-submit"));

      // Navigate to Inventory and back to Contact
      fireEvent.click(screen.getByText("Agoda Platform"));
      fireEvent.click(screen.getByText(/Contact Us/i));

      expect(screen.queryByText("SessionUser")).not.toBeInTheDocument();
      expect(screen.queryByText("Recent Submissions")).not.toBeInTheDocument();
    });
  });
});