# Placement Management System — Technical Specification

## Overview
A full-stack web application for managing college/university placement drives. Built with a **Neobrutalism UI** theme, **React + Vite** frontend, **Node.js + Express** backend, and **MongoDB Atlas** database.

---

## ER Diagram Analysis & Improvements

### Original Entities (from ER Diagram)

| Entity | Attributes |
|---|---|
| **Student** | Student_ID (PK), Name, CGPA, Branch, Email, Phone_no, Resume |
| **Placement Drive** | PMD_ID (PK), arrival_date, Selection_procedure, Skills_Required, Job_loc, Position |
| **Company** | Comp_ID (PK), Company_Name, Contact_no, Package |
| **Admin** | Admin_ID (PK), Email, Name, Phone_no |

### Relationships
- **Student ↔ Placement Drive** — "Applies" (M:N — a student can apply to many drives, a drive has many applicants)
- **Company → Placement Drive** — "Conducts" (1:N — one company can conduct many drives)
- **Admin → Placement Drive** — "Manages"

### Proposed Improvements

1. **Application Status Tracking** — Add an `Application` junction collection with `status` (pending/shortlisted/selected/rejected), `appliedAt` timestamp
2. **Password & Auth** — Add `password` field to Student and Admin for login/auth (JWT-based)
3. **Drive Status** — Add `status` field to Placement Drive (upcoming/ongoing/completed)
4. **Drive Deadline** — Add `deadline` and `description` fields to Placement Drive
5. **Company Logo** — Add `logo` and `website` fields to Company
6. **Eligibility Criteria** — Add `minCGPA` to Placement Drive for auto-filtering
7. **Package Details** — Expand Package to `ctc` and `stipend` on Placement Drive level (since the same company may offer different packages for different drives)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (Neobrutalism theme) |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Auth | JWT (JSON Web Tokens) + bcrypt |
| HTTP Client | Axios |

---

## Database Schema (MongoDB Collections)

### `students`
```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "email": "String (required, unique)",
  "password": "String (hashed)",
  "phone": "String",
  "branch": "String",
  "cgpa": "Number",
  "resumeUrl": "String",
  "createdAt": "Date"
}
```

### `admins`
```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "email": "String (required, unique)",
  "password": "String (hashed)",
  "phone": "String",
  "createdAt": "Date"
}
```

### `companies`
```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "website": "String",
  "contactNo": "String",
  "logo": "String",
  "createdAt": "Date"
}
```

### `drives`
```json
{
  "_id": "ObjectId",
  "company": "ObjectId (ref: companies)",
  "position": "String (required)",
  "description": "String",
  "ctc": "String",
  "stipend": "String",
  "jobLocation": "String",
  "skillsRequired": ["String"],
  "selectionProcedure": "String",
  "minCGPA": "Number",
  "arrivalDate": "Date",
  "deadline": "Date",
  "status": "String (upcoming/ongoing/completed)",
  "createdAt": "Date"
}
```

### `applications`
```json
{
  "_id": "ObjectId",
  "student": "ObjectId (ref: students)",
  "drive": "ObjectId (ref: drives)",
  "status": "String (pending/shortlisted/selected/rejected)",
  "appliedAt": "Date"
}
```

---

## User Roles & Features

### 🎓 Student
- Register / Login
- View profile, edit profile
- Browse upcoming placement drives
- Apply to drives (if eligible by CGPA)
- View application history & status
- Upload resume (URL-based)

### 🛡️ Admin
- Login (pre-seeded or register)
- **Dashboard** — Stats overview (total students, companies, drives, placements)
- **Manage Companies** — CRUD operations
- **Manage Drives** — Create/edit/delete placement drives, link to company
- **Manage Applications** — View applicants per drive, update status (shortlist/select/reject)
- **View Students** — Browse all registered students

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Student registration |
| POST | `/api/auth/login` | Login (student/admin) |
| GET | `/api/auth/me` | Get current user |

### Students
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | List all students (admin) |
| GET | `/api/students/:id` | Get student profile |
| PUT | `/api/students/:id` | Update student profile |

### Companies
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/companies` | List all companies |
| POST | `/api/companies` | Create company (admin) |
| PUT | `/api/companies/:id` | Update company (admin) |
| DELETE | `/api/companies/:id` | Delete company (admin) |

### Drives
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/drives` | List all drives |
| GET | `/api/drives/:id` | Get drive details |
| POST | `/api/drives` | Create drive (admin) |
| PUT | `/api/drives/:id` | Update drive (admin) |
| DELETE | `/api/drives/:id` | Delete drive (admin) |

### Applications
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/applications` | Apply to drive (student) |
| GET | `/api/applications/my` | Get my applications (student) |
| GET | `/api/applications/drive/:driveId` | Get applicants for drive (admin) |
| PUT | `/api/applications/:id` | Update application status (admin) |

---

## Frontend Pages

| Page | Route | Role |
|---|---|---|
| Landing / Home | `/` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Student Dashboard | `/student/dashboard` | Student |
| Browse Drives | `/student/drives` | Student |
| Drive Details | `/student/drives/:id` | Student |
| My Applications | `/student/applications` | Student |
| Student Profile | `/student/profile` | Student |
| Admin Dashboard | `/admin/dashboard` | Admin |
| Manage Companies | `/admin/companies` | Admin |
| Manage Drives | `/admin/drives` | Admin |
| Drive Applicants | `/admin/drives/:id/applicants` | Admin |
| View Students | `/admin/students` | Admin |

---

## Neobrutalism Design System

### Key Characteristics
- **Bold black borders** (3-4px solid black)
- **Solid drop shadows** (offset black shadows, no blur)
- **Bright, flat colors** (yellow #FFD700, pink #FF6B9D, blue #4ECDC4, white, black)
- **Chunky typography** (bold headings, monospace accents)
- **Flat, no-gradient backgrounds**
- **Playful, slightly offset elements**
- **Rounded corners (small)** with thick borders
- **Hover effects** — shadow offset changes, slight translations

### Color Palette
| Name | Hex | Usage |
|---|---|---|
| Primary Yellow | `#FFE156` | Buttons, highlights |
| Accent Pink | `#FF6B9D` | Badges, alerts |
| Accent Blue | `#4ECDC4` | Cards, links |
| Accent Purple | `#A855F7` | Tags, accents |
| Background | `#FFF8E7` | Page background |
| Surface | `#FFFFFF` | Cards |
| Border | `#000000` | All borders |
| Text | `#1A1A1A` | Body text |

---

## Project Structure

```
d:\Codebase\Placement Management\
├── client/                    # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/        # Shared UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── student/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Drives.jsx
│   │   │   │   ├── DriveDetails.jsx
│   │   │   │   ├── Applications.jsx
│   │   │   │   └── Profile.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Companies.jsx
│   │   │       ├── Drives.jsx
│   │   │       ├── DriveApplicants.jsx
│   │   │       └── Students.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                    # Express backend
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Student.js
│   │   ├── Admin.js
│   │   ├── Company.js
│   │   ├── Drive.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── students.js
│   │   ├── companies.js
│   │   ├── drives.js
│   │   └── applications.js
│   ├── server.js
│   ├── .env
│   └── package.json
└── SPEC.md
```
