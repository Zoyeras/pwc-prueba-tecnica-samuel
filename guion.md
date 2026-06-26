# Guion — Video Demostración CRUD de Tarjetas (5 min máx)

## Antes de grabar

Preparar el entorno y dejarlo abierto en pestañas del editor:

- [ ] `docker compose up -d --build` corriendo, los 3 contenedores healthy.
- [ ] Navegador en `http://localhost:4200` con la lista vacía (ejecutar `docker exec crud-sqlserver ... sqlcmd -Q "DELETE FROM Cards"` si hay datos).
- [ ] Rider / VSCode abierto en la raíz del proyecto.
- [ ] Terminal con `docker compose ps` lista para pegar.
- [ ] Cerrar notificaciones del editor y extensiones ruidosas.

---

## 00:00 – 00:15 · Apertura

**EN PANTALLA:** navegador en `http://localhost:4200` (form a la izquierda, listado vacío a la derecha).

**NARRACIÓN:**
> "Hola. Este es un CRUD completo de tarjetas de crédito. Stack: Angular 21 en el frontend, .NET 10 con Entity Framework Core en el backend, SQL Server 2022 en Docker. Todo se levanta con un solo `docker compose up`. Voy a mostrar primero cómo se usa, y después un recorrido rápido por la estructura del código."

---

## BLOQUE 1 · DEMO DEL FORM (90 s)

### 00:15 – 00:40 · Crear tarjeta

**ACCIÓN:** enfocar el campo Titular, escribir `Juan Pérez`. Saltar al campo Número, escribir `4111111111111111` (16 dígitos, debe autocompletarse a `4111 1111 1111 1111` y avanzar solo al siguiente campo). Escribir `12/27` (debe autocompletar `12/` tras el mes y avanzar al CVV). Escribir `123`. Click en "Guardar tarjeta".

**NARRACIÓN:**
> "Empiezo creando una tarjeta. El titular es texto libre. El número se autocompleta en grupos de cuatro dígitos y al llegar a dieciséis salta solo al campo de vencimiento. La fecha autocompleta la barra después del mes y avanza al CVV al completarse. Pulso guardar y aparece en la tabla de la derecha con el número formateado."

### 00:40 – 01:00 · Validación en vivo

**ACCIÓN:** click en el botón "Guardar tarjeta" con todos los campos vacíos. Mostrar que aparecen los 4 mensajes rojos. Tocar el campo CVV y borrar todo → mostrar error "CVV debe tener 3 o 4 dígitos". Borrar el campo Número y escribir `123` → mostrar error "Debe tener 16 dígitos". Llenar todo correctamente y guardar la segunda tarjeta.

**NARRACIÓN:**
> "Si intento guardar con el formulario vacío, me marca los cuatro campos en rojo y debajo de cada uno me dice qué falta o qué formato espera. La validación vive en dos lados: el patrón se chequea en el cliente y el backend lo vuelve a validar con DataAnnotations, así nunca llega basura a la base de datos."

### 01:00 – 01:20 · Editar

**ACCIÓN:** click en el icono del lápiz de la primera fila. La página hace scroll suave al formulario. Mostrar que el título cambió a "Editar Tarjeta" y el botón a "Guardar edición de tarjeta", y que apareció un botón "Cancelar". La fila editada se ve resaltada en indigo. Cambiar el nombre a "Juan Pérez Editado". Click en "Guardar edición". Mostrar la tabla actualizada.

**NARRACIÓN:**
> "Para editar, hago clic en el lápiz. La página sube al formulario, lo llena con los datos, cambia el título y el texto del botón. La fila que estoy editando se resalta para que sepa cuál es. Modifico el nombre, guardo, y vuelve al modo normal."

### 01:20 – 01:30 · Borrar

**ACCIÓN:** click en el icono de papelera de la segunda tarjeta. Mostrar que la lista queda con una sola fila.

**NARRACIÓN:**
> "Borrar es directo: clic en la papelera, la fila desaparece, la API devuelve 204. Listo el flujo completo del frontend."

