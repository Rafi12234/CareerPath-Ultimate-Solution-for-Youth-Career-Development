# CareerPath Project Proposal

## Project Name: CareerPath

### Objective
CareerPath is an interactive platform designed to guide students and job-seekers through every step of their career journey. The platform offers personalized career development tools, such as job matching, skill gap analysis, and AI-powered roadmap generation, helping users to build career profiles, explore job opportunities, improve skills, and access valuable career resources.

### Team Members

| Roll Number | Name                 | Email                                         | Role                 |
|-------------|----------------------|-----------------------------------------------|----------------------|
| 20230104091 | Shajedul Kabir Rafi   | shajedul.cse.20230104091@aust.edu             | Lead Developer       |
| 20230104082 | Samanta Islam         | samanta.cse.20230104082@aust.edu              | Backend Developer    |
| 20230104093 | Maruf Islam Shiab     | maruful.cse.20230104093@aust.edu              | Frontend Developer   |
| 20230104089 | Nusrat Jahan Shanti   | nusrat.cse.20230104089@aust.edu               | Frontend Developer   |

### Tech Stack

#### Frontend
- React.js
- Tailwind CSS
- Bootstrap

#### Backend
- PHP Laravel

#### Database
- MySQL

#### AI API
- Gemini API

#### Development Tools
- VS Code
- GitHub
- MySQL Workbench

### Key Features

#### Core Features
- **Interactive Profile Builder**: Users can create a complete career profile by adding skills, experience levels, and education details. They can also download these details as a structured CV.
- **Job Matching System**: CareerPath analyzes users' skills and experience to calculate match percentages for available jobs, helping users instantly identify the most suitable roles.
- **Skill Gap Analyzer**: The platform highlights the skills a user lacks and suggests relevant learning resources to help users upgrade their skills.
- **Courses & Dashboard Recommendations**: Personalized course recommendations and a dashboard tailored to users' skills and goals.
- **AI-powered Assistant**: A career and job-related assistant to answer questions and guide users through their career journey.

#### Exclusive Features
- **AI-powered Price Intelligence**: Suggests fair market prices based on similar job listings.
- **Reputation-driven Trust System**: Users rate and review job postings to ensure trustworthy job offerings.
- **Automated Scam Detection**: Mechanisms to detect and prevent fraudulent activities on the platform.

### Authentication & CRUD Operations
- **JWT-based secure authentication**
- **Campus email verification** for user access
- **CRUD operations** for user profiles, job listings, messaging, and reviews

### Milestones

#### Milestone 1: Setup & Authentication
- Laravel & React project setup
- Database design
- JWT authentication & campus email verification
- Basic UI layout

#### Milestone 2: Marketplace Features
- User profile creation and management
- Marketplace features (job listings, search, and filters)
- Messaging system integration
- Frontend-backend integration

#### Milestone 3: AI & Finalization
- AI-powered price suggestion and scam detection
- User ratings, feedback system
- UI/UX improvements
- Testing & final deployment

### Figma Design
- The user interface has been designed using **Figma** to ensure a clean and intuitive user experience.
- [Figma Design Link](https://www.figma.com/make/uaYIDti20a4gf1hNcd7L6L/CareerPath-Website-UI-Design?t=bgMmRDWUxwI81cAm-1)

### Future Plans
- Add more AI-driven features to improve career guidance.
- Extend the platform to include internships and freelance opportunities.
- Collaborate with companies to list actual job openings directly on CareerPath.

---

## How to Run the Project

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
Install dependencies:
For the backend:

bash
Copy code
cd backend
composer install
For the frontend:

bash
Copy code
cd frontend
npm install
Set up the environment:

Create .env files for both frontend and backend with necessary configurations (API keys, database, etc.)

Start the application:

For the backend:

bash
Copy code
php artisan serve
For the frontend:

bash
Copy code
npm start
Open the application in your browser at http://localhost:3000.

