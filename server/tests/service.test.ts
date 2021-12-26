import request from "supertest";
import express, { Application } from 'express';
import { StatusLog } from "../src/service"

let app: Application

describe('APP should say "Hello World!"', () => {
  beforeAll(() => {
    app = express();
    let dummy = new StatusLog();
    let service = new StatusLog('/status/');
    service.registerRoutes(app);
  });

  it('should return 200', (done) => {
    request(app)
      .get('/status/')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body).toMatchObject({ 'message': `Hello World!` })
        done()
      })
  });

  it('should return 500', (done) => {
    request(app)
      .get('/status/entity/?limit=4&start=4')
      .expect(500)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body).toMatchObject({})
        done()
      })
  });
});