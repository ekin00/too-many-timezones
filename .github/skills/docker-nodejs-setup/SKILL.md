---
name: docker-nodejs-setup
description: Complete Node.js Docker setup and deployment workflow. Use when asked to create a Node.js Express Docker application, set up Docker for Node.js projects, build and run Node containers, automate containerization, or follow the Docker + VS Code Node.js example tutorial. Provides end-to-end automation from project creation through containerized app deployment with Express on port 3000.
license: MIT
---

# Docker Node.js Setup Skill

Complete automated setup and deployment of a Node.js Express application in Docker, following Docker best practices and the official tutorial workflow.

## When to Use This Skill

Use when:
- User asks: "create Node Docker app", "set up Docker for Node.js", "Docker Node Express example"
- Building a Node.js project containerized from scratch
- Learning Docker with Node.js/Express
- Following "Master Docker and VS Code" tutorial
- Automating Node.js container workflows
- Setting up development environment with Docker

## Prerequisites

### Required Tools
- **Docker Desktop** (v4.37+) or Docker Engine (v27.5+)
- **Node.js** (v18+, recommended v20+)
- **npm** (v9+, installed with Node.js)
- **VS Code** (v1.96+)
- **VS Code Docker Extension** (install via Extensions marketplace)

### System Requirements
- Port 3000 available (or alternative port)
- 2GB+ free disk space for Docker images
- Docker daemon running

## Quick Architecture Overview

