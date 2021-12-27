import request from "supertest";
import express, { Application } from 'express';
import { StatusLog } from "../src/service"

let app: Application

describe('POST /event basically works.', () => {
	beforeAll(() => {
		app = express();
		app.use(express.json());
		let dummy = new StatusLog();
		let service = new StatusLog('/status/');
		service.registerRoutes(app);
	});

	let firstId: string | number;

	it('should return 200 with id, on post', (done) => {
		request(app)
			.post('/status/event/')
			.send({
				"entity": "demo1",
				"value": "e",
				"timestamp": "2001-12-24T12:05:00",
				"validFor": 10.5,
				"extraDummy": 45
			})
			.expect(200)
			.end((err, res) => {
				if (err) return done(err)
				const o = res.body;
				expect(o.id).toBeDefined();
				firstId = o.id;
				done();
			})
	});

	it('should return 200 with other id, on second post', (done) => {
		request(app)
			.post('/status/event/')
			.send({
				"entity": "demo1",
				"value": "g",
				"timestamp": "2001-12-24T12:06:00",
				"validFor": 1
			})
			.expect(200)
			.end((err, res) => {
				if (err) return done(err)
				const o = res.body;
				expect(o.id).toBeDefined();
				expect(o.id != firstId).toBe(true);
				done();
			})
	});

	it('should return 400, on post of bad data (value)', (done) => {
		request(app)
			.post('/status/event/')
			.send({
				"entity": "demo1",
				"value": "x",
				"validFor": 1
			})
			.expect(400)
			.end((err, res) => {
				if (err) return done(err)
				done();
			})
	});

	it('should return 400, on post of bad data (timestamp)', (done) => {
		request(app)
			.post('/status/event/')
			.send({
				"entity": "demo1",
				"value": "e",
				"timestamp": "malformedTimeString",
				"validFor": 1
			})
			.expect(400)
			.end((err, res) => {
				if (err) return done(err)
				done();
			})
	});

	it('should return 400, on post of bad data (text)', (done) => {
		request(app)
			.post('/status/event/')
			.send({
				"entity": "demo1",
				"value": "e",
				"validFor": 1,
				"text": 2
			})
			.expect(400)
			.end((err, res) => {
				if (err) return done(err)
				done();
			})
	});

})

/*
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
*/
