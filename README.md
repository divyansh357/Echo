# Echo

Echo is an intelligent task management and productivity application that helps you organize your work, track priorities, and stay focused on what matters most.

## Features

- **Smart Task Management**: Organize tasks by priority (Critical, High, Medium, Low)
- **AI-Powered Assistant**: Get intelligent suggestions and insights powered by Google Gemini
- **Activity Stream**: Track all your activities from integrated sources
- **Analytics Dashboard**: Visualize your productivity patterns and progress
- **Multiple Integrations**: Connect with Gmail, Google Calendar, Slack, GitHub, and more
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing
- **Day Planner**: Plan and schedule your daily tasks efficiently
- **Achievements**: Track your productivity milestones

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Lucide React icons
- **Charts**: Recharts for data visualization
- **AI**: Google Generative AI (Gemini)
- **Styling**: Modern CSS with theme support

## Prerequisites

- Node.js (v16 or higher)
- A Google Gemini API key

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

## Project Structure

```
echo_focus/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard interface
│   ├── LandingPage.tsx  # Landing page
│   ├── LoginScreen.tsx  # User authentication
│   ├── ChatAssistant.tsx # AI chat interface
│   ├── Analytics.tsx    # Analytics visualization
│   └── ...
├── services/           # Service layer
│   ├── geminiService.ts # AI integration
│   └── integrationService.ts # External integrations
├── App.tsx            # Main application component
├── ThemeContext.tsx   # Theme management
├── types.ts           # TypeScript type definitions
└── constants.ts       # Application constants
```

## How It Works

1. **Landing Page**: Welcome screen with app introduction
2. **Login**: Enter your name to get started
3. **Permissions**: Connect your preferred integrations (Gmail, Calendar, Slack, etc.)
4. **Dashboard**: Access your personalized productivity hub with:
   - Priority-based task cards
   - Activity stream from all connected sources
   - AI chat assistant for smart suggestions
   - Analytics and achievements tracking

## AI Studio

View and manage your app in AI Studio: https://ai.studio/apps/drive/1C19QeAL0khkLXBAr9hVkxf-ijY-qQvDT

## License

This project is private and not licensed for public use.

## Contributing

This is a private project. For questions or contributions, please contact the project maintainers.
