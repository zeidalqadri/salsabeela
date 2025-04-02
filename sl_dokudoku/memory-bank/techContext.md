# Technical Context

## Core Technologies

### Frontend
- **Next.js** - React framework for the application
- **TypeScript** - Type-safe JavaScript
- **TanStack Query** - Server state management
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI component library
- **Lucide Icons** - Icon library

### Drag and Drop
- **@dnd-kit/core** - Core drag and drop functionality
- **@dnd-kit/sortable** - Sortable functionality
- **@dnd-kit/utilities** - DnD utility functions

### Database
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Primary database

## Key Dependencies

### UI Components
```json
{
  "@radix-ui/react-dialog": "^1.0.0",
  "@radix-ui/react-dropdown-menu": "^2.0.0",
  "@radix-ui/react-label": "^2.0.0",
  "@radix-ui/react-toast": "^1.0.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0"
}
```

### Drag and Drop
```json
{
  "@dnd-kit/core": "^6.0.0",
  "@dnd-kit/sortable": "^7.0.0",
  "@dnd-kit/utilities": "^3.2.0"
}
```

### Data Management
```json
{
  "@tanstack/react-query": "^5.0.0",
  "@prisma/client": "^5.0.0"
}
```

### Document Processing
```json
{
  "litellm": "^1.2.0",
  "mem0": "^0.8.1",
  "langfuse": "^2.3.0",
  "serpapi": "^12.0.0"
}
```

### Type System
```json
{
  "@prisma/client": "^5.0.0",
  "zod": "^3.22.0"
}
```

## Component Structure

### Folder Management
- `src/components/folders/draggable-folder-tree.tsx`
  - Main folder tree component
  - Implements drag and drop
  - Handles folder operations

### Custom Hooks
- `src/hooks/use-folders.ts`
  - Folder data management
  - CRUD operations
  - Server state synchronization

### Types
- `FolderWithCounts` - Extended Prisma Folder type
- Custom interfaces for component props
- API request/response types

## API Structure

### Folder Endpoints
- All folder-related endpoints under `/api/folders`
- RESTful architecture
- Type-safe request/response handling
- Error handling with custom error types

### Added API Endpoints
- POST /api/process-document
- GET /api/context/memory
- POST /api/external/search

## Development Tools
- ESLint for code quality
- Prettier for code formatting
- TypeScript for type checking
- Next.js development server
- Prisma Studio for database management

## Environment Requirements
- Node.js 18+
- PostgreSQL 13+
- npm or yarn package manager
