# Guion — Video Demostración CRUD de Tarjetas (5 min máx)

> **Nota:** las pruebas del proyecto (correr `docker compose up`, ejecutar la app, etc.) las haces tú fuera de cámara. Este guion es solo lo que **narrás en el video** mientras muestras la app y los archivos clave.

---

## Antes de grabar

- [ ] `docker compose up -d --build` corriendo, los 3 contenedores healthy.
- [ ] Navegador en `http://localhost:4200` con datos de prueba (o vacía).
- [ ] Rider / VSCode abierto en la raíz del proyecto.
- [ ] Terminal con `docker compose ps` lista para pegar.
- [ ] Cerrar notificaciones del editor y extensiones ruidosas.

---

## Apertura · 20 s

**EN PANTALLA:** navegador en `http://localhost:4200` corriendo.

**NARRAR:**
> "Hola. Este es un CRUD de tarjetas de crédito: Angular 21, .NET 10, SQL Server 2022, todo dentro de Docker. Te resumo los cuatro puntos que muestran cómo trabajo: DTOs separados de la entity en backend, Docker Compose con healthchecks encadenados, validaciones de campo visibles en tiempo real, y auto-formato más auto-advance en los inputs. Vamos a ver la app primero y después el código."

---

## Demo en vivo · 1 min 30 s

Mostrar la app funcionando. Narrar mientras hacés las acciones:

| Acción | Decir |
|---|---|
| Llenar titular + número + fecha + CVV | "Auto-formato del número en grupos de cuatro, auto-advance al campo siguiente, auto-slash en la fecha, y cada campo se pone en verde cuando es válido" |
| Click "Guardar tarjeta" | "Aparece en la tabla, número formateado, fecha en formato corto" |
| Click "Guardar" con form vacío | "Validaciones visibles: borde rojo, mensaje por debajo, y la validación se refuerza en el backend" |
| Click en lápiz de una fila | "Editar usando el mismo form, no inline. Cambia el título a 'Editar Tarjeta' y aparece 'Cancelar'" |
| Click en papelera | "Borrar directo, devuelve 204" |

---

## Estructura del proyecto · 1 min 30 s

**EN PANTALLA:** árbol de la raíz del repo en el editor.

**NARRAR:**
> "La estructura es: `backend/` con la API .NET, `frontend/` con Angular, `docker-compose.yml` arriba, `.env.example` con las variables que el compose lee, y los `Dockerfile` ya commiteados para que un solo comando levante todo. Los healthchecks encadenados evitan que nginx arranque antes que el backend."

### `backend/`

**EN PANTALLA:** `backend/PwcPruebaTecnica/PwcPruebaTecnica/`.

**NARRAR (mencionar solo, no abrir cada archivo):**
> "En `Models/Card.cs` la entity con DataAnnotations. En `Dtos/` los tres DTOs: `CardCreateDto` con las validaciones de entrada, `CardUpdateDto` igual, `CardResponseDto` para lo que devuelvo. En `Data/ApplicationDbContext.cs` el DbContext con el DbSet. En `Controllers/CardsController.cs` los cinco endpoints REST, inyectando el DbContext directamente. En `Middleware/` el handler global de errores con ProblemDetails. Y en `Migrations/` las dos migraciones generadas con `dotnet ef`."

### `frontend/`

**EN PANTALLA:** `frontend/src/app/`.

**NARRAR:**
> "Estructura por dominio. En `models/card.model.ts` los DTOs en TypeScript — interfaces que reflejan el contrato del backend. En `services/cards.service.ts` las cinco llamadas HTTP, una por endpoint. En `directives/` las dos directivas que hacen el auto-formato: `CardNumberFormatDirective` agrupa en cuatro y avanza, `ExpirationDateFormatDirective` inserta la barra y avanza. Y en `credit-card/` el componente principal, con signals, OnPush, y la lógica de edit/create usando el mismo form."

---

## Los 4 puntos donde se ve mi mano · 1 min

**EN PANTALLA:** cada archivo por ~15 segundos mientras se narra.

### 1. DTOs separados de la entity

**EN PANTALLA:** `Dtos/CardCreateDto.cs`.

**NARRAR:**
> "Validación en el DTO, no en la entity. La entity es para EF, el DTO es la frontera con el cliente. `RegularExpression(@"^\d+$")` en el CVV y el PAN rechazan basura antes de tocar la DB. La entity queda limpia, solo con lo que necesita el ORM."

### 2. Docker Compose con healthchecks

**EN PANTALLA:** `docker-compose.yml` (resaltar el bloque `healthcheck` y `depends_on: condition: service_healthy`).

**NARRAR:**
> "El backend espera a que SQL Server esté healthy, el frontend espera a que el backend esté healthy. Sin esto, nginx arranca antes que el backend y falla al no poder resolver el hostname. Tres contenedores, un solo comando, y funciona."

### 3. Validaciones de campo visibles

**EN PANTALLA:** `credit-card.html` (resaltar los `[class.border-emerald-500]` y los `@if (fieldError(...))`).

**NARRAR:**
> "Cada campo tiene tres estados: gris sin tocar, rojo inválido, verde válido. El helper `fieldValid` en el componente decide el color. Las validaciones viven en dos lados: patrón en el cliente, DataAnnotations en el backend. Si deshabilito JS o uso curl, el backend responde 400 con ProblemDetails."

### 4. Auto-formato y auto-advance

**EN PANTALLA:** `directives/card-number-format.directive.ts` y `expiration-date-format.directive.ts`.

**NARRAR:**
> "Las directivas escuchan el evento input, transforman el valor, y al completarse hacen focus al siguiente input. Cada directiva es standalone, reutilizable, y no depende del componente. Esto es lo que hace que escribir una tarjeta se sienta como en una app nativa."

---

## Cierre · 15 s

**EN PANTALLA:** terminal con `docker compose ps` mostrando los 3 healthy.

**NARRAR:**
> "Tres contenedores, una sola orden. DTOs, Docker con healthchecks, validaciones visibles, y auto-formato en los inputs. El código está en `dev` con commits por capa, listo para revisarse. Gracias por ver."

---

## Resumen visual de los 4 puntos

| # | Punto | Archivo a mostrar en cámara |
|---|---|---|
| 1 | DTOs separados de entity | `backend/.../Dtos/CardCreateDto.cs` |
| 2 | Docker con healthchecks | `docker-compose.yml` |
| 3 | Validaciones visibles | `frontend/.../credit-card.html` |
| 4 | Auto-formato y auto-advance | `frontend/.../directives/*.directive.ts` |

---

## Notas de grabación

- **Si te pasas de 5 min**, comprime la sección "Estructura del proyecto" a 60s y la "Demo en vivo" a 1 min.
- **Voz:** ritmo tranquilo, narra como si explicaras a un compañero.
- **Cursor del mouse:** lento, hover sobre la línea que estás explicando 1-2 segundos antes de cambiar.
- **Resolución:** 1920x1080. Fuente del editor: 14-16px.
- **En cámara:** resalta brevemente la línea exacta de cada punto (la regex del DTO, el `condition: service_healthy`, el `[class.border-emerald-500]`, el `focusNext` en la directiva).
