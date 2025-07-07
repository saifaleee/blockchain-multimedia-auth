const req = require('supertest');
const expressRt = require('express');
const rentalRoutes = require('../src/routes/rental').default;

jest.mock('../src/services/contractService', () => ({
  rentOut: jest.fn().mockResolvedValue('0xrent'),
}));

const appRental = expressRt();
appRental.use(expressRt.json());
appRental.use('/rental', rentalRoutes);

describe('Rental route', () => {
  it('rent token', async () => {
    const res = await req(appRental)
      .post('/rental/rent')
      .send({ tokenId: 1, renter: '0xabc', duration: 3600 });
    expect(res.status).toBe(200);
  });
}); 