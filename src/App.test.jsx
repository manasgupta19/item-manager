import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import App from "./App";

describe("Item Manager Platform - Final Integrated Suite", () => {
  
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  describe("Inventory Operations", () => {
    beforeEach(() => {
      localStorage.clear();
      render(<App />);
    });

    it("adds a new item and confirms its presence in the list", () => {
      const input = screen.getAllByTestId("input-field")[0];
      const addButton = screen.getByTestId("add-button");
      fireEvent.change(input, { target: { value: "Quality Assurance Item" } });
      fireEvent.click(addButton);
      expect(screen.getByText("Quality Assurance Item")).toBeInTheDocument();
    });

    it("successfully removes an item from the list", () => {
      const input = screen.getAllByTestId("input-field")[0];
      fireEvent.change(input, { target: { value: "Discardable Item" } });
      fireEvent.click(screen.getByTestId("add-button"));
      const deleteBtn = screen.getByTestId("delete-button");
      fireEvent.click(deleteBtn);
      expect(screen.queryByText("Discardable Item")).not.toBeInTheDocument();
    });

    it("filters the inventory list based on search input", () => {
      const input = screen.getAllByTestId("input-field")[0];
      const addButton = screen.getByTestId("add-button");
      ["Apple", "Banana", "Cherry"].forEach(text => {
        fireEvent.change(input, { target: { value: text } });
        fireEvent.click(addButton);
      });
      fireEvent.change(screen.getByTestId("search-input"), { target: { value: "nan" } });
      expect(screen.queryByText("Apple")).not.toBeInTheDocument();
      expect(screen.getByText("Banana")).toBeInTheDocument();
      expect(screen.queryByText("Cherry")).not.toBeInTheDocument();
    });

    it("updates upvote and downvote counts correctly", () => {
      const input = screen.getAllByTestId("input-field")[0];
      fireEvent.change(input, { target: { value: "Vote Test" } });
      fireEvent.click(screen.getByTestId("add-button"));
      const upvoteBtn = screen.getAllByLabelText("Upvote")[0];
      const downvoteBtn = screen.getAllByLabelText("Downvote")[0];
      fireEvent.click(upvoteBtn);
      fireEvent.click(upvoteBtn);
      expect(screen.getByText("2", { selector: ".up .count" })).toBeInTheDocument();
      fireEvent.click(downvoteBtn);
      expect(screen.getByText("1", { selector: ".down .count" })).toBeInTheDocument();
    });

    it("persists items in localStorage across renders", () => {
      const input = screen.getAllByTestId("input-field")[0];
      fireEvent.change(input, { target: { value: "Persistent Item" } });
      fireEvent.click(screen.getByTestId("add-button"));
      cleanup();
      render(<App />);
      expect(screen.getByText("Persistent Item")).toBeInTheDocument();
    });
  });

  describe("Timestamps & Sorting (Fake Timers)", () => {
    beforeEach(() => {
      localStorage.clear();
      vi.useFakeTimers();
      const mockDate = new Date('2026-03-29T17:30:00');
      vi.setSystemTime(mockDate);
    });

    it("renders timestamps in the correct HH:MM:SS AM/PM locale format", () => {
      render(<App />);
      fireEvent.change(screen.getAllByTestId("input-field")[0], { target: { value: "Time Validation" } });
      fireEvent.click(screen.getByTestId("add-button"));
      const timestamp = screen.getByText((content, element) => {
        const hasText = (t) => element.textContent.includes(t);
        const isLeaf = element.children.length === 0;
        return isLeaf && hasText("05:30:00") && hasText("PM") && hasText("Mar 29, 2026");
      });
      expect(timestamp).toBeDefined();
    });

    it("toggles sorting between Ascending and Descending on header click", () => {
      render(<App />);
      const input = screen.getAllByTestId("input-field")[0];
      const addButton = screen.getByTestId("add-button");
      fireEvent.change(input, { target: { value: "Zebra" } });
      fireEvent.click(addButton);
      vi.advanceTimersByTime(1000); 
      fireEvent.change(input, { target: { value: "Apple" } });
      fireEvent.click(addButton);
      const header = screen.getByText(/Item Name/i);
      fireEvent.click(header);
      let listItems = screen.getAllByTestId("list-item");
      expect(listItems[0]).toHaveTextContent("Zebra");
      fireEvent.click(header);
      listItems = screen.getAllByTestId("list-item");
      expect(listItems[0]).toHaveTextContent("Apple");
    });

    it("sorts the inventory by Upvotes in descending order", () => {
      render(<App />);
      const input = screen.getAllByTestId("input-field")[0];
      const addButton = screen.getByTestId("add-button");
      ["Low Vote", "High Vote"].forEach(text => {
        fireEvent.change(input, { target: { value: text } });
        fireEvent.click(addButton);
      });
      const upvoteButtons = screen.getAllByLabelText("Upvote");
      fireEvent.click(upvoteButtons[1]); 
      fireEvent.click(screen.getByText(/Upvotes/i));
      const listItems = screen.getAllByTestId("list-item");
      expect(listItems[0]).toHaveTextContent("High Vote");
    });
  });

  describe("Contact Form Validations (Real Timers)", () => {
    beforeEach(() => {
      localStorage.clear();
      vi.useRealTimers(); 
      render(<App />);
      fireEvent.click(screen.getByText(/Contact Us/i));
    });

    it("displays the correct validation error for empty fields", async () => {
      fireEvent.click(screen.getByTestId("contact-submit"));
      const error = await screen.findByTestId("error-message");
      expect(error).toHaveTextContent("All fields are mandatory");
    });

    it("displays the correct validation error for invalid email format", async () => {
      fireEvent.change(screen.getByTestId("name-input"), { target: { value: "User" } });
      fireEvent.change(screen.getByTestId("email-input"), { target: { value: "invalid-email" } });
      fireEvent.change(screen.getByTestId("message-input"), { target: { value: "This message is long enough." } });
      fireEvent.click(screen.getByTestId("contact-submit"));
      const error = await screen.findByTestId("error-message");
      expect(error).toHaveTextContent("Email is invalid");
    });

    it("displays the correct validation error for short messages", async () => {
      fireEvent.change(screen.getByTestId("name-input"), { target: { value: "User" } });
      fireEvent.change(screen.getByTestId("email-input"), { target: { value: "user@agoda.com" } });
      fireEvent.change(screen.getByTestId("message-input"), { target: { value: "Short" } });
      fireEvent.click(screen.getByTestId("contact-submit"));
      const error = await screen.findByTestId("error-message");
      expect(error).toHaveTextContent("Message must be at least 10 characters long");
    });

    it("submits the form successfully and redirects to Leads view", async () => {
      fireEvent.change(screen.getByTestId("name-input"), { target: { value: "Lead Name" } });
      fireEvent.change(screen.getByTestId("email-input"), { target: { value: "lead@agoda.com" } });
      fireEvent.change(screen.getByTestId("message-input"), { target: { value: "This inquiry meets all requirements." } });
      fireEvent.click(screen.getByTestId("contact-submit"));
      await waitFor(() => {
        expect(screen.getByText(/Contact Info/i)).toBeInTheDocument();
        expect(screen.getByText("lead@agoda.com")).toBeInTheDocument();
      });
    });

    it("navigates back to inventory when the Cancel button is clicked", () => {
      const cancelBtn = screen.getByText(/Cancel/i);
      fireEvent.click(cancelBtn);
      expect(screen.getAllByTestId("input-field")[0]).toBeInTheDocument();
    });

    it("displays an empty state message when no leads have been submitted", () => {
      fireEvent.click(screen.getByText(/View Leads/i));
      expect(screen.getByText(/No inquiries found/i)).toBeInTheDocument();
    });
  });
});