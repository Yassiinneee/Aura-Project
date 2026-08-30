import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "aura_super_secure_jwt_secret_key_2026";

let ioInstance = null;

export function initSocketIO(httpServer) {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Socket authentication middleware
  ioInstance.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      // Allow guest socket connection with anonymous room
      socket.user = { isGuest: true, email: socket.handshake.query?.email?.toLowerCase() };
      return next();
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      console.warn("Socket auth token invalid, continuing as guest");
      socket.user = { isGuest: true };
      next();
    }
  });

  ioInstance.on("connection", (socket) => {
    const email = socket.user?.email;
    const role = socket.user?.role;

    if (email) {
      const userRoom = `user:${email.toLowerCase()}`;
      socket.join(userRoom);
    }

    if (role === 'admin') {
      socket.join("admins");
    }

    socket.on("join_order_room", (orderId) => {
      if (orderId) {
        socket.join(`order:${orderId}`);
      }
    });

    socket.on("disconnect", () => {
      // Disconnected cleanly
    });
  });

  return ioInstance;
}

export function emitNotification(notification) {
  if (!ioInstance) return;

  const targetEmail = notification.recipientEmail?.toLowerCase();
  
  // Emit to specific user room if recipient specified
  if (targetEmail) {
    ioInstance.to(`user:${targetEmail}`).emit("notification.created", notification);
  }

  // If order notification, also emit to order room
  if (notification.orderId) {
    ioInstance.to(`order:${notification.orderId}`).emit("notification.created", notification);
  }

  // Admins always receive inventory and high-level notifications
  if (notification.type === 'INVENTORY_ALERT' || notification.broadcastAdmin) {
    ioInstance.to("admins").emit("notification.created", notification);
  }
}

export function getIO() {
  return ioInstance;
}
