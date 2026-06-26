# Guion — Video Demostración CRUD de Tarjetas (5 min máx)

## Antes de grabar

Preparar el entorno y dejarlo abierto en pestañas del editor:

- [ ] `docker compose up -d --build` corriendo, los 3 contenedores healthy.
- [ ] Navegador en `http://localhost:4200` con la lista vacía (ejecutar `docker exec crud-sqlserver ... sqlcmd -Q "DELETE FROM Cards"` si hay datos).
- [ ] Rider / VSCode abierto en la raíz del proyecto.
- [ ] Terminal con `docker compose ps` lista para pegar.
- [ ] Cerrar notificaciones del editor y extensiones ruidosas.

---

## 00:00 – 00:30 · Apertura — "esto es lo que me distingue"

**EN PANTALLA:** navegador en `http://localhost:4200` (form a la izquierda, listado vacío a la derecha).

**NARRACIÓN:**
> "Hola. Este es un CRUD de tarjetas de crédito hecho con Angular 21, .NET 10 y SQL Server 2022 — todo dentro de Docker. Antes de mostrar cómo se usa, te resumo los cuatro puntos donde pongo mi mano: primero, **DTOs separados de las entidades** en backend, así nunca se filtra EF Core al cliente. Segundo, **Docker Compose con healthchecks** y dependencias entre servicios, no es un `docker run` suelto. Tercero, **validaciones de campo visibles en tiempo real**, con borde y mensaje por debajo de cada input. Y cuarto, **auto-formato y auto-advance en los campos** — el número se agrupa en cuatro, la fecha autocompleta la barra y el cursor salta solo al siguiente campo. Vamos a verlo."

---

## BLOQUE 1 · DEMO DEL FORM (90 s) — auto-formato + validaciones

### 00:30 – 00:55 · Crear tarjeta con auto-formato y auto-advance

**ACCIÓN:** enfocar el campo Titular, escribir `Juan Pérez`. Saltar al campo Número, escribir `4111111111111111` (16 dígitos, debe autocompletarse a `4111 1111 1111 1111` y avanzar solo al siguiente campo). Escribir `12/27` (debe autocompletar `12/` tras el mes y avanzar al CVV). Escribir `123`. **Pausa para que la cámara capture cómo cada campo se pone verde** (borde + icono). Click en "Guardar tarjeta".

**NARRACIÓN:**
> "Aquí se ve el auto-formato: el número se autocompleta en grupos de cuatro y, al llegar a dieciséis dígitos, el cursor salta solo al campo de vencimiento. La fecha autocompleta la barra después del mes y avanza al CVV al completarse. Fíjate también que cada campo se pone en verde cuando es válido — borde verde e icono verde — y al hacer clic en guardar aparece en la tabla con el número formateado."

### 00:55 – 01:15 · Validaciones visibles

**ACCIÓN:** click en el botón "Guardar tarjeta" con todos los campos vacíos. Mostrar que aparecen los 4 mensajes rojos y bordes rojos. Tocar el campo CVV y borrar todo → mostrar error "CVV debe tener 3 o 4 dígitos". Borrar el campo Número y escribir `123` → mostrar error "Debe tener 16 dígitos". Llenar todo correctamente y guardar la segunda tarjeta.

**NARRACIÓN:**
> "Si intento guardar con el formulario vacío, me marca los cuatro campos en rojo y debajo de cada uno me dice qué falta o qué formato espera. La validación vive en dos lados: el patrón se chequea en el cliente y el backend lo vuelve a validar con DataAnnotations, así nunca llega basura a la base de datos. Si deshabilito JavaScript o uso curl, el backend responde 400 con ProblemDetails y nunca llega a la DB."

### 01:15 – 01:30 · Editar y borrar

**ACCIÓN:** click en el icono del lápiz de la primera fila. La página hace scroll suave al formulario. Mostrar que el título cambió a "Editar Tarjeta" y el botón a "Guardar edición de tarjeta", y que apareció un botón "Cancelar". La fila editada se ve resaltada en indigo. Cambiar el nombre a "Juan Pérez Editado". Click en "Guardar edición". Mostrar la tabla actualizada. Click en la papelera de la segunda tarjeta para borrarla.

