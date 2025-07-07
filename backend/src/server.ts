import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import mediaRoutes from './routes/media';
import editionRoutes from './routes/edition';
import marketplaceRoutes from './routes/marketplace';
import rentalRoutes from './routes/rental';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/media', mediaRoutes);
app.use('/edition', editionRoutes);
app.use('/marketplace', marketplaceRoutes);
app.use('/rental', rentalRoutes);

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
}); 