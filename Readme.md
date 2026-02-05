# Hacker News Demo with @view-models/react

A Hacker News client built with React demonstrating the View Model pattern using [@view-models/core](https://github.com/nicktgn/view-models) and [@view-models/react](https://github.com/nicktgn/view-models).

## Features

- Browse top stories from Hacker News
- View story details and nested comments
- Pagination with "Load More"
- Responsive design

## Tech Stack

- **React 18** - UI library
- **@view-models/core** - View Model state management
- **@view-models/react** - React integration (`useModelState` hook)
- **@nano-router/react** - Client-side routing
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Vitest** - Testing framework

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## Project Structure

```
src/
├── api/           # Hacker News API client
├── components/    # React UI components
├── context/       # React Context for dependency injection
├── hooks/         # Custom hooks bridging components and view models
├── state/         # View models (business logic)
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Architecture

The project follows the **View Model pattern** for clean separation of concerns:

- **View Models** (`src/state/`) - Contain business logic and state management
- **Hooks** (`src/hooks/`) - Bridge view models to React components using `useModelState`
- **Components** (`src/components/`) - Pure presentation components

### Key View Models

- `HackerNewsModel` - Root model orchestrating all state
- `TopStoriesViewModel` - Manages paginated list of top stories
- `StoryViewModel` - Individual story data with lazy loading
- `CommentViewModel` - Individual comment data with lazy loading

## License

MIT License

Copyright (c) 2026 Sune Simonsen sune@we-knowhow.dk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
