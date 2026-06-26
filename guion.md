# Guion — Video Demostración CRUD de Tarjetas (5 min máx)

> **Nota:** la ejecución del proyecto (`docker compose up`, abrir el navegador, probar el CRUD) la hacés vos fuera de cámara. Este guion es solo lo que **narrás mientras mostrás la app y los archivos**.

---

## Antes de grabar

- [ ] `docker compose up -d --build` corriendo, los 3 contenedores healthy.
- [ ] Rider / VSCode abierto en la raíz del proyecto.
- [ ] Terminal con `docker compose ps` lista para pegar.
- [ ] Cerrar notificaciones del editor y extensiones ruidosas.

---

## Apertura · 15 s

**EN PANTALLA:** navegador en `http://localhost:4200` corriendo, o terminal con `docker compose ps`.

**NARRAR:**
> "Este es un CRUD de tarjetas de crédito. Lo armé en tres partes: backend en .NET 10, frontend en Angular 21, y todo orquestado con Docker. Te muestro cada una."

---

## BACKEND · 1 min 45 s

**EN PANTALLA:** árbol `backend/PwcPruebaTecnica/PwcPruebaTecnica/`.

**NARRAR (estructura general):**
> "El backend es una Web API de .NET 10 con controladores — no minimal API. La separación por capas vive en estas carpetas: `Models/` para las entities, `Dtos/` para lo que entra y sale, `Data/` para el DbContext, `Controllers/` para los endpoints, `Middleware/` para el handler global de errores, y `Migrations/` para los archivos de EF Core."

### 1. Entity vs DTO (30 s)

**EN PANTALLA:** `Models/Card.cs` y luego `Dtos/CardCreateDto.cs` lado a lado.

**NARRAR:**
> "La entity `Card` en `Models/` lleva las anotaciones que definen el esquema de la tabla: Primary Key, `Required`, `StringLength` para el nombre, el PAN y el CVV, y dos campos de auditoría `CreatedAt` y `UpdatedAt` en UTC. Lo importante: la entity es para EF Core, no se expone al cliente. Lo que valida lo que viene por HTTP son los DTOs en `Dtos/`. Acá en `CardCreateDto` tengo las mismas anotaciones más una `RegularExpression(@"^\d+$")` que rechaza cualquier cosa que no sean dígitos en el PAN y en el CVV. Si el cliente manda basura, el backend responde 400 con ProblemDetails antes de tocar la DB. Esta separación es clave: si mañana cambio el modelo, los clientes no se enteran mientras el DTO no cambie."

### 2. Controller (30 s)

**EN PANTALLA:** `Controllers/CardsController.cs`, scroll mostrando los 5 atributos `[Http...]`.

**NARRAR:**
> "El `CardsController` tiene los cinco endpoints REST: `GET` lista, `GET` por id, `POST` crear, `PUT` actualizar, `DELETE` borrar. Inyecto el `ApplicationDbContext` directamente por constructor, uso `AsNoTracking()` en las lecturas para no contaminar el Change Tracker, y mapeo a DTO en cada respuesta. El POST devuelve 201 con la URL del nuevo recurso gracias a `CreatedAtAction`. Cuando el id no existe, devuelvo `NotFound()` directo desde el controller."

### 3. Middleware y migraciones (30 s)

**EN PANTALLA:** `Middleware/ErrorHandlingMiddleware.cs` y luego la carpeta `Migrations/`.

**NARRAR:**
> "El middleware global de errores atrapa cualquier excepción no controlada, la loguea con el `ILogger`, y devuelve un `ProblemDetails` siguiendo el RFC 7807. En desarrollo expone el mensaje real; en producción lo oculta. Esto evita que el cliente vea stack traces. Y acá en `Migrations/` tengo dos archivos generados con `dotnet ef migrations add`: `InitialCreate` que crea la tabla, y `AddAuditFields` que se generó cuando agregué `CreatedAt` y `UpdatedAt` al modelo. El flujo es: cambio la entity, genero migración, aplico con `dotnet ef database update`. Nada de `EnsureCreated` — quiero control fino del schema."

---

## FRONTEND · 1 min 45 s

**EN PANTALLA:** árbol `frontend/src/app/`.

**NARRAR (estructura general):**
> "El frontend es Angular 21 con standalone components, signals para el estado, y OnPush para reducir renders. La estructura es por dominio: `models/`, `services/`, `directives/`, y un componente por feature en `credit-card/`. Tailwind v4 para estilos, lucide-angular para los iconos, sin NgModules."

### 1. Models y Service (30 s)

**EN PANTALLA:** `models/card.model.ts` y luego `services/cards.service.ts`.

**NARRAR:**
> "En `models/card.model.ts` defino las interfaces que son el equivalente frontend de los DTOs del backend: `Card` para leer, `CardCreate` para crear, y `CardUpdate` como alias. Esto desacopla la UI de cualquier cambio en la entity. El `CardsService` inyecta `HttpClient` y expone los cinco métodos REST — uno por endpoint — contra `/api/cards`. La URL es relativa porque nginx la proxy al backend."

### 2. Directivas de auto-formato (30 s)

**EN PANTALLA:** `directives/card-number-format.directive.ts` y luego `expiration-date-format.directive.ts`.