**NARRACIÓN:**
> "Para editar, hago clic en el lápiz. La página sube al formulario, lo llena con los datos, cambia el título y el texto del botón. La fila que estoy editando se resalta para que sepa cuál es. Modifico el nombre, guardo, y vuelve al modo normal. Borrar es directo: clic en la papelera, la fila desaparece. Listo el flujo completo del frontend."

---

## BLOQUE 2 · FRONTEND (60 s) — DTOs en TypeScript + directivas

### 01:30 – 01:40 · Vista general

**EN PANTALLA:** árbol de archivos `frontend/src/app/` en el editor.

**NARRACIÓN:**
> "El frontend vive en `src/app/` y sigue la convención por dominio: `models/`, `services/`, `directives/` y un componente por feature."

### 01:40 – 01:50 · Models (los DTOs en TypeScript)

**EN PANTALLA:** `frontend/src/app/models/card.model.ts`.

**NARRACIÓN:**
> "En `models/card.model.ts` defino las interfaces que actúan como DTOs en el cliente: `Card` para leer, `CardCreate` para crear y `CardUpdate` como alias. Esto es el equivalente frontend de los DTOs del backend: desacoplan la UI de la entity y reflejan exactamente el contrato HTTP."

### 01:50 – 02:00 · Directivas de auto-formato

**EN PANTALLA:** `frontend/src/app/directives/card-number-format.directive.ts` y luego `expiration-date-format.directive.ts`.

**NARRACIÓN:**
> "Las dos directivas son las que hacen la magia del form. `CardNumberFormatDirective` escucha el evento input, deja solo dígitos, agrupa en cuatro, y al llegar a dieciséis dígitos llama focus al siguiente campo. `ExpirationDateFormatDirective` hace lo mismo con la barra: inserta el slash tras el mes y avanza al CVV cuando el campo está completo. Cada directiva es reutilizable e independiente del componente."

### 02:00 – 02:10 · Servicio HTTP

**EN PANTALLA:** `frontend/src/app/services/cards.service.ts`.

**NARRACIÓN:**
> "El `CardsService` inyecta `HttpClient` y expone los cinco métodos REST: getAll, getById, create, update, delete. La URL base es relativa porque nginx la proxy hacia el backend."

### 02:10 – 02:30 · Componente y template

**EN PANTALLA:** `credit-card.ts` y `credit-card.html` (vista general, resaltar los `@if (fieldError(...))` y el helper `fieldValid`).

**NARRACIÓN:**
> "El `CreditCard` component usa signals de Angular 21 para el estado, OnPush para reducir renders, e inyecta el servicio. El template usa el nuevo control flow `@if` para los errores y `@for` para iterar la tabla. La validación visual se hace con clases dinámicas: `[class.border-emerald-500]` cuando el campo es válido, `[class.border-red-400]` cuando es inválido, y el helper `fieldValid` en el componente decide cuál aplica. La fila en edición se marca con `bg-indigo-50`."

---

## BLOQUE 3 · BACKEND (90 s) — DTOs reales + Docker

### 02:30 – 02:40 · Vista general del backend

**EN PANTALLA:** árbol `backend/PwcPruebaTecnica/PwcPruebaTecnica/`.

**NARRACIÓN:**
> "El backend es una Web API de .NET 10 con controladores, no minimal API. Sigue la separación por capas: `Controllers/`, `Data/`, `Dtos/`, `Middleware/`, `Migrations/`, `Models/` y el `Program.cs`."

### 02:40 – 02:55 · DTOs (la separación clave)

**EN PANTALLA:** `Dtos/CardCreateDto.cs` y luego `Dtos/CardResponseDto.cs`.

**NARRACIÓN:**
> "Los DTOs son la frontera de la API y donde valido todo lo que viene del cliente. `CardCreateDto` lleva `Required`, `StringLength` y `RegularExpression` para que el PAN y el CVV sean solo dígitos. `CardResponseDto` es lo que devuelvo en GET y POST, así la entity de EF Core nunca sale al exterior. Esta separación es importante: si mañana cambio el modelo de la DB, los clientes no se enteran mientras el DTO no cambie."

### 02:55 – 03:10 · Controller

**EN PANTALLA:** `Controllers/CardsController.cs` (mostrar los 5 atributos `[Http...]`).

