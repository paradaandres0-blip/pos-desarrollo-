# POS System — Punto de Venta

Sistema de punto de venta full-stack con arquitectura en capas, principios SOLID y separación estricta de responsabilidades.

---

## Estructura del Proyecto

```
pos-desarrollo/
├── backend/          ← API REST (Java 17 + Spring Boot 3)
└── frontend/         ← Aplicación web (Node.js 20 + Express 4)
```

---

## Backend

### Stack

| Tecnología | Versión |
|---|---|
| Java | 17 |
| Spring Boot | 3.x |
| Spring Data JPA | — |
| PostgreSQL | — |
| MapStruct | — |
| Springdoc OpenAPI | 3.0 |
| JUnit 5 + Mockito | — |

### Arquitectura

El backend implementa **arquitectura hexagonal (Ports & Adapters)** con tres capas:

```
infrastructure  ←  application  ←  domain
(adapters REST/JPA)  (use cases)  (entities + ports)
```

- **domain** — Entidades puras Java, Ports (interfaces), excepciones de negocio. Sin dependencias de frameworks.
- **application** — Use Cases que orquestan la lógica de negocio usando únicamente Ports.
- **infrastructure** — Adaptadores REST (controllers), adaptadores de persistencia (JPA), configuración Spring.

### API Endpoints

| Método | Ruta | Descripción | HTTP |
|---|---|---|---|
| GET | `/api/v1/products` | Listar productos | 200 |
| GET | `/api/v1/products/{id}` | Obtener producto | 200 |
| POST | `/api/v1/products` | Crear producto | 201 |
| PUT | `/api/v1/products/{id}` | Actualizar producto | 200 |
| DELETE | `/api/v1/products/{id}` | Eliminar producto | 204 |
| POST | `/api/v1/sales` | Crear venta | 201 |
| GET | `/api/v1/sales/{id}` | Obtener venta | 200 |
| POST | `/api/v1/sales/{id}/items` | Agregar ítem | 200 |
| POST | `/api/v1/sales/{id}/confirm` | Confirmar venta | 200 |
| POST | `/api/v1/payments` | Procesar pago | 201 |
| GET | `/api/v1/reports/sales` | Reporte de ventas | 200 |
| GET | `/api/v1/reports/top-products` | Top 10 productos | 200 |
| GET | `/api/v1/reports/inventory` | Reporte inventario | 200 |
| GET | `/api/v1/docs` | OpenAPI 3.0 | 200 |

### Formato de errores

Todos los errores devuelven:

```json
{
  "error_code": "INSUFFICIENT_STOCK",
  "message": "Insufficient stock. Available: 3, requested: 5.",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

| Excepción | HTTP | error_code |
|---|---|---|
| Código de producto duplicado | 409 | `DUPLICATE_PRODUCT` |
| Stock insuficiente | 422 | `INSUFFICIENT_STOCK` |
| Pago inválido | 422 | `INVALID_PAYMENT` |
| Producto con ventas asociadas | 422 | `PRODUCT_HAS_SALES` |
| Venta no encontrada | 404 | `SALE_NOT_FOUND` |
| Request inválido | 400 | `INVALID_REQUEST` |

---

## Frontend

### Stack

| Tecnología | Versión |
|---|---|
| Node.js | 20 |
| Express | 4.18.2 |
| Nunjucks | 3.2.4 |
| dotenv | 16.3.1 |
| Jest | 29.7.0 |
| Sinon | 17.0.1 |

### Arquitectura

El frontend implementa **arquitectura en capas con inversión de dependencias (DIP)**:

```
infrastructure  ←  application  ←  domain
(ApiClient, routes)  (orchestrators)  (interfaces JSDoc)
```

- **domain** — Interfaces JSDoc (`IApiClient`, `IProductService`, `ISaleService`, etc.) y modelos de datos. Sin dependencias HTTP.
- **application** — Orchestrators que coordinan flujos de UI usando únicamente interfaces del dominio.
- **infrastructure** — `ApiClient` (único que hace llamadas HTTP), `*ApiService` (implementaciones concretas), rutas Express.
- **composition** — `container.js` es el único punto donde se instancian y conectan todas las dependencias (DI Root).

### Estructura de directorios

```
frontend/
├── src/
│   ├── domain/
│   │   ├── model/          ← product.js, sale.js, payment.js
│   │   └── service/        ← IApiClient, IProductService, ISaleService, IPaymentService, IReportService
│   ├── application/        ← SaleOrchestrator, InventoryOrchestrator, ReportOrchestrator
│   ├── infrastructure/
│   │   ├── api/            ← ApiClient, ApiError, *ApiService
│   │   └── routes/         ← saleRoutes, inventoryRoutes, reportRoutes
│   ├── views/              ← Plantillas Nunjucks (layout, sale, inventory, reports)
│   ├── composition/        ← container.js (DI Root)
│   └── app.js              ← Entry point Express
├── test/
│   ├── application/        ← SaleOrchestrator.test.js
│   └── infrastructure/api/ ← ApiClient.test.js
├── .env
└── package.json
```

### Pantallas

- **Venta** (`/sale`) — Búsqueda de productos, tabla de ítems con cantidad editable, total en tiempo real, formulario de pago con método y monto, visualización de cambio.
- **Inventario** (`/inventory`) — Tabla paginada con indicadores visuales de stock bajo (amarillo) y sin stock (rojo), formulario de creación/edición con validación HTML5, confirmación de eliminación.
- **Reportes** (`/reports`) — Filtros de fecha, tabla de ventas por método de pago, top 10 productos, reporte de inventario con indicadores de stock.

### Configuración

Crea un archivo `.env` en `frontend/`:

```env
BACKEND_URL=http://localhost:8080
PORT=3000
```

### Instalación y ejecución

```bash
cd frontend
npm install
npm start
```

### Tests

```bash
cd frontend
npm test
```

---

## Reglas de arquitectura

| Regla | Descripción |
|---|---|
| **Backend** | Las clases de `domain` no importan nada de `application` ni `infrastructure` |
| **Backend** | Las clases de `application` no importan nada de `infrastructure` |
| **Backend** | Todos los Ports son interfaces Java puras sin anotaciones Spring |
| **Frontend** | Los Orchestrators solo conocen interfaces (`IService`), nunca implementaciones concretas |
| **Frontend** | `ApiClient` es la única clase que hace llamadas HTTP al Backend |
| **Frontend** | Toda la instanciación de dependencias ocurre exclusivamente en `container.js` |
| **Ambos** | Toda inyección de dependencias es por constructor |

---

## Estado de implementación

### Backend

| Tarea | Estado |
|---|---|
| Especificaciones y diseño | ✅ Completo |
| Implementación | 🔲 Pendiente |

### Frontend

| Tarea | Estado |
|---|---|
| 1. Setup inicial del proyecto | ✅ Completo |
| 2. Domain — Modelos e Interfaces | ✅ Completo |
| 3. Infrastructure — ApiClient y ApiError | ✅ Completo |
| 4. Infrastructure — API Services | ✅ Completo |
| 5. Application — Orchestrators | ✅ Completo |
| 6. Infrastructure — Express Routes | ✅ Completo |
| 7. Nunjucks Views | ✅ Completo |
| 8. Composition y Entry Point | ✅ Completo |
| 9. Unit Tests | ✅ Completo |
Evidencia <img width="1834" height="958" alt="image" src="https://github.com/user-attachments/assets/0d0217e7-5c2a-4a62-a0fb-4ab26736137e" />
