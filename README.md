# 📦 Restaurant Orders API

API desarrollada en **NestJS** para gestionar órdenes de restaurante, incluyendo creación, consulta, actualización de estado y documentación con Swagger.

---

## 🚀 Inicio Rápido

### 🔧 Construir los contenedores
```bash
docker compose build --no-cache
▶️ Ejecutar la aplicación
bash

docker compose up
La API estará disponible en:


http://localhost:3000
📘 Documentación Swagger
La API incluye documentación interactiva generada con Swagger UI.

👉 Accede a:

bash
Copiar código
http://localhost:3000/api
Aquí podrás probar todos los endpoints sin necesidad de Postman o curl.

🧪 Ejemplos de uso con cURL
(Puedes importarlos directamente en Postman)

🔍 Obtener una orden por ID

curl --location --request GET 'http://127.0.0.1:3000/orders/62573357-16a3-43d4-95fc-a8dd7b748fbf'
➕ Crear una nueva orden

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
🔄 Avanzar el estado de una orden

curl -X PUT "http://127.0.0.1:3000/orders/dc22f1d5-aece-4a0b-ab45-91de9cc0dec4/advance" \
  -H "Content-Type: application/json"
📂 Estructura del Proyecto
/src/orders — Controladores, servicios y entidades de órdenes

/src/common — Filtros, interceptores y utilidades

/docker-compose.yml — Orquestación de la API + Postgres

/api — Documentación Swagger

🧰 Requisitos
Docker

Docker Compose

No necesitas instalar Node.js ni NestJS localmente.
