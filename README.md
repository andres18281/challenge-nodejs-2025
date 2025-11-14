# 📦 Restaurant Orders API

API desarrollada en **NestJS** para gestionar órdenes de restaurante, incluyendo creación, consulta, actualización de estado y documentación con Swagger.

---

## 🚀 Inicio Rápido

### 🔧 Construir los contenedores

```bash
docker compose build --no-cache
```

### ▶️ Ejecutar la aplicación

```bash
docker compose up
```

La API estará disponible en:

```
http://localhost:3000
```

---

## 📘 Documentación Swagger

La API incluye documentación interactiva generada con **Swagger UI**.

👉 **Accede a:**

```
http://localhost:3000/api
```

Aquí podrás probar todos los endpoints sin necesidad de Postman o curl.

---

## 🧪 Ejemplos de uso con cURL

_(Puedes importarlos directamente en Postman)_

### 📋 Listar todas las órdenes activas

```bash
curl --location --request GET 'http://127.0.0.1:3000/orders'
```

### 🔍 Obtener una orden por ID

```bash
curl --location --request GET 'http://127.0.0.1:3000/orders/62573357-16a3-43d4-95fc-a8dd7b748fbf'
```

### ➕ Crear una nueva orden

```bash
curl -X POST http://127.0.0.1:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Juan Perez",
    "items": [
      {
        "description": "Hamburguesa",
        "quantity": 2,
        "unitPrice": 15000
      },
      {
        "description": "Gaseosa",
        "quantity": 1,
        "unitPrice": 5000
      }
    ]
  }'
```

### ⏭️ Avanzar el estado de una orden

```bash
curl -X POST "http://127.0.0.1:3000/orders/dc22f1d5-aece-4a0b-ab45-91de9cc0dec4/advance" \
  -H "Content-Type: application/json"
```

---

## 📊 Flujo de Estados

Las órdenes pasan por los siguientes estados:

```
initiated → sent → delivered
```

- **initiated**: Orden creada
- **sent**: Orden enviada a cocina
- **delivered**: Orden entregada (se elimina de la base de datos)

---

## 📂 Estructura del Proyecto

```
restaurant-orders-api/
├── src/
│   ├── orders/           # Módulo de órdenes
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── entities/     # Entidades de Sequelize
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   ├── orders.repository.ts
│   │   └── orders.module.ts
│   ├── common/           # Filtros e interceptores
│   │   ├── filters/
│   │   └── interceptors/
│   ├── config/           # Configuración de DB y Redis
│   ├── app.module.ts
│   └── main.ts
├── test/                 # Tests E2E
├── docker-compose.yml    # Orquestación de servicios
├── Dockerfile
└── README.md
```

---

## 🛠️ Tecnologías Utilizadas

- **NestJS** - Framework progresivo de Node.js
- **TypeScript** - Superset de JavaScript con tipado estático
- **Sequelize** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos relacional
- **Redis** - Caché en memoria
- **Docker** - Contenerización
- **Swagger** - Documentación interactiva de API
- **Jest** - Framework de testing

---

## 🧰 Requisitos

- **Docker**
- **Docker Compose**

> ⚠️ **Nota:** No necesitas instalar Node.js ni NestJS localmente.

---

## 🔄 Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/orders` | Listar todas las órdenes activas (no entregadas) |
| `GET` | `/orders/:id` | Obtener detalle de una orden específica |
| `POST` | `/orders` | Crear una nueva orden |
| `POST` | `/orders/:id/advance` | Avanzar el estado de una orden |

---

## ⚙️ Variables de Entorno

El proyecto incluye un archivo `.env.example` que puedes copiar a `.env`:

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=restaurant_orders

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# App
PORT=3000
NODE_ENV=production
```

---

## 🧪 Ejecutar Tests

```bash
# Tests E2E
docker compose exec app npm run test:e2e

# Tests unitarios
docker compose exec app npm run test

# Coverage
docker compose exec app npm run test:cov
```

---

## 🐳 Comandos Docker Útiles

```bash
# Ver logs de la aplicación
docker compose logs -f app

# Ver logs de PostgreSQL
docker compose logs -f postgres

# Ver logs de Redis
docker compose logs -f redis

# Detener todos los servicios
docker compose down

# Detener y eliminar volúmenes (limpieza completa)
docker compose down -v

# Reconstruir y reiniciar
docker compose up --build -d
```

---

## 📝 Características Técnicas

✅ **Arquitectura Modular** con separación de responsabilidades  
✅ **Principios SOLID** aplicados en toda la API  
✅ **Caché Redis** con TTL de 30 segundos en consultas  
✅ **Validación de DTOs** con class-validator  
✅ **Manejo de errores** centralizado con filtros  
✅ **Relaciones 1:N** entre Order y OrderItem  
✅ **Soft Delete** automático al llegar a estado "delivered"  
✅ **Documentación Swagger** generada automáticamente  
✅ **Tests E2E** con Jest  
✅ **Contenerización completa** con Docker

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama con tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 👨‍💻 Autor

Desarrollado con ❤️ para gestión eficiente de órdenes de restaurante.

---

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias, por favor abre un **Issue** en el repositorio.

---

**¡Disfruta construyendo con esta API! 🚀**
