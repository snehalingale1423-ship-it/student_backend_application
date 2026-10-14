# StudbuddY — Student Management System (Phase 1)

A clean, responsive, frontend-only Student Management System designed for college administrative workflows with a strict black-and-white visual identity.

---

## Overview

StudbuddY is built entirely in **React + JavaScript (JSX)** using **Vite**, **React Router**, and **Tailwind CSS**. It contains no backend code, databases, or external API calls. All student records, metrics, searches, and CRUD interactions run client-side in the browser using React state and persistent `localStorage`.

---

## Features

- **Strict Monochromatic Palette**: High-contrast, accessibility-focused design system using only `#000000`, `#FFFFFF`, `#F5F5F5`, `#EAEAEA`, `#BDBDBD`, `#737373`, and `#404040`. Zero colored badges or distracting visual effects.
- **Typography**: Dual Google Fonts pairing with **Manrope** for page headings, wordmark, and metric numbers, and **DM Sans** for table records, inputs, and body text.
- **Simulated Authentication**:
  - `/login`: Form validation, show/hide password, "Remember me", forgot password handler, quick demo explore button.
  - `/register`: Full name, email, password matching validation, success state.
- **Administrative Dashboard** (`/dashboard`):
  - 4 real-time calculated metrics: Total Students, Computer Engineering Students, First-Year Students, Second-Year Students.
  - Compact preview of recent records and quick-action shortcuts.
- **Student Directory** (`/students`):
  - Instant multi-field search (Student ID, Name, Email).
  - Department branch filter & academic year filter with compound filtering.
  - Column sorting by Student ID or Name.
  - Clean pagination.
  - Actions for View Details, Edit, and Delete.
- **Add Student** (`/students/new`):
  - Field validation, duplicate ID & email prevention, auto-ID generator.
- **Student Profile** (`/students/:id`):
  - Detail summary adhering strictly to core fields: ID, Name, Email, Branch, Year.
- **Edit Student** (`/students/:id/edit`):
  - Reuses shared form logic, pre-populates fields, prevents duplicate collisions with other records.
- **Delete Confirmation Modal**:
  - Accessible modal dialog requiring explicit confirmation before removing records.
- **Demo Data Reset**:
  - One-click "Reset Demo Data" in the sidebar to restore original college sample records at any time.

---

## Technology Stack

- **Framework**: React 19 (JSX)
- **Routing**: React Router v7 (`react-router-dom`)
- **Styling**: Tailwind CSS v4 + Monochromatic Design System
- **Icons**: Lucide React
- **Build Tool**: Vite

---

## Running the Application

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## How Demo Data Works

- Initial sample data is defined in `src/data/mockStudents.js` across branches (Computer Engineering, IT, AI & Data Science, Electronics & Telecom, Mechanical) and years (First through Fourth Year).
- The application persists changes (Add, Edit, Delete) in the browser's `localStorage` under the key `studbuddy_students_data`.
- To reset back to the default dataset, click **Reset Demo Data** in the bottom sidebar.
