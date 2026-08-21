# 🎓 SPM System — Student Project Management System

> A full-stack web-based **Student Project Management (SPM) System** designed to simplify and digitize the complete academic project management workflow between **Students, Guides, Coordinators, and Administrators**.

The system provides a centralized platform for project proposal submission, guide supervision, progress tracking, document submission, feedback, approvals, and project management.

---

## 🚀 Features

### 👨‍🎓 Student

* Register and login securely
* Create and manage project groups
* Submit project proposals
* Select/request project guides
* Upload project-related documents
* Track project approval status
* Submit weekly progress updates
* View guide feedback
* Submit project milestones
* Track project progress

### 👨‍🏫 Guide

* View assigned student groups
* Review project proposals
* Accept or reject project requests
* Monitor student project progress
* Review weekly progress reports
* Provide feedback to students
* Review project submissions
* Track assigned projects

### 👨‍💼 Coordinator

* Manage academic project workflow
* Manage students and guides
* Review project proposals
* Approve or reject projects
* Assign/manage project guides
* Track project progress
* Manage academic years
* Review project submissions

### 🛡️ Administrator

* Manage users
* Manage students, guides, and coordinators
* Manage project groups
  
---

## ✨ Key Highlights

* 🔐 Role-based authentication and authorization
* 👥 Student group management
* 📋 Project proposal management
* 👨‍🏫 Guide assignment and supervision
* 📊 Project progress tracking
* 📝 Weekly progress updates
* 📁 Document and file uploads
* 💬 Guide feedback system
* ✅ Project approval workflow
* 📱 Responsive user interface
* 🔒 Secure password handling
* ⚡ RESTful API architecture

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* JavaScript
* Axios
* Shadcn/UI

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* Multer
* OpenRouter API

### Development Tools

* Git & GitHub
* MongoDB Compass
* Visual Studio Code
* Postman

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/SPM-System.git
```

Navigate into the project:

```bash
cd SPM-System
```

---

## 2. Setup the Client

Navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create your environment file if required:

```bash
.env
```

Configure the required frontend environment variables.

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 3. Setup the Server

Open another terminal and navigate to:

```bash
cd SPM-System/server
```

Install backend dependencies:

```bash
npm install
```

Create:

```text
.env
```

Add your backend configuration.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

The API will normally run at:

```text
http://localhost:5000
```

> Environment variable names may differ depending on your current server configuration. Use the variable names defined in your actual backend code.

---

# 👥 User Roles

| Role              | Responsibilities                                                    |
| ----------------- | ------------------------------------------------------------------- |
| 👨‍🎓 Student     | Create projects, submit proposals, upload documents, track progress |
| 👨‍🏫 Guide       | Supervise projects, review progress, provide feedback               |
| 👨‍💼 Coordinator | Approve projects, manage guides and academic workflow               |
| 🛡️ Admin         | Manage users and overall system data                                |

---

# 🔒 Security

The system implements several security mechanisms, including:

* JWT-based authentication
* Password hashing using bcrypt
* Role-based authorization
* Protected API routes
* Environment variable configuration
* Secure file upload handling
* Input validation

---

# 🧪 Testing API

You can test backend APIs using:

* Postman
* Thunder Client

> API routes may differ depending on the current implementation.

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/your-feature
```

3. Make your changes
4. Commit your changes

```bash
git commit -m "Add your feature"
```

5. Push the branch

```bash
git push origin feature/your-feature
```

6. Create a Pull Request

---

# 📜 License

This project was developed as an academic project.

You may modify and use the project for learning and educational purposes.

---

# 👨‍💻 Developer

**Ansh Parmar**

Computer Science Engineer | Full-Stack Developer

Interested in:

* MERN Stack
* .NET
* Laravel
* AI-powered applications
* Full-stack web development

---

⭐ If you find this project useful, consider giving the repository a **star**!
