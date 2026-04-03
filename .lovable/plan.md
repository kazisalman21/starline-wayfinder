## Plan: AI Customer Care & Complaint Management System

### Phase 1: Foundation
1. **Data layer** — Create `src/data/supportData.ts` with complaint types, mock complaints, staff, FAQ data, and Zustand store for complaint state
2. **Shared components** — Build reusable support UI atoms (status badges, priority indicators, category chips)

### Phase 2: Customer-Facing
3. **Floating AI Widget** — Global floating button with pulse glow, opens chat panel
4. **AI Chat Panel** — Slide-up premium chat with suggestion chips, message bubbles, typing indicator, complaint submission flow
5. **Support Page** — Revamp existing `/support` page with hero, search, FAQ accordion, categories grid, emergency contacts
6. **Complaint History Page** — `/my-complaints` page with list, filters, search, detail view with timeline

### Phase 3: Admin
7. **Admin Complaints Tab** — Add to existing admin dashboard with analytics cards, filterable table, actions
8. **Admin Complaint Detail** — Full detail view with summary, customer info, notes, status timeline, quick actions
9. **Support Analytics Tab** — Charts for complaints by route/category/counter/time, insight cards

### Phase 4: Integration
10. **Navigation updates** — Update Navbar, App.tsx routes, admin tabs
11. **Widget integration** — Add floating widget to App.tsx so it appears on all pages

### Design tokens used throughout:
- Primary red `#E8001D`, Gold `#FFB800`, BG `#060608`, Surface `#13131a`
- All via existing CSS variables / tailwind tokens
- Glassmorphism cards, subtle glows, smooth animations via framer-motion