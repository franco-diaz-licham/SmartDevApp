import barGraphImage from '@/assets/images/bar-graph.png';
import cloudImage from '@/assets/images/cloud.png';
import codeImage from '@/assets/images/code.png';
import databaseImage from '@/assets/images/database.png';
import item1Image from '@/assets/images/item1.png';
import item2Image from '@/assets/images/item2.jpg';
import item3Image from '@/assets/images/item3.png';
import item4Image from '@/assets/images/item4.png';
import item5Image from '@/assets/images/item5.jpg';
import processImage from '@/assets/images/process.png';
import websiteImage from '@/assets/images/website.png';

export const experienceItems = [
  {
    title: 'Application Development',
    image: websiteImage,
    imageAlt: 'Web application icon',
    points: ['Experience in both frontend and backend development', 'Built responsive, user-friendly web applications', 'Worked with .NET (Web API, Blazor), React, and Vue', 'Applied modern standards: Progressive Web Apps with Service Workers']
  },
  {
    title: 'Cloud Services & CI/CD',
    image: cloudImage,
    imageAlt: 'Cloud services icon',
    points: [
      'Set up and maintained Azure DevOps and GitHub Actions CI/CD pipelines',
      'Worked with Git and Docker for version control and containerization',
      'Experience deploying and managing Azure resources: SQL, Cosmos DB, Service Bus, Container Apps, App Services, Key Vault, Functions, Blob Storage, and Entra ID'
    ]
  },
  {
    title: 'Database Management',
    image: databaseImage,
    imageAlt: 'Database icon',
    points: ['Designed, maintained, and fine-tuned databases for performance and efficiency', 'Implemented backups, security policies, indexing, stored procedures, functions, and views', 'Experience with MSSQL, SQLite, and MongoDB']
  },
  {
    title: 'Testing & Code Quality',
    image: codeImage,
    imageAlt: 'Code icon',
    points: [
      'Extensive unit and integration testing for backend services',
      'xUnit, Moq, and FluentAssertions for .NET applications',
      'Vitest, React Testing Library, and component testing for frontend validation',
      'Refactoring and maintaining clean, testable code'
    ]
  },
  {
    title: 'Data Analytics & Visualisation',
    image: barGraphImage,
    imageAlt: 'Analytics icon',
    points: ['Performed statistical analysis and created detailed reports', 'Built dashboards and visualisations to highlight business data and trends', 'Experience using Microsoft Fabric and Power BI']
  },
  {
    title: 'Development Practices & Optimisation',
    image: processImage,
    imageAlt: 'Development practices icon',
    points: [
      'Apply Clean Architecture and SOLID principles',
      'Experience with Domain-Driven Design (DDD), Event-Driven Architecture (EDA), and microservices',
      'Experienced with end-to-end development: requirements, design, implementation, and deployment',
      'Emphasis on automation, reliability, and maintainability across the stack'
    ]
  }
] as const;

export const portfolioGroups = [
  {
    title: 'Professional Work',
    items: [
      {
        href: '/portfolio/professional/3',
        title: 'Property Management Platform',
        image: item5Image,
        imageAlt: 'PropertyMe software development work',
        description: 'Cloud-based software development for PropertyMe, including backend services, responsive customer-facing applications, asynchronous processing, and frontend architecture improvements.'
      },
      {
        href: '/portfolio/professional/1',
        title: 'Operations Portal',
        image: item1Image,
        imageAlt: 'Operations Portal',
        description: "A custom business website application for BCC Transport's internal processes including timesheets, compliance and safety checks, staff onboarding, staff logins and more."
      },
      {
        href: '/portfolio/professional/2',
        title: 'Operations Platform',
        image: item2Image,
        imageAlt: 'Operations Platform',
        description: 'A self-contained system composed of multiple applications, providing NWCC with an efficient and streamlined online platform that supports approval processes such as purchase orders and leave requests.'
      }
    ]
  },
  {
    title: 'Personal Projects',
    items: [
      {
        href: '/portfolio/personal/1',
        title: 'Alumno360',
        image: item3Image,
        imageAlt: 'Alumno360 student plans platform',
        description: 'A focused student plans platform for Australian schools, designed around learning support, compliance evidence, reviews, reporting, audit history, and staff planning workflows.'
      },
      {
        href: '/portfolio/personal/2',
        title: 'EarlyLearner',
        image: item4Image,
        imageAlt: 'EarlyLearner full-stack application',
        description: 'A full-stack early childhood learning record and school-readiness application for carers to track children, learning moments, evidence, and readiness outcomes.'
      }
    ]
  }
] as const;
