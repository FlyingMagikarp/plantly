### Local Deployment and Testing Guide

Here is the information you requested regarding the local deployment of Plantly using Docker Compose.

#### 1. Command to Build and Start Deployment
Before running these commands, ensure you have created a `.env` file from the `.env.example` and set your PC's LAN IP address.

```powershell
# Build and start all services in the background
docker-compose up -d --build
```

#### 2. Local Testing Steps
Once the containers are up and running, follow these steps to verify the deployment:

- **From your PC:**
    - Open your browser and navigate to `http://localhost:3000` (Frontend).
    - To check if the backend is responding, go to `http://localhost:8081/api` (or whichever health endpoint is configured).
- **From your Phone (on the same Wi-Fi):**
    - Find your PC's LAN IP (e.g., `192.168.1.10`).
    - Open the browser on your phone and navigate to `http://192.168.1.10:3000`.
- **Verify Persistence:**
    - Add a plant or a species via the UI.
    - Run `docker-compose down`.
    - Run `docker-compose up -d`.
    - Refresh the page to ensure the data is still there.

#### 3. Commands to Rebuild/Restart After Coding Changes
If you make changes to the source code, you need to rebuild the specific service to see the updates in the container.

- **Rebuild and restart everything:**
  ```powershell
  docker-compose up -d --build
  ```
- **Rebuild only the Backend:**
  ```powershell
  docker-compose up -d --build backend
  ```
- **Rebuild only the Frontend:**
  ```powershell
  docker-compose up -d --build frontend
  ```
  *Note: Since the Frontend uses a build-time argument for the API URL, you must rebuild it if your `LAN_IP` changes.*

#### 4. When are the migrations applied?
Migrations are applied **automatically with every backend startup**.

- The `backend` service uses a `docker-entrypoint.sh` script (defined in `plantly-backend/Dockerfile`).
- This script runs `npm run migration:run` before starting the NestJS application (`npm run start:prod`).
- This ensures that your database schema is always up to date with the code version currently deployed in the container.