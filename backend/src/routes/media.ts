import { Router } from 'express';
import * as mediaController from '../controllers/mediaController';
import * as dashboardController from '../controllers/dashboardController';
import crypto from 'crypto';
import multer from 'multer';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Register media with file upload
router.post('/register', upload.single('file'), mediaController.registerMedia);

// Dashboard endpoints
router.get('/user', dashboardController.getUserMedia);

// Add verification endpoint
router.post('/verify', async (req, res) => {
  try {
    // For now, we'll handle file upload differently
    // This is a placeholder until we implement proper file handling
    const { fileHash } = req.body;
    
    if (!fileHash) {
      return res.status(400).json({ error: 'No file hash provided' });
    }
    
    // Check if hash exists in smart contract
    const isRegistered = await checkMediaHash(fileHash);
    
    if (isRegistered) {
      const mediaInfo = await getMediaInfo(fileHash);
      res.json({
        verified: true,
        message: 'File is authentic and registered',
        mediaInfo
      });
    } else {
      res.json({
        verified: false,
        message: 'File is not registered or may have been tampered with'
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

async function checkMediaHash(hash: string): Promise<boolean> {
  // Implementation to check if hash exists in smart contract
  // This would interact with your MediaRegistry contract
  return false; // Placeholder
}

async function getMediaInfo(hash: string): Promise<any> {
  // Implementation to get media info from blockchain
  return {}; // Placeholder
}

export default router; 