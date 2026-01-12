# CareerPath Project Proposal

## Project Name: CareerPath

### Objective
CareerPath is an interactive platform designed to guide students and job-seekers through every step of their career journey. The platform offers personalized career development tools, such as job matching, skill gap analysis, and AI-powered roadmap generation, helping users to build career profiles, explore job opportunities, improve skills, and access valuable career resources.

### Team Members

| Roll Number | Name                  | Email                                         | Role                              |
|-------------|-----------------------|-----------------------------------------------|-----------------------------------|
| 20230104091 | Shajedul Kabir Rafi   | shajedul.cse.20230104091@aust.edu             | Lead Frontend & Backend Developer |
| 20230104082 | Samanta Islam         | samanta.cse.20230104082@aust.edu              | Backend Developer    |
| 20230104093 | Maruf Islam Shiab     | maruful.cse.20230104093@aust.edu              | Frontend Developer   |
| 20230104089 | Nusrat Jahan Shanti   | nusrat.cse.20230104089@aust.edu               | Frontend Developer   |
---
### **Tech Stack**

#### **Frontend:**
- **React.js**:  
  A JavaScript library for building user interfaces. It is used to create dynamic, responsive, and interactive components that make up the CareerPath platform.
  
- **Tailwind CSS**:  
  A utility-first CSS framework that enables quick and easy design of custom, responsive user interfaces without having to leave your HTML.

- **Bootstrap**:  
  A popular CSS framework that provides pre-designed components to speed up the development process and ensure a consistent design across the platform.

#### **Backend:**
- **PHP Laravel**:  
  A PHP framework used for the backend of CareerPath. Laravel provides a clean, elegant syntax and a set of powerful tools to handle tasks such as authentication, routing, sessions, and caching.

#### **Database:**
- **MySQL**:  
  A relational database management system (RDBMS) used to store all the data for the platform, including user information, job listings, courses, and other related content.

#### **AI API:**
- **Gemini API**:  
  The core AI API used for advanced features such as job matching, skill gap analysis, AI-powered roadmap generation, and personalized course recommendations based on user profiles.

#### **Development Tools:**
- **VS Code**:  
  A lightweight code editor that provides the development team with powerful tools for writing and debugging code.

- **GitHub**:  
  A platform for version control and collaboration, allowing the team to manage and track the source code and contribute effectively.

- **MySQL Workbench**:  
  A database management tool used by the development team to design and interact with the MySQL database, ensuring smooth data handling and query execution.

#### **Coding Assistance (AI-based):**
- **ChatGPT (OpenAI)**:  
  Used for providing real-time coding assistance, answering development-related questions, and offering suggestions for resolving coding issues.

- **Claude AI (Anthropic)**:  
  Another AI tool used for coding help, offering intelligent responses and troubleshooting tips for developers.

- **Gemini**:  
  An AI tool used for enhancing the coding experience by suggesting code improvements and providing solutions to development challenges.

- **Deepseek AI**:  
  An additional AI assistant for coding that helps developers by providing suggestions, finding bugs, and improving overall code quality.
---

#### Features
#### Core Features

- Interactive UI Dashboard:
  The platform provides an interactive dashboard that recommends relevant courses and job opportunities based on the user's interests, knowledge, and skills. It helps users discover personalized career pathways and learning resources.

- Job Matching:
  CareerPath uses advanced algorithms to match users with job opportunities that align with their current skills and level of learning (rated at 100%). The system also suggests areas where the user needs to improve and recommends specific courses and learning resources   to help fill skill gaps.

- Courses Enrollment Page:
  Users can explore a wide range of courses related to their career development. The platform suggests relevant courses based on the user’s skills, career goals, and knowledge gaps. Users can enroll directly through the platform.

#### Exclusive Features

- AI Chatbot:
  The AI-powered chatbot answers career-related queries, provides job advice, and helps users navigate the platform more efficiently. It acts as an assistant to answer questions about job opportunities, career development, and skills enhancement.

- AI CV Analyzer:
  The AI CV Analyzer helps users improve their CVs by extracting key skills, roles, and domains. It provides tips and feedback on areas for improvement based on current market demands and the user's professional goals.

- AI Roadmap Generator:
  By analyzing the user’s current skills, education, and career goals, the AI generates a personalized roadmap that shows the user’s step-by-step career path. This roadmap helps guide users to achieve their dream job by suggesting necessary skills, courses, and experience.

- AI Mock Interview Practice:
  Users can practice for job interviews with AI-powered mock interviews. The system simulates real interview scenarios, asks questions based on the user's chosen career path, and provides feedback on answers, helping users to prepare effectively.

#### Admin Panel

- Admin Panel for User and Content Management:
  The admin panel allows platform administrators to manage user activity, monitor course enrollments, and oversee job listings. It provides detailed insights into the platform's performance, job market trends, and user engagement.
---
### **Authentication**

**CareerPath** uses secure and reliable authentication mechanisms to ensure that only authorized users can access the platform. The authentication system is designed with both security and user experience in mind.

#### **Key Authentication Features:**

1. **JWT-based Secure Authentication**:  
   - **JSON Web Tokens (JWT)** are used to manage user sessions securely. After a user successfully logs in, a JWT token is issued, which they can use for authenticated requests. This token is stored securely on the client side (typically in localStorage or cookies).
   - JWT tokens ensure that each request from the client to the server is authenticated, providing a seamless and secure experience.

2. **Email Verification**:  
   - Users must register with a valid email address, and they will receive an email with a verification link to confirm their identity. This verification process helps ensure that the email provided is correct and belongs to the user.

