# SG CarPark Live - Real-Time Singapore Carpark Lot Tracker

A modern, high-performance web application tracking real-time parking lot availabilities across Singapore HDB, URA, LTA, and commercial shopping centers.

## Features

- **Interactive Singapore Map**: Rendered with Leaflet vector maps, color-coded lot availability badges, and interactive popups with turn-by-turn directions.
- **Real-Time Lot Availability**: Tracks car, motorcycle, and heavy vehicle lots with live turnover simulations and upward/downward delta indicators.
- **Singapore-Specific Rates & Regulations**: Displays peak, off-peak, weekend tariffs, the 15-minute EPS grace period, Sunday/PH Free Parking Schemes (FPS), and night parking caps.
- **Facility Data**: EV charging points (SP Mobility, Shell Recharge, CDG ENGIE), EPS gantry types, and height clearances.
- **Multi-Factor Search & Filtering**: Search by carpark name, address, or code (e.g., `ION01`, `TP21`, `MBS01`), filter by region, operator, EV charging, and sort by distance.
- **3 View Modes**: Split View (Map + Cards), Full Map View, and High-Density Table View.
- **Backend API Integration Hub**: Built-in adapter for Singapore Land Transport Authority (LTA) DataMall `CarParkAvailabilityv2` API and custom REST endpoints with live ping latency testing.

## Tech Stack

- React 19 + TypeScript
- Vite + Tailwind CSS v4
- Leaflet for interactive mapping
- Lucide React Icons

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Backend API Integration

The frontend includes a service adapter in `src/services/carparkService.ts` designed to consume official LTA DataMall v2 feeds or your custom proxy backend. To point to your live backend, open the **Backend API** settings modal in the navigation bar.
