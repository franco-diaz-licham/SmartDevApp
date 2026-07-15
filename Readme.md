# 💼 SmartDevApp

![Azure Functions](https://img.shields.io/badge/Azure_Functions-v4-0062AD?logo=azurefunctions&logoColor=white)
![Azure Static Web Apps](https://img.shields.io/badge/Azure_Static_Web_Apps-Production-008AD7?logo=microsoftazure&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white)

SmartDevApp is a full-stack portfolio website for Franco Diaz Licham. It presents professional experience, personal projects, contact information, and portfolio detail pages through a Vite-powered static frontend.

The backend is an Azure Functions app that supports the contact form by sending email through Azure Communication Services. The project is deployed with GitHub Actions to Azure Static Web Apps and Azure Functions.

---

## ✨ Features

- Responsive portfolio landing page
- Professional work and personal project detail pages
- JSON-backed portfolio content
- Contact form integration
- Azure Functions email endpoint
- Azure Communication Services email delivery
- Static Web Apps routing configuration
- Split GitHub Actions workflows for frontend and backend deployment

---

## 🧰 Technology Stack

### ⚙️ Backend

- Node.js 20
- TypeScript
- Azure Functions v4
- Azure Communication Services Email
- Azure Functions Core Tools for local development

### 🖥️ Frontend

- Vite
- TypeScript
- HTML
- CSS
- Bootstrap
- Static Web Apps configuration

### ☁️ Deployment

- GitHub Actions
- Azure Static Web Apps
- Azure Functions
- Azure CLI

---

## 🏗️ Project Architecture

### Backend

```text
backend/
├── src/
│   ├── functions/  # Azure Functions entry points
│   ├── helpers.ts  # Shared response helpers
│   └── index.ts    # Function registration
├── host.json       # Azure Functions host configuration
├── package.json
└── tsconfig.json
```

### Frontend

```text
frontend/
├── pages/          # Portfolio detail pages
├── public/         # Static images and portfolio JSON data
├── src/            # TypeScript and styling
├── index.html      # Main portfolio page
├── staticwebapp.config.json
├── package.json
└── vite.config.ts
```

### CI/CD

```text
.github/
└── workflows/
    ├── backend.yml   # Build and deploy Azure Functions
    └── frontend.yml  # Build and deploy Static Web Apps
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm
- Azure Functions Core Tools v4
- Azure CLI
- PowerShell 7+

---

## ⚙️ Backend Setup

From the backend directory:

```powershell
cd backend
npm install
npm run build
npm start
```

The contact function expects these environment variables:

```text
COMMUNICATION_SERVICES_CONNECTION_STRING=
CONTACT_TO_EMAIL=
CONTACT_SENDER_ADDRESS=
```

Useful commands:

```powershell
npm run build
npm run watch
npm run clean
npm start
```

---

## 🖥️ Frontend Setup

From the frontend directory:

```powershell
cd frontend
npm install
npm run dev
```

For production builds, Vite reads the API base URL from:

```text
VITE_API_BASE=
```

Useful commands:

```powershell
npm run build
npm run preview
```

---

## 🚢 Deployment

The repository contains separate GitHub Actions workflows for frontend and backend deployments.

### 🖥️ Frontend Workflow Secrets

```text
AZURE_CREDENTIALS
SWA_NAME
SWA_RESOURCE_GROUP
API_BASE_URL
```

### ⚙️ Backend Workflow Secrets

```text
AZURE_CREDENTIALS
FUNCTION_APP_NAME
FUNCTION_RESOURCE_GROUP
```

The frontend workflow builds the Vite app, writes the production API base URL, includes the Static Web Apps config file, and deploys the `frontend/dist` output to Azure Static Web Apps.

The backend workflow builds the TypeScript Azure Functions app, prunes development dependencies, creates a zip deployment package, and deploys it to Azure Functions with `az functionapp deployment source config-zip`.

---

## 🧪 Local Build

Build the backend:

```powershell
cd backend
npm run build
```

Build the frontend:

```powershell
cd frontend
npm run build
```

---

## 📌 About

SmartDevApp is a personal portfolio and contact platform focused on presenting software development experience, project work, and a simple way to get in touch.
