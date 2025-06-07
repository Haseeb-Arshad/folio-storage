# Google Drive Alternative Backend

A powerful backend service built with Bun, Express, Supabase, and Pinata (IPFS) for file storage. This service provides a feature-rich alternative to Google Drive with secure file management, sharing capabilities, and IPFS-based decentralized storage.

## Features

- 🔐 **Authentication & User Management**: Secure user registration and login
- 📁 **File Operations**: Upload, download, update, and delete files and folders
- 🔍 **Search Capabilities**: Search files by name and content
- 🔄 **File Versioning**: Track file changes and history
- 🔗 **Sharing & Permissions**: Share files with specific permissions
- 📊 **Activity Tracking**: Log all file operations for audit trails
- 🗄️ **IPFS Storage**: Decentralized file storage using Pinata
- 🗃️ **Database Integration**: Robust data management with Supabase

## Tech Stack

- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript/TypeScript runtime
- **Framework**: Express.js - Web server framework
- **Database**: [Supabase](https://supabase.io) - PostgreSQL database with authentication
- **Storage**: [Pinata](https://pinata.cloud) - IPFS pinning service
- **Authentication**: JWT tokens + Supabase Auth

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.0.0+)
- [Supabase](https://supabase.com) account
- [Pinata](https://pinata.cloud) account

### Installation

1. Clone the repository and navigate to the backend directory
2. Install dependencies:

```bash
bun install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update the `.env` file with your Supabase and Pinata credentials

### Setting Up Supabase

1. Create a new Supabase project
2. Run the SQL commands from `src/config/schema.sql` in the Supabase SQL editor
3. Grab your Supabase URL and API keys from the project settings

### Setting Up Pinata

1. Create a Pinata account
2. Generate API keys from the developer settings
3. Add these keys to your `.env` file

## Running the Backend

### Development Mode

```bash
bun run dev
```

### Production Mode

```bash
bun run start
```

### Building for Production

```bash
bun run build
```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/settings` - Update user settings

### Files & Folders

- `POST /api/files/upload` - Upload a new file
- `POST /api/files/folders` - Create a new folder
- `GET /api/files/folders/:folderId?` - List files in a folder
- `GET /api/files/:fileId` - Get file details
- `PUT /api/files/:fileId` - Update file details
- `DELETE /api/files/:fileId` - Move file to trash
- `DELETE /api/files/:fileId/permanent` - Permanently delete file
- `POST /api/files/:fileId/share` - Share file with another user
- `GET /api/files/:fileId/download` - Download a file
- `GET /api/files/:fileId/activity` - Get file activity logs
- `GET /api/files/search` - Search for files

## Project Structure

```
/backend
├── src/                  # Source code
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic services
│   ├── utils/            # Utility functions
│   └── index.ts          # Main entry point
├── .env.example          # Environment variables template
├── package.json          # Project dependencies
├── README.md             # Project documentation
└── tsconfig.json         # TypeScript configuration
```

## License

MIT

