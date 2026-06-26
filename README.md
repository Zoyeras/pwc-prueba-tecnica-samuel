# CRUD Udemy — Angular 21 + .NET 10 + SQL Server 2022

CRUD de tarjetas de crédito. Stack completo dentro de Docker: SQL Server, API .NET y frontend Angular servidos por nginx.

## Requisitos

- Docker 24+ y Docker Compose v2
- (Nada más — no hace falta .NET SDK, ni Node, ni Angular CLI en la máquina)

## Levantar el proyecto

```bash
cp .env.example .env
docker compose up -d --build
```

Espera unos 60-90 segundos. Verifica con:

```bash
docker compose ps
```

Los tres servicios deben estar `running (healthy)`.

## URLs

| Servicio | URL | Notas |
|---|---|---|
| Frontend (Angular) | http://localhost:4200 | UI del CRUD |
| Backend API | http://localhost:8080/api/cards | Endpoints REST |
| API interactiva (Scalar) | http://localhost:8080/scalar/v1 | Probar endpoints sin curl |
| SQL Server | `localhost:1433` | User `sa`, password la del `.env` |

## Comandos útiles

```bash
docker compose ps                              # estado de los 3 servicios
docker compose logs -f backend                 # logs en vivo del backend
docker compose logs -f frontend                # logs en vivo de nginx/angular
docker compose restart backend                # reiniciar solo el backend
docker compose down                            # parar los 3 contenedores
docker compose down -v                         # parar y borrar el volumen de la DB

# Conectarse a SQL Server desde el host
docker exec -it crud-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "$(grep MSSQL_SA_PASSWORD .env | cut -d= -f2)" -No \
  -Q "SELECT * FROM Cards"
```

## Estructura del repositorio

```
.
├── backend/                          # .NET 10 Web API + EF Core
│   ├── Dockerfile
│   └── PwcPruebaTecnica/
│       └── PwcPruebaTecnica/
│           ├── Controllers/CardsController.cs
│           ├── Data/ApplicationDbContext.cs
│           ├── Dtos/CardCreateDto.cs / CardUpdateDto.cs / CardResponseDto.cs
│           ├── Middleware/ErrorHandlingMiddleware.cs
│           ├── Migrations/
│           ├── Models/Card.cs
│           └── Program.cs
├── frontend/                         # Angular 21 standalone
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── proxy.conf.json
│   └── src/app/
│       ├── models/card.model.ts
│       ├── services/cards.service.ts
│       ├── directives/card-number-format.directive.ts
│       ├── directives/expiration-date-format.directive.ts
│       └── credit-card/credit-card.ts / credit-card.html
├── docker-compose.yml
├── .env.example
├── AGENTS.md                         # reglas del proyecto (no tocar)
└── guion.md                          # guion para grabar un video demo
```

## Flujo de los datos

```
navegador (localhost:4200)
  └─► nginx (puerto 80 interno)
        └─► /api/* → backend:8080
              └─► ApplicationDbContext (EF Core)
                    └─► sqlserver:1433
```

El frontend hace `this.http.get('/api/cards')` y el proxy de nginx lo redirige al backend dentro de la red de Docker.

## Troubleshooting

- **"docker: command not found"** → instala Docker Desktop o `docker` + `docker-compose-plugin` desde tu package manager.
- **"port 4200/8080/1433 is already in use"** → cambia los puertos en `docker-compose.yml` o para el proceso que los ocupa.
- **El backend no arranca** → revisa `docker compose logs backend`. Lo más común es que la password del `.env` no coincida con la de SQL Server (tienen que estar sincronizadas).
- **"Cards table doesn't exist"** → las migraciones se aplican al primer request. Si quieres forzar: `docker compose restart backend`.
- **Cambios en el código no se ven** → `docker compose up -d --build backend` (o `frontend`) para reconstruir la imagen.
