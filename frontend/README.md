# ⚡ Real-Time Insurance Claim Stream Adjudication Engine

An event-driven, high-throughput microservice backend built with **Java 21 Virtual Threads**, **Spring Boot**, **Apache Kafka**, and **Redis**. 

This system ingests high-volume insurance peril events, processes risk-scoring rules in real time, and routes claims through automated straight-through processing (STP) or manual adjuster review queues.

---

## 🚀 Key Features

* **High-Concurrency Stream Ingestion:** Leverages Java 21 Virtual Threads (`Executors.newVirtualThreadPerTaskExecutor`) to ingest and publish concurrent catastrophe events to Kafka with minimal thread-context overhead.
* **Automated Risk Engine:** Evaluates incoming claims against rule criteria (velocity checks, maximum coverage limits, peril coverage, and round-number claim detection).
* **Straight-Through Processing (STP):** Instantly auto-approves low-risk claims (`Risk Score < 15`) and publishes payout events to down-stream payment queues.
* **Velocity Tracking via Redis:** Implements rolling window velocity checks per policy number using Redis counters to flag high-frequency suspicious claims.
* **Interactive Monitoring & Simulator Dashboard:** Modern dark-mode React frontend allowing real-time trigger testing and metrics tracking for STP rates and manual queues.

---

## 🛠️ Tech Stack

* **Backend:** Java 21, Spring Boot 3, Spring Data JPA, Spring Kafka, Redis (`StringRedisTemplate`)
* **Database:** PostgreSQL (Relational Policy & Claim storage)
* **Messaging & Cache:** Apache Kafka, Redis
* **Frontend:** React, Tailwind CSS, Lucide Icons, Axios

---

## ⚡ Real-World Impact

Insurance claim backlogs during natural catastrophes can delay policyholder relief by weeks. This platform demonstrates how event-driven streaming architecture handles **thousands of simultaneous ingestion streams**, automatically settling clear claims in seconds while escalating genuine risk edge cases to human adjusters.

---

## 🚦 Getting Started

### Prerequisites
* Docker & Docker Compose
* JDK 21+
* Node.js v18+

### 1. Start Infrastructure Services
```bash
docker-compose up -d