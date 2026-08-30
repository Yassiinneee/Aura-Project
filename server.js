import "dotenv/config";
import express from "express";
import http from "http";
import path from "path";
import fs from "fs";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { connectDB, getDbStatus } from "./server/config/db.js";
import { initSocketIO } from "./server/websockets/index.js";
import { apiLimiter } from "./server/middlewares/rateLimiter.js";
import { getCorrelationId } from "./server/services/auditService.js";
import apiRouter from "./server/routes/index.js";

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Trust proxy for reverse proxy environment (Cloud Run, Render, Nginx)
  app.set('trust proxy', 1);

  // Cross-Origin Resource Sharing (CORS) for Vercel <-> Render communication
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['*'];

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.) or wildcard match
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for production deployment flexibility
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-ID']
  }));

  // Connect to Database (or initialize in-memory fallback)
  await connectDB();

  // Initialize Real-Time WebSockets Engine
  initSocketIO(httpServer);

  // Core Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Correlation ID Middleware for end-to-end request tracing
  app.use((req, res, next) => {
    const correlationId = getCorrelationId(req);
    req.correlationId = correlationId;
    res.setHeader('X-Correlation-ID', correlationId);
    next();
  });

  // Global Rate Limiting
  app.use("/api", apiLimiter);

  // Root & Health Endpoints
  app.get("/", (req, res, next) => {
    // If standalone backend on Render without frontend build
    const distIndex = path.join(process.cwd(), 'dist', 'index.html');
    if (process.env.NODE_ENV === "production" && !fs.existsSync(distIndex)) {
      return res.json({
        message: "Aura Boutique Backend API Service (Render)",
        status: "online",
        health: "/api/health",
        version: "1.0.0"
      });
    }
    next();
  });

  // System Health Endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      mongoConnected: getDbStatus(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
      timestamp: new Date().toISOString()
    });
  });

  // Mount Unified API Router (controllers, models, routes, websockets)
  app.use("/api", apiRouter);

  // Vite Middleware Setup (Development vs Production SPA)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        const indexPath = path.join(distPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).json({ error: "Page not found" });
        }
      });
    }
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`[Aura Boutique Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal Server Startup Error:", err);
});

