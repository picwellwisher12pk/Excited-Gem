# 💎 Excited Gem

Excited Gem is a high-performance, unified productivity browser extension designed for power users. More than just a tab manager, it serves as your digital workspace—combining advanced session management, YouTube media control, and secure cloud synchronization into a beautiful, lightning-fast interface.

---

## ✨ Key Features

### 🚀 Advanced Tab & Session Management
- **Visual Command Center**: A clean, real-time overview of all open tabs across all windows.
- **Smart Sessions**: Save entire windows or specific tab groups into persistent sessions. Declutter your browser and free up system memory instantly.
- **Library Management**: Organize saved sessions into custom categories for different projects or workflows.
- **Tab Actions**: Bulk close, mute, pin, or move tabs with precision.

### 📺 🎥 Enhanced YouTube Integration
- **Universal Remote**: Control YouTube playback (Play/Pause, Seek) directly from the extension sidebar or popup.
- **Shorts Support**: Full integration with YouTube Shorts for seamless browsing and control.
- **Metadata Fetching**: Automatically retrieves high-quality video titles and durations, even for unloaded tabs.
- **Narrowed Permissions**: Built with privacy in mind—host permissions are strictly limited to video-related URLs for maximum security.

### 🔖 Bookmark Power Tools
- **Deep Organization**: Move, rename, and categorize your browser bookmarks within a specialized productivity UI.
- **Quick Links**: Access your most important sites with a dedicated Bookmarks view.

### ☁️ Secure Cloud Sync (BYOK)
- **Google Drive Integration**: Back up your extension settings, sessions, and data to your personal Google Drive (App Data folder).
- **Privacy First**: Your data never touches our servers. Authentication happens directly with Google, and your data stays in your personal cloud.
- **BYOK (Bring Your Own Key)**: Support for custom YouTube API keys for advanced users who want full control over their data fetching.

### 🔍 Powerful Search & Filtering
- **Regex Support**: Find exactly what you need using advanced Regular Expression search across titles and URLs.
- **Live Filtering**: Filter tabs by audible status, pinned status, or specific domains in real-time.

### 🎨 Premium User Experience
- **Adaptive Layouts**: Seamlessly switch between **Sidebar (Side Panel)**, **Popup**, and **Full Tab** views.
- **Contextual UI**: Enhanced context menus and a **Floating Action Bar** for quick access to frequent tasks.
- **Modern Tech**: Built on React 18, TypeScript, Tailwind CSS, and optimized with the Bun runtime.

---

## 🛠 Tech Stack

- **Core**: [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [Ant Design](https://ant.design/) & [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Build System**: [Plasmo](https://docs.plasmo.com/) & [Bun](https://bun.sh/)

---

## 🔒 Privacy & Security

We believe your browsing data is yours alone.
- **Local-First**: All data is processed locally in your browser.
- **No Tracking**: No telemetry, no ads, and no third-party tracking.
- **Standardized Review**: Permissions are narrowed to satisfy the strictest Chrome Web Store security requirements.
- **[Privacy Policy](https://picwellwisher12pk.github.io/excited-gem/privacy.html)**: Transparent disclosure of all browser permissions.

---

## 🚀 Getting Started

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   bun install
   ```

### Development
Start the development server with hot-reloading:
```bash
bun dev
```

### Build
Generate a production-ready package for Chrome:
```bash
bun build
```
The output will be located in the `build/chrome-mv3-prod` directory.

---

## 📜 License

MIT License - feel free to use, modify, and contribute!

---
*Built with ❤️ for productive minds.*
