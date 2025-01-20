# BookClub Project

## Overview
BookClub is a web application designed to facilitate a virtual book club. It features a **Spring Boot backend**, a **MySQL database**, and a **React.js frontend**. The application supports secure user interactions and provides robust features for book recommendations, voting, discussions, event announcements, and user management.

---

## Features

### Security
- **Basic Authentication:** Ensures secure login for all users.
- **Refresh and Access Tokens:** Used for secure and efficient session management.
- **Password Encryption:** User passwords are stored securely using Bcrypt.
- **HTTPS:** Communication is encrypted for added security.

### Functionalities
#### **Book Recommendations**
- Users can **add**, **edit**, and **delete** book recommendations.
- Only the user who created the book recommendation can edit or delete it.
- Duplicate book recommendations are not allowed.

#### **Voting**
- **Admins** can create voting deadlines.
- Users can vote on books **only within the active deadline**.
- Each user can cast **only one vote**.
- The book with the most votes wins. 
  - If there are no votes, no book wins.
  - In case of a tie, the winner is determined alphabetically by book title.

#### **Discussion**
- A discussion thread is **automatically created** for the winning book after the voting deadline ends.
  - The backend checks every 60 seconds to see if the deadline has passed and identifies the winner.
- Users can **add**, **edit**, and **delete** comments in the discussion thread.

#### **Events**
- **Admins** can create, edit, and delete announcements for events.
- Only logged-in users can view events.

#### **User Management**
- **Admins** can block users from accessing the platform.

#### **Admin Privileges**
- Admins can edit or delete **any** book recommendations and comments.

---

## Technology Stack
### Backend
- **Framework:** Spring Boot
- **Database:** MySQL
- **Security:** Bcrypt for password encryption, Basic Authentication, and token-based session management

### Frontend
- **Framework:** React.js

---

## Installation and Setup

### Prerequisites
- **Java 17** or higher (for the Spring backend)
- **Node.js** and **npm** (for the React frontend)
- **MySQL** database

### Steps to Run the Project
1. Clone the repository:
   ```
   git clone https://github.com/cagla01/bookclub.git
   cd bookclub
   ```

2. Backend Setup:
	Navigate to the backend directory: 
	```
   cd bookclub-backend
   ```
   Update application.properties with your MySQL database credentials.
	Build and run the backend:
	```
	./mvnw spring-boot:run
	```

3. Frontend Setup:
	Navigate to the frontend directory:
	```
	cd bookclub-frontend
	```
	Install dependencies:
	```
	npm install
	```	
	Start the React development server:
	```
	npm start
	```

4. Open your browser and access the application at:
	```
	http://localhost:3000
	```
