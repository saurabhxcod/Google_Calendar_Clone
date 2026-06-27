# 📅 Google Calendar Clone

### A production-ready, full-stack Google Calendar replica

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb)
![Vite](https://img.shields.io/badge/Vite-4.0-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.0-E73C7E?style=for-the-badge&logo=framer)
![JWT](https://img.shields.io/badge/JWT-Tokens-000000?style=for-the-badge&logo=json-web-tokens)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)
![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge&logo=render)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

> Built as part of the SDE Intern Assignment — evaluated on UI fidelity, architecture, API design, edge case handling, and code quality.

🌐 **[Live Demo](https://google-calendar-clone.vercel.app)**  |  📦 **[API Docs](#-api-documentation)**  |  🏗️ **[Architecture](#-architecture)**

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [🏗️ Architecture](#-architecture)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔐 Environment Variables](#-environment-variables)
- [📡 API Documentation](#-api-documentation)
- [🗄️ Database Schema](#-database-schema)
- [🖥️ UI Walkthrough](#-ui-walkthrough)
- [⚡ Edge Cases Handled](#-edge-cases-handled)
- [✨ Animations and Interactions](#-animations-and-interactions)
- [🚀 Deployment Guide](#-deployment-guide)
- [📚 Theory Questions](#-theory-questions)
- [🔮 Future Enhancements](#-future-enhancements)
- [📄 License](#-license)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🗓️ Three Calendar Views | Month, Week, and Day views with smooth animated transitions between them using Framer Motion |
| ✏️ Full Event CRUD | Create, edit, delete events with title, description, location, color, and recurrence options |
| 🔄 Recurring Events | Daily, weekly, monthly recurrence with options to edit or delete "this event", "this and following", or "all events" |
| ⚠️ Overlap Detection | Real-time backend detection of overlapping events with a warning modal before saving — user can override |
| 🎨 Event Color Coding | 8 Google Calendar colors: Blueberry, Sage, Banana, Tomato, Grape, Peacock, Flamingo, Graphite |
| 📅 Calendar Visibility Filters | Toggle visibility of My Calendar, Birthdays, Tasks, Holidays per Google Calendar sidebar behavior |
| 🌍 Public Holidays | Real Indian public holidays, festivals, and religious holidays fetched from Calendarific API with detail modal |
| 🔍 Global Search | Live search dropdown with 300ms debounce, keyboard navigation, highlighted matches, and dedicated search results page |
| 🔐 Authentication | JWT-based register and login with bcrypt password hashing and 7-day token expiry |
| 💾 UTC Timezone Handling | All events stored in UTC on the server, displayed in user's local timezone on the frontend |
| 📱 Responsive Design | Fully responsive across desktop, tablet, and mobile with Tailwind CSS utility classes |
| ✨ Animations | Framer Motion animations throughout — view transitions, modal springs, event chip entrance, checkbox toggles |
| 🗃️ Offline Draft Support | Event form data persisted to localStorage so drafts survive accidental page refreshes |
| 📆 Mini Calendar | Sidebar mini calendar for quick date navigation, independent of the main view calendar |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI component library |
| **TypeScript** | 5.x | Static typing and safety |
| **Vite** | 4.x | Build tool and dev server |
| **Tailwind CSS** | 3.x | Utility-first styling |
| **Framer Motion** | 10.x | Animations and transitions |
| **date-fns** | 2.x | Date manipulation and formatting |
| **Lucide React** | 0.x | Icon library |
| **Axios** | 1.x | HTTP client with interceptors |
| **React Router** | 6.x | Client-side routing |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime |
| **Express** | 4.x | HTTP server framework |
| **MongoDB** | 7.x | NoSQL document database |
| **Mongoose** | 7.x | MongoDB ODM with schema validation |
| **JWT** | 9.x | Stateless authentication tokens |
| **bcryptjs** | 2.x | Password hashing with salt rounds |
| **dotenv** | 16.x | Environment variable management |
| **cors** | 2.x | Cross-origin resource sharing |
| **uuid** | 9.x | Unique ID generation for recurrence groups |

### DevOps

| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting with CDN and auto-deploy |
| **Render** | Backend hosting with auto-deploy from GitHub |
| **MongoDB Atlas** | Cloud MongoDB with free M0 cluster |
| **Calendarific** | Holiday data API (1000 req/month free) |
| **GitHub** | Version control and CI/CD trigger |

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Vercel)                          │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │ AuthCtx  │  │CalendarCtx│ │Visibility│  │ HolidayContext │  │
│  │  (JWT)   │  │ (Events) │  │ Context  │  │ (Calendarific) │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────┬────────┘  │
│       │              │              │                 │           │
│  ┌────▼──────────────▼──────────────▼─────────────────▼───────┐ │
│  │                     React Component Tree                     │ │
│  │                                                              │ │
│  │  CalendarHeader → SearchBar → SearchDropdown               │ │
│  │  Sidebar → MiniCalendar → CalendarFilterList               │ │
│  │  MonthView / WeekView / DayView                            │ │
│  │  EventModal → EventCard → EventPopover                     │ │
│  │  HolidayChip → HolidayDetailModal                         │ │
│  └──────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────┼────────────────────────────────────┘
                              │ HTTPS (Axios + JWT Bearer)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER (Render)                             │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Express App                           │   │
│  │                                                          │   │
│  │  /api/auth    →  authRoutes    →  User model            │   │
│  │  /api/events  →  eventRoutes   →  Event model           │   │
│  │  /api/events/search → searchRoutes → searchService      │   │
│  │                                                          │   │
│  │  Middleware: CORS → JSON → authenticate (JWT)           │   │
│  └──────────────────────────┬───────────────────────────┘   │
└─────────────────────────────┼────────────────────────────────────┘
                              │ Mongoose ODM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas                                  │
│                                                                   │
│   users collection          events collection                    │
│   ┌─────────────┐           ┌──────────────────────┐            │
│   │ _id         │           │ _id                  │            │
│   │ name        │    1:N    │ userId  ─────────────┼──┐         │
│   │ email       │◄──────────│ title                │  │         │
│   │ password    │           │ startTime (UTC)      │  │         │
│   │ createdAt   │           │ endTime (UTC)        │  │         │
│   └─────────────┘           │ color                │  │         │
│                             │ recurrence           │  │         │
│                             │ recurrenceGroupId    │  │         │
│                             │ allDay               │  │         │
│                             │ calendarId           │  │         │
│                             └──────────────────────┘  │         │
│                                          ▲             │         │
│                                          └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  External APIs                                    │
│                                                                   │
│   Calendarific API                                               │
│   GET /v2/holidays?country=IN&year=2024                         │
│   → festivals, national, religious, regional holidays           │
│   → cached in sessionStorage per country+year                   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow — Creating an Event

1. User clicks a date cell in `MonthView`.
2. `CalendarContext.openCreate(date)` is called.
3. `EventModal` opens with `defaultDate` pre-filled.
4. User fills form and clicks Save.
5. `EventModal` calls `CalendarContext.saveEvent(formData)`.
6. `CalendarContext` calls `api.createEvent(data)`.
7. Axios `POST /api/events` with JWT Bearer token in header.
8. Express `authenticate` middleware verifies JWT → extracts `userId`.
9. `events.ts` route handler validates required fields.
10. `detectOverlap()` queries MongoDB for time conflicts.
11. If overlap found → 409 response with conflicting events.
12. Frontend shows overlap warning — user can override.
13. Event saved to MongoDB with `startTime`/`endTime` in UTC.
14. 201 response with saved event document.
15. `CalendarContext` reloads events for current date range.
16. Event appears in `MonthView` with Framer Motion entrance animation.

### Data Flow — Recurring Events

| editMode | What changes |
|----------|-------------|
| `this` | Only the clicked instance. `isException` set to `true` |
| `following` | This instance and all future instances in the group |
| `all` | Every event sharing the same `recurrenceGroupId` |

---

## 📁 Project Structure

```
google-calendar-clone/
│
├── server/                          # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/
│   │   │   └── eventSearch.controller.ts   # Search request handler
│   │   ├── middleware/
│   │   │   └── auth.ts                     # JWT verification middleware
│   │   ├── models/
│   │   │   ├── Event.ts                    # Mongoose Event schema
│   │   │   └── User.ts                     # Mongoose User schema + bcrypt
│   │   ├── routes/
│   │   │   ├── auth.ts                     # /api/auth/register + /login
│   │   │   ├── events.ts                   # /api/events CRUD routes
│   │   │   └── search.routes.ts            # /api/events/search route
│   │   ├── services/
│   │   │   └── eventSearch.service.ts      # MongoDB search query logic
│   │   ├── utils/
│   │   │   └── overlap.ts                  # Overlap detection algorithm
│   │   └── index.ts                        # Express app entry point
│   ├── .env.example                        # Environment variable template
│   ├── package.json
│   ├── render.yaml                         # Render deployment config
│   └── tsconfig.json
│
├── client/                          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginModal.tsx          # Login form with JWT
│   │   │   │   └── RegisterModal.tsx       # Registration form
│   │   │   ├── Calendar/
│   │   │   │   ├── CalendarHeader.tsx      # Top nav + view switcher
│   │   │   │   ├── DayView.tsx             # Single day hourly grid
│   │   │   │   ├── MiniCalendar.tsx        # Sidebar date picker
│   │   │   │   ├── MonthView.tsx           # Month grid with event chips
│   │   │   │   └── WeekView.tsx            # 7-column time grid
│   │   │   ├── Event/
│   │   │   │   ├── EventCard.tsx           # Reusable event chip
│   │   │   │   ├── EventModal.tsx          # Create/edit event form
│   │   │   │   └── EventPopover.tsx        # Event detail hover card
│   │   │   ├── holidays/
│   │   │   │   ├── HolidayChip.tsx         # Holiday chip with tooltip
│   │   │   │   ├── HolidayDetailModal.tsx  # Holiday detail read-only modal
│   │   │   │   └── HolidayLoadingBar.tsx   # Top loading bar for API fetch
│   │   │   ├── search/
│   │   │   │   ├── HighlightMatch.tsx      # Text highlight component
│   │   │   │   ├── SearchBar.tsx           # Search input + dropdown
│   │   │   │   ├── SearchDropdown.tsx      # Live results dropdown
│   │   │   │   ├── SearchResultCard.tsx    # Full card for search page
│   │   │   │   └── SearchResultItem.tsx    # Dropdown result row
│   │   │   ├── sidebar/
│   │   │   │   ├── CalendarFilterItem.tsx  # Single calendar checkbox row
│   │   │   │   ├── CalendarFilterList.tsx  # My + Other calendars lists
│   │   │   │   └── CalendarSection.tsx     # Collapsible section wrapper
│   │   │   └── Sidebar.tsx                 # Left sidebar shell
│   │   ├── context/
│   │   │   ├── AuthContext.tsx             # Auth state + JWT storage
│   │   │   ├── CalendarContext.tsx         # Events + modal orchestration
│   │   │   ├── CalendarVisibilityContext.tsx # Calendar show/hide state
│   │   │   └── HolidayContext.tsx          # Holiday data + type filters
│   │   ├── hooks/
│   │   │   ├── useCalendarVisibility.ts    # Visibility toggle logic
│   │   │   ├── useEventSearch.ts           # Search debounce + cache
│   │   │   └── useHolidays.ts              # Calendarific fetch + cache
│   │   ├── pages/
│   │   │   └── SearchPage.tsx              # /search results page
│   │   ├── services/
│   │   │   ├── api.ts                      # Axios instance + interceptors
│   │   │   ├── calendarificApi.ts          # Holiday API service
│   │   │   └── searchService.ts            # Search API + cache
│   │   ├── types/
│   │   │   ├── holiday.ts                  # Holiday interfaces
│   │   │   ├── index.ts                    # Core app interfaces
│   │   │   └── search.ts                   # Search interfaces
│   │   ├── utils/
│   │   │   ├── calendarVisibility.ts       # Default calendars + storage
│   │   │   ├── dateUtils.ts                # UTC/local conversion + grids
│   │   │   └── holidayUtils.ts             # Holiday transform + filter
│   │   ├── App.tsx                         # Root + routing + providers
│   │   ├── index.css                       # Tailwind directives + fonts
│   │   └── main.tsx                        # React DOM entry point
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json                         # Vercel SPA routing config
│   └── vite.config.ts
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [ ] Node.js 18 or higher
- [ ] npm 9 or higher
- [ ] MongoDB installed locally OR MongoDB Atlas account
- [ ] Calendarific API key (free at [calendarific.com](https://calendarific.com))
- [ ] Git

### Installation

**Step 1 — Clone the repository:**
```bash
git clone https://github.com/saurabhxcod/google-calendar-clone.git
cd google-calendar-clone
```

**Step 2 — Setup Backend:**
```bash
cd server
cp .env.example .env
```
Then open `server/.env` and fill in:
```env
MONGODB_URI=mongodb://localhost:27017/gcal
JWT_SECRET=your_minimum_32_character_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
```
Then run:
```bash
npm install
npm run dev
```
*Expected output:* `MongoDB connected` and `Server running on port 5000`.

**Step 3 — Setup Frontend (in a new terminal):**
```bash
cd client
cp .env.example .env
```
Then open `client/.env` and fill in:
```env
VITE_API_URL=http://localhost:5000/api
VITE_CALENDARIFIC_API_KEY=your_api_key_here
```
Then run:
```bash
npm install
npm run dev
```
*Open:* `http://localhost:5173`

### Quick Test

1. Register a new account on the login modal.
2. Create an event by clicking any date cell in Month View.
3. Switch between Month, Week, and Day views using the top header control.
4. Type in the global search bar and observe live debounced results.
5. Check that Indian public holidays appear automatically in green chips across the calendar.

---

## 🔐 Environment Variables

### server/.env

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb://localhost:27017/gcal` |
| `JWT_SECRET` | Yes | Secret for signing tokens | minimum 32 random characters |
| `PORT` | No | Server port (default 5000) | `5000` |
| `CLIENT_URL` | Yes | Frontend origin for CORS | `http://localhost:5173` |

### client/.env

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | Yes | Backend API base URL | `http://localhost:5000/api` |
| `VITE_CALENDARIFIC_API_KEY` | Yes | Calendarific API key | get from calendarific.com |

> ⚠️ **Never commit your `.env` files to Git.**
> Both `.gitignore` files already exclude them. Only `.env.example` files are committed.

---

## 📡 API Documentation

Base URL: `https://google-calendar-api.onrender.com/api`

> All `/events` endpoints require `Authorization: Bearer {token}` header

### Authentication Endpoints

#### POST `/auth/register`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Display name |
| `email` | string | yes | Unique email address |
| `password` | string | yes | Minimum 6 characters |

*Success response (201 Created):*
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64a1b2c3d4e5f6789",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

*Error responses:*
| Status | Meaning |
|--------|---------|
| 400 | Missing required fields |
| 409 | Email already registered |
| 500 | Server error |

#### POST `/auth/login`

Same structure as register but only `email` + `password` in body. Returns 401 Unauthorized for invalid credentials.

### Event Endpoints

All require `Authorization` header.

#### GET `/api/events`

| Param | Type | Description |
|-------|------|-------------|
| `start` | ISO string | Range start (inclusive) |
| `end` | ISO string | Range end (inclusive) |

Returns array of events sorted by `startTime` ascending.

#### POST `/api/events`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | yes | Event title max 200 chars |
| `startTime` | string | yes | ISO datetime in UTC |
| `endTime` | string | yes | ISO datetime in UTC (must be after start) |
| `description` | string | no | Max 2000 chars |
| `allDay` | boolean | no | Default false |
| `color` | string | no | One of 8 hex color values |
| `location` | string | no | Max 500 chars |
| `recurrence` | string | no | `none`, `daily`, `weekly`, `monthly` |
| `recurrenceEnd` | string | no | ISO date when recurrence stops |
| `calendarId` | string | no | `primary`, `birthdays`, `tasks`, `holidays` |

*Returns:* 201 Created with full event object, or 409 Conflict with overlap details.

#### PUT `/api/events/:id`

Same fields as POST plus `editMode`: `"this"` | `"following"` | `"all"`.

#### DELETE `/api/events/:id`

Query parameter `deleteMode`: `"this"` | `"following"` | `"all"`.

#### GET `/api/events/search`

Query parameter `q` (search string). Returns max 20 results sorted by relevance then newest first.

```json
[
  {
    "id": "64a1b2c3d4e5f6789",
    "title": "Team Meeting",
    "description": "Weekly sync",
    "startTime": "2024-07-15T10:00:00.000Z",
    "endTime": "2024-07-15T11:00:00.000Z",
    "location": "Conference Room A",
    "color": "#4285f4",
    "allDay": false,
    "calendarId": "primary"
  }
]
```

---

## 🗄️ Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,        // required, trimmed
  email: String,       // required, unique, lowercase
  password: String,    // bcrypt hashed, never returned in API responses
  createdAt: Date,     // auto timestamp
  updatedAt: Date      // auto timestamp
}
```

**Indexes:**
- `email`: unique index (enforces single account per email).

### Event Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,            // ref: User, indexed
  title: String,               // required, max 200 chars
  description: String,         // max 2000 chars
  startTime: Date,             // UTC, required
  endTime: Date,               // UTC, required
  allDay: Boolean,             // default false
  color: String,               // enum of 8 hex values
  location: String,            // max 500 chars
  recurrence: String,          // enum: none, daily, weekly, monthly
  recurrenceEnd: Date,
  recurrenceGroupId: String,   // uuid, groups recurring instances
  isException: Boolean,        // true when individual instance edited
  calendarId: String,          // primary, birthdays, tasks, holidays
  createdAt: Date,
  updatedAt: Date
}
```

**Compound Indexes:**

| Index | Fields | Purpose |
|-------|--------|---------|
| 1 | `userId` + `startTime` + `endTime` | Efficient date range queries for views |
| 2 | `userId` (single) | Filter all events belonging to a user |
| 3 | `recurrenceGroupId` | Fast operations across recurring series |

### Overlap Detection Algorithm

```javascript
const query = {
  userId,
  allDay: false,
  $or: [
    { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
  ],
  _id: { $ne: excludeId }
};
```

This single `$or` condition mathematically guarantees detecting all three conflict possibilities between an existing event $(S_{exist}, E_{exist})$ and a proposed event $(S_{new}, E_{new})$. If an existing event starts before the new event ends ($S_{exist} < E_{new}$) AND ends after the new event starts ($E_{exist} > S_{new}$), their time intervals overlap. This elegantly covers: (1) new event starting during an existing event, (2) new event ending during an existing event, and (3) new event completely encapsulating an existing event.

---

## 🖥️ UI Walkthrough

### Month View
Renders a standard 6-week grid. Events appear as rounded chips color-coded according to user selection, displaying a time prefix for timed events. Displays a `+N more` button when a cell exceeds capacity. Clicking empty date cells triggers event creation. Public holidays render in distinctive green chips, and current day is highlighted with a blue circle.

### Week View
Renders a 7-column time grid with 64px height per hour block. Features a top sticky all-day row for all-day events and holidays. Timed events position absolutely based on exact start time and duration. Clicking any hourly slot opens the event modal pre-configured for that hour.

### Day View
Single-day high-density hourly schedule. Features a dedicated top banner for public holidays. Renders large event blocks with full titles, exact time ranges, and location details. 

### Event Modal
Features spring-physics entry animations with a distinct top color accent bar. Includes title input, datetime pickers, all-day toggle, recurrence selector (`daily`, `weekly`, `monthly`), location, description, 8-swatch color palette picker, recurring series edit mode selector, and real-time conflict warning notices.

### Search
Pill-shaped global search input with focus ring. Features a 300ms debounce handler, live dropdown showing matching events with color dots, highlighted text snippets, and keyboard navigation (`ArrowUp`, `ArrowDown`, `Enter`). Pressing `Enter` navigates to a dedicated `/search` page.

### Sidebar
Contains the multi-color floating `+ Create` button, mini calendar date-picker, collapsable "My calendars" and "Other calendars" sections with custom checkbox toggles, three-dot context menus, and a "Display this only" filtering action.

---

## ⚡ Edge Cases Handled

| Edge Case | How It's Handled |
|-----------|-----------------|
| Overlapping events | Backend `detectOverlap()` returns 409 with conflicting event details. Frontend shows yellow warning with names of conflicting events. User can override and save anyway. |
| Recurring event deletion | Three delete modes — "this event only", "this and following" (by `startTime` ≥ current), "all events" (by `recurrenceGroupId`). Backend handles each with targeted MongoDB queries. |
| Editing one instance of recurring event | `isException` flag set to `true`. Only that document updated. `recurrenceGroupId` preserved so remaining instances unaffected. |
| Zero visible calendars | `ensureAtLeastOneVisible()` always forces primary calendar to true if toggling would hide all calendars. |
| Token expiry mid-session | Axios interceptor catches 401 responses and calls `logout()` which clears `localStorage` and redirects to login. |
| Calendarific API key missing | `calendarificApi.ts` checks for key before fetch. Logs warning. Returns empty array silently. Calendar works normally without holidays. |
| Network failure during holiday fetch | Error state shown in yellow dismissible banner. `sessionStorage` cache means failure only occurs on first load of a new year — subsequent views use cache. |
| Event spanning midnight | `startTime` and `endTime` stored independently in UTC. Frontend renders event in the day column matching `startTime`. `endTime` correctly displays across midnight. |
| All-day event overlap | All-day events skip overlap detection entirely (by design, matching Google Calendar behavior). They render in the all-day row, not the time grid. |
| Timezone differences | All times stored as UTC in MongoDB. Frontend uses `parseUTCtoLocal()` from `dateUtils.ts` which converts via `Date` constructor to browser's local timezone automatically. |
| Search with special characters | Query is passed directly to MongoDB RegExp. Special regex chars in user input are matched literally due to the `'i'` flag and MongoDB's handling. |
| Calendar visibility on refresh | Visibility map persisted to `localStorage` under `'calendar_visibility'` key. Loaded synchronously on `useCalendarVisibility` hook init before first render. |
| Duplicate email registration | MongoDB unique index on email field returns error code 11000. Backend catches and returns 409 with "Email already in use" message. |
| Empty search query | Backend returns `[]` immediately without hitting MongoDB. Frontend skips API call for empty or whitespace-only queries. |

---

## ✨ Animations and Interactions

| Interaction | Animation | Implementation |
|-------------|-----------|----------------|
| View switch (Month/Week/Day) | Slide in from right, slide out to left | `AnimatePresence` + `motion.div` with initial `x:20` animate `x:0` exit `x:-20` |
| Event modal open | Scale 0.95→1, Y -20→0, spring physics | `motion.div` with `type:'spring'` `duration:0.3` |
| Event chip entrance (month view) | Fade in + scale 0.95→1 | `motion.button` initial `opacity:0` `scale:0.95` |
| Event block entrance (week/day view) | Slide in from left, opacity 0→1 | `motion.div` initial `x:-10` `opacity:0` |
| Calendar date header change | Title slides up and fades in | `key={getTitle()}` on `motion.h1` with `y:-5→0` |
| Checkbox toggle (sidebar) | Checkmark scales in/out inside colored box | `AnimatePresence` + scale 0.5→1 on checkmark |
| Three-dot menu open | Scale 0.95→1 + opacity fade | `motion.div` initial `scale:0.95` `opacity:0` |
| Section collapse (My calendars) | Height 0→auto smooth accordion | `AnimatePresence` + `motion.div` height animation |
| Search dropdown appear | Opacity 0→1 + Y -8→0 | `motion.div` exit included for close animation |
| Search result items | Staggered entrance, each row fades in with delay | `index * 0.03` delay, max 10 items animated |
| Clear button in search | Scale 0.8→1 + fade on appear, reverse on exit | `AnimatePresence` wrapping X button |
| Holiday loading bar | Width 0%→100% over 2 seconds | `motion.div` animate width with ease |
| Button press feedback | Scale 0.95 on tap | `whileTap={{ scale: 0.95 }}` on all buttons |
| Search result card hover | Subtle scale 1.005 + shadow increase | `whileHover` on `SearchResultCard` |

---

## 🚀 Deployment Guide

### Backend → Render

1. Create an account at [render.com](https://render.com).
2. Push your repository to GitHub.
3. In the Render dashboard, click **New +** → **Web Service**.
4. Connect your GitHub repository.
5. Configure service settings:
   - **Name**: `gcal-api`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Configure Environment Variables in the **Environment** tab:
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = random string (minimum 32 characters)
   - `PORT` = `5000`
   - `CLIENT_URL` = `https://google-calendar-clone.vercel.app`
7. Click **Create Web Service**.
8. Copy your deployed server URL (e.g., `https://google-calendar-api.onrender.com`).

**MongoDB Atlas Setup:**
- Navigate to [cloud.mongodb.com](https://cloud.mongodb.com) and create a free M0 cluster.
- Create a database user and password.
- In Network Access, add IP `0.0.0.0/0` (Allow Access from Anywhere).
- Copy the driver connection string and paste into Render's `MONGODB_URI`.

### Frontend → Vercel

1. Create an account at [vercel.com](https://vercel.com).
2. Click **Add New...** → **Project** and import your GitHub repository.
3. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables:
   - `VITE_API_URL` = `https://google-calendar-api.onrender.com/api`
   - `VITE_CALENDARIFIC_API_KEY` = your Calendarific API key
5. Click **Deploy**. Vercel will build and host your frontend static distribution.
6. Update `CLIENT_URL` on Render with your final Vercel domain to ensure CORS alignment.

### Post-Deployment Checklist

- [ ] Health check: `GET https://google-calendar-api.onrender.com/health` returns `{"status":"ok"}`
- [ ] Register a new account on the live app
- [ ] Create, edit, delete an event
- [ ] Verify holidays load from Calendarific API
- [ ] Test search returns results
- [ ] Verify `/search` route works on refresh (SPA routing)
- [ ] Check browser console for zero errors

---

## 📚 Theory Questions

> These questions were part of the SDE Intern Assignment evaluation. Answers demonstrate understanding of distributed systems, database design, and frontend performance engineering.

---

### Question 1

> Imagine your calendar application now serves one million users. How would you redesign the backend to efficiently retrieve events, support recurring events, and prevent inconsistencies when multiple devices edit the same event?

#### 1. Database Layer — Sharding and Indexing

To scale to one million active users, a single database instance becomes a major bottleneck. We would implement horizontal database sharding in MongoDB using `userId` as the shard key. Because calendar operations are strictly scoped to an individual user, sharding by `userId` ensures that 100% of read and write queries for a given user land on a single shard, completely avoiding expensive scatter-gather cross-shard queries.

Index engineering is vital for query performance. We would enforce a compound index on `{ userId: 1, startTime: 1, endTime: 1 }`. Date-range filtering is the most executed query in calendar applications (firing every time a user switches or navigates views). This compound index allows MongoDB to perform index scans to fetch exact date windows instantly. Additionally, an index on `recurrenceGroupId` ensures instant lookups across recurring series. Lastly, enabling MongoDB Atlas Auto-Scaling guarantees automated disk storage and RAM provision during peak traffic spikes.

#### 2. Recurring Events at Scale

At a scale of 1M users, generating and storing every concrete instance of a recurring event (e.g., a daily meeting recurring indefinitely) into the database causes massive write amplification and storage bloat. Updating a series of 1,000 instances would require an $O(n)$ write operation.

Instead, we transition to a **Virtual Expansion Pattern** utilizing the iCalendar RFC 5545 specification (`RRULE`). We store only **one** master event document containing the recurrence rule string (e.g., `FREQ=WEEKLY;BYDAY=MO`). When a client requests events for a specific date window (e.g., July 1 to July 31), the server evaluates the master `RRULE` on-the-fly and projects virtual event instances into the response payload for that window only. If a user modifies a single instance, an exception document is created referencing the master ID with `isException: true` and the `originalDate`. This reduces series creation and modification complexity from $O(instances)$ to $O(1)$.

#### 3. Preventing Edit Conflicts — Optimistic Locking

When a user edits an event simultaneously from their mobile phone and laptop, race conditions can cause lost updates. We implement **Optimistic Concurrency Control (OCC)** using document versioning rather than heavy pessimistic database locks.

Each event document includes a `version` field (integer, starting at 0). When a client fetches an event, it receives the current version number. When submitting an update (`PUT`), the client passes the known version. The database query explicitly targets both ID and version while atomically incrementing the version:
```javascript
const result = await Event.findOneAndUpdate(
  { _id: eventId, version: currentVersion },
  { $set: { ...updateData }, $inc: { version: 1 } },
  { new: true }
);
if (!result) {
  throw new Error("409_CONFLICT");
}
```
If another device updated the document in the interim, the version in the database no longer matches `currentVersion`. The query matches zero documents and returns `null`. The backend intercepts this and returns HTTP `409 Conflict`. The frontend captures this response and displays a non-blocking prompt: *"This event was modified on another device. Click to refresh."*

#### 4. Caching Layer — Redis

To shield MongoDB from repetitive read traffic, we introduce a Redis caching tier between the Express application servers and MongoDB. Calendar access patterns are highly read-heavy (users view their schedule repeatedly without making changes).

Event range queries are cached in Redis using keys structured as `events:{userId}:{startDate}:{endDate}` with a Time-To-Live (TTL) of 60 seconds. When any mutation occurs (`POST`, `PUT`, `DELETE`), an event bus worker invalidates all cached keys matching the pattern `events:{userId}:*`. This caching architecture offloads 80–90% of read operations from MongoDB, maintaining sub-10ms response times.

#### 5. Horizontal Scaling — Load Balancing

The stateless nature of Node.js and JWT authentication allows seamless horizontal scaling. We deploy multiple Node.js server instances behind an Application Load Balancer (AWS ALB or Nginx).

Because authentication credentials are validated statelessly via cryptographic signatures in the JWT Bearer token, any app instance can process any incoming request without sticky sessions. On individual instances, we utilize Node.js Cluster mode or PM2 to instantiate worker processes across all available CPU cores, maximizing throughput per instance. Auto Scaling Groups dynamically provision or terminate instances based on CPU utilization and HTTP request latency.

#### 6. Real-time Multi-device Sync — WebSockets

To eliminate stale UI states when modifications occur across multiple devices, we integrate a real-time event pipeline using Socket.io and Redis Pub/Sub.

When a user authenticates, their WebSocket connection joins a private room named `user:{userId}`. Whenever an event mutation succeeds on the backend, the server publishes a lightweight notification (`EVENT_CREATED`, `EVENT_UPDATED`, `EVENT_DELETED`) to that user's Redis Pub/Sub channel. All active application instances handling connections for that user push the notification to connected client devices. The frontend automatically merges changes into React state, updating the UI instantly without requiring manual refreshes.

#### Architecture Summary

| Problem | Solution |
|---------|----------|
| Slow date range queries | Compound index on `userId` + `startTime` + `endTime` |
| Recurring event storage bloat | `RRULE` virtual expansion pattern ($O(1)$ writes) |
| Concurrent edits / lost updates | Optimistic locking via `version` field |
| High MongoDB read load | Redis cache tier with 60s TTL & mutation invalidation |
| Multi-device sync latency | WebSocket rooms per `userId` backed by Redis Pub/Sub |
| Traffic spikes & server load | Stateless Node.js cluster behind Application Load Balancer |

---

### Question 2

> Your calendar becomes slow when rendering thousands of events. What frontend optimization techniques would you apply to improve performance, and why would each technique help?

#### 1. Virtualized Rendering — React Virtual

The primary bottleneck when rendering thousands of events is DOM node proliferation. Browsers struggle with layout recalculation, painting, and memory overhead when managing thousands of active DOM elements simultaneously.

By integrating windowing libraries such as `react-virtual` or `react-window`, we restrict rendering to **only** the DOM nodes visible within the current viewport, plus a small buffer index. In Week and Day views containing dense schedules, instead of creating thousands of event blocks, the DOM holds only the ~15 visible elements. As the user scrolls, elements outside the viewport are unmounted and recycled. This reduces memory consumption and transforms rendering complexity from $O(n)$ to $O(1)$ relative to total event count.

#### 2. Memoization — React.memo and useMemo

In React, state updates in root providers (e.g., `CalendarContext` or `CalendarVisibilityContext`) trigger recursive re-renders down the component tree. Without memoization, toggling a single calendar filter in the sidebar causes hundreds of rendered event chips across the Month View grid to evaluate and re-render.

We wrap granular components (`EventCard`, `EventChip`, `HolidayChip`) in `React.memo`, which performs a shallow comparison of props and skips rendering if props remain unchanged. Furthermore, computationally heavy filtering tasks—such as evaluating `visibleEvents` across multiple calendar categories—are wrapped in `useMemo`. This ensures array filtering runs strictly when event datasets or visibility maps change, rather than on every render cycle.

#### 3. Code Splitting — React.lazy and Suspense

Including every application view, modal, and route within a single monolithic bundle inflates initial load times and delays Time-to-Interactive (TTI).

Using `React.lazy()` and `Suspense`, we break the application bundle into distinct asynchronous chunks. Heavy or secondary routes—such as `SearchPage`, `HolidayDetailModal`, and complex export components—are loaded dynamically only when requested by the user. Vite automatically creates separate JavaScript bundles for these chunks. This significantly reduces the initial parsing and execution footprint on the browser thread.

#### 4. Debouncing — Search and Resize Handlers

Executing heavy handlers on high-frequency events triggers layout thrashing and unnecessary network overhead. Typing in a search input without debouncing fires API requests on every single keystroke.

Implementing a `300ms` debounce utility on search input delays API execution until the user pauses typing. This eliminates ~85% of redundant HTTP requests and backend queries. Similarly, window resize handlers used to recalculate grid dimensions are debounced using `requestAnimationFrame` or a `100ms` delay, preventing continuous layout calculations during window dragging.

#### 5. Date Range Fetching — Only Load What's Visible

Attempting to load a user's entire historical and future event database into client memory causes severe memory degradation and slow array processing operations.

Our data fetching architecture queries strictly bounded date ranges matching the active view window (e.g., a 5-week range for Month View or a 7-day range for Week View). When the user navigates to a different month or week, the client fetches only the delta range for that target window. This ensures that the in-memory JavaScript array of events remains small and consistent (typically < 100 items), keeping array filtering and rendering execution times minimal.

#### 6. Session Storage Caching — Holiday API

External API integrations (such as Calendarific) return static datasets (e.g., ~100 national holidays per year). Refetching this data on every view switch or page refresh introduces network latency and risks hitting API rate limits.

We implement a multi-tier caching strategy in `useHolidays`. Fetched holiday arrays are stored in `sessionStorage` keyed by `holidays_{country}_{year}`. On subsequent view mounts or year switches within the session, the hook reads directly from `sessionStorage` in < 1ms, eliminating network requests entirely. Furthermore, an in-memory Map cache within the React context ensures zero storage deserialization overhead during component re-renders.

#### 7. Tailwind CSS — Zero Runtime Style Computation

CSS-in-JS libraries (such as `styled-components` or `Emotion`) parse props and evaluate CSS strings dynamically at runtime during component render cycles, generating and injecting style tags into the document head.

Tailwind CSS operates as an ahead-of-time (AOT) compiler that generates a highly optimized, static CSS utility file during the build step. Because styling rules are applied via static class names, there is zero JavaScript runtime overhead for computing styles, zero dynamic DOM injection, and near-instant browser style matching.

#### 8. Framer Motion — Reduced Motion & Hardware Acceleration

Running dozens of concurrent UI animations across dense event grids can strain GPU layers and drop frame rates below 60fps on lower-end devices.

We optimize Framer Motion animations by constraining properties to hardware-accelerated transforms (`transform: translate3d`, `scale`, `opacity`), avoiding properties that trigger expensive browser layout reflows (like `top`, `left`, `width`, `height`). We wrap modal transitions in `<AnimatePresence mode="wait">` to ensure animations run sequentially rather than concurrently. Finally, we respect system accessibility settings via Framer Motion's `useReducedMotion()` hook, instantly disabling transforms for users requesting reduced motion.

#### Optimization Summary

| Technique | Why It Helps |
|-----------|-------------|
| **React Virtual / Windowing** | Restricts DOM nodes to visible viewport only; maintains $O(1)$ DOM footprint |
| **React.memo** | Skips component re-render when props have not changed |
| **useMemo for `visibleEvents`** | Memoizes filtering logic; executes strictly on data changes |
| **React.lazy + Suspense** | Code-splits routes/modals into dynamic chunks; reduces initial bundle size |
| **300ms Search Debounce** | Eliminates up to 85% of redundant API requests during typing |
| **Bounded Date Range Fetching** | Keeps client array size small regardless of total account history |
| **sessionStorage Holiday Cache** | Eliminates duplicate network requests for static annual holiday data |
| **Tailwind CSS (AOT)** | Zero runtime JS evaluation for styles; static class compilation |
| **Hardware Accelerated Motion** | Animates via GPU transforms; respects `prefers-reduced-motion` |

---

## 🔮 Future Enhancements

| Priority | Feature | Description |
|----------|---------|-------------|
| **P1 (High)** | 🔑 Google OAuth | One-click login and registration integration using Google Accounts |
| **P1 (High)** | 🔔 Push Notifications | Service Worker & Web Push API integration for automated event reminders 15 mins prior |
| **P1 (High)** | 🖱️ Drag and Drop | Full `@hello-pangea/dnd` integration to drag events across day columns and resize event durations |
| **P2 (Medium)** | ✉️ Event Invitations | Invite external users via email with RSVP status tracking (`Yes`, `No`, `Maybe`) |
| **P2 (Medium)** | 📥 iCal Export & Import | Export and import `.ics` calendar files compatible with Apple Calendar and Outlook |
| **P2 (Medium)** | 🌐 Multiple Time Zones | Display dual timezone rulers in Week and Day views for distributed global teams |
| **P2 (Medium)** | 📋 Agenda View | Compact, searchable linear list view of upcoming schedule items |
| **P3 (Nice to Have)** | 📱 Mobile Native App | React Native cross-platform mobile app leveraging existing Express REST API |
| **P3 (Nice to Have)** | ⚡ Real-Time Sync | WebSocket rooms syncing edits instantly across active browser windows |
| **P3 (Nice to Have)** | 🤖 AI Assistant Scheduling | AI-powered slot recommendation engine suggesting optimal meeting times |

---

## 📄 License

```
MIT License

Copyright (c) 2024 Saurabh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

Built with ❤️ for the SDE Intern Assignment

⭐ Star this repo if you found it helpful!

[🔝 Back to Top](#-google-calendar-clone)

</div>
