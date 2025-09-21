# Weather Chat App 🌤️

A React-based chat application that provides real-time weather information using a conversational interface. Users can type questions about the weather, and the app responds using a backend API integration.

LIVE_DEMO https://weather-chat-app-git-main-shronghanates-projects.vercel.app?_vercel_share=NGoutYP6amx02AD0xvtNWPKGRwWsp9nV 

---

## Features

- User-friendly chat interface built with **React**.
- Real-time weather responses using **Mastra API** .
- Persistent chat history stored in **localStorage**.
- Auto-scroll to latest messages, with a "Scroll to Latest" button.
- Clean UI with a fixed input box for smooth chatting.
- Error handling and loading states for better UX.

---

### Installation

# Clone the repository
git clone https://github.com/Shronghanate/weather-chat-app.git

cd weather-chat-app

# Install dependencies
npm install

# Setup Environment Variables
1.Copy .env.example to .env.local (or .env)

cp .env.example .env.local

2.Open .env.local and replace the placeholder values with your actual credentials:

VITE_MASTRA_API_URL=your_api_url_here
VITE_MASTRA_API_KEY=your_api_key_here

# Run the Development Server

npm run dev



# Technologies Used

React - Frontend UI
JavaScript (ES6+) - Logic & state management
Mastra API / Weather API - Weather data
Tailwind CSS - Styling
LocalStorage - Persistent chat history
Vite - Development server & bundler


