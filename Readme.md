# Echo - AI-Powered Productivity Dashboard

Echo is an intelligent productivity platform that helps you stay focused and organized by integrating your tasks, calendar, emails, and messages into a unified AI-powered dashboard. Built with React, TypeScript, and powered by Google's Gemini AI.

## ✨ Features

- **🎯 Smart Dashboard** - Unified view of all your productivity streams
- **🤖 AI Chat Assistant** - Powered by Gemini AI to help you plan, prioritize, and stay on track
- **📊 Analytics & Insights** - Visualize your productivity patterns and achievements
- **📅 Day Planner** - Intelligent daily planning with AI suggestions
- **🏆 Achievements System** - Gamified productivity tracking with milestones
- **🔗 Multi-Platform Integration** - Connect Gmail, Google Calendar, Slack, and GitHub
- **⚡ Real-time Updates** - Stay synced across all your productivity tools
- **🎨 Beautiful UI** - Modern, responsive design with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/divyansh357/Echo.git
   cd Echo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the app in action!

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **AI Integration**: Google Gemini AI
- **Charts**: Recharts
- **Icons**: Lucide React
- **Styling**: CSS3 with custom animations
- **Date Handling**: date-fns

## 📁 Project Structure

```
focus_flow/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard view
│   ├── ChatAssistant.tsx # AI chat interface
│   ├── Analytics.tsx    # Analytics dashboard
│   ├── AchievementsWidget.tsx
│   ├── DayPlannerModal.tsx
│   ├── PriorityCard.tsx
│   ├── StreamItem.tsx
│   └── ...
├── services/           # API and integration services
│   ├── geminiService.ts    # Gemini AI integration
│   └── integrationService.ts # External API integrations
├── App.tsx            # Main application component
├── types.ts           # TypeScript type definitions
├── constants.ts       # App constants
└── package.json       # Project dependencies
```

## 🔑 API Integrations

Echo supports connections to:
- **Gmail** - Email tracking and quick actions
- **Google Calendar** - Event scheduling and reminders
- **Slack** - Team communication monitoring
- **GitHub** - Repository and issue tracking

## 🎮 Usage

1. **Login** - Enter your name to get started
2. **Grant Permissions** - Connect your productivity tools (Gmail, Calendar, Slack, GitHub)
3. **Dashboard** - View your unified productivity stream
4. **Chat with AI** - Ask Echo to help plan your day, prioritize tasks, or provide insights
5. **Track Progress** - Monitor your achievements and productivity analytics

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Links

- **AI Studio App**: https://ai.studio/apps/drive/1C19QeAL0khkLXBAr9hVkxf-ijY-qQvDT
- **Repository**: https://github.com/divyansh357/Echo

## 👨‍💻 Developer

Created with ❤️ by [divyansh357](https://github.com/divyansh357)

---

**Note**: Make sure to keep your API keys secure and never commit them to version control!
