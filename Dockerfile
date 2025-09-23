# Multi-stage build for production
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend-build
WORKDIR /app

# Copy backend project files
COPY backend/*.csproj ./backend/
COPY backend/*.cs ./backend/
COPY backend/*.json ./backend/
RUN dotnet publish ./backend/fullstack-fun.csproj -c Release -o /app/publish/backend

# Frontend build stage
FROM node:20-alpine AS frontend-build
WORKDIR /app

# Copy frontend package files
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source files
COPY frontend/ ./
RUN npm run build

# Production stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

# Copy backend from build stage
COPY --from=backend-build /app/publish/backend ./backend

# Copy frontend build files
COPY --from=frontend-build /app/dist ./wwwroot

# Update CORS policy for production
RUN sed -i 's/http:\/\/localhost:3000/*/g' /app/backend/appsettings.json

EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENV SPA_STATIC_PATH=./wwwroot

ENTRYPOINT ["dotnet", "backend/fullstack-fun.dll"]