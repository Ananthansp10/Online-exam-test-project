Project Overview

The Online Examination System is a web-based platform that allows candidates to take exams online with automated evaluation and result generation.
It is designed to support time-bound exams, randomized question delivery, and basic anti-cheating measures to ensure exam integrity.

Features

Exam Management: Admin can create exams and add questions (MCQ, True/False).

Time-Bound Exams: Automatic submission once the exam time expires.

Randomized Questions: Questions are randomized per user to prevent cheating.

Automated Grading: Exam results are automatically calculated and generated upon submission.

User Dashboard: Candidates can view their results and progress.

Anti-Cheating Measures: Detects tab switching and warns users.

Secure Access: JWT-based authentication and role-based authorization.

Progress Saving: Handles network interruptions and allows users to resume exams.

Technologies

Backend: Node.js, Express

Frontend: React with TypeScript

Database: MySQL with Sequelize ORM

Authentication: JWT (JSON Web Tokens)

HTTP Client: Axios

Styling: Tailwind CSS

State Management: React Hooks / Context API

Architecture

The system follows a client-server architecture:

Frontend (React + TypeScript)

Handles exam interface, question navigation, answer selection, and timer.

Saves progress locally to handle disconnections.

Sends submission data securely to the backend.

Backend (Node.js + Express)

Handles exam creation, question storage, user authentication, and result computation.

Provides RESTful APIs for frontend consumption.

Performs automatic grading and stores results in MySQL.

Database (MySQL + Sequelize)

Tables include Users, Exams, Questions, Options, Results.

Maintains relationships between exams, questions, and users.

erequisites

Node.js >= 18.x

MySQL >= 8.x

npm or yarn

Steps

Clone the repository:https://github.com/Ananthansp10/Online-exam-test-project.git

Install backend dependencies:

cd backend
npm install

Install frontend dependencies:

cd ../frontend
npm install

Start backend server:

cd ../backend
npm run dev

Start frontend development server:

cd ../frontend
npm run dev

Backend env :-

DB_HOST=localhost
DB_USER=root
DB_PASSWORD
DB_NAME
PORT
ADMIN_EMAIL
ADMIN_PASSWORD
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
ACCESS_TOKEN_EXPIRE
REFRESH_TOKEN_EXPIRE
ACCESS_TOKEN_MAX_AGE
REFRESH_TOKEN_MAX_AGE
FRONT_END_URL

Frontend env :-

API_BASE_URL
