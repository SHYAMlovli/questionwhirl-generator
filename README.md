# Question Paper Generator

A web application for generating question papers efficiently.

## Features

- Create and manage questions
- Generate question papers
- Select questions based on difficulty levels
- Export to Word document format
- User authentication
- MongoDB integration

## Setup Instructions

1. Clone the repository
```bash
git clone <your-repository-url>
cd <repository-name>
```

2. Install dependencies
```bash
npm install
```

3. Environment Setup
- Copy `.env.example` to `.env`
- Update the environment variables with your values

4. Start the development server
```bash
# Start the frontend
npm run dev

# Start the backend (in a separate terminal)
node src/server/mongodb.js
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Environment Variables

The following environment variables are required:

- `VITE_MONGODB_URI`: MongoDB connection string
- `VITE_API_URL`: Backend API URL
- `VITE_SUPABASE_URL`: Supabase project URL (if using Supabase)
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key (if using Supabase)

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- MongoDB
- Express.js

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request