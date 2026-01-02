# Focus Flow

A modern, feature-rich productivity dashboard designed to help you stay focused and organized. Built with Next.js, TypeScript, and Tailwind CSS.

![Focus Flow](https://img.shields.io/badge/Focus%20Flow-Productivity%20Dashboard-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-blue?style=flat-square)

## ✨ Features

### 🕒 **Advanced Pomodoro Timer**
- **Multiple Animation Styles**: Choose from 4 beautiful timer visualizations
  - ⭕ **Circle**: Classic circular progress bar
  - ☕ **Coffee**: Animated coffee cup with steam
  - ▬ **Progress Bar**: Clean horizontal progress bar
  - 🥤 **Water Glass**: Realistic water glass with surface reflection
- **Pomodoro Modes**: Focus (25min), Short Break (5min), Long Break (15min)
- **Custom Duration**: Set any timer duration you need
- **Smart Notifications**: Audio alerts when timer completes
- **Seamless Mode Switching**: Switch between modes without losing progress

### 📝 **Smart Todo List**
- **Persistent Storage**: Tasks saved automatically to localStorage
- **Task Management**: Add, complete, and delete tasks
- **Visual Feedback**: Smooth animations for task interactions
- **Cross-session Persistence**: Your tasks remain across browser sessions

### 📅 **Interactive Calendar**
- **Date Selection**: Click to select dates
- **Clean Interface**: Modern calendar design
- **Future-ready**: Built for event integration

### 🕐 **Time & Location Display**
- **Live Clock**: Real-time time updates every second
- **Geolocation**: Automatic location detection
- **Timezone Aware**: Displays local time accurately

### 🎵 **Focus Music Player**
- **YouTube Integration**: Play focus music from YouTube
- **Background Playback**: Continue working while music plays
- **Volume Control**: Adjust audio levels
- **Playlist Support**: Queue multiple tracks

### 🌙 **Theme System**
- **Dark/Light Mode**: Automatic system preference detection
- **Smooth Transitions**: Elegant theme switching animations
- **Accessibility**: High contrast ratios for readability

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/focus-flow.git
   cd focus-flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:5001](http://localhost:5001)

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4+](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Theme Management**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Calendar**: [react-calendar](https://github.com/wojtekmaj/react-calendar)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Icons**: Heroicons (via Tailwind CSS)

## 📁 Project Structure

```
focus-flow/
├── app/
│   ├── components/
│   │   ├── calendar/          # Calendar component
│   │   ├── music/            # Music player with YouTube integration
│   │   ├── navbar/           # Navigation with theme toggle
│   │   ├── time/             # Time and location display
│   │   ├── timer/            # Pomodoro timer with animations
│   │   └── todo/             # Todo list with persistence
│   ├── globals.css           # Global styles and Tailwind imports
│   ├── layout.tsx            # Root layout with theme provider
│   └── page.tsx              # Main dashboard page
├── public/                   # Static assets
├── tailwind.config.js        # Tailwind CSS configuration
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## 🎯 Usage Guide

### Timer Features
1. **Select Animation Style**: Click the buttons (● ☕ ▬ 🥤) to choose your preferred timer visualization
2. **Choose Mode**: Select Focus, Short Break, or Long Break
3. **Custom Duration**: Enter any duration in minutes and click "Set Custom"
4. **Start/Pause**: Use the Start button to begin timing
5. **Music Integration**: Click "Show Music" to add background focus music

### Todo Management
1. **Add Tasks**: Type in the input field and press Enter or click Add
2. **Complete Tasks**: Click the checkbox to mark tasks as done
3. **Delete Tasks**: Click the X button to remove tasks
4. **Persistence**: Tasks are automatically saved and restored

### Theme Switching
- Click the sun/moon icon in the navbar to toggle between light and dark modes
- Theme preference is saved and persists across sessions

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server on port 5001
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

The app uses client-side APIs and doesn't require additional environment variables for basic functionality. For production deployment, consider:

- `NEXT_PUBLIC_YOUTUBE_API_KEY` - For enhanced YouTube integration (optional)

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Responsive Design

Focus Flow is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [YouTube API](https://developers.google.com/youtube) for music integration
- [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/) for geolocation services

## 📞 Support

If you find this project helpful, please give it a ⭐️ on GitHub!

For questions or issues, please open an issue on the [GitHub repository](https://github.com/yourusername/focus-flow/issues).

---

**Stay focused, stay productive!** 🚀
