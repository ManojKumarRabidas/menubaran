/**
 * middleware/uploadMiddleware.js
 * ──────────────────────────────
 * Backwards-compatible re-export.
 * Delegates to config/upload.js which switches between local diskStorage
 * (development) and Cloudinary (production) based on NODE_ENV.
 *
 * Existing imports of this file (e.g. in routes/index.js) continue to work
 * without modification.
 */
import { getUploader } from '../config/upload.js';

// Default uploader writes to uploads/restaurants/ (the primary use-case).
// Routes that need a different subfolder should import getUploader directly.
const upload = getUploader('restaurants');

export default upload;
