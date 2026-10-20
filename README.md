# BUTTAA - Smart Agricultural Marketplace & Farm Management Hub

A modern, full-stack agricultural management platform and marketplace built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Express**, and **Google Gemini 2.5**.

---

## 🚀 Running Locally with VS Code

You can run this application locally on your machine with **Visual Studio Code** and test it on `http://localhost:3000`.

### 1. Prerequisites

Before starting, ensure you have the following installed on your computer:

- **Node.js**: Version 20.x or 22.x LTS ([Download Node.js](https://nodejs.org/))
- **npm** (bundled with Node.js) or **pnpm** / **bun**
- **VS Code**: ([Download Visual Studio Code](https://code.visualstudio.com/))
- **Git** (optional, recommended for version tracking)

---

### 2. Export / Get the Project Files

1. **From Google AI Studio**:
   - In the top right corner of the AI Studio interface, click on the **Export** or **GitHub** button to download the repository as a `.zip` archive or sync to GitHub.
   - Extract the downloaded `.zip` file into a directory of your choice (e.g. `~/projects/buttaa-app` or `C:\projects\buttaa-app`).
2. **Open in VS Code**:
   - Launch VS Code.
   - Go to **File** > **Open Folder...** (or on macOS: **File** > **Open...**).
   - Select your project folder.
   - Alternatively, open your terminal, navigate to the directory, and run:
     ```bash
     code .
     ```

---

### 3. Install Dependencies

Open the integrated terminal in VS Code:
- Press ``Ctrl + ` `` (or ``Cmd + ` `` on macOS), or go to **Terminal** > **New Terminal**.
- Run:
  ```bash
  npm install
  ```
  This will install all necessary packages (`react`, `express`, `@google/genai`, `lucide-react`, `tailwindcss`, `d3`, etc.).

---

### 4. Configure Environment Variables

1. Copy the example environment file:
   - **Linux / macOS**:
     ```bash
     cp .env.example .env
     ```
   - **Windows (PowerShell)**:
     ```powershell
     Copy-Item .env.example .env
     ```
   - Or simply duplicate `.env.example` in VS Code and rename it to `.env`.

2. Open `.env` and fill in your Gemini API key (optional for UI exploration, required for AI agronomy advice and smart diagnosis):
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=3000
   ```
   > 💡 You can generate a free Gemini API key at [Google AI Studio](https://aistudio.google.com/app/apikey).

---

### 5. Start the Development Server

In your VS Code terminal, start the app:

```bash
npm run dev
```

You will see:
```text
BUTTAA Server running on http://localhost:3000
```

Now open your web browser (Chrome, Firefox, Edge, Safari) and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🛠 Available NPM Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs the full-stack server (`server.ts` with Vite development middleware) with instant hot reloading |
| `npm run build` | Compiles frontend assets into `dist/` and bundles `server.ts` into `dist/server.cjs` |
| `npm run start` | Runs the production-optimized build using Node.js |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) to verify code integrity |
| `npm run preview` | Previews the compiled Vite distribution |

---

## 📂 Project Architecture

```text
├── src/
│   ├── components/         # Reusable UI modules (Crop Rotation Planner, Calendar, Charts, etc.)
│   ├── screens/            # Application views (Farmer Dashboard, Task Logs, Marketplace, etc.)
│   ├── data/               # Realistic seed data (crops, soil profiles, tasks, orders)
│   ├── types.ts            # TypeScript interfaces and domain models
│   ├── App.tsx             # Root React application & state controller
│   ├── main.tsx            # React client mount point
│   └── index.css           # Global Tailwind CSS styling
├── server.ts               # Express server with Gemini AI endpoints + Vite dev middleware
├── package.json            # Node.js dependencies & scripts
├── vite.config.ts          # Vite frontend configuration
├── tsconfig.json           # TypeScript configuration
├── .env.example            # Environment variables template
└── README.md               # Local development setup guide
```

---

## 💡 Recommended VS Code Extensions

For the best development experience in VS Code, install:
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) - Autocomplete for utility classes.
- **ESLint** (`dbaeumer.vscode-eslint`) - Code hygiene and syntax warnings.
- **Prettier - Code formatter** (`esbenp.prettier-vscode`) - Automatic code formatting.
- **TypeScript and JavaScript Language Features** (built-in).
