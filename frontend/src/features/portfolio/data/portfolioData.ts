import item1Image from '@/assets/images/item1.png';
import item2Image from '@/assets/images/item2.jpg';
import item3Image from '@/assets/images/item3.png';
import item4Image from '@/assets/images/item4.png';
import item5Image from '@/assets/images/item5.jpg';

export type ProfessionalWorkItem = {
  companyName: string;
  id: string;
  image: string;
  keyContributions: string[];
  roleSummary: string;
  roleTitle: string;
  skillsAndPractices: {
    backend: string;
    cloudAndData: string;
    engineeringPractices: string;
    frontend: string;
  };
};

export type PersonalProjectItem = {
  demoUrl?: string;
  id: string;
  image: string;
  impact: string[];
  overview: string;
  projectName: string;
  subtitle: string;
  tech: {
    architecture: string;
    backend: string;
    cicdCloud: string;
    frontend: string;
  };
};

export const professionalWorkItems: ProfessionalWorkItem[] = [
  {
    id: '1',
    companyName: 'Bulk Chemical Cartage',
    roleTitle: 'Operations Portal',
    image: item1Image,
    roleSummary:
      "This work involved creating a custom full-stack software solution for BCC Transport's internal paperwork processes, including timesheets, compliance and safety checks, staff onboarding, single sign on (SSO), and more. It includes a website created with .NET Web API server, MSSQL as the database, and a Blazor Client, authenticating against the company's Azure AD, so staff can login using their work email. This solution allows all branches across Australia to have a central source of information, enable easier payroll processing and allow managers to better monitor company performance.",
    keyContributions: [
      'Staff timesheet tracking removed the need of paperwork and saved over 15 hours of administration for office staff and drivers per fortnight company-wide',
      'Creation of vehicle compliance checklist to comply with NSW safety regulations allows for detailed, accurate reports for auditing purposes and efficient flagging of safety and compliance issues',
      'New company website allows potential customers to easily contact for services',
      'Automation and schedule of tasks, as well as automated emails, allows users to have a list of tasks to be completed, saving office staff 4-6 hours weekly in administrative work'
    ],
    skillsAndPractices: {
      backend: '.NET, ASP.NET Core Web API, MVC controllers, Coravel, task scheduling',
      frontend: 'Blazor, Razor components, MudBlazor, Microsoft Fabric',
      cloudAndData: 'Azure DevOps, Azure Key Vault, Azure Container Apps, Azure Static Web Apps, Entra ID, Docker, MSSQL, Azure Storage, Azure Application Insights',
      engineeringPractices: 'Full-stack monolithic application, DDD, EDA, Clean Architecture'
    }
  },
  {
    id: '2',
    companyName: 'Norwest Christian College',
    roleTitle: 'Online Business Platform',
    image: item2Image,
    roleSummary:
      'Norwest Connect is a self-contained system composed of multiple applications that centralizes online operations for Norwest Christian College. It provides Single Sign-On (SSO) and permissions management across applications, making development and maintenance more efficient while ensuring a seamless user experience. The platform represents a transition from fragmented online and offline processes to a streamlined digital ecosystem, supporting workflows such as purchase order approvals, leave requests, and a Student Management System (SMS) for students with additional learning or medical needs. Built with modern technologies, it includes .NET Web API services backed by MSSQL databases, client applications developed in React. The system also integrates Power BI for data visualization and analysis, giving staff valuable insights to support informed decision-making.',
    keyContributions: [
      'Staff timesheet tracking saves payroll staff 5 hours per fortnight in administration',
      'Streamlined staff approval processes (leave applications, professional development forms, etc.) result in better data workflows and detailed, accurate compliance reports for auditing purposes',
      'Creation of Student Management System resulted in efficient online platform that saved College staff over 15 hours per week in administration, printing, reporting and management of data',
      'A complex web application securely manages all student-related data including medical, learning, and personal information to enable parents, teachers and external professionals to easily access and filter relevant data from one secure location',
      'Automated submission process for referral forms saves a total of 5 hours of manual administration per week'
    ],
    skillsAndPractices: {
      backend: '.NET, ASP.NET Core Web API, MVC controllers, application services, authorization services, REST APIs',
      frontend: 'React, TypeScript, component-based UI, shared frontend patterns',
      cloudAndData: 'Azure DevOps, Azure Key Vault, Azure Container Apps, Azure Static Web Apps, Entra ID, Docker, MSSQL, Azure Storage, Azure Application Insights',
      engineeringPractices: 'Modular monoliths, microservices, shared authentication, role-based authorization, EDA, Clean Architecture, DDD'
    }
  },
  {
    id: '3',
    companyName: 'PropertyMe',
    roleTitle: 'Software Developer',
    image: item5Image,
    roleSummary:
      'This role involved delivering cloud-based features for a national property management platform in collaboration with Product Managers and business stakeholders. The work included developing .NET solutions using DDD, Clean Architecture, SOLID principles, and modern engineering practices; maintaining software quality through automated unit and integration testing; conducting code reviews; mentoring junior developers; building responsive customer-facing applications with TypeScript, JavaScript, and Vue; working with CI/CD workflows including GitHub Actions; and contributing to Agile delivery through sprint planning, backlog refinement, and continuous improvement initiatives.',
    keyContributions: [
      'Architected and implemented a high-performance PDF and image processing background worker using RabbitMQ for asynchronous workloads, reducing PDF generation times by 75% from 60 seconds to 15 seconds',
      'Proposed and drove the adoption of a vertical feature-slice architecture for a major frontend codebase, improving maintainability, scalability, and developer experience',
      'Delivered cloud-based product features in collaboration with Product Managers and business stakeholders',
      'Maintained software quality through automated unit and integration testing',
      'Supported engineering standards through code reviews and mentoring junior developers'
    ],
    skillsAndPractices: {
      backend: '.NET, DDD, Clean Architecture, SOLID principles, cloud-based application patterns',
      frontend: 'Vue, TypeScript, JavaScript, customer-facing applications, frontend architecture',
      cloudAndData: 'AWS, MySQL Aurora / RDS, Secrets Manager, ElastiCache, Amazon MQ, S3, CloudWatch, GitHub Actions',
      engineeringPractices: 'Microservices, DDD, TDD, Unit-integration-e2e testing, mentoring, vertical feature-slice architecture'
    }
  }
];

