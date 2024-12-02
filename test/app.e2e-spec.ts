import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Rental API (e2e)', () => {
    const validRental = {
      customer_id: 1,
      inventory_id: 1,
      staff_id: 1,
      rental_date: new Date(),
      timezone: 'Europe/Paris',
      rental_duration: 14,
    };

    it('should create rental', () => {
      return request(app.getHttpServer())
        .post('/rentals')
        .send(validRental)
        .expect(201);
    });

    it('should reject rental with invalid duration', () => {
      return request(app.getHttpServer())
        .post('/rentals')
        .send({ ...validRental, rental_duration: 5 })
        .expect(400);
    });

    it('should reject rental with invalid timezone', () => {
      return request(app.getHttpServer())
        .post('/rentals')
        .send({ ...validRental, timezone: 'Invalid/TZ' })
        .expect(400);
    });

    it('should reject modification of ongoing rental', async () => {
      const rental = await request(app.getHttpServer())
        .post('/rentals')
        .send(validRental);

      return request(app.getHttpServer())
        .put(`/rentals/${rental.body.rental_id}`)
        .send({ return_date: new Date() })
        .expect(400);
    });
  });
});
