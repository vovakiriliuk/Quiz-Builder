# Quiz Builder

A full-stack Quiz Builder application built with NestJS, React, TypeScript, and Tailwind CSS. The system allows users to create, view, and manage quizzes with multiple question types (Boolean, Input, and Checkbox).

---

## Prerequisites

- **Node.js**: v18.0.0 or later (Node 20+ recommended)
- **npm**: v9.0.0 or later

---

## 1. Backend Setup & Database

The backend is built with **NestJS** and **Prisma ORM** using SQLite.

### Steps:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Ensure `backend/.env` exists with the SQLite connection string:
   ```env
   DATABASE_URL="file:./dev.db"
   PORT=3001
   ```

4. Set up the database:
   Run Prisma migrations to generate the database schema and Prisma Client:
   ```bash
   npx prisma migrate dev --name init
   ```
   *(Optional) To seed initial sample quizzes if needed:*
   ```bash
   npm run prisma:seed # or npx prisma db seed
   ```

5. Start the backend server:
   ```bash
   npm run start:dev
   ```
   The backend will start and listen at **`http://localhost:3001`**.

---

## 2. Frontend Setup

The frontend is built with **Vite**, **React 19**, **TypeScript**, **React Router v7**, **Tailwind CSS v4**, **React Hook Form**, and **Zod**.

### Steps:

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(On Windows PowerShell: `Copy-Item .env.example .env`)*

   Verify that `frontend/.env` contains:
   ```env
   VITE_API_URL=http://localhost:3001
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Open your browser at the URL shown in the terminal (typically **`http://localhost:5173`**).

### Additional Scripts:
- **Build production bundle**: `npm run build`
- **Lint source code**: `npm run lint`
- **Format code with Prettier**: `npx prettier --write .`

---

## 3. How to Create a Sample Quiz via the UI

1. Open **`http://localhost:5173`** in your browser. You will be automatically redirected to `/quizzes`.
2. Click **"Create Quiz"** in the navigation bar or from the empty state.
3. Fill in the **Quiz Title**:
   - Example: `Web Development Fundamentals`
4. Add your questions:
   - **Question 1 (Boolean)**:
     - Select type: `Boolean (True / False)`
     - Text: `Is TypeScript a superset of JavaScript?`
     - Correct answer: Select `True`.
   - **Question 2 (Input)**:
     - Select `Text Input` from the type dropdown next to "Add Question" and click **Add Question**.
     - Text: `What is the HTML tag used for top-level headings?`
     - Correct answer: `h1`
   - **Question 3 (Checkbox / Multiple Choice)**:
     - Select `Multiple Choice` and click **Add Question**.
     - Text: `Which of the following are CSS layout modules?`
     - Option 1: `Flexbox` (mark checkbox as Correct)
     - Option 2: `Grid` (mark checkbox as Correct)
     - Option 3: `Canvas` (leave unselected)
5. Click **"Create Quiz"**:
   - The form validates all fields (non-empty title, min 1 question, min 2 checkbox options with at least 1 marked correct).
   - On success, you are redirected to `/quizzes`, and your new quiz appears in the list with the correct question count.
6. **View the Quiz**:
   - Click on the quiz card in `/quizzes` to open the read-only detail view at `/quizzes/:id`.
   - All question types are displayed with custom badges and read-only answer indicators.
7. **Delete a Quiz**:
   - In `/quizzes`, click the trash icon on the quiz item.
   - Confirm the browser prompt.
   - The quiz is removed from the database and updated in the UI list immediately.

---

## 4. API Endpoints Reference

| Method | Endpoint        | Description                         | Response                    |
| ------ | --------------- | ----------------------------------- | --------------------------- |
| `GET`  | `/quizzes`      | List all quizzes with summary count | `200 OK` (Quiz summaries)   |
| `GET`  | `/quizzes/:id`  | Retrieve single quiz with questions | `200 OK` / `404 Not Found`  |
| `POST` | `/quizzes`      | Create a new quiz                   | `201 Created`               |
| `DELETE`| `/quizzes/:id` | Delete a quiz by ID                 | `204 No Content` / `404 Not Found` |