3. **Role-based Access Control (RBAC)**:  
   - The platform implements **role-based access control** to ensure that users have appropriate permissions based on their roles.
   - Common roles include:
     - **General User**: Regular access to job listings, course recommendations, profile management, etc.
     - **Admin**: Full access to the admin panel for managing user activity, job market insights, content moderation, etc.

4. **Password Security**:  
   - Passwords are securely stored using **bcrypt** hashing, ensuring that passwords are not exposed in their raw form.
   - Users can reset their passwords through a secure email-based recovery process.

5. **Session Management**:  
   - The platform manages sessions using JWT tokens, ensuring that users stay logged in until they choose to log out.
   - Tokens are refreshed automatically before expiration to ensure a seamless user experience.
   - Session timeouts are implemented for added security, automatically logging out users after a specified period of inactivity.

6. **OAuth Integration (Future Enhancement)**:  
   - In the future, CareerPath may integrate **OAuth** to support additional authentication methods (e.g., Google or LinkedIn login) for increased flexibility.

#### **User Authentication Flow:**

1. **Sign-Up**:  
   - The user registers by providing their email, creating a password, and filling out basic details.
   - Upon successful registration, the system sends a verification email to the provided email address.
   
2. **Email Verification**:  
   - The user clicks the verification link in their email to confirm their identity.
   - Once verified, the user can log in to the platform using their email and password.

3. **Login**:  
   - After email verification, the user can log in using their credentials (email and password).
   - Upon successful login, the user receives a JWT token, which is used for further authentication in subsequent requests.

4. **Accessing Platform Features**:  
   - The system checks the JWT token in the user's request headers to authenticate them before allowing access to protected features like job matching, course recommendations, and AI-powered tools.

---
### **Milestones**

**The project will be completed in the following stages:**

#### **Milestone 1: Setup & Authentication**

- **Project Setup**:
  - Setting up the initial project structure for both frontend and backend.
  - Integrating the development environments for **React.js** (frontend) and **PHP Laravel** (backend).
  
- **Database Design**:
  - Designing the database schema to store user profiles, job listings, course information, and other platform-related data in **MySQL**.
  
- **User Authentication**:
  - Implementing **JWT-based authentication** for secure login and session management.
  - Setting up **email verification** to ensure only valid users can register and log in.

- **Basic UI Layout**:
  - Designing the initial basic UI layout for the platform, including the login, registration, and dashboard pages.
  - Ensuring responsiveness for both desktop and mobile views.
  
#### **Milestone 2: Core Features Development**

- **Job Matching System**:
  - Implementing the core job matching system where users' profiles are analyzed based on their skills and experience.
  - Integrating an AI-based system (Gemini API) to match users with job listings that fit their profile.

- **Interactive UI Dashboard**:
  - Creating the user dashboard that dynamically updates based on users’ interests, skill levels, and job preferences.
  - Integrating personalized **course recommendations** and **job opportunities**.

- **Course Enrollment Page**:
  - Developing a course discovery and enrollment system where users can explore and sign up for various career-building courses.

- **Role-Based Access Control (RBAC)**:
  - Setting up different roles (User, Admin) to manage access control across the platform, ensuring secure and appropriate access.

#### **Milestone 3: AI & Finalization**

- **AI-Powered Features**:
  - Implementing the **AI CV Analyzer** to analyze user-uploaded CVs, providing insights and suggestions for improvement.
  - Integrating the **AI Roadmap Generator** to provide personalized career paths for users based on their current skills and career goals.
  - Setting up **AI Mock Interview Practice** to help users practice interviews with simulated scenarios and receive feedback.

- **Admin Panel Development**:
  - Creating the **Admin Panel** for managing user data, job listings, content, and platform performance analytics.
  
- **Testing & QA**:
  - Conducting extensive testing to ensure the platform works smoothly across different devices and browsers.
  - User acceptance testing (UAT) to gather feedback from a small group of users.

- **Deployment**:
  - Preparing the platform for production and deploying the final version.
  - Ensuring all features are functioning and providing necessary documentation for the deployment process.

---

### Figma Design
- The user interface has been designed using **Figma** to ensure a clean and intuitive user experience.
 
🔗 google Drive Link:
[https://drive.google.com/drive/folders/1yQDq3c-HMI16N5js_siPYkqqSZlMJ627?usp=sharing](https://drive.google.com/drive/folders/1Hi-OUV_VTcU-E3sFK6AeWuW3LZX4dEqE?usp=sharing)

---

### **Future Plans**

- **Additional AI Features**:
  - Integration of more AI-powered tools to assist users with career advice, job opportunities, and skill development, including AI-driven resume builders and job application optimizers.
  
- **Job and Internship Partnerships**:
  - Partnering with companies, universities, and industry leaders to provide users with exclusive job listings, internship opportunities, and career development resources.

- **Expand Course Offerings**:
  - Continuously expanding the available courses and learning materials in collaboration with top educational platforms, universities, and industry experts.

- **Social & Community Features**:
  - Adding features that allow users to connect with mentors, participate in online forums or discussion groups, and share career development experiences.
  
- **Mobile App Development**:
  - Developing mobile versions of the platform for iOS and Android to increase accessibility and usability for users on the go.
  
- **Global Expansion**:
  - Expanding CareerPath to support users outside the current region, integrating multi-language support, and adapting the platform to local job markets and career trends.

- **Improved AI**:
  - Enhancing the AI algorithms with more advanced machine learning techniques to provide even more personalized and accurate career recommendations.
