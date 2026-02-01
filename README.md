# ✈️ git init

A modern, responsive flight search experience built as part of the Spotter technical screening.  
The app allows users to search flights, apply complex filters, and explore real-time price trends through an interactive graph.

---

## 🔍 Features

- **Flight Search**
  - Search by origin, destination, travel dates, and passengers
  - Results displayed in a clear, scannable list

- **Live Price Graph**
  - Interactive price trend visualization built with **Recharts**
  - Updates instantly as filters are applied

- **Complex Filtering**
  - Combine multiple filters simultaneously (price, stops, airline, etc.)
  - Filters update both:
    - Flight results list
    - Price graph (in real time)

- **Responsive Design**
  - Fully optimized for mobile and desktop
  - Mobile-first layout with adaptive components

- **Modern UI & UX**
  - Clean visual hierarchy
  - Fast interactions and instant feedback
  - Thoughtful defaults to reduce friction

---

## 🌐 Live Demo

- **Hosted App:** 🔗 https://flight-search-engine.vercel.app  
- **Loom Walkthrough (3–4 mins):** 🔗 https://loom.com/your-demo

---

## 🧱 Tech Stack

- **Framework:** Next.js (App Router)
- **Frontend:** React 19 + TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** lucide-react
- **Data Fetching:** Axios
- **API:** Amadeus Self-Service API (Test Environment)

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/abigieig/flight-search-engine.git
cd flight-search-engine
```
### 2. Evironment variables
```.env
AMADEUS_API_KEY=
AMADEUS_API_SECRET=