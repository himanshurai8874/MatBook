
# Form Builder Frontend

React-based frontend for the dynamic form builder system.

## Tech Stack

- React 19
- Vite
- TanStack Query (React Query)
- TanStack Form
- TanStack Table
- React Router
- Tailwind CSS
- ShadCN UI (Radix UI + Tailwind)

## Features

### Dynamic Form Page
- Fetches form schema from backend API
- Renders 8 field types dynamically:
  - Text
  - Number
  - Select
  - Multi-select
  - Date
  - Textarea
  - Switch
- Client-side validation with inline error messages
- Loading and error states
- Success feedback after submission
- Automatic redirection to submissions page

### Submissions Table Page
- Server-side pagination (10/20/50 items per page)
- Server-side sorting on Created Date (ascending/descending)
- View submission details in modal
- Loading, error, and empty states
- Responsive design

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Configure the API URL in `.env`:
```
VITE_API_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── api/
│   └── client.js              # API client functions
├── components/
│   ├── ui/                    # ShadCN UI components
│   │   ├── button.jsx
│   │   ├── input.jsx
│   │   ├── label.jsx
│   │   ├── select.jsx
│   │   ├── switch.jsx
│   │   ├── textarea.jsx
│   │   ├── checkbox.jsx
│   │   ├── card.jsx
│   │   ├── table.jsx
│   │   ├── dialog.jsx
│   │   └── alert.jsx
│   ├── FormField.jsx          # Dynamic form field component
│   └── SubmissionModal.jsx    # Submission details modal
├── pages/
│   ├── FormPage.jsx           # Main form page
│   └── SubmissionsPage.jsx    # Submissions table page
├── lib/
│   └── utils.js               # Utility functions
└── App.jsx                    # Main app with routing
```

## Key Features Implemented

- Dynamic form rendering based on backend schema
- All validation rules (minLength, maxLength, regex, min, max, minDate, minSelected, maxSelected)
- TanStack Query for server state management
- TanStack Form for form state and validation
- TanStack Table for submissions display
- Query invalidation after successful submission
- Proper loading states and error handling
- User-friendly feedback messages
