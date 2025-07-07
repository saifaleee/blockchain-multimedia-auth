const request = require('supertest');
const express = require('express');
const mediaRoutes = require('../src/routes/media').default;

// Mock contractService
jest.mock('../src/services/contractService', () => ({
  registerMedia: jest.fn().mockResolvedValue('0xtxhash'),
}));

const app = express();
app.use(express.json());
app.use('/media', mediaRoutes);

describe('POST /media/register', () => {
  it('should return txHash for valid input', async () => {
    const res = await request(app)
      .post('/media/register')
      .send({ hashHex: '0xabc', metadataURI: 'ipfs://meta' });

    expect(res.status).toBe(200);
    expect(res.body.txHash).toBe('0xtxhash');
  });

  it('should fail with 400 for missing params', async () => {
    const res = await request(app).post('/media/register').send({});
    expect(res.status).toBe(400);
  });
}); 