# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and csproj files to restore dependencies.
COPY Nhaxuong.sln ./
COPY Nhaxuong.API/Nhaxuong.API.csproj Nhaxuong.API/
COPY Nhaxuong.MODEL/Nhaxuong.MODELS.csproj Nhaxuong.MODEL/
COPY Nhaxuong.REPO/Nhaxuong.REPOSITORIES.csproj Nhaxuong.REPO/
COPY Nhaxuong.SERVICE/Nhaxuong.SERVICES.csproj Nhaxuong.SERVICE/

RUN dotnet restore Nhaxuong.API/Nhaxuong.API.csproj

# Copy all source files and build
COPY . .
RUN dotnet publish Nhaxuong.API/Nhaxuong.API.csproj -c Release -o /app/publish /p:UseAppHost=false --no-restore

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Nhaxuong.API.dll"]