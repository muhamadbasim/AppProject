# API Documentation

The backend is built with **Hono** and runs as a **Cloudflare Worker**.

**Production URL**: `https://project-control-center-api.perfectmoney7.workers.dev`

**Base Path**: `/api`

## Endpoints

### Tasks

#### Get All Tasks
Retrieves a list of all tasks.

- **URL**: `/api/tasks`
- **Method**: `GET`
- **Response**: `200 OK`
    ```json
    [
      {
        "id": 1,
        "name": "UX Research",
        "status": "Done",
        "progress": 100
      },
      ...
    ]
    ```

#### Get Task by ID
Retrieves details for a specific task.

- **URL**: `/api/tasks/:id`
- **Method**: `GET`
- **URL Params**: `id=[integer]`
- **Success Response**: `200 OK`
    ```json
    {
      "id": 1,
      "name": "UX Research",
      ...
    }
    ```
- **Error Response**: `404 Not Found`
    ```json
    { "error": "Task not found" }
    ```

#### Create New Task
Adds a new task to the system.

- **URL**: `/api/tasks`
- **Method**: `POST`
- **Data Params**: `JSON`
    ```json
    {
      "name": "New Feature Dev",
      "status": "Pending",
      "progress": 0
    }
    ```
- **Success Response**: `201 Created`
    ```json
    {
      "id": 5,
      "name": "New Feature Dev",
      ...
    }
    ```

---

### Projects

#### Get All Projects
Retrieves a list of all projects.

- **URL**: `/api/projects`
- **Method**: `GET`
- **Response**: `200 OK`
    ```json
    [
      { "id": 1, "name": "WEB_REDESIGN_P1", "status": "In Progress", "progress": 65 },
      ...
    ]
    ```

#### Get Project by ID
Retrieves details for a specific project including its tasks.

- **URL**: `/api/projects/:id`
- **Method**: `GET`
- **Success Response**: `200 OK`
    ```json
    {
      "id": 1,
      "name": "WEB_REDESIGN_P1",
      "tasks": [...]
    }
    ```

---

### Dashboard

#### Get Dashboard Metrics
Retrieves aggregated metrics for the dashboard.

- **URL**: `/api/dashboard/metrics`
- **Method**: `GET`
- **Response**: `200 OK`
    ```json
    {
      "activeProjects": 5,
      "pendingReview": 1,
      "tasksCompleted": 2,
      "systemLoad": "52%",
      "totalTasks": 8,
      "totalProjects": 5
    }
    ```

## Development

To run the API server locally:
```bash
bun run api:dev
```
The API will be available at `http://localhost:3000`.
