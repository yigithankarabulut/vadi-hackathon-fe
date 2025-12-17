# 🚛 IoT Canlı Filo Takip ve Uyarı Sistemi

![Go](https://img.shields.io/badge/backend-Go-00ADD8?style=flat&logo=go&logoColor=white)
![React](https://img.shields.io/badge/frontend-React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/language-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/style-Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![K3s](https://img.shields.io/badge/orchestration-K3s-FFC61C?style=flat&logo=kubernetes&logoColor=white)
![Redis](https://img.shields.io/badge/database-Redis-DC382D?style=flat&logo=redis&logoColor=white)

Bu proje, araç filolarından gelen yüksek frekanslı telemetri verilerini (GPS, hız, sıcaklık) gerçek zamanlı olarak işleyen, görselleştiren ve anlık iletişim sağlayan kapsamlı bir IoT çözümüdür. Sistem, veri kaybını önlemek için gelişmiş **Failover (Hata Toleransı)** mekanizmalarına sahiptir.

## 📋 İçindekiler

- [Proje Özeti](#-proje-özeti)
- [Sistem Mimarisi](#-sistem-mimarisi)
- [Teknoloji Yığını](#-teknoloji-yığını)
- [Temel Özellikler](#-temel-özellikler)
- [Dayanıklılık: Redis Fallback](#-dayanıklılık-redis-fallback)
- [Kurulum ve Çalıştırma](#-kurulum-ve-çalıştırma)
- [Gözlemlenebilirlik](#-gözlemlenebilirlik)
- [Lisans](#-lisans)

---

## 🚀 Proje Özeti

Sistem, sahadaki araçlardan **1 Hz (saniyede 1 veri)** frekansında gelen verileri toplar. **Go** dilinin yüksek performanslı eşzamanlılık (concurrency) yetenekleri sayesinde binlerce cihazdan gelen veri anlık olarak işlenir. Yöneticiler harita üzerinde araçları takip edebilir, geçmişe dönük grafikleri inceleyebilir ve kurallar ihlal edildiğinde anlık uyarı alır.

---

## 🏗 Sistem Mimarisi

Veri akışı uçtan uca şu şekildedir:

1.  **Edge (ESP32):** Sensör verilerini okur ve MQTT Broker'a yayınlar.
2.  **Ingestion (Go):** MQTT konusuna abone olur, veriyi karşılar.
3.  **Buffer:** Veriler işlenmek üzere Redis kuyruğuna yazılır.
4.  **Processing:** Uyarı motoru veriyi analiz eder (Geofence, Sıcaklık Eşiği).
5.  **Storage:** Veriler kalıcı saklama için Telemetry DB'ye yazılır.
6.  **Presentation:** İşlenen veriler WebSocket üzerinden React frontend'e canlı aktarılır.

🛠 Teknoloji Yığını

 Donanım & IoT
 
MCU: ESP32 (C++ / MicroPython)

Protokol: MQTT (Message Queuing Telemetry Transport)

 Backend
Dil: Go (Golang)

Web Server: Gin / Fiber / Standard Lib

WebSocket: Gorilla WebSocket

Cache & Queue: Redis

Veritabanı: Telemetry DB (Örn: InfluxDB / TimescaleDB)

 Frontend

Framework: React

Dil: TypeScript

Stil: Tailwind CSS

Harita: Leaflet / Mapbox

Grafik: Recharts / Chart.js

☁️ DevOps
Orkestrasyon: K3s (Lightweight Kubernetes)

Container: Docker

