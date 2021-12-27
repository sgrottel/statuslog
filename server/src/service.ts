//
// Simple implementation of sg.statuslog
// Route implementation
// Available under MIT LICENSE
//
import { Application, Request, Response } from 'express';

function cleanObject(i: any): any {
	// remove undefined properties from object
	Object.keys(i).forEach(key => {
		if (i[key] === undefined) {
			delete i[key];
		}
	})
	return i;
}

interface EntityType {
	// name/id is map key
	maxAge: number | null,
	maxCount: number | null,
	text: string | null,
	link: string | null
}

interface Entity {
	// name/id is map key
	type: string | null,
	maxAge: number | null,
	maxCount: number | null,
	text: string | null,
	link: string | null
}

interface Event {
	entity: string,
	value: string,
	timestamp: Date | null,
	validFor: number,
	text: string | null,
	link: string | null
}

function cleanEvent(i: Event): Event {
	// explicitly copy only known values
	return cleanObject({
		entity: i.entity,
		value: i.value,
		timestamp: i.timestamp,
		validFor: i.validFor,
		text: i.text,
		link: i.link
	})
}

interface FutureValue {
	entity: string | null,
	type: string | null,
	value: string,
	validFor: number,
	text: string | null,
	link: string | null
}

export class StatusLog {
	private apiRoot: string;

	private entities: Map<string, Entity> = new Map<string, Entity>();
	private entityTypes: Map<string, EntityType> = new Map<string, EntityType>();
	private events: Map<number, Event> = new Map<number, Event>();
	private nextEventId: number = 1;
	private futureValues: Map<number, FutureValue> = new Map<number, FutureValue>();
	private nextFutureValueId: number = 1;

	public constructor(_apiRoot: string = '/status/') {
		this.apiRoot = _apiRoot
	}

	public registerRoutes(app: Application) {
		app.post(`${this.apiRoot}event/`, this.postEventHandler.bind(this) );
		app.get(`${this.apiRoot}event/`, (req: Request, res: Response): Response => { return res.status(500).send('not implemented'); });
		app.delete(`${this.apiRoot}event/:id`, (req: Request, res: Response): Response => { return res.status(500).send('not implemented'); });
		app.post(`${this.apiRoot}entity/`, (req: Request, res: Response): Response => { return res.status(500).send('not implemented'); });
		app.get(`${this.apiRoot}entity/`, (req: Request, res: Response): Response => { return res.status(500).send('not implemented'); });
		app.patch(`${this.apiRoot}entity/:id`, (req: Request, res: Response): Response => { return res.status(500).send('not implemented'); });
		app.delete(`${this.apiRoot}entity/:id`, (req: Request, res: Response): Response => { return res.status(500).send('not implemented'); });
		app.post(`${this.apiRoot}type/`, (req: Request, res: Response): Response => { return res.status(500).send('not implemented'); });
		app.get(`${this.apiRoot}type/`, (req: Request, res: Response): Response => { return res.status(500).send('not implemented'); });
		app.patch(`${this.apiRoot}type/:id`, (req: Request, res: Response): Response => { return res.status(500).send('not implemented'); });
		app.delete(`${this.apiRoot}type/:id`, (req: Request, res: Response): Response => { return res.status(500).send('not implemented'); });
		app.post(`${this.apiRoot}future-value/`, (req: Request, res: Response): Response => { return res.status(500).send('not implemented'); });
		app.get(`${this.apiRoot}future-value/`, (req: Request, res: Response): Response => { return res.status(500).send('not implemented'); });
		app.delete(`${this.apiRoot}future-value/:id`, (req: Request, res: Response): Response => { return res.status(500).send('not implemented'); });
		app.get(this.apiRoot, (req: Request, res: Response): Response => { return res.status(500).send('not implemented'); });
	}

	private postEventHandler(req: Request, res: Response): Response {
		let ev = req.body as Event;
		if (!ev) return res.status(400).send('Malformed request');

		if (!ev.entity) return res.status(400).send('Missing entity');

		if (ev.timestamp) {
			ev.timestamp = new Date(ev.timestamp)
			if (Number.isNaN(ev.timestamp.valueOf())) return res.status(400).send('Malformed timestamp');
		}

		if (!ev.value) return res.status(400).send('Missing value');
		if (ev.value !== 'e'
			&& ev.value !== 'w'
			&& ev.value !== 'g'
			&& ev.value !== 'n'
			&& ev.value !== 'd') return res.status(400).send('Malformed value');

		if (!ev.validFor) return res.status(400).send('Missing validFor');
		if (typeof (ev.validFor) !== 'number') return res.status(400).send('Malformed validFor');

		if (ev.text && typeof (ev.text) !== 'string') return res.status(400).send('Malformed text');
		if (ev.link && typeof (ev.link) !== 'string') return res.status(400).send('Malformed link');

		const id = this.postEvent(ev);
		return res.status(200).send({ "id": id });
	}

	private postEvent(ev: Event): number {
		// ensure entity exists
		if (!this.entities.has(ev.entity)) {
			this.entities.set(ev.entity, {} as Entity)
		}

		// store event
		const id = this.nextEventId++;
		this.events.set(id, cleanEvent(ev));
		// console.log(`Posted event [${id}]:`);
		// console.log(this.events.get(id));

		// cleanup

		// TODO

		return id;
	}

}