---

## BLOQUE 2 · ESTRUCTURA DEL FRONTEND (90 s)

### 01:30 – 01:40 · Vista general

**EN PANTALLA:** árbol de archivos `frontend/src/app/` en el editor.

**NARRACIÓN:**
> "El frontend vive en `src/app/` y sigue la convención por dominio: `models/`, `services/`, `directives/`, y un componente por feature."

### 01:40 – 01:50 · Modelos

**EN PANTALLA:** `frontend/src/app/models/card.model.ts`.

**NARRACIÓN:**
> "En `models/card.model.ts` defino las interfaces que reflejan el contrato del backend: `Card` para leer, `CardCreate` para crear y `CardUpdate` como alias para actualizar. Esto desacopla la UI de la entity de EF."

### 01:50 – 02:00 · Servicio

**EN PANTALLA:** `frontend/src/app/services/cards.service.ts`.

**NARRACIÓN:**
> "El `CardsService` inyecta `HttpClient` y expone los cinco métodos REST: getAll, getById, create, update, delete. Cada función es una llamada HTTP a `/api/cards`. La URL base es relativa porque nginx la proxy hacia el backend."

### 02:00 – 02:15 · Directivas de formato

**EN PANTALLA:** `frontend/src/app/directives/card-number-format.directive.ts` y luego `expiration-date-format.directive.ts`.

**NARRACIÓN:**
> "Las dos directivas son las que hacen la magia del form. `CardNumberFormatDirective` escucha el evento input, deja solo dígitos, agrupa en cuatro, y al llegar a dieciséis dígitos llama focus al siguiente campo. `ExpirationDateFormatDirective` hace lo mismo con la barra: inserta el slash tras el mes y avanza al CVV cuando el campo está completo."

### 02:15 – 02:25 · Componente

**EN PANTALLA:** `frontend/src/app/credit-card/credit-card.ts` (vista general, sin entrar línea por línea).

**NARRACIÓN:**
> "El `CreditCard` component usa signals de Angular 21 para el estado: `cards`, `loading`, `errorMessage`, `editingId`. Inyecta el servicio por constructor, declara el form con FormBuilder, y los handlers onSubmit, startEdit, cancelEdit y deleteCard despachan contra el servicio."

### 02:25 – 02:35 · Template

**EN PANTALLA:** `frontend/src/app/credit-card/credit-card.html` (vista general, resaltar los `@if (fieldError(...))`).

**NARRACIÓN:**
> "El template usa el nuevo control flow de Angular 21: `@if` para los errores por campo, `@for` para iterar la tabla, `@if (loading)` para el spinner. La validación visual se hace con `[class.border-red-400]` cuando el control está tocado y es inválido. La fila en edición se marca con `bg-indigo-50`."

---

## BLOQUE 3 · ESTRUCTURA DEL BACKEND (90 s)

### 02:35 – 02:45 · Vista general

**EN PANTALLA:** árbol `backend/PwcPruebaTecnica/PwcPruebaTecnica/`.

**NARRACIÓN:**
> "El backend es una Web API de .NET 10 con controladores, no minimal API. Sigue la separación por capas: `Controllers/`, `Data/`, `Dtos/`, `Middleware/`, `Migrations/`, `Models/` y el `Program.cs` que lo conecta todo."

### 02:45 – 02:55 · Entity

**EN PANTALLA:** `backend/PwcPruebaTecnica/PwcPruebaTecnica/Models/Card.cs`.

**NARRACIÓN:**
> "La entidad `Card` tiene las anotaciones que definen el esquema: Primary Key auto-incremental, `Required` y `StringLength` para el nombre, el PAN y el CVV, y dos campos de auditoría `CreatedAt` y `UpdatedAt` en UTC."

### 02:55 – 03:05 · DbContext

**EN PANTALLA:** `backend/PwcPruebaTecnica/PwcPruebaTecnica/Data/ApplicationDbContext.cs`.

