import request from "supertest";
import express, { Application } from 'express';
import { StatusLogService } from "../src/service"

let app: Application

describe('POST /event basically works.', () => {
	beforeAll(() => {
		app = express();
		app.use(express.json());
		(new StatusLogService('/status/')).registerRoutes(app);
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

describe('POST /entity basically works.', () => {
	beforeAll(() => {
		app = express();
		app.use(express.json());
		(new StatusLogService('/status/')).registerRoutes(app);
	});
	
	let firstId: string | number;
	it('should return 200 with id, on post', (done) => {
		request(app)
			.post('/status/entity/')
			.send({
				"id": "entity1"
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
			.post('/status/entity/')
			.send({
				"id": "entity2",
				"type": "fancyType"
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

	it('should return 400, on post of bad data (no id)', (done) => {
		request(app)
			.post('/status/entity/')
			.send({
				"text": "wut?"
			})
			.expect(400)
			.end((err, res) => {
				if (err) return done(err)
				done();
			})
	});

	it('should return 409, on post of bad data (double post)', (done) => {
		request(app)
			.post('/status/entity/')
			.send({
				"id": "entity2",
				"maxCount": 100
			})
			.expect(409)
			.end((err, res) => {
				if (err) return done(err)
				done();
			})
	});
})

describe('POST /type basically works.', () => {
	beforeAll(() => {
		app = express();
		app.use(express.json());
		(new StatusLogService('/status/')).registerRoutes(app);
	});

	let firstId: string | number;
	it('should return 200 with id, on post', (done) => {
		request(app)
			.post('/status/type/')
			.send({
				"id": "type1",
				"maxCount": 100
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
			.post('/status/type/')
			.send({
				"id": "type2",
				"text": "hello world"
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

	it('should return 400, on post of bad data (no id)', (done) => {
		request(app)
			.post('/status/type/')
			.send({
				"text": "wut?"
			})
			.expect(400)
			.end((err, res) => {
				if (err) return done(err)
				done();
			})
	});

	it('should return 400, on post of bad data (empty)', (done) => {
		request(app)
			.post('/status/type/')
			.send({
				"id": "type3"
			})
			.expect(400)
			.end((err, res) => {
				if (err) return done(err)
				done();
			})
	});

	it('should return 409, on post of bad data (double post)', (done) => {
		request(app)
			.post('/status/type/')
			.send({
				"id": "type1",
				"maxCount": 100
			})
			.expect(409)
			.end((err, res) => {
				if (err) return done(err)
				done();
			})
	});

})

describe('POST /future-value basically works.', () => {
	// beforeAll(() => {
	// 	app = express();
	// 	app.use(express.json());
	// 	(new StatusLogService('/status/')).registerRoutes(app);
	// });
})