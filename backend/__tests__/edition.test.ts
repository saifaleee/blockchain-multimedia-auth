const request = require('supertest');
const express = require('express');
const editionRoutes = require('../src/routes/edition').default;

jest.mock('../src/services/contractService', () => ({
  registerEdition: jest.fn().mockResolvedValue('0xeditiontx'),
}));

const app = express();
app.use(express.json());
app.use('/edition', editionRoutes);

describe('POST /edition/register', () => {
  it('should return txHash', async () => {
    const res = await request(app)
      .post('/edition/register')
      .send({ hashHex: '0xhash', metadataURI: 'ipfs://xyz', amount: 5 });
    expect(res.status).toBe(200);
    expect(res.body.txHash).toBe('0xeditiontx');
  });

  it('should validate inputs', async () => {
    const res = await request(app).post('/edition/register').send({});
    expect(res.status).toBe(400);
  });
}); 