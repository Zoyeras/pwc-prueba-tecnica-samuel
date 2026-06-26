# CRUD Udemy — Angular 21 + .NET 10 + SQL Server 2022

Stack completo en Docker: base de datos, API y frontend.

## Requisitos

- Docker 24+ y Docker Compose v2
- El proyecto .NET debe estar en `backend/` con un `.csproj` llamado `api.csproj`
- El proyecto Angular debe estar en `frontend/` con un `package.json`

## Bootstrap del proyecto (solo la primera vez)

```bash
# Backend
cd backend
dotnet new webapi -n api -o . --framework net10.0
cd ..

# Frontend
cd frontend
npx -p @angular/cli@21 ng new app --directory=. --routing --style=css --skip-git --package-manager=npm
cd ..
```

## Levantar entorno

```bash
cp .env.example .env
# editar .env y poner una contraseña fuerte en MSSQL_SA_PASSWORD

docker compose up -d --build
```

| Servicio  | URL                      |
|-----------|--------------------------|
| Frontend  | http://localhost:4200    |
| Backend   | http://localhost:8080    |
| SQL Server| localhost:1433 (sa / .env) |

## Proxy del frontend

El `nginx.conf` enruta `/api/*` al backend (`http://backend:8080`). En Angular usa rutas relativas:

```ts
this.http.get('/api/productos');
```

Si prefieres que el backend NO reciba el prefijo `/api`, cambia en `frontend/nginx.conf`:

```nginx
location /api/ {
    proxy_pass http://backend:8080/;   # con barra final: strip /api
}
```

## Comandos útiles

```bash
docker compose logs -f backend
docker compose logs -f sqlserver
docker compose down                 # parar contenedores
docker compose down -v              # parar y borrar volumen de SQL Server
docker compose exec sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -No -Q "SELECT name FROM sys.databases"
```
