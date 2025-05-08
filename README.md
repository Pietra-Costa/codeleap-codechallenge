# CodeLeap Frontend Challenge

[![Live Demo](https://img.shields.io/badge/demo-online-green?style=flat-square&logo=vercel)](https://codeleap-codechallenge.vercel.app/)
[![Built with React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev/)

<p align="center">
  <img src="https://github.com/user-attachments/assets/f864731a-daaf-4be0-ba19-31257273f7c7" width="100%" alt="github-header-image"/>
</p>


A modern, fully responsive frontend web application built with React + Vite for the CodeLeap technical challenge. This project replicates a basic social platform with post creation, authentication, interaction, and media handling.

**🔗 Live demo:**  
👉 [https://codeleap-codechallenge.vercel.app/](https://codeleap-codechallenge.vercel.app/)

---

## 🛠️ Tech Stack

- ⚛️ React + Vite  
- 🔐 Firebase Authentication  
- 🌐 CodeLeap API ([https://dev.codeleap.co.uk/careers/](https://dev.codeleap.co.uk/careers/))  
- 🎨 TailwindCSS 
- 📦 Axios  
- 🎞️ Framer Motion (for animations)

<p align="center">
  <img src="https://github.com/user-attachments/assets/e1e7dbec-e165-4c6c-82de-6752bdcda8b4" width="600" alt="Mockup 2"/>
</p>


---

## ✨ Features

- ✅ Create and delete posts  
- 💬 Add comments  
- ❤️ Like posts  
- 🧑‍🤝‍🧑 Mention users in comments (`@username`)  
- 🔐 Login with Google or email/password (via Firebase)  
- 📎 Media attachments  
- 🔄 Infinite scroll  
- 🔍 Sorting and filtering options  
- ✨ Pretty transitions and hover effects  
- 📱 Responsive layout (mobile-first)
- ⌨️ Use your favorite emojis in posts and comments!
- 🌙 Dark Mode
- 🌞 Light Mode

<p align="center">
  <img src="https://github.com/user-attachments/assets/6fbf74f7-9c08-4a05-ac28-2a5e7a947e77" width="600" alt="Mockup 1"/>
</p>


---

## 🔐 Test Credentials

You can log in with the following test account:

Email: codeleap@email.com <br/>
Password: codeleap123

Or create your **own** account using:
- Google login
- Any email/password

## Firebase Credentials (Local Environment)

To run this project locally, you **must have access to the Firebase credentials** used in the appropriate environments (development, staging, or production).

These credentials **must not be exposed publicly** or committed to the repository. Use a `.env.local` file (which should be ignored by Git) to store them securely.

### 📄 Example `.env.local`

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## ▶️ How to run the project

Clone the repository and run the project locally:

```bash
# Clone the repository
git clone https://github.com/your-username/codeleap-codechallenge.git

# Navigate into the directory
cd codeleap-codechallenge

# Install dependencies
npm install

# Start the development server
npm run dev
