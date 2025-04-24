# Travel Story App

A full-stack web application for documenting travel experiences.

## Demo

https://github.com/user-attachments/assets/2b67300e-6644-49f6-ace4-49bdfcdb828f

## Team Members

- **Ronith HU** 

## ✨ Features

- 📝 Create, edit, and manage travel stories
- 🖼️ Upload images for each story
- 📍 Interactive map with story markers
  - View stories by location
  - Click markers to read associated stories
  - Visual representation of your travel journey
- ⭐ Favorite stories for quick access
- 🤖 AI-powered story enhancement
- 🔍 Search stories by title, content, or location
- 📱 Responsive design for all devices

## 🛠️ Tech Stack

**Frontend:**
- React + Vite
- Tailwind CSS
- React Leaflet

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- Google Gemini API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/rkrypt01/TravelStory.git
cd TravelStory
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Configure backend environment variables
```bash
# Modify .env file in backend directory
ACCESS_TOKEN_SECRET=your_secret_key
MONGODB_URI=your_mongodb_connection_string
```

4. Install frontend dependencies
```bash
cd frontend
npm install
```

5. Configure frontend environment variables
```bash
# Modify .env file in frontend directory
VITE_GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key
```


### Running the App

1. Start the backend server
```bash
cd backend
npm start
```

2. Start the frontend development server
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173`


## 🤝 Contributing

Contributions welcome! Open issues and pull requests.