export const personalProjectItems: PersonalProjectItem[] = [
  {
    id: '1',
    projectName: 'Alumno360',
    subtitle: 'Student Plans Platform',
    image: item3Image,
    demoUrl: 'https://www.youtube.com/embed/S8zOrtmbxTs',
    overview:
      'Alumno360 is a specialist student plans product for Australian schools. The platform is designed to help staff create, manage, review, report on, and evidence student plans with the depth required for learning support and compliance work. It focuses on student planning rather than broad school operations, bringing plan families, school data, identity, permissions, files, audit history, templates, reporting, CSV exports, PDF rendering, dashboard building, and Edumate integration into one staff workspace.',
    impact: [
      'Creates a focused workspace for education plans, medical plans, health support plans, behaviour and safety plans, transition plans, reviews, sign-offs, files, and audit history',
      'Supports Australian school planning and NCCD workflows with stronger compliance confidence and less administrative scatter',
      'Reduces repeated data entry by using school source-system data for students, staff, carers, classes, grades, enrolments, and contact records',
      'Integrates with Edumate to support school data sync and reduce manual maintenance of core student and staff information',
      'Supports CSV exporting and PDF rendering for plan documentation, evidence, reporting, and compliance workflows',
      'Includes a dashboard visual builder for focused student-plan reporting and operational views',
      'Keeps reporting, exports, saved views, search, dashboards, templates, files, and plan evidence connected to the student planning workflow',
      'Maintains a clear product boundary so the platform stays focused on student plans rather than becoming a broad school operations tool'
    ],
    tech: {
      backend: '.NET, ASP.NET Core Web API, MVC controllers, Entity Framework Core, PostgreSQL, Clean Architecture, DDD boundaries, domain services, application services, Swagger / OpenAPI',
      frontend: 'Vue, Vite, TypeScript, TanStack Query, Vue Router, Pinia, Vuelidate, Vitest, Vue Testing Library',
      cicdCloud: 'GitHub Actions, Azure Container Apps, Azure Static Web Apps, Entra ID, PostgreSQL, Azure Storage, Azure Service Bus, Azure Key Vault, Azure Application Insights',
      architecture: 'Event-driven architecture with modular domains, asynchronous processing, audit history, compliance-focused workflows, templates, reporting and permission-aware access'
    }
  },
  {
    id: '2',
    projectName: 'EarlyLearner',
    subtitle: 'Early Childhood Learning Record',
    image: item4Image,
    demoUrl: 'https://www.youtube.com/embed/MLcxa0VT7Ro',
    overview:
      'EarlyLearner is a full-stack early childhood learning record and school-readiness application. It helps carers manage households and children, capture daily learning moments, attach file evidence, and track school-readiness outcomes. The project is built as a technical showcase for event-driven and microservice-based architecture, combining a .NET API, background worker, Azure-native services, and a modern React frontend.',
    impact: [
      'Supports household and child profiles, readiness outcome catalogues, child readiness profiles, and progress tracking',
      'Captures daily logs, learning moments, readiness evidence, files, and portfolio-style records',
      'Uses event-driven integration between API and worker processes for asynchronous workflows',
      'Includes household invitation email workflows with realtime delivery status notifications',
      'Provides dashboard query slices for household summary data and school-readiness visibility'
    ],
    tech: {
      backend: '.NET 10, ASP.NET Core Minimal APIs, Entity Framework Core, PostgreSQL, Npgsql, Clean Architecture, DDD entities and value objects, CQRS-style commands and queries, Serilog, Swagger / OpenAPI',
      frontend: 'React 19, Vite, TypeScript, Tailwind CSS 4, PrimeReact, TanStack Query, React Router, Zustand, React Hook Form, Zod, Vitest, React Testing Library',
      cicdCloud: 'GitHub Actions, Azure Key Vault, Azure Container Apps, Azure Static Web Apps, Entra ID, Docker, PostgreSQL 17, Azure Service Bus, Azure Storage, Azure Application Insights',
      architecture: 'Microservice architecture with decoupled API and worker services, asynchronous processing, message-driven workflows, Clean Architecture boundaries, Dockerized local infrastructure and seeded demo data'
    }
  }
];
