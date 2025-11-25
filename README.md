# Excited Gem

Excited Gem is a powerful Chrome extension designed to revolutionize your browsing experience. Inspired by "OneTab" but built for power users, it offers advanced tab management, session saving, and a beautiful, customizable interface.

## Features

### 🚀 Active Tabs Management
- **Visual Overview**: See all your open tabs in a clean, organized list.
- **Quick Actions**: Pin, mute, or close tabs directly from the list.
- **Drag & Drop**: Reorder tabs easily by dragging tabs in extension UI .
- **Search**: Instantly find tabs using text search or Regular Expressions. Search URLs, Titles, or by Audible or Pinned tabs.

### 💾 Sessions
- **Save for Later**: Save all your open tabs into a "Session" to declutter your browser and save memory.
- **Restore**: Restore individual tabs or entire sessions with a single click.
- **Manage**: Rename, delete, or organize your saved sessions.

### 🎨 Customizable Interface
- **Display Modes**: Choose how you want to interact with the extension:
    - **Sidebar**: Open in the browser side panel for side-by-side management.
    - **Popup**: Classic extension popup for quick access.
    - **New Tab**: Open as a full page in a new tab.
- **Themes**: Modern, clean design. Dark mode (Coming soon).
- **Compact View**: Toggle between compact and expanded views for session lists.


## Tech Stack

- **Framework**: [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Ant Design](https://ant.design/)
- **Build Tool**: [Plasmo](https://docs.plasmo.com/)
- **Package Manager**: [Bun](https://bun.sh/)

## Development

### Prerequisites
- [Bun](https://bun.sh/) installed.

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   bun install
   ```

### Running in Development Mode
To start the development server with hot-reloading:
```bash
bun dev
```
This will load the extension in a temporary Chrome instance.

### Building for Production
To build the extension for production (Chrome MV3):
```bash
bun build
```
The output will be in the `build/chrome-mv3-prod` directory.

## License

MIT License - feel free to use and modify!

---
*Built with ❤️ by Amir Hameed*
