# 🤝 CollabSync Pro

**CollabSync Pro** is a cutting-edge Industry-Academia Collaboration Portal designed to bridge the gap between universities and corporate partners. It facilitates co-development of R&D projects, manages intellectual property (IP), and streamlines talent recruitment through an AI-powered ecosystem.

---

## 🚀 Vision
To empower innovation by seamlessly connecting academic research expertise with industry challenges, fostering a collaborative environment that accelerates the journey from proposal to commercialization.

## ✨ Key Features

### 🧩 1. Project Discovery & AI Matchmaking
- **Industry Challenges Board**: Corporate partners can post real-world challenges with budget ranges and timelines.
- **Research Discovery**: Filterable grid of university research projects categorized by TRL levels and expertise areas
- **AI Matchmaking**: Intelligent scoring system that aligns academic research with industry needs based on expertise and past success metrics.

### ✍️ 2. Collaboration Workspace
- **Shared Workspace**: Dedicated environment for negotiating project scope, deliverables, and timelines.
- **Live Collaboration Feed**: Real-time activity feed utilizing Supabase Realtime to stay updated on project progress and team interactions.
- **Agreement Generator & Digital Signatures**: Automated UI for contract generation and integrated workflow for legal approval and signing

### 📊 3. Project Execution & Tracking
- **Milestone Management**: Interactive Gantt charts and progress trackers to monitor project health.
- **Secure Repository**: Version-controlled document storage for research findings and project deliverables.
- **Real-time Dashboards**: KPIs tracking budget utilization, timeline adherence, and team activity.

### 🎯 4. Enhanced User Experience & Navigation
- **Role-Based Splash Screen**: Interactive onboarding flow allowing seamless selection of user personas upon launch.
- **Command Palette**: Advanced global search and quick navigation system accessible via `Cmd+K` or `Ctrl+K`.
- **Responsive Navigation**: State-of-the-art navigation powered by `react-router-dom` with lazy-loaded routes and optimized layout.

### 🎓 5. Talent Showcase & Recruitment
- **Researcher Portfolios**: Highlights student and faculty talent involved in projects.
- **Smart Filtering & Interview Workflow**: Recruitment tools to find candidates and schedule interviews with top talent.

### ⚖️ 6. IP Management & Commercialization
- **IP Disclosure System**: Simplified multi-step wizard for documenting new inventions and contributors.
- **Ownership Calculator & Revenue Tracker**: Automatic rights assignment and financial monitoring.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Optimized with feature slices)
- **Routing**: [React Router](https://reactrouter.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
- **Backend & Auth**: [Supabase](https://supabase.com/) (PostgreSQL Database & Authentication)
- **Realtime**: [Supabase Realtime](https://supabase.com/docs/guides/realtime) for live feeds and updates

---

## 📂 Project Structure

```text
CollabSync Pro/
├── app/                     # Entry point, core application structure and layouts
├── components/              # Reusable UI features
│   ├── ui/                  # Atom-level UI components (buttons, Commandpalette, etc.)
│   └── ...                  # Feature-specific components (e.g., SplashScreen.tsx)
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions, helpers, and Supabase client
├── pages/                   # Route components for all application pages
├── supabase/                # Database configurations & migrations
├── index.html               # Main HTML file
└── package.json             # Project dependencies and scripts
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (Recommended version: v18+)
- [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/)
- A Supabase Project (for backend services and authentication)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Ajaykannagit/CollabPro.git
   cd CollabPro-main
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Running Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Building for Production
```bash
npm run build
```

---

## 🗺️ Roadmap
- [ ] Advanced Agreement Review with version comparison.
- [ ] Enhanced Recruitment Pipeline dashboards.
- [ ] Integrated Financial Transaction history for IP revenue.
- [ ] Multi-language support for international collaborations.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (if applicable).

---

Developed with ❤️ for Industry-Academia Growth.