**NARRACIÓN:**
> "El `CardsController` tiene los cinco endpoints REST con atributos `[HttpGet]`, `[HttpPost]`, `[HttpPut]`, `[HttpDelete]`. Inyecto el DbContext directamente, uso `AsNoTracking` en las lecturas, y mapeo a DTO en cada respuesta. El form detecta automáticamente si es alta o edición según el `editingId`, así reutilizo la misma pantalla para crear y actualizar."

### 03:10 – 03:20 · Middleware de errores

**EN PANTALLA:** `Middleware/ErrorHandlingMiddleware.cs`.

**NARRACIÓN:**
> "El middleware global atrapa cualquier excepción no controlada, loguea el error, y devuelve un `ProblemDetails` con status quinientos en formato JSON siguiendo el RFC 7807. En desarrollo expone el mensaje de la excepción; en producción lo oculta. Esto evita que el cliente vea stack traces y estandariza el formato de error."

### 03:20 – 03:30 · Migraciones y EF Core

**EN PANTALLA:** carpeta `Migrations/` mostrando los dos archivos.

**NARRACIÓN:**
> "Hay dos migraciones generadas con `dotnet ef migrations add`. La primera crea la tabla `Cards`. La segunda, `AddAuditFields`, añade `CreatedAt` y `UpdatedAt` después de agregar esos campos al modelo. El flujo es: cambiar la entity, generar migración, aplicarla con `dotnet ef database update`. Nada de `EnsureCreated` — quiero control fino del schema."

### 03:30 – 03:50 · Docker Compose

**EN PANTALLA:** `docker-compose.yml`, resaltando las dependencias y healthchecks.

**NARRACIÓN:**
> "Y aquí está la parte de Docker. El `docker-compose.yml` define los tres servicios: `sqlserver` con healthcheck, `backend` que espera a que SQL Server esté `service_healthy` antes de arrancar, y `frontend` que espera a que el backend esté healthy. Esto resuelve el típico problema de que nginx arranca antes que el backend y falla porque no puede resolver el hostname. Los Dockerfiles están en el repo, el `.env` real está gitignored, y el `.env.example` trae valores por defecto funcionales. Un solo `docker compose up -d --build` levanta todo."

### 03:50 – 04:00 · Verificación final

**EN PANTALLA:** terminal con `docker compose ps` mostrando los tres servicios `running (healthy)`.

**NARRACIÓN:**
> "Y aquí lo ven: tres contenedores, todos healthy, en menos de un minuto. Sin tocar nada del host."

---

## 04:00 – 04:15 · Cierre — "estos son los cuatro puntos"

**EN PANTALLA:** navegador mostrando el CRUD funcionando.

**NARRACIÓN:**
> "Recapitulando: DTOs separados de las entities en backend, Docker Compose con healthchecks encadenados, validaciones de campo visibles en tiempo real con doble validación cliente-servidor, y auto-formato más auto-advance en los inputs. El código está en `dev` con historia de commits por capa, listo para revisarse. Gracias por ver."

---

## Notas de grabación

- **Si te pasas de 5 min**, comprime en este orden:
  1. Saltar la sección "Editar y borrar" (último sub-bloque del Bloque 1) — ahorra 15s.
  2. Saltar la vista general del backend — ir directo a DTOs. Ahorra 10s.
  3. Acortar la demo de Docker Compose a solo mostrar `docker compose ps` y narrar la idea en una frase. Ahorra 20s.
- **Voz:** ritmo tranquilo, narra como si explicaras a un compañero; no leas en voz alta.
- **Cursor del mouse:** lento, hover sobre cada línea que estás explicando 1-2 segundos antes de cambiar.
- **Resolución:** 1920x1080. Fuente del editor: 14-16px para que se lea.
- **Puntos a destacar visualmente** (en el editor, agranda la fuente o resalta la línea cuando los menciones):
  - DTOs: la línea de `RegularExpression(@"^\d+$", ...)` en `CardCreateDto.cs`
  - Docker: el bloque `healthcheck` + `depends_on: condition: service_healthy` en `docker-compose.yml`
  - Validaciones: el helper `fieldValid` en `credit-card.ts` y los `[class.border-emerald-500]` en el HTML
  - Auto-formato: el método `onInput` en cada directiva
