import { NotificationModel, memoryNotifications } from "../models/index.js";
import { getDbStatus } from "../config/db.js";

export async function getNotifications(req, res) {
  try {
    const userEmail = req.user?.email || req.query.email;
    const isAdmin = req.user && req.user.role === 'admin';

    if (getDbStatus()) {
      let query = {};
      if (isAdmin) {
        query = {
          $or: [
            { recipientEmail: userEmail ? userEmail.toLowerCase() : 'admin@auraboutique.com' },
            { type: 'INVENTORY_ALERT' },
            { recipientEmail: 'admin@auraboutique.com' }
          ]
        };
      } else if (userEmail) {
        query = { recipientEmail: userEmail.toLowerCase() };
      } else {
        return res.json([]);
      }

      const notifs = await NotificationModel.find(query).sort({ createdAt: -1 }).limit(50);
      return res.json(notifs);
    } else {
      let list = [...memoryNotifications];
      if (isAdmin) {
        list = list.filter(n =>
          n.recipientEmail?.toLowerCase() === (userEmail ? userEmail.toLowerCase() : 'admin@auraboutique.com') ||
          n.type === 'INVENTORY_ALERT' ||
          n.recipientEmail === 'admin@auraboutique.com'
        );
      } else if (userEmail) {
        list = list.filter(n => n.recipientEmail?.toLowerCase() === userEmail.toLowerCase());
      } else {
        list = [];
      }
      return res.json(list.slice(0, 50));
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to load notifications" });
  }
}

export async function markNotificationAsRead(req, res) {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      const notif = await NotificationModel.findOneAndUpdate(
        { $or: [{ notificationId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        { isRead: true },
        { new: true }
      );
      if (!notif) return res.status(404).json({ error: "Notification not found" });
      return res.json(notif);
    } else {
      const n = memoryNotifications.find(x => x.notificationId === id);
      if (!n) return res.status(404).json({ error: "Notification not found" });
      n.isRead = true;
      return res.json(n);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update notification" });
  }
}

export async function clearAllNotifications(req, res) {
  try {
    const userEmail = req.user?.email || req.body?.email;
    if (!userEmail) return res.status(400).json({ error: "User email required" });

    if (getDbStatus()) {
      await NotificationModel.updateMany(
        { recipientEmail: userEmail.toLowerCase() },
        { $set: { isRead: true } }
      );
    } else {
      memoryNotifications.forEach(n => {
        if (n.recipientEmail?.toLowerCase() === userEmail.toLowerCase()) {
          n.isRead = true;
        }
      });
    }

    return res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear notifications" });
  }
}