**NARRACIÓN:**
> "El `ApplicationDbContext` hereda de `DbContext`, recibe las opciones por constructor y expone un `DbSet<Card>`. Eso es todo lo que necesita EF para mapear la tabla."

### 03:05 – 03:15 · DTOs

**EN PANTALLA:** `backend/PwcPruebaTecnica/PwcPruebaTecnica/Dtos/CardCreateDto.cs`.

**NARRACIÓN:**
> "Los DTOs son la frontera de la API. Validan todo lo que viene del cliente: el nombre con mínimo dos caracteres, el PAN con `RegularExpression` para que sean solo dígitos, el CVV igual, y la fecha como `DateTime`. Importante: validar en el DTO, no en la entity, porque la entity nunca debería exponerse directamente."

### 03:15 – 03:30 · Controller

**EN PANTALLA:** `backend/PwcPruebaTecnica/PwcPruebaTecnica/Controllers/CardsController.cs` (mostrar los 5 atributos `[Http...]`).

**NARRACIÓN:**
> "El `CardsController` tiene los cinco endpoints REST con atributos `[HttpGet]`, `[HttpGet("{id:int}")]`, `[HttpPost]`, `[HttpPut("{id:int}")]`, `[HttpDelete("{id:int}")]`. Inyecto el DbContext directamente, uso `AsNoTracking` en las lecturas para no contaminar el Change Tracker, y mapeo a DTO en cada respuesta. `ToAction` en el POST devuelve 201 con la URL del nuevo recurso."

### 03:30 – 03:45 · Middleware de errores

**EN PANTALLA:** `backend/PwcPruebaTecnica/PwcPruebaTecnica/Middleware/ErrorHandlingMiddleware.cs`.

**NARRACIÓN:**
> "El middleware global atrapa cualquier excepción no controlada, loguea el error, y devuelve un `ProblemDetails` con status quinientos en formato JSON. En desarrollo expone el mensaje de la excepción; en producción lo oculta. Esto evita que el cliente vea stack traces."

### 03:45 – 03:55 · Migraciones

**EN PANTALLA:** carpeta `Migrations/` mostrando los dos archivos.

**NARRACIÓN:**
> "Hay dos migraciones generadas con `dotnet ef migrations add`. La primera crea la tabla `Cards` con sus columnas. La segunda, `AddAuditFields`, añade `CreatedAt` y `UpdatedAt` después de que esos campos se agregaron al modelo. El flujo es: cambiar la entity, generar migración, aplicarla con `dotnet ef database update`."

### 03:55 – 04:05 · Program.cs y arranque

**EN PANTALLA:** `backend/PwcPruebaTecnica/PwcPruebaTecnica/Program.cs` y luego terminal con `docker compose ps`.

**NARRACIÓN:**
> "El `Program.cs` registra el DbContext con la connection string de `appsettings.json`, agrega los controladores, monta el middleware de errores y configura Scalar para visualizar la API. Con todo eso, `docker compose up -d --build` levanta SQL Server, compila el backend, compila el frontend, y queda todo conectado. Los tres contenedores, healthy."

---

## 04:05 – 04:15 · Cierre

**EN PANTALLA:** terminal con `docker compose ps` mostrando los tres servicios `running (healthy)`.

**NARRACIÓN:**
> "Tres contenedores, una sola orden. El código está en `dev` con historia de commits por capa, listo para revisarse. Gracias por ver."

---

## Notas de grabación

- Si la edición se alarga, cortar el Bloque 1 entre 01:20 y 01:30 (la demo de borrar puede saltarse).
- Si el tiempo aprieta, comprimir el Bloque 2 (frontend) a 60s saltando la vista general.
- Si necesitas ahorrar más, mostrar el backend solo con Entity + DTOs + Controller (sin middleware ni migraciones).
- Voz: ritmo tranquilo, evita leer en voz alta; narra como si explicaras a un compañero.
- Resolución recomendada: 1920x1080. Fuente del editor: 14-16px para que se lea.
- Cursor del mouse: lento, hover sobre cada línea que estás explicando 1-2 segundos antes de cambiar.
