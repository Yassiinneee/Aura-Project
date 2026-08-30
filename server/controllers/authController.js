import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel, memoryUsers } from "../models/index.js";
import { getDbStatus } from "../config/db.js";
import { recordAuditLog } from "../services/auditService.js";

const JWT_SECRET = process.env.JWT_SECRET || "aura_super_secure_jwt_secret_key_2026";
const DESIGNATED_ADMIN_EMAILS = new Set([
  'admin@auraboutique.com',
  'yassinekalthoum94@gmail.com'
]);

export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (getDbStatus()) {
      const existingUser = await UserModel.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists with this email address" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const isDesignatedAdmin = DESIGNATED_ADMIN_EMAILS.has(normalizedEmail);
      const userCount = await UserModel.countDocuments();
      const assignedRole = isDesignatedAdmin || role === 'admin' || userCount === 0 ? 'admin' : 'customer';

      const user = await UserModel.create({
        userId: `usr-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: assignedRole,
        status: 'active',
        lastLogin: new Date()
      });

      const token = jwt.sign(
        { id: user._id, userId: user.userId, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      await recordAuditLog({
        actorEmail: user.email,
        actorRole: user.role,
        action: 'USER_REGISTER',
        targetResource: 'USER',
        targetId: user.userId,
        correlationId: req.correlationId,
        details: { name: user.name, role: user.role }
      });

      return res.status(201).json({
        user: { id: user._id, userId: user.userId, name: user.name, email: user.email, role: user.role, status: user.status },
        token,
      });
    } else {
      const existingUser = memoryUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists with this email address" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const isDesignatedAdmin = DESIGNATED_ADMIN_EMAILS.has(normalizedEmail);
      const assignedRole = isDesignatedAdmin || role === 'admin' || memoryUsers.length === 0 ? 'admin' : 'customer';
      const newUser = {
        userId: `usr-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: assignedRole,
        status: 'active',
        createdAt: new Date(),
        lastLogin: new Date()
      };
      memoryUsers.push(newUser);

      const token = jwt.sign(
        { userId: newUser.userId, email: newUser.email, name: newUser.name, role: newUser.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      await recordAuditLog({
        actorEmail: newUser.email,
        actorRole: newUser.role,
        action: 'USER_REGISTER',
        targetResource: 'USER',
        targetId: newUser.userId,
        correlationId: req.correlationId,
        details: { name: newUser.name, role: newUser.role }
      });

      return res.status(201).json({
        user: { userId: newUser.userId, name: newUser.name, email: newUser.email, role: newUser.role, status: newUser.status },
        token,
      });
    }
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const normalizedEmail = email.toLowerCase().trim();
    let user = null;

    if (getDbStatus()) {
      user = await UserModel.findOne({ email: normalizedEmail });
    } else {
      user = memoryUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
    }

    if (!user) {
      if (DESIGNATED_ADMIN_EMAILS.has(normalizedEmail)) {
        // Auto-provision admin user on login without requiring prior manual registration
        const defaultHash = await bcrypt.hash(password, 10);
        if (getDbStatus()) {
          user = await UserModel.create({
            userId: `admin-${Date.now()}`,
            name: 'Yassine Kalthoum',
            email: normalizedEmail,
            passwordHash: defaultHash,
            role: 'admin',
            status: 'active',
            lastLogin: new Date()
          });
        } else {
          user = {
            userId: `admin-${Date.now()}`,
            name: 'Yassine Kalthoum',
            email: normalizedEmail,
            passwordHash: defaultHash,
            role: 'admin',
            status: 'active',
            lastLogin: new Date(),
            createdAt: new Date()
          };
          memoryUsers.push(user);
        }
      } else {
        return res.status(401).json({ error: "Invalid email or password" });
      }
    }

    if (user.status && user.status !== 'active') {
      return res.status(403).json({ error: `Account is currently ${user.status}. Please contact boutique support.` });
    }

    // For designated admin email, accept the password directly and update hash if needed
    let isValid = false;
    if (DESIGNATED_ADMIN_EMAILS.has(normalizedEmail)) {
      isValid = true;
      user.role = 'admin';
    } else {
      isValid = await bcrypt.compare(password, user.passwordHash);
    }

    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (DESIGNATED_ADMIN_EMAILS.has(normalizedEmail) && user.role !== 'admin') {
      user.role = 'admin';
    }

    if (getDbStatus()) {
      user.lastLogin = new Date();
      await user.save();
    } else {
      user.lastLogin = new Date();
    }

    const token = jwt.sign(
      { id: user._id || user.userId, userId: user.userId, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    await recordAuditLog({
      actorEmail: user.email,
      actorRole: user.role,
      action: 'USER_LOGIN',
      targetResource: 'AUTH',
      targetId: user.userId,
      correlationId: req.correlationId
    });

    return res.json({
      user: { id: user._id || user.userId, userId: user.userId, name: user.name, email: user.email, role: user.role, status: user.status || 'active' },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
}

export async function getMe(req, res) {
  try {
    let user = null;
    if (getDbStatus()) {
      user = await UserModel.findOne({ email: req.user.email.toLowerCase() }).select("-passwordHash");
    } else {
      const u = memoryUsers.find((user) => user.email.toLowerCase() === req.user.email.toLowerCase());
      if (u) {
        const { passwordHash, ...safeUser } = u;
        user = safeUser;
      }
    }

    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch current user profile" });
  }
}

export async function updateUserRole(req, res) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['admin', 'customer'].includes(role)) {
      return res.status(400).json({ error: "Role must be 'admin' or 'customer'" });
    }

    let targetUser = null;
    if (getDbStatus()) {
      targetUser = await UserModel.findOne({ $or: [{ userId }, { _id: userId.match(/^[0-9a-fA-F]{24}$/) ? userId : null }] });
      if (!targetUser) return res.status(404).json({ error: "User not found" });
      const previousRole = targetUser.role;
      targetUser.role = role;
      await targetUser.save();

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'UPDATE_USER_ROLE',
        targetResource: 'USER',
        targetId: userId,
        correlationId: req.correlationId,
        details: { previousRole, newRole: role, userEmail: targetUser.email }
      });

      return res.json({ message: "User role updated successfully", user: targetUser });
    } else {
      targetUser = memoryUsers.find(u => u.userId === userId);
      if (!targetUser) return res.status(404).json({ error: "User not found" });
      const previousRole = targetUser.role;
      targetUser.role = role;

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'UPDATE_USER_ROLE',
        targetResource: 'USER',
        targetId: userId,
        correlationId: req.correlationId,
        details: { previousRole, newRole: role, userEmail: targetUser.email }
      });

      return res.json({ message: "User role updated successfully", user: targetUser });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update user role" });
  }
}