```
┌─────────────────────────────────────────────────┐
│  Local Machine (Port 3000)                      │
│                                                 │
│  ┌─────────────────────────────────────────┐  │
│  │  Docker Container (Port 3000 internal)  │  │
│  │                                         │  │
│  │  ┌──────────────────────────────────┐  │  │
│  │  │  Node.js + Express Server        │  │  │
│  │  │  (index.js on port 3000)         │  │  │
│  │  └──────────────────────────────────┘  │  │
│  │                                         │  │
│  │  Base: node:23.6.1-alpine              │  │
│  └─────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Step-by-Step Workflow

### Phase 1: Project Setup (5 min)

**Step 1.1: Create Project Directory**

```bash
mkdir node-docker-app
cd node-docker-app
```

**Step 1.2: Initialize Node.js Project**

```bash
npm init -y
```

Creates `package.json` with default metadata. Expected output:
```json
{
  "name": "node-docker-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

**Step 1.3: Install Express Framework**

```bash
npm install express
```

This:
- Downloads Express from npm registry
- Extracts to `node_modules/` directory
- Updates `package.json` with `express` as dependency
- Creates `package-lock.json` for version pinning

Verify: Check that `node_modules/express` exists and `package.json` has `"express"` in dependencies.

### Phase 2: Application Code (5 min)

**Step 2.1: Create Express Server (index.js)**

Create file `index.js` in project root with this content:

```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Node + Docker + VS Code!');
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
```

**Explanation:**
- `require('express')` - Imports Express library
- `app = express()` - Creates Express application instance
- `app.get('/', ...)` - Defines HTTP GET route for root path
- `res.send(...)` - Sends HTML response to browser
- `app.listen(port, ...)` - Starts server on port 3000

**Step 2.2: Test Locally (Optional)**

Before containerizing, verify it works:

```bash
node index.js
```

Expected terminal output:
```
App running on port 3000
```

Open browser: http://localhost:3000
Expected page: `Hello from Node + Docker + VS Code!`

Stop with: `Ctrl+C`

### Phase 3: Containerization (10 min)

**Step 3.1: Create Dockerfile**

Create file `Dockerfile` (no extension) in project root with this content:

```dockerfile
# Use a lightweight Node.js Alpine Linux image
FROM node:23.6.1-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy entire project files
COPY . .

# Expose port 3000
EXPOSE 3000

# Define startup command
CMD ["node", "index.js"]
```

**Line-by-Line Explanation:**

| Line | Purpose | Details |
|------|---------|---------|
| `FROM node:23.6.1-alpine` | Base image | Lightweight Linux + Node.js v23.6.1 |
| `WORKDIR /usr/src/app` | Container path | All commands run in this directory |
| `COPY package*.json ./` | Copy dependencies config | `package*` matches both package.json and package-lock.json |
| `RUN npm install` | Install dependencies | Creates node_modules inside container |
| `COPY . .` | Copy project code | Copies index.js and other files |
| `EXPOSE 3000` | Metadata | Documents that app uses port 3000 (doesn't actually open it) |
| `CMD ["node", "index.js"]` | Startup command | Runs when container starts |

**Why This Order Matters (Layer Caching):**
- If code changes, only `COPY . .` and `CMD` re-execute
- `RUN npm install` is cached if `package.json` hasn't changed
- Rebuilds are 10x faster with this layering

**Step 3.2: Build Docker Image**

```bash
docker build -t node-docker-app .
```

**Breakdown:**
- `docker build` - Creates image from Dockerfile
- `-t node-docker-app` - Tags image with name `node-docker-app`
- `.` - Dockerfile location (current directory)

**Expected output (first build takes 1-2 min):**
```
[1/7] FROM node:23.6.1-alpine
[2/7] WORKDIR /usr/src/app
[3/7] COPY package*.json ./
[4/7] RUN npm install
...
Successfully tagged node-docker-app:latest
```

**Verify image created:**
```bash
docker images
```

Should show: `node-docker-app    latest    <IMAGE_ID>    ...`

**Step 3.3: Run Container**

```bash
docker run -p 3000:3000 node-docker-app
```

**Breakdown:**
- `docker run` - Creates and starts a new container
- `-p 3000:3000` - Port mapping: local machine port 3000 → container port 3000
- `node-docker-app` - Image to use

**Expected output:**
```
App running on port 3000
```

Container is now running in foreground. Terminal shows logs from `console.log()` inside container.

**Step 3.4: Test Application**

Open browser: http://localhost:3000

You should see:
```
Hello from Node + Docker + VS Code!
```

Terminal should show access logs (if configured in Express).

**Step 3.5: Stop Container**

In terminal running the container, press: `Ctrl+C`

Or in another terminal:
```bash
docker ps                              # Find container ID
docker stop <CONTAINER_ID>
```

### Phase 4: Docker Extension Management (Optional)

**In VS Code Docker Extension:**

1. Click Docker icon (whale) in left sidebar
2. Expand "Containers" section
3. You'll see `node-docker-app` container in stopped state
4. Right-click options:
   - **Start** - Restart the container
   - **View Logs** - See console output
   - **Attach Terminal** - Shell into container
   - **Remove** - Delete container
   - **Inspect** - View configuration details

## Troubleshooting Guide

| Problem | Cause | Solution |
|---------|-------|----------|
| `docker: command not found` | Docker not in PATH or not installed | Install Docker Desktop from docker.com/products/docker-desktop; restart terminal |
| Port 3000 already in use | Another app using port 3000 | Kill existing: `lsof -i :3000` (Mac/Linux) or use `-p 3001:3000` instead |
| `npm: command not found` | Node.js not installed or not in PATH | Install from nodejs.org; restart terminal |
| Build fails: "Cannot find module 'express'" | npm install didn't work | Check internet connection; try `npm cache clean --force` and rebuild |
| Container exits immediately | App crashed inside container | Run interactively: `docker run -it node-docker-app /bin/sh` and test manually |
| `"index.js" not found` | COPY command didn't work | Verify index.js exists in project root; check COPY path syntax |
| Permission denied (Linux) | Docker daemon requires sudo | Add user to docker group: `sudo usermod -aG docker $USER` |
| Browser shows "Cannot reach" | Port mapping wrong or container not running | Check: `docker ps` shows running container; try `localhost:3000` not `127.0.0.1:3000` |

## Verification Checklist

After completion, verify each step:

- [ ] Project directory `node-docker-app` created
- [ ] `package.json` exists with "express" dependency
- [ ] `index.js` contains Express server code
- [ ] `Dockerfile` created with all 7 lines
- [ ] `docker build` completed successfully
- [ ] `docker images` shows `node-docker-app` image
- [ ] `docker run` starts without errors
- [ ] Browser shows "Hello from Node + Docker + VS Code!"
- [ ] Container shows "App running on port 3000" in logs
- [ ] Docker extension shows container in Containers list

## Best Practices Applied

✅ **Alpine Base Image** - node:23.6.1-alpine is 150MB vs 1GB+ for full Node.js  
✅ **Layer Caching** - package.json copied before code; avoids rebuilding deps on code changes  
✅ **WORKDIR Isolation** - /usr/src/app prevents filesystem pollution  
✅ **Small Attack Surface** - Alpine Linux ~5MB, fewer vulnerabilities  
✅ **Clear Documentation** - Dockerfile comments explain each step  
✅ **Proper Port Mapping** - Explicit `-p` flag, no hardcoded ports  
✅ **Standard Conventions** - Follows Docker official Node.js best practices  

## Common Next Steps

After the basic example works:

1. **Add .dockerignore** - Exclude files from COPY:
   ```
   node_modules
   npm-debug.log
   .git
   .DS_Store
   ```

2. **Add npm scripts** to package.json:
   ```json
   "scripts": {
     "start": "node index.js",
     "dev": "nodemon index.js"
   }
   ```

3. **Try volume mounting** for live development:
   ```bash
   docker run -v $(pwd):/usr/src/app -p 3000:3000 node-docker-app
   ```

4. **Add health checks** to Dockerfile:
   ```dockerfile
   HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
     CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"
   ```

5. **Explore Docker Compose** for multi-service setups (Node + Database)

6. **Push to Docker Hub** for team sharing:
   ```bash
   docker tag node-docker-app username/node-docker-app
   docker push username/node-docker-app
   ```

## References

- [Official Node.js Docker Best Practices](./references/nodejs-setup-guide.md)
- [Docker Documentation](https://docs.docker.com/)
- [Express.js Guide](https://expressjs.com/)
- [Docker VS Code Extension](https://code.visualstudio.com/docs/containers/overview)
