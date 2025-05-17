<div align="center">
  <img src="public/logos/GUCInternshipSystemLogo.png" alt="GUC Internship System Logo" height="150" style="margin-top: 0; margin-bottom: 0; padding: 0;" />
  <h1 style="margin-top: 0;">GUC Internship System</h1>
  <p style="margin-top: 0;">A streamlined internship management solution for the German University in Cairo.</p>
</div>


---

## 📋 Table of Contents
- [📖 About](#-about)
- [🚀 Project Details](#-project-details)
  - [🔐 Profile and Identity Module](#-profile-and-identity-module)
  - [💼 Internship Search and Recruitment Module](#-internship-search-and-recruitment-module)
  - [📊 Evaluation and Reporting Module](#-evaluation-and-reporting-module)
  - [✨ Additional Features](#-additional-features)
- [🛠️ Technical Notes](#-technical-notes)
- [🧱 Technologies](#-technologies)
- [⚙️ Setup](#️-setup)
- [🎬 Demo Video](#-demo-video)
- [👨‍💻 Contributors](#-contributors)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📬 Contact](#-contact)

---

## 📖 About
**GUC Internship System** is a front-end prototype web application built using **React**, **Next.js**, **TypeScript**, and **CSS**, designed to digitize and streamline the internship lifecycle at the **German University in Cairo (GUC)**. The system caters to **students**, **PRO students**, **faculty**, **companies**, and the **SCAD office**, offering a professional, intuitive, and responsive user experience.

---

## 🚀 Project Details

### 🔐 Profile and Identity Module
- **Company Registration and Verification**
  - Companies register with key details (name, industry, size, logo, and email).
  - Upload tax documents for verification by SCAD.
  - SCAD accepts or rejects applications, triggering notification emails.

- **Student Profiles**
  - Students and PRO students personalize their profiles with:
    - Internship/job history
    - Job interests
    - College activities
    - Major and semester

- **SCAD Oversight**
  - SCAD reviews, filters (by industry), and searches (by name) company applications.

---

### 💼 Internship Search and Recruitment Module
- **Internship Listings**
  - Companies can post, edit, and remove listings with details such as:
    - Duration (1–6 months)
    - Paid/unpaid status
    - Expected salary
    - Required skills and job description
  - Listings are searchable/filterable by title, company name, industry, duration, and payment status.

- **Application Process**
  - Students apply by uploading:
    - CVs
    - Cover letters
    - Certificates
  - Companies manage and update application statuses (e.g., Accepted, Finalized, Rejected).
  - Students can view and track the status of applications.

- **Intern Management**
  - Companies manage current interns and mark internships as completed.
  - Filter and search by intern name, job title, or status.

---

### 📊 Evaluation and Reporting Module
- **Company Evaluations**
  - Companies evaluate interns; evaluations are only visible to SCAD.
  - Students evaluate companies and tag helpful faculty courses.

- **Intern Reports**
  - Students submit detailed reports:
    - Company overview
    - Tasks performed
    - Feedback on the work environment
  - Faculty/SCAD review reports and set statuses (e.g., Pending, Flagged, Rejected, Accepted).
  - Students can appeal rejections with comments.

- **Real-Time Analytics**
  - Faculty/SCAD view stats:
    - Report statuses per cycle
    - Average review time
    - Top-rated companies
    - Frequently cited courses
  - Exportable/downloadable reports.

---

### ✨ Additional Features
- **Notifications**
  - Students: Cycle dates, report status, workshop reminders
  - Companies: New applications, SCAD verification results

- **Career Support (for PRO students)**
  - Online assessments and scores
  - Live/pre-recorded workshops with chat and notes
  - Attendance certificates
  - Video call scheduling with SCAD (includes mute, screen share, notifications)

- **Document Management**
  - Users can download submissions and reports as PDFs
  - 5MB upload limit for performance

- **UI/UX Design**
  - Consistent, accessible, and responsive layout (WCAG 2.1 compliant)
  - Principles: error prevention, reversible actions, minimal clicks, consistent design

---

## 🛠️ Technical Notes
This is a front-end prototype using **dummy data** to simulate:
- Authentication (e.g., email/password login)
- Backend/database functionality

Supports:
- Multiple concurrent users
- Learnability, visibility, and efficiency
- Evaluation based on assigned product manager's UI/UX criteria

---

## 🧱 Technologies
- **React** – Component-based UI
- **Next.js** – SSR and optimized routing
- **TypeScript** – Type safety and scalability
- **CSS** – Responsive, clean styling

---

## ⚙️ Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-team-repo/guc-internship-system.git
cd guc-internship-system