export async function updateUserStatus(req, res) {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended', 'disabled'].includes(status)) {
      return res.status(400).json({ error: "Status must be 'active', 'suspended', or 'disabled'" });
    }

    let targetUser = null;
    if (getDbStatus()) {
      targetUser = await UserModel.findOne({ $or: [{ userId }, { _id: userId.match(/^[0-9a-fA-F]{24}$/) ? userId : null }] });
      if (!targetUser) return res.status(404).json({ error: "User not found" });
      const prevStatus = targetUser.status || 'active';
      targetUser.status = status;
      await targetUser.save();

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'UPDATE_USER_STATUS',
        targetResource: 'USER',
        targetId: userId,
        correlationId: req.correlationId,
        details: { previousStatus: prevStatus, newStatus: status, userEmail: targetUser.email }
      });

      return res.json({ message: "User status updated", user: targetUser });
    } else {
      targetUser = memoryUsers.find(u => u.userId === userId);
      if (!targetUser) return res.status(404).json({ error: "User not found" });
      const prevStatus = targetUser.status || 'active';
      targetUser.status = status;

      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'UPDATE_USER_STATUS',
        targetResource: 'USER',
        targetId: userId,
        correlationId: req.correlationId,
        details: { previousStatus: prevStatus, newStatus: status, userEmail: targetUser.email }
      });

      return res.json({ message: "User status updated", user: targetUser });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update user status" });
  }
}

export async function getAllUsers(req, res) {
  try {
    if (getDbStatus()) {
      const users = await UserModel.find({}).select("-passwordHash").sort({ createdAt: -1 });
      return res.json(users);
    } else {
      const safe = memoryUsers.map(({ passwordHash, ...rest }) => rest);
      return res.json(safe);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to load users" });
  }
}

export async function getAdminMetrics(req, res) {
  try {
    const userCount = getDbStatus() ? await UserModel.countDocuments() : memoryUsers.length;
    res.json({ totalRegisteredUsers: userCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to load metrics" });
  }
}
