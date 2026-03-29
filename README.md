This updated `README.md` reflects the current architecture of the repository, including the recently integrated design system, the strict validation logic, and the budget estimation features.

***

# Agoda-Inspired Item Manager Platform

A comprehensive React-based inventory and lead management system built with Vite. This platform features a robust design system, real-time data validation, and advanced affordability calculations.

## 🚀 Key Features

### 1. Dynamic Inventory Management
* **6-Column Responsive Grid:** Manage items with Name, Amount, Date, Upvotes, Downvotes, and Actions.
* **Advanced Sorting & Search:** Real-time filtering and multi-column sorting (Alphabetical, Date, and Votes).
* **Item Profiles:** Detailed view for each item including a price update mechanism and timestamp tracking.

### 2. Budget & Affordability Planner
* **Real-Time Calculator:** Based on the "CryptoRank" logic, users can enter a budget to see exactly how many units of each inventory item they can afford.
* **Validation States:** Handles range errors (min/max balance) with specific feedback and displays `0` for empty inputs or `n/a` for invalid ranges.

### 3. Strict Form Validation
* **Contact & Lead System:** Features real-time regex-based validation for Name (4+ chars), Email (strict format), and Message length.
* **State-Locked UI:** Submit buttons are disabled by default and only unlock when all field-specific criteria are met.
* **Lead Tracking:** Persists contact messages into a "Leads" dashboard.

### 4. Interactive User Experience
* **Onboarding Tutorial:** A multi-slide walkthrough for new users, featuring interactive "Next/Prev" navigation and persistence checks.
* **Persistence Layer:** All inventory items, votes, and leads are synchronized with `localStorage`.

## 🛠️ Tech Stack

* **Frontend:** React (Hooks-based architecture)
* **Build Tool:** Vite
* **Styling:** CSS3 (Custom Design System with CSS Grids and Variables)
* **Testing:** Vitest / React Testing Library
* **State Management:** Custom Hooks (`useItemList`, `useLeads`)

## 📂 Project Structure

```text
src/
├── assets/             # Static assets and icons
├── components/         # Functional UI components
│   ├── BudgetEstimator # Affordability logic
│   ├── ContactForm     # Strict validation form
│   ├── InventoryTable  # Main data grid
│   ├── ItemDetail      # Price & Profile management
│   └── Onboarding      # Tutorial slides
├── hooks/              # Custom state logic
│   ├── useItemList.js  # Inventory & Persistence
│   └── useLeads.js     # Contact leads management
├── App.jsx             # Main routing & view logic
├── App.css             # Agoda-inspired Design System
└── App.test.jsx        # Integrated test suite
```

## 🚥 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Testing
To run the full 26-test suite covering validation, inventory logic, and budget calculations:
```bash
npm test
```

## 🎨 Design System

The application uses a custom-built design system defined in `App.css`:
* **Primary Color:** `#003580` (Agoda Blue)
* **Layout:** Strict CSS Grid columns (`2fr 1fr 1.5fr 0.8fr 0.8fr 1.8fr`) for inventory alignment.
* **Interactive States:** Standardized button logic for `:disabled`, `:hover`, and `:active` states.
* **Typography:** System-font stack for maximum performance and readability.

## 📝 License
This project is for internal development and testing purposes.