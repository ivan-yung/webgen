# WebGen Frontend

WebGen is a React-based frontend for the WebProducer project, designed to streamline web content generation and management. This repository contains the source code for the user interface, built with modern web technologies.

## Features
- Intuitive UI for web content creation
- Integration with backend APIs
- Responsive design
- Modular component architecture

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/webgen.git
   cd webgen/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Development Server
```bash
npm start
# or
yarn start
```
The app will be available at `http://localhost:3000`.

### Building for Production
```bash
npm run build
# or
yarn build
```
The production-ready files will be in the `build/` directory.

## Project Structure
```
frontend/
├── public/         # Static assets
├── src/            # Source code
│   ├── components/ # React components
│   ├── pages/      # Page components
│   ├── api/        # API utilities
│   └── ...
├── package.json    # Project metadata and scripts
└── README.md       # Project documentation
```
