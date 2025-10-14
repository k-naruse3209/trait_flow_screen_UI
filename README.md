<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1HDEDL9GTki0WyE3JGkHue6dTsWu7HsDI

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Google Cloud Run

The repository already includes a production-ready Dockerfile that builds the Vite app and serves the compiled assets through Nginx. Follow the steps below to deploy to Cloud Run.

1. **Authenticate and set project**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Enable required services (once per project)**
   ```bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
   ```

3. **Build and push the container image**  
   Cloud Run expects the service to listen on the port provided by the `PORT` environment variable. The provided `start.sh` script and `nginx.conf.template` handle this automatically.
   ```bash
   gcloud builds submit --tag REGION-docker.pkg.dev/YOUR_PROJECT_ID/trait-flow/trait-flow-ui
   ```
   - Replace `REGION` with a supported Artifact Registry region (e.g. `asia-northeast1`).
   - The first run will create the Docker repository (`trait-flow`) if it does not exist.

4. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy trait-flow-ui \
     --image REGION-docker.pkg.dev/YOUR_PROJECT_ID/trait-flow/trait-flow-ui \
     --platform managed \
     --region REGION \
     --allow-unauthenticated
   ```
   After a few moments Cloud Run will output the service URL. The React app is static, so no additional environment variables are required at runtime.

5. **(Optional) Test locally with Docker**
   ```bash
    docker build -t trait-flow-ui .
    docker run -p 8080:8080 trait-flow-ui
   ```
   Visit http://localhost:8080 to confirm the build before deploying.
