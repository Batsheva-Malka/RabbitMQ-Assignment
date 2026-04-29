# RabbitMQ Weather Assignment

Two Node.js services communicating via RabbitMQ (async processing).

## Services

### 1) Producer API
- Folder: `producer-api/`
- Endpoint: **POST** `/weather/request` with JSON `{ "city": "Tel Aviv" }`
- Behavior: publishes to RabbitMQ queue `weather_queue` and returns immediately (`202`)

Swagger:
- UI: `http://localhost:3000/docs`
- Spec: `http://localhost:3000/docs.json`

### 2) Processor Service (Consumer + Result API)
- Folder: `processor-service/`
- Consumer: listens to RabbitMQ queue `weather_queue`, processes messages, stores results **in memory**
- Endpoint: **GET** `/weather/result?city=Tel%20Aviv`

Swagger:
- UI: `http://localhost:3001/docs`
- Spec: `http://localhost:3001/docs.json`

> Note: Results are stored in-memory in the processor service. Restarting it clears stored results.

## Shared RabbitMQ package

- Folder: `packages/rabbit-service/`
- Provides RabbitMQ connection + publish/consume helpers

## RabbitMQ (Docker)

```bash
docker run -d --hostname rabbit \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management
```

Management UI:
- `http://localhost:15672` (user: `guest`, password: `guest`)

## Environment variables

- `RABBITMQ_URL` (default: `amqp://localhost`)
- `RABBITMQ_QUEUE` (default: `weather_queue`)
- `PORT` (producer default: `3000`, processor default: `3001`)

## Install

From the repo root:

```bash
npm install
```

## Run

In one terminal:
```bash
npm run start:processor
```

In a second terminal:
```bash
npm run start:producer
```

Alternative (without npm workspaces):
```bash
npm run start:processor:prefix
npm run start:producer:prefix
```

## Quick test

1) Send a request:
```bash
curl -X POST http://localhost:3000/weather/request -H "Content-Type: application/json" -d "{\"city\":\"Tel Aviv\"}"
```

2) Fetch the result:
```bash
curl "http://localhost:3001/weather/result?city=Tel%20Aviv"
```
