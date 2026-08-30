import { recordAuditLog } from "../services/auditService.js";

export async function uploadImage(req, res) {
  try {
    const { dataUrl, filename, mimeType } = req.body;
    if (!dataUrl) return res.status(400).json({ error: "Data URL is required" });

    // Enforce payload size safety limit (e.g. 5MB)
    const base64Data = dataUrl.split(',')[1] || dataUrl;
    const approximateSizeInBytes = (base64Data.length * (3 / 4));
    if (approximateSizeInBytes > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "Image exceeds 5MB upload size limit." });
    }

    const publicUrl = dataUrl;

    if (req.user) {
      await recordAuditLog({
        actorEmail: req.user.email,
        action: 'UPLOAD_ASSET',
        targetResource: 'MEDIA',
        targetId: filename || `asset-${Date.now()}`,
        correlationId: req.correlationId,
        details: { filename, sizeBytes: Math.round(approximateSizeInBytes), mimeType }
      });
    }

    return res.json({
      url: publicUrl,
      filename: filename || `upload-${Date.now()}.jpg`,
      size: Math.round(approximateSizeInBytes)
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to process image upload" });
  }
}
