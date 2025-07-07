const requestMp = require('supertest');
const expressMp = require('express');
const mpRoutes = require('../src/routes/marketplace').default;

jest.mock('../src/services/contractService', () => ({
  listToken: jest.fn().mockResolvedValue('0xlist'),
  purchaseToken: jest.fn().mockResolvedValue('0xbuy'),
}));

const appMp = expressMp();
appMp.use(expressMp.json());
appMp.use('/marketplace', mpRoutes);

describe('Marketplace routes', () => {
  it('list token', async () => {
    const res = await requestMp(appMp)
      .post('/marketplace/list')
      .send({ tokenId: 1, priceWei: '1000000000000000000' });
    expect(res.status).toBe(200);
    expect(res.body.txHash).toBe('0xlist');
  });

  it('purchase token validation', async () => {
    const res = await requestMp(appMp).post('/marketplace/purchase').send({});
    expect(res.status).toBe(400);
  });
}); 