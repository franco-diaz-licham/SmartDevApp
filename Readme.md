# 💼 SmartDevApp

![Azure Functions](https://img.shields.io/badge/Azure_Functions-v4-0062AD?logo=azurefunctions&logoColor=white)
![Azure Static Web Apps](https://img.shields.io/badge/Azure_Static_Web_Apps-Production-008AD7?logo=microsoftazure&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white)

SmartDevApp is my full-stack portfolio website. It presents my professional experience, personal projects, contact information, and portfolio detail pages through a deliberately framework-free frontend built with plain HTML, CSS, and TypeScript. Vite is used as the build tool, not as an application framework.

The backend is an Azure Functions app that supports the contact form by sending email through Azure Communication Services. The project is deployed with GitHub Actions to Azure services including Static Web Apps and Azure Functions.

---

## ✨ Features

- No Frameworks, pure HTML, CSS and TS.
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
