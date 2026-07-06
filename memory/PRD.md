# Smile Dental Clinic — PRD

## Original Problem Statement
Build a modern landing page for a dental clinic called Smile Dental Clinic.
Sections: Hero, Services, About the Doctor, Testimonials, Contact, Floating AI Chat button (bottom-right).
Main CTA: "Book Appointment". Clean blue and white medical theme.

## User Choices
- AI Chat: **Gemini 3 Flash** via Emergent LLM Key (streaming SSE).
- Book Appointment: opens a **simple appointment form saved to MongoDB**.
- Content: polished placeholder content generated.

## Architecture
- **Backend**: FastAPI at `/app/backend/server.py`, Mongo via Motor, LLM via `emergentintegrations`.
  - `POST /api/appointments` — create appointment (Pydantic-validated).
  - `GET /api/appointments` — list appointments.
  - `POST /api/chat/stream` — SSE stream (Gemini 3 Flash), tokens as `data: <chunk>` + `data: [DONE]`.
- **Frontend**: React (CRA + Tailwind + shadcn/ui) at `/app/frontend`.
  - Landing page: `/app/frontend/src/pages/Landing.jsx`.
  - Components in `/app/frontend/src/components/landing/`:
    Navbar, Hero, Services, AboutDoctor, Testimonials, Contact, Footer, AppointmentDialog, ChatWidget.

## Design
- Fonts: Outfit (display) + Manrope (body).
- Palette: blue-600 primary, sky-50 tinted sections, slate text hierarchy, white base.
- Rounded-2xl cards, rounded-full buttons, soft blue shadows.

## Implemented (2026-07-06)
- All six sections rendered with polished placeholder content and imagery.
- Book Appointment flow: dialog with name/email/phone/service select/date/message; success state; persists to Mongo.
- Service cards deep-link into booking with the service pre-selected.
- Floating AI chat (bottom-right) streaming Gemini 3 Flash responses; positioned to clear the Emergent badge.
- Backend: appointments + streaming chat endpoints tested (5/5 pytest passing).

## Backlog
- **P1**: Send confirmation email to patients after booking (Resend/SendGrid).
- **P1**: Admin dashboard to view/manage appointments.
- **P2**: Time-slot picker (not just date) with real availability.
- **P2**: Google reviews import for the Testimonials section.
- **P2**: Persist chat history per session to Mongo.
- **P2**: Analytics on chat conversations & booking funnel.

## Next Tasks
- Wire email/SMS notifications on new bookings.
- Add secure admin route for appointments management.
