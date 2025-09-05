#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Advisory Board Project Setup');
console.log('================================\n');

// Helper to create directories
function mkdirSync(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created: ${dir}`);
    }
}

// Helper to write files
function writeFileSync(filePath, content) {
    const dir = path.dirname(filePath);
    mkdirSync(dir);
    fs.writeFileSync(filePath, content);
    console.log(`📄 Created: ${filePath}`);
}

// Create all directories
const dirs = [
    'app',
    'app/api',
    'app/api/chat',
    'app/api/memory/save',
    'app/api/memory/list', 
    'app/api/chats',
    'app/api/chats/[id]',
    'components',
    'components/ui',
    'lib',
    'lib/db',
    'public'
];

dirs.forEach(mkdirSync);

console.log('\n📝 Creating configuration files...\n');

// Create package.json
writeFileSync('package.json', JSON.stringify({
    name: "advisory-board",
    version: "1.0.0",
    private: true,
    scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint",
        "db:generate": "drizzle-kit generate:sqlite",
        "db:migrate": "tsx lib/db/migrate.ts"
    },
    dependencies: {
        "next": "14.1.0",
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "openai": "^4.26.0",
        "drizzle-orm": "^0.29.3",
        "better-sqlite3": "^9.2.2",
        "zustand": "^4.5.0",
        "lucide-react": "^0.311.0",
        "next-themes": "^0.2.1",
        "date-fns": "^3.3.1",
        "react-markdown": "^9.0.1",
        "remark-gfm": "^4.0.0",
        "tailwind-merge": "^2.2.0",
        "clsx": "^2.1.0",
        "class-variance-authority": "^0.7.0",
        "@radix-ui/react-dialog": "^1.0.5",
        "@radix-ui/react-dropdown-menu": "^2.0.6",
        "@radix-ui/react-label": "^2.0.2",
        "@radix-ui/react-scroll-area": "^1.0.5",
        "@radix-ui/react-select": "^2.0.0",
        "@radix-ui/react-separator": "^1.0.3",
        "@radix-ui/react-slot": "^1.0.2",
        "@radix-ui/react-switch": "^1.0.3",
        "@radix-ui/react-tabs": "^1.0.4",
        "@radix-ui/react-toast": "^1.1.5",
        "react-resizable-panels": "^1.0.7",
        "tailwindcss-animate": "^1.0.7"
    },
    devDependencies: {
        "typescript": "^5.3.3",
        "@types/node": "^20.11.5",
        "@types/react": "^18.2.48",
        "@types/react-dom": "^18.2.18",
        "@types/better-sqlite3": "^7.6.8",
        "tailwindcss": "^3.4.1",
        "autoprefixer": "^10.4.17",
        "postcss": "^8.4.33",
        "drizzle-kit": "^0.20.12",
        "tsx": "^4.7.0",
        "eslint": "^8.56.0",
        "eslint-config-next": "14.1.0"
    }
}, null, 2));

// Create .env.local.example
writeFileSync('.env.local.example', 'OPENAI_API_KEY=sk-your-openai-api-key-here\nDATABASE_URL=file:./data.db');

// Create .gitignore
writeFileSync('.gitignore', `# dependencies
/node_modules
/.pnp
.pnp.js

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# database
*.db
*.db-journal
/drizzle`);

// Create next.config.js
writeFileSync('next.config.js', `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3'],
  },
}

module.exports = nextConfig`);

// Create tsconfig.json
writeFileSync('tsconfig.json', JSON.stringify({
    compilerOptions: {
        target: "es5",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./*"] }
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    exclude: ["node_modules"]
}, null, 2));

// Create tailwind.config.ts
writeFileSync('tailwind.config.ts', `import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config`);

// Create postcss.config.js
writeFileSync('postcss.config.js', `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`);

// Create drizzle.config.ts
writeFileSync('drizzle.config.ts', `import type { Config } from 'drizzle-kit'

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  driver: 'better-sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL || './data.db',
  },
} satisfies Config`);

// Create components.json
writeFileSync('components.json', JSON.stringify({
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}, null, 2));

console.log('\n📝 Creating app files...\n');

// Create app/layout.tsx
writeFileSync('app/layout.tsx', `import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Advisory Board',
  description: 'AI Leadership Coaching',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`);

// Create app/globals.css
writeFileSync('app/globals.css', `@tailwind base;
@tailwind components;
@tailwind utilities;`);

// Create app/page.tsx
writeFileSync('app/page.tsx', `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Advisory Board</h1>
      <p className="mt-4">AI Leadership Coaching Platform</p>
      <p className="mt-8 text-gray-600">Setup in progress...</p>
    </main>
  )
}`);

// Create basic lib/utils.ts
writeFileSync('lib/utils.ts', `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`);

console.log('\n✅ Basic project structure created!');
console.log('\n📋 Next steps:');
console.log('1. Run: npm install');
console.log('2. Create .env.local from .env.local.example');
console.log('3. Add your OpenAI API key');
console.log('4. Continue adding component files');
console.log('\n🚀 Project setup complete!');
