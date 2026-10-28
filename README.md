# Hệ Thống Quản Lý & Cho Thuê Bất Động Sản Công Nghiệp (Nhà Xưởng)

Dự án nền tảng BĐS Công nghiệp (Frontend React 19 + Three.js + Vite và Backend .NET 8 Web API + Docker).

---

## 🌐 Trạng Thái Triển Khai (Deployment Status)

| Phần | Nền tảng | Trạng thái | Đường dẫn trực tiếp |
| :--- | :--- | :--- | :--- |
| **Frontend (FE)** | **Vercel** | ![Deployed](https://img.shields.io/badge/Vercel-LIVE-success?style=for-the-badge&logo=vercel) | [nhaxuong-fe.vercel.app](https://nhaxuong-fe.vercel.app) |
| **Backend (BE)** | **Render** | ![Deployed](https://img.shields.io/badge/Render-LIVE-success?style=for-the-badge&logo=render) | [nhaxuong-backend.onrender.com](https://nhaxuong-backend.onrender.com) |

---

## 🚀 Triển Khai Backend Lên Render (1-Click Deploy)

Nhấn vào nút bên dưới để Render tự động đọc file `render.yaml` và build Docker Web Service:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Tuannvtse161029/nhaxuong)

Hoặc truy cập trực tiếp:
👉 **[https://render.com/deploy?repo=https://github.com/Tuannvtse161029/nhaxuong](https://render.com/deploy?repo=https://github.com/Tuannvtse161029/nhaxuong)**

* **Dockerfile:** `BE/Dockerfile`
* **Port:** `8080`
* **Healthcheck:** `/healthz`
* **Swagger:** `/swagger`
