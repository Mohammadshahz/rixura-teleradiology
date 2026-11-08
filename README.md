# Rixura Teleradiology

A complete teleradiology platform that connects **diagnostic centres** with **remote radiologists**. Centres upload X-ray, CT and MRI scans. Radiologists view the DICOM images in the browser and write reports. Admins manage the whole network: centres, radiologists, billing and quality.

> This repository is a showcase copy of the production platform. It contains the source code only, with no credentials, environment files or patient data.

---

## How it works

```
 Diagnostic Centre                 Backend API                    Radiologist
 (centre-app)                     (backend-api)                  (radiologist-app)
 ─────────────────               ─────────────────              ─────────────────
 Register patient    ───────▶    Stores patient &     ───────▶  Sees assigned case
 Upload DICOM scan               scan (AWS S3)                   Opens DICOM viewer
                                 Assigns radiologist             Writes report from
 Receives PDF report ◀───────    Generates report /   ◀───────   templates
                                 invoice                          Submits report
                                        ▲
                                        │
                                 Admin Portal (admin-portal)
                                 Manage centres, radiologists,
                                 reports, invoices, feedback
```

## Apps in this repository

| Folder | What it is | Tech |
|---|---|---|
| [`backend-api/`](backend-api) | Core REST API: users, centres, patients, reports, templates, invoices, dashboard, feedback | NestJS, TypeORM, PostgreSQL, AWS S3, AWS Cognito, Razorpay |
| [`centre-app/`](centre-app) | Web app for diagnostic centres: add patients, upload scans, track and download reports | React, Redux Toolkit, DWV (DICOM Web Viewer), jsPDF |
| [`radiologist-app/`](radiologist-app) | Web app for radiologists: case queue, in-browser DICOM viewer, template-based reporting, PDF preview | React, Redux Toolkit, DWV, jsPDF |
| [`admin-portal/`](admin-portal) | Admin dashboard: manage centres and radiologists, monitor reports, billing | React, Redux Toolkit, DWV |
| [`radiologist-onboarding/`](radiologist-onboarding) | Application/onboarding portal for radiologists joining the network | React, Vite, Tailwind CSS |
| [`landing-page/`](landing-page) | Public marketing website | React, TypeScript, Vite, Tailwind CSS |

## Key features

- **In-browser DICOM viewer.** Radiologists open and inspect scans (zoom, window/level, tags) without installing software.
- **Template-based reporting.** Reusable report templates speed up writing and keep reports consistent.
- **PDF reports.** Reports are generated as PDFs that centres can download and share.
- **Role-based access.** Separate apps and permissions for centres, radiologists and admins (AWS Cognito / JWT).
- **Secure scan storage.** Images are stored on AWS S3.
- **Billing.** Invoices per centre, radiologist payouts and Razorpay payments.
- **Dashboards and feedback.** Case volumes, turnaround tracking and quality feedback.

## Running locally

Each app runs on its own. For example:

```bash
# Backend
cd backend-api
cp .env.example .env      # fill in your own database / AWS values
npm install
npm run start:dev         # http://localhost:4000

# Any frontend (centre-app, radiologist-app, admin-portal)
cd centre-app
cp .env.example .env      # points to the backend URL
npm install
npm start
```

See each folder's own README for details.

## Team

Built by the Rixura team: Shahzeb Shaikh, Adeeb Shah, Arbaj, Umar Shaikh and Sultankhan Pathan.

## Credits

The DICOM viewers are built on [DWV – DICOM Web Viewer](https://github.com/ivmartel/dwv). See `license.txt` in the viewer apps.
