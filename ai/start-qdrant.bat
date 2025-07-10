@echo off
echo 🚀 Starting Qdrant vector database...
echo.
echo This will start Qdrant in a Docker container on port 6333
echo Make sure Docker is installed and running first!
echo.
pause

echo Starting Qdrant container...
docker run -d -p 6333:6333 -p 6334:6334 --name scholar-ai-qdrant qdrant/qdrant

if %ERRORLEVEL% == 0 (
    echo.
    echo ✅ Qdrant started successfully!
    echo 📡 Health check: http://localhost:6333/health
    echo 🎯 Dashboard: http://localhost:6333/dashboard
    echo.
    echo To stop Qdrant later, run: docker stop scholar-ai-qdrant
    echo To remove container: docker rm scholar-ai-qdrant
) else (
    echo.
    echo ❌ Failed to start Qdrant. Make sure Docker is running!
    echo 💡 Install Docker from: https://docs.docker.com/get-docker/
)

echo.
pause
