# Item List Manager: Platform Edition

A high-performance, accessible, and persistent React application designed to demonstrate industrial-grade frontend architecture. This project showcases the transition from basic feature implementation to a scalable, **INP (Interaction to Next Paint)** conscious platform standard.

> Note: The UI is now redesigned to align with Agoda’s design tokens, focusing on tactile feedback and high contrast.

## Design Discussion

The architecture of this application is governed by three core principles: **Separation of Concerns**, **Performance Resilience**, and **Operational Integrity**.

### 1. Logic vs. UI (The Custom Hook Pattern)
Instead of co-locating business logic within the view layer, the application utilizes a centralized `useItemList` hook.
* **Why:** This creates a "headless" logic layer. It allows the core state management (adding, deleting, voting, and persistence migration) to be tested independently of the DOM and reused across different UI representations (e.g., mobile native app or desktop view).



### 2. Performance & INP Score
To maintain buttery smooth interactions (maximizing the INP metric), we have strictly governed the **Critical Rendering Path**.
* **Immutability:** State is never mutated. Operations use the spread operator (`...item`) or functional updates (`setItems(prev => ...)`) to return new references, ensuring React's diffing engine works efficiently.
* **Reconciliation keys:** Using deterministic UUIDs ensures React accurately tracks item identity during complex deletions, filtering, or sorting.
* **Derived State:** Search filtering is derived on-the-fly using `useMemo`. Typing in the "Add Item" field does *not* trigger the expensive filter calculation on the thousands of items, keeping the browser responsive.



### 3. Reliability & Operational Integrity
* **Data Migration:** The `useItemList` hook acts as a robust data gatekeeper. During hydration, it automatically sanitizes data from `localStorage`. If an old data structure is detected (e.g., missing `upvotes`), it "migrates" the object to the current schema before loading it into the state. This prevents **NaN** rendering errors and UI crashes.
* **Accessibility Standard:** The interface follows **WCAG 2.1 AA** guidelines. Critical controls (Delete, Upvote, Downvote) are labeled with `aria-label`, ensuring the complex visual interface is fully interpretable by screen reader users.



---

## Setup Steps

Follow these steps to replicate the development environment locally.

1. **Clone the Repository:**
   ```bash
   git clone [your-repo-link]
   cd item-manager
   ```

2. **Install Dependencies:**
   This project uses **Vite** for ESM-based HMR and **Vitest** for a high-speed, parallel test runner.
   ```bash
   npm install
   ```

3. **Launch Development Server:**
   ```bash
   npm run dev
   ```
   *Access the app at `http://localhost:5173`.*

4. **Run the Robust Test Suite:**
   ```bash
   npx vitest
   ```

---

## Verification & Scenarios

### 1. Initial State & Theme Confirmation
On the first visit, the system should present a clean interface, grouping "Add" and "Search" controls within the Agoda Blue Navbar.
> **[SCREENSHOT PLACEHOLDER: Redesigned Empty State]**

### 2. Addition & Tactile Feedback
Adding an item results in immediate validation and clearing of the field.
> **[SCREENSHOT PLACEHOLDER: Adding Item and INP Feedback]**

### 3. Isolated Deletion Flow
The '×' button retains its visual position but is now fully labeled for screen readers. Deletion purges data from `localStorage`.
> **[SCREENSHOT PLACEHOLDER: List After Deletion]**

### 4. Real-time Search & Voting Integrity
Items are filtered dynamically without destroying source data.
> **[SCREENSHOT PLACEHOLDER: Filtered List Results]**

### 5. Persistence across Session Reloads
Vote counts and item data persist after a page refresh.
> **[SCREENSHOT PLACEHOLDER: Persistent State After Refresh]**

---

## Appendix: Future Platform Roadmap
This section details how this application would evolve to handle enterprise-level scale.

#### **1. List Virtualization (Windowing)**
As the inventory grows to thousands of items, the current `<ul data-testid="item-list">` will become a memory bottleneck. We would implement virtualization (using `react-window`) to ensure the browser only renders the elements currently in the viewport, significantly reducing memory footprint and keeping **LCP (Largest Contentful Paint)** constant at O(1) complexity.



#### **2. Optimistic API Updates**
Replace `localStorage` with a remote API call. To keep the app feeling instantaneous, we would implement **Optimistic UI Updates**. When a user votes, we update the local UI immediately (assuming success) and roll it back only if the API call eventually fails, maximizing perceived performance.
