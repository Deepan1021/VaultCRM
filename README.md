# LeadPulse CRM — Vercel Demo

This is a functional, Vercel-ready frontend demonstration of the CRM described in the internship PPT.

## Included
- Sales dashboard
- Lead management
- Search and stage filtering
- Add lead
- Customer management
- Add customer
- Activity logs
- Admin / Sales role switch
- Role-based Users & Roles screen
- Responsive layout
- Local in-memory state for live demonstration

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Deploy to Vercel
1. Create a GitHub repository.
2. Upload this project.
3. In Vercel, choose **Add New Project** and import the repository.
4. Vercel automatically detects Next.js.
5. Click **Deploy**.

## Important
This demonstration stores data in browser memory only. Refreshing the page resets the sample data. It does NOT claim to be a production backend.

For a production full-stack version, connect the React/Next.js interface to Node.js/Express REST APIs and MongoDB, then add real authentication and server-side RBAC.