**NARRAR:**
> "Las dos directivas son standalone y reutilizables. `CardNumberFormatDirective` escucha el evento input, deja solo dígitos con un `replace(/\D/g, '')`, agrupa en cuatro con un `replace(/(.{4})/g, '$1 ')`, y al llegar a dieciséis dígitos llama `focus()` al siguiente input. `ExpirationDateFormatDirective` hace lo mismo pero con la barra: inserta el slash tras el segundo dígito y avanza al CVV cuando el campo está completo. Cada directiva es independiente del componente, no sabe nada del form, y se aplica con un atributo en el template."

### 3. Componente y template (30 s)

**EN PANTALLA:** `credit-card/credit-card.ts` y luego `credit-card.html` (vista general, resaltar los `@if` y los `[class.X]`).

**NARRAR:**
> "El `CreditCard` component usa signals de Angular 21: `cards`, `loading`, `errorMessage`, `editingId`. Inyecta el servicio por constructor, declara el form con `FormBuilder`, y los handlers despachan contra el servicio. El template usa el nuevo control flow `@if` y `@for`. La validación visual se hace con class binding dinámico: `[class.border-emerald-500]` cuando el campo es válido, `[class.border-red-400]` cuando es inválido, decidido por un helper `fieldValid()` que vive en el componente. La fila en edición se marca con `bg-indigo-50` y el pencil se deshabilita. El mismo form sirve para crear y para editar — el título, el texto del botón y la aparición del botón Cancelar dependen del estado de la signal `editingId`."

---

## DOCKER · 1 min

**EN PANTALLA:** árbol raíz del proyecto, luego `docker-compose.yml`.

**NARRAR (estructura):**
> "Todo el stack se levanta con `docker compose up -d --build`. Hay tres servicios: `sqlserver` con la imagen oficial de Microsoft, `backend` que se compila con un multi-stage de `dotnet/sdk` a `dotnet/aspnet`, y `frontend` que se compila con Node y se sirve con nginx. Los Dockerfiles están commiteados, el `.env` real está en `.gitignore`, y `.env.example` trae valores por defecto funcionales para que el entrevistador no tenga que tocar nada."

### 1. Healthchecks encadenados (30 s)

**EN PANTALLA:** `docker-compose.yml`, resaltando los bloques `healthcheck` y `depends_on`.

**NARRAR:**
> "Lo crítico acá son los healthchecks encadenados. SQL Server tiene un healthcheck que hace un `SELECT 1` con `sqlcmd`. El backend tiene `depends_on: condition: service_healthy` apuntando a SQL Server, así no arranca hasta que la DB esté lista. El frontend tiene lo mismo apuntando al backend, así nginx nunca arranca antes de que el backend esté resolviendo DNS. Sin esto, te aparece el clásico error 'host not found in upstream backend' porque nginx resuelve nombres al inicio y si el backend todavía no existe, falla y sale."

### 2. nginx.conf y proxy (15 s)

**EN PANTALLA:** `frontend/nginx.conf`.

**NARRAR:**
> "El `nginx.conf` tiene un `location /api/` que hace `proxy_pass http://backend:8080`. Esto permite que el frontend haga `this.http.get('/api/cards')` y la request llegue al backend sin que el frontend sepa que existe un backend separado. Para desarrollo local hay también un `proxy.conf.json` que Angular CLI usa con `ng serve`."

### 3. Verificación (15 s)

**EN PANTALLA:** terminal con `docker compose ps` mostrando los 3 healthy.

**NARRAR:**
> "Y acá lo ven: tres contenedores, todos healthy, en menos de un minuto. Un solo `docker compose up -d --build` desde una máquina con Docker, y el proyecto entero está corriendo."

---

## Cierre · 15 s

**EN PANTALLA:** navegador o terminal, lo que se vea mejor.

**NARRAR:**
> "Backend en .NET 10 con DTOs y migraciones, frontend en Angular 21 con signals y directivas standalone, y todo orquestado con Docker Compose y healthchecks. El código está en `dev` con commits por capa. Gracias por ver."

---

## Resumen visual de los 3 bloques

| Bloque | Archivos clave a mostrar |
|---|---|
| Backend | `Models/Card.cs`, `Dtos/CardCreateDto.cs`, `Controllers/CardsController.cs`, `Middleware/ErrorHandlingMiddleware.cs`, `Migrations/` |
| Frontend | `models/card.model.ts`, `services/cards.service.ts`, `directives/*.directive.ts`, `credit-card/credit-card.{ts,html}` |
| Docker | `docker-compose.yml`, `frontend/nginx.conf`, `frontend/Dockerfile`, `backend/Dockerfile` |

---

## Notas de grabación

- **Si te pasas de 5 min**, comprime el bloque Docker a 45s saltando la parte de `nginx.conf`.
- **Voz:** ritmo tranquilo, narra como si explicaras a un compañero.
- **Cursor del mouse:** lento, hover sobre la línea que estás explicando 1-2 segundos antes de cambiar.
- **Resolución:** 1920x1080. Fuente del editor: 14-16px.
- **Lo más importante a mostrar en cámara:**
  - La regex `^\d+$` en el DTO
  - El `condition: service_healthy` en el compose
  - El `focusNext()` en la directiva
  - El helper `fieldValid` y los `[class.border-emerald-500]` en el template
