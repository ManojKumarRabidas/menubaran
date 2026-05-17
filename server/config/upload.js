/**
 * config/upload.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Returns a configured multer instance that writes to:
 *   • Local disk  (NODE_ENV !== 'production')  → uploads/<folder>/
 *   • Cloudinary  (NODE_ENV === 'production')   → Cloudinary folder
 *
 * Usage:
 *   import { getUploader } from '../config/upload.js';
 *   const upload = getUploader('restaurants');
 *   router.post('/register', upload.fields([...]), handler);
 *
 * Controller compatibility guarantee
 * ───────────────────────────────────
 *   In both modes each file object carries:
 *     file.path     – local absolute path  OR  Cloudinary secure_url
 *     file.filename – basename used by the controller to build DB paths
 *                     (Cloudinary: the public_id is stored here)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Allowed file types ────────────────────────────────────────────────────────
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type "${file.mimetype}". Allowed: jpg, jpeg, png, webp, pdf.`
      ),
      false
    );
  }
};

const limits = { fileSize: 5 * 1024 * 1024 }; // 5 MB

// ── Local disk storage ────────────────────────────────────────────────────────
function buildDiskStorage(folderName) {
  // Resolve absolute path to  server/uploads/
  // Files are stored flat in the root uploads/ dir so that the controller's
  // `/uploads/${file.filename}` path building works without modification.
  // The folderName is used only for Cloudinary organisation.
  const uploadDir = path.join(__dirname, '..', 'uploads');

  // Auto-create the uploads/ root (and optional subfolder) if they don't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const subDir = path.join(uploadDir, folderName);
  if (!fs.existsSync(subDir)) {
    fs.mkdirSync(subDir, { recursive: true });
  }

  return multer.diskStorage({
    destination(_req, _file, cb) {
      cb(null, uploadDir); // write flat to uploads/
    },
    filename(_req, file, cb) {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
}

// ── Cloudinary storage ────────────────────────────────────────────────────────
async function buildCloudinaryStorage(folderName) {
  // Dynamic import keeps cloudinary out of dev bundles if you ever tree-shake
  const cloudinary = (await import('cloudinary')).v2;
  const { CloudinaryStorage } = await import('multer-storage-cloudinary');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder:         `menubaran/${folderName}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
      // Use the original fieldname + timestamp so filenames stay predictable
      public_id: (_req, file) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        return `${file.fieldname}-${uniqueSuffix}`;
      },
    },
  });
}

// ── Public factory ────────────────────────────────────────────────────────────
/**
 * getUploader(folderName) → multer instance
 *
 * In production the function is async (Cloudinary imports are dynamic).
 * We return a middleware wrapper so the route definition stays synchronous:
 *
 *   router.post('/register', getUploader('restaurants').fields([...]), handler)
 *
 * The wrapper calls the real middleware once the storage is ready.
 */
export function getUploader(folderName = 'general') {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // ── Synchronous path: local disk ──────────────────────────────────────────
    const storage = buildDiskStorage(folderName);
    return multer({ storage, fileFilter, limits });
  }

  // ── Async path: Cloudinary ────────────────────────────────────────────────
  // Build a lazy-initialised multer instance so the route definition is still
  // synchronous (the actual init happens on the first request).
  let _multerInstance = null;

  const lazyMiddleware = (method) =>
    async (req, res, next) => {
      try {
        if (!_multerInstance) {
          const storage = await buildCloudinaryStorage(folderName);
          _multerInstance = multer({ storage, fileFilter, limits });
        }
        _multerInstance[method](req, res, next);
      } catch (err) {
        next(err);
      }
    };

  // Proxy object that mirrors the multer API surface used in routes
  return {
    single:  (fieldName)  => lazyMiddleware(`single`)(fieldName),
    array:   (fieldName, maxCount) => lazyMiddleware(`array`)(fieldName, maxCount),
    fields:  (fieldsSpec) => async (req, res, next) => {
      try {
        if (!_multerInstance) {
          const storage = await buildCloudinaryStorage(folderName);
          _multerInstance = multer({ storage, fileFilter, limits });
        }
        _multerInstance.fields(fieldsSpec)(req, res, next);
      } catch (err) {
        next(err);
      }
    },
    none:    () => lazyMiddleware(`none`)(),
    any:     () => lazyMiddleware(`any`)(),
  };
}
