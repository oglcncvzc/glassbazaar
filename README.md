# GlassBazaar

GlassBazaar is a modern e-commerce web application built with **Next.js 15** and **TypeScript**. The project simulates a real-world online marketplace for glass products, focusing on clean code, modularity, and a smooth user experience.

## Features

- **Product Listing & Filtering:**  
  Browse products with category filtering, search, and sorting options.

- **Product Details:**  
  View detailed information, images, and ratings for each product.

- **Shopping Cart:**  
  Add/remove products, adjust quantities, and view a summary before checkout.

- **User Authentication (Mock):**  
  Simple login simulation with localStorage (no real backend).

- **Internationalization (i18n):**  
  Supports English and Turkish. Language can be switched instantly.

- **Responsive Design:**  
  Fully optimized for mobile, tablet, and desktop devices.

- **Theme Support:**  
  Light and dark mode toggle, with preference saved in localStorage.

- **Fake Loading & Data Simulation:**  
  All product and cart data is loaded from local JSON files.  
  To mimic real API latency, artificial loading states (spinners, skeletons) are used throughout the app.

- **Error Handling:**  
  User-friendly error messages for invalid actions and edge cases.

- **Performance Optimizations:**  
  Uses React memoization, lazy loading, and efficient state management for a smooth experience.

## Project Structure

- `/src/app/` — Main Next.js app directory (pages, layouts, components)
- `/src/data/` — Product and cart data in JSON format
- `/src/contexts/` — React context providers for state management
- `/src/locales/` — Localization files (English & Turkish)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Technical Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI Library:** Ant Design
- **State Management:** React Context API
- **Styling:** CSS Modules, Ant Design
- **i18n:** Custom context-based solution with JSON dictionaries

## Notes

- **No real backend:** All data is static and comes from local JSON files.
- **Fake loading:** Artificial delays are used to simulate real API calls.
- **Authentication is mock-only:** No real user accounts or password storage.

## License

This project is for educational and demonstration purposes only.
