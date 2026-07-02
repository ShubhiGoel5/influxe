# Influex — Creator Discovery Platform ✨

![Influex Dashboard Preview](./public/favicon.svg)

> A polished, modern influencer search and management application built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**. 

**🚀 Live Deployment:** [https://influxe1.vercel.app/](https://influxe1.vercel.app/)

---

## 📖 Overview

Influex completely reimagines the creator discovery experience. Instead of a basic utility, it acts as a creator discovery platform with a focus on usability, visual hierarchy, and user delight. 

Users can seamlessly discover top influencers across platforms (Instagram, YouTube, TikTok), view detailed analytics, and manage curated lists of creators for their upcoming campaigns using an intuitive drag-and-drop interface.

## ✨ Features

- **Modern & Responsive UI**: Fully redesigned layout featuring glassmorphism, smooth micro-animations, and a responsive sidebar structure that works flawlessly across all devices.
- **Creator Discovery**: Browse and filter influencers across major platforms. Features an infinite-scroll "Trending Creators" carousel.
- **Detailed Profiles**: Deep dive into individual creator metrics, audience demographics, and recent content with animated metric cards.
- **My Lists (Drag & Drop)**: Manage your saved creators using a globally accessible "My Lists" side-panel. Supports smooth Drag and Drop (DnD) to organize creators into custom assignments/campaigns.
- **Global State Management**: Powered by **Zustand** for lightning-fast, boilerplate-free state management across the UI and Saved Lists.
- **Optimized Performance**: Infinite scrolling, asset optimization, strictly typed interfaces, and bulletproof CSS Grid/Flexbox layouts.

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + `clsx` / `tailwind-merge`
- **State Management**: Zustand
- **Routing**: React Router v7
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Drag & Drop**: React Beautiful DnD

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/wobb-assignment.git
   cd wobb-assignment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Assumptions & Trade-offs

During the development of this assignment, several architectural and design decisions were made:

1. **React Beautiful DnD vs. dnd-kit**: `react-beautiful-dnd` was chosen for its unparalleled out-of-the-box animation smoothness for list reordering. While it requires a `legacy-peer-deps` flag for React 19, the user experience trade-off was deemed worth it. 
2. **State Management**: React Context was completely ripped out and replaced with **Zustand**. Zustand allowed for a much cleaner architecture, separating UI state (like sidebar collapsing) from domain state (saved creators), preventing unnecessary re-renders across the app.
3. **Layout Engine**: The dashboard layout was rebuilt from scratch using a strict Flexbox row paradigm rather than fixed positioning. This guarantees zero overlap or overflow bugs on any viewport size, making the app 100% robust.
4. **Data Fetching**: Kept the local JSON file imports for instantaneous UI feedback, simulating a highly optimized edge-cached API response. In a real-world scenario, this would be replaced with React Query or SWR for remote data fetching.

---
*Built with ❤️ for the Wobb Frontend Assignment.*
