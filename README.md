# Lunelle ✧ — Make space for what matters.

A dreamy, elegant, and editorial productivity web application crafted to bring calm, intentional organization to your daily flow. Styled with a delicate starburst brand mark (`✧`), graceful editorial serif typography, warm cream cards, pale lavender surfaces, and soft purple accents.

---

## ✧ Brand Identity & Philosophy

- **Name:** Lunelle
- **Symbol:** `✧` (A delicate starburst emblem)
- **Tagline:** *"Make space for what matters."*
- **Aesthetic:** Dreamy, elegant, editorial, modern, soft, and premium.
- **Design Voice:** Thoughtfully spaced typography, soothing lavender and cream hues, soft shadows, and subtle micro-interactions that inspire focus and clarity without visual noise.

---

## 🎨 Color Palette & Design System

Lunelle is built on a custom design token system calibrated for both aesthetic harmony and high-contrast accessibility (WCAG AA/AAA compliant):

| Token Name | Hex Code | Purpose |
|---|---|---|
| Main Background | `#FAF8FF` | Luminous, soft lavender page background |
| Card Background | `#FFFDF8` | Warm cream & ivory paper-like surfaces |
| Pale Lavender | `#F0EBFF` | Secondary surfaces, input backgrounds & subtle fills |
| Light Lilac | `#E7DFFF` | Badges, pills, calendar header accents |
| Soft Purple Accent | `#BCA6ED` | Primary action buttons, badges & highlights |
| Deeper Lavender | `#8F74C7` | Interactive states, focus rings & accents |
| Main Text | `#352B45` | Deep plum for optimal contrast & readability ($\ge 12:1$) |
| Secondary Text | `#766D83` | Muted purple-gray for subtext and captions ($\ge 4.8:1$) |
| Borders | `#E9E2F1` | Whisper-thin, delicate lavender borders |

### Typography
- **Headings & Brand Title:** Editorial Serif (`Cormorant Garamond`, `Playfair Display`, `Didot`, `Georgia`, `serif`) for an elevated, timeless feel.
- **Body, Tasks & Navigation:** Clean Sans-Serif (`Plus Jakarta Sans`, system sans fallbacks) for crisp legibility across all screen sizes.

---

## 🌟 The Four Main Views

### 1. ✦ Dashboard
- **Personalized Greeting:** Welcomes the active user with a warm, time-of-day greeting and the starburst mark (`Good morning, Emma ✧`).
- **Poetic Focus:** Features the brand motto *"Make space for what matters."* to center your attention.
- **Summary Metrics:** Elegant stat cards displaying **Total Intentions**, **Completed**, and **Remaining**.
- **Progress Track:** Smooth progress indicator displaying percentage completed and encouraging editorial captions.
- **Recent Intentions Preview:** Quick-access list of recent tasks with instant completion toggles.
- **Quick Flow:** Action button to transition directly to the **My Tasks** workspace.

### 2. ✧ My Tasks
- **Refined Task Input:** Comfortable, elegant input field with optional calendar due date picker (`YYYY-MM-DD`).
- **Complete Task Management:** Create, complete, reactivate, and delete tasks with subtle micro-animations.
- **Intentional Filters:** Seamlessly toggle between **All**, **Active**, and **Completed** with live count badges.
- **Due Date Indicators:** Visual indicators (`Today`, `Overdue`, or formatted calendar date) for scheduled items.
- **Graceful Empty States:** Poetic empty-state messaging when no tasks are pending.

### 3. 📅 Calendar & Schedule
- **Interactive Monthly Grid:** Monthly calendar with previous-month, next-month, and "Today" navigation.
- **Delicate Date Highlights:** Days with scheduled tasks display subtle lavender indicator dots.
- **Focused Day Inspector:** Selecting any date displays all tasks assigned to that day in an adjacent schedule panel.
- **Direct Scheduling:** Add new tasks directly to the selected date from within the calendar inspector.

### 4. ⚙️ Settings & Studio
- **Curator Profile:** Displays the current user's profile details, username handle, and active storage identifier.
- **Palette Themes:** Switch between 3 curated color aesthetics:
  - ✧ **Lunelle Lavender:** Pale lavender, warm cream & soft purple (Signature)
  - 🌿 **Lunelle Sage:** Earthy mint and morning mist
  - 🍑 **Lunelle Peach:** Warm apricot and soft champagne
- **Storage Management:** Live overview of saved items with the ability to reset to initial starter intentions.
- **Gentle Session Logout:** Safely sign out and return to the login screen while preserving all stored user tasks.

---

## 🧭 Navigation & Layout

- **Desktop Experience ($\ge 768px$):** Left navigation sidebar featuring the Lunelle brand mark, seamless view transitions, and quick user actions.
- **Mobile Experience ($< 768px$):** Fixed bottom navigation bar with comfortable touch targets, elegant icons, and no horizontal overflow.
- **Fluid Single-Page Architecture:** Zero page reloads; smooth view transitions and immediate client-side responsiveness.

---

## 🛠️ Technology Stack

- **HTML5:** Semantic, accessible markup with proper ARIA attributes.
- **Vanilla CSS3:** Modern CSS custom properties, Flexbox, CSS Grid, and subtle micro-transitions without bulky frameworks.
- **Vanilla JavaScript (ES6+):** Lightweight view routing, task state management, calendar calculations, and event handlers.
- **Browser LocalStorage:** Fast, private, client-side data persistence.

---

## 💾 Data Persistence Architecture

Lunelle stores all account data locally in the browser's `localStorage` ensuring complete privacy and isolation between demo accounts:

| Storage Key | Purpose |
|---|---|
| `taskflow_demo_users` | Registered accounts and credentials |
| `taskflow_current_session` | Currently authenticated user profile |
| `taskflow_tasks_${userId}` | User-specific task list and scheduled dates |
| `taskflow_theme_preference` | Selected visual theme preference |

*(Existing storage keys are preserved for 100% backward compatibility with existing user tasks.)*

---

## 🚀 How to Run Locally

Lunelle requires no compilers, package managers, or server installations:

### Option 1: Direct File
Simply open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).

### Option 2: Local HTTP Server (Recommended)
Using Python:
```bash
python -m http.server 3000
```
Then navigate to `http://localhost:3000` in your browser.
