# Contributing to LNMIIT Study Resources Management System

## Getting Started

### Prerequisites
- Git
- Docker
- Docker Compose
- MongoDB Compass

### Initial Setup

1. **Fork the Repository**
   ```bash
   # Navigate to https://github.com/SiddharthJiyani/LNMIIT-Study-Resources-Management-System
   # Click 'Fork' button to create a copy in your GitHub account
   ```

2. **Clone Your Forked Repository**
   ```bash
   # Replace {YOUR_USERNAME} with your GitHub username
   git clone https://github.com/{YOUR_USERNAME}/LNMIIT-Study-Resources-Management-System.git
   cd LNMIIT-Study-Resources-Management-System
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/SiddharthJiyani/LNMIIT-Study-Resources-Management-System.git
   
   # Verify remotes
   git remote -v
   ```

4. **Sync Upstream Changes**
   ```bash
   # Fetch changes from upstream
   git fetch upstream
   
   # Merge upstream main branch into your local main
   git checkout main
   git merge upstream/main
   ```

5. **Create a New Branch**
   ```bash
   # Create and switch to a new branch for your feature/fix
   git checkout -b feature/your-feature-name
   # OR
   git checkout -b bugfix/issue-description
   ```

6. **Set Up Environment**
   - Create `.env` file in the server directory
     ```bash
     cd server
     touch .env
     ```
     Add the following contents to the server/.env file:
     ```
     PORT=4000
     MONGODB_URL="mongodb://mongo:27017/LNMIIT_Study_Resources_Management_System"
     JWT_SECRET="12345"
     ```

   - Create `.env` file in the client directory
     ```bash
     cd ../client
     touch .env
     ```
     Add the following contents to the client/.env file:
     ```
     VITE_BACKEND_URL='http://localhost:4000'
     ```

7. **Start Development Environment**
   ```bash
   # Ensure Docker engine is running
   # Run this command from project root directory
   docker compose up -d
   ```

8. **Access Services**
   - Frontend: [http://localhost:5173/](http://localhost:5173/)
     - Log into the site using one of the below credentials:
         1. email: student@demo.in pass: student
         2. email: admin@demo.in pass: admin 
   - Backend: [http://localhost:4000/](http://localhost:4000/)

9. **Connecting to Database in MongoDB Compass**
   - Open MongoDB Compass
   - New Connection
   - Use the following connection string:
     ```
     mongodb://localhost:27019
     ```
   - Click "Connect"
   - Select the database: `LNMIIT_Study_Resources_Management_System`

10. **Monitoring**
    - View Docker logs using Docker Desktop
    - Or use command line:
      ```bash
      docker compose logs -f
      ```

11. **Development Features**
    - **Hot Reload Enabled**
      - Server: Nodemon watches for file changes and automatically restarts
      - Client: Vite provides instant hot module replacement (HMR)
      - No manual restart needed during development

12. **Commit and Push Changes**
    ```bash
    # Stage your changes
    git add .
    
    # Commit with a descriptive message
    git commit -m "feat: Add description of your changes"
    
    # Push to your branch
    git push origin feature/your-feature-name
    ```

13. **Create Pull Request**
    - Go to your forked repository on GitHub
    - Click "Pull Request" button
    - Select base repository: `SiddharthJiyani/LNMIIT-Study-Resources-Management-System`
    - Select base branch: `main`
    - Select head repository: `{YOUR_USERNAME}/LNMIIT-Study-Resources-Management-System`
    - Select head branch: `feature/your-feature-name`
    - Write a clear description of your changes
    - Submit Pull Request

## Contribution Guidelines
- Follow existing code style and conventions
- Write clear, concise commit messages
- Test thorougly before submitting PR
- Be respectful and collaborative

## Environment Variables Explanation
- **Server `.env`**:
  - `PORT`: The port on which the server will run (4000)
  - `MONGODB_URL`: Connection string for MongoDB database
  - `JWT_SECRET`: Secret key for JSON Web Token authentication

- **Client `.env`**:
  - `VITE_BACKEND_URL`: URL of the backend server for API calls

## Troubleshooting
- If Docker services fail to start, check:
  1. Docker is running
  2. All required ports are free
  3. `.env` files are correctly configured
- For database connection issues, verify MongoDB URI in Compass

## Hot Reload Note
Both server and client have hot reload enabled:
- Server uses Nodemon to watch for file changes
- Client uses Vite's Hot Module Replacement (HMR)
- Changes reflect immediately during development

## Questions?
If you have any questions, please open an issue or contact the project maintainers.

Happy Contributing!
