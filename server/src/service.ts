//
// Simple implementation of sg.statuslog
// Service Route implementation
// Available under MIT LICENSE
//
import { Application, Request, Response } from 'express';
import { StatusLog, Event, FutureValue, EntityId, EventId, EntityTypeWithId, EntityWithId, FutureValueId, EntityTypeId } from './status-log';

function queryNumber(q: any, d: number): number {
	if (q === undefined || q === null) return d;
	if (typeof q === 'string') return parseInt(q);
	return Number.NaN;
}
function queryEventId(q: any, d: EventId): EventId {
	if (q === undefined || q === null) return d;
	if (typeof q === 'string') return parseInt(q) as EventId;
	return Number.NaN as EventId;
}
function queryEntityId(q: any): EntityId | null {
	if (q === undefined || q === null) return null;
	if (typeof q === 'string') return q as EntityId;
	return null;
}
function queryEntityTypeId(q: any): EntityTypeId | null {
	if (q === undefined || q === null) return null;
	if (typeof q === 'string') return q as EntityTypeId;
	return null;
}
function queryFutureValueId(q: any, d: FutureValueId): FutureValueId {
	if (q === undefined || q === null) return d;
	if (typeof q === 'string') return parseInt(q) as FutureValueId;
	return Number.NaN as FutureValueId;
}
function queryString(q: any): string | null {
	if (q === undefined || q === null) return null;
	if (typeof q === 'string') return q as string;
	return null;
}

export class StatusLogService extends StatusLog {
	private apiRoot: string;

	public constructor(_apiRoot: string = '/status/') {
		super();
		this.apiRoot = _apiRoot
	}

	public registerRoutes(app: Application) {
		app.post(`${this.apiRoot}event/`, this.postEventHandler.bind(this));
		app.get(`${this.apiRoot}event/`, this.getEventHandler.bind(this));
		app.delete(`${this.apiRoot}event/:id`, this.deleteEventHandler.bind(this));
		app.post(`${this.apiRoot}entity/`, this.postEntityHandler.bind(this));
		app.get(`${this.apiRoot}entity/`, this.getEntityHandler.bind(this));
		app.patch(`${this.apiRoot}entity/:id`, (req: Request, res: Response): Response => { return res.status(500).send('not implemented'); });
		app.delete(`${this.apiRoot}entity/:id`, this.deleteEntityHandler.bind(this));
		app.post(`${this.apiRoot}type/`, this.postTypeHandler.bind(this));
		app.get(`${this.apiRoot}type/`, this.getTypeHandler.bind(this));
		app.patch(`${this.apiRoot}type/:id`, (req: Request, res: Response): Response => { return res.status(500).send('not implemented'); });
		app.delete(`${this.apiRoot}type/:id`, this.deleteTypeHandler.bind(this));
		app.post(`${this.apiRoot}future-value/`, this.postFutureValueHandler.bind(this));
		app.get(`${this.apiRoot}future-value/`, this.getFutureValueHandler.bind(this));
		app.delete(`${this.apiRoot}future-value/:id`, this.deleteFutureValueHandler.bind(this));
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
		if (ev.validFor <= 0) return res.status(400).send('Non-positive validFor');

		if (ev.text && typeof (ev.text) !== 'string') return res.status(400).send('Malformed text');
		if (ev.link && typeof (ev.link) !== 'string') return res.status(400).send('Malformed link');

		const id = this.postEvent(ev);
		return res.status(200).send({ "id": id });
	}

	private getEventHandler(req: Request, res: Response): Response {
		// query parameters
		const limit: number = queryNumber(req.query.limit, 100);
		if (Number.isNaN(limit)) return res.status(400).send('malformed limit');
		if (limit < 1) return res.status(400).send('Non-positive limit');
		const startId: EventId = queryEventId(req.query.startid, 0);
		if (Number.isNaN(startId)) return res.status(400).send('malformed startId');
		if (startId < 0) return res.status(400).send('Invalid startId');
		const entity: EntityId | null = queryEntityId(req.query.entity);
		const link: string | null = queryString(req.query.link);

		const events = this.getEvents(limit, startId, entity, link);
		return res.status(200).send(events);
	}

	private deleteEventHandler(req: Request, res: Response): Response {
		const id: EventId = queryEventId(req.params.id, Number.NaN);
		if (Number.isNaN(id)) return res.status(400).send('malformed id');
		const r = this.deleteEvent(id);
		if (!r) return res.sendStatus(404);
		return res.sendStatus(203);
	}

	private postEntityHandler(req: Request, res: Response): Response {
		let en = req.body as EntityWithId;
		if (!en) return res.status(400).send('Malformed request');
		if (!en.id) return res.status(400).send('Missing id');

		if (this.hasEntity(en.id)) return res.status(409).send('Entity known');

		const id = this.postEntity(en.id, en);
		return res.status(200).send({ "id": id });
	}

	private getEntityHandler(req: Request, res: Response): Response {
		// query parameters
		const limit: number = queryNumber(req.query.limit, 100);
		if (Number.isNaN(limit)) return res.status(400).send('malformed limit');
		if (limit < 1) return res.status(400).send('Non-positive limit');
		const startId: EntityId = queryEntityId(req.query.startid) as EntityId;
		const type: EntityTypeId | null = queryEntityTypeId(req.query.type);
		const link: string | null = queryString(req.query.link);

		const entities = this.getEntity(limit, startId, type, link);
		return res.status(200).send(entities);
	}

	private deleteEntityHandler(req: Request, res: Response): Response {
		const id: EntityId = queryEntityId(req.params.id) as EntityId;
		if (id === null) return res.status(400).send('malformed id');
		const r = this.deleteEntity(id);
		if (!r) return res.sendStatus(404);

		// TODO: Cleanup all references to entity

		return res.sendStatus(203);
	}

	private postTypeHandler(req: Request, res: Response): Response {
		let ty = req.body as EntityTypeWithId;
		if (!ty) return res.status(400).send('Malformed request');
		if (!ty.id) return res.status(400).send('Missing id');

		if (!ty.maxAge
			&& !ty.maxCount
			&& !ty.text
			&& !ty.link) return res.status(400).send('Empty type');

		if (this.hasEntityType(ty.id)) return res.status(409).send('Type known');

		const id = this.postEntityType(ty.id, ty);
		return res.status(200).send({ "id": id });
	}

	private getTypeHandler(req: Request, res: Response): Response {
		// query parameters
		const limit: number = queryNumber(req.query.limit, 100);
		if (Number.isNaN(limit)) return res.status(400).send('malformed limit');
		if (limit < 1) return res.status(400).send('Non-positive limit');
		const startId: EntityTypeId = queryEntityTypeId(req.query.startid) as EntityTypeId;
		const link: string | null = queryString(req.query.link);

		const types = this.getEntityType(limit, startId, link);
		return res.status(200).send(types);
	}

	private deleteTypeHandler(req: Request, res: Response): Response {
		const id: EntityTypeId = queryEntityTypeId(req.params.id) as EntityTypeId;
		if (id === null) return res.status(400).send('malformed id');
		const r = this.deleteEntityType(id);
		if (!r) return res.sendStatus(404);

		// TODO: Cleanup all references to type

		return res.sendStatus(203);
	}

	private postFutureValueHandler(req: Request, res: Response): Response {
		let fv = req.body as FutureValue;
		if (!fv) return res.status(400).send('Malformed request');

		if (!fv.value) return res.status(400).send('Missing value');
		if (fv.value !== 'e'
			&& fv.value !== 'w'
			&& fv.value !== 'g'
			&& fv.value !== 'n'
			&& fv.value !== 'd') return res.status(400).send('Malformed value');

		if (!fv.validFor) return res.status(400).send('Missing validFor');
		if (typeof (fv.validFor) !== 'number') return res.status(400).send('Malformed validFor');
		if (fv.validFor <= 0) return res.status(400).send('Non-positive validFor');

		if (fv.text && typeof (fv.text) !== 'string') return res.status(400).send('Malformed text');
		if (fv.link && typeof (fv.link) !== 'string') return res.status(400).send('Malformed link');

		const id = this.postFutureValue(fv);
		return res.status(200).send({ "id": id });
	}

	private getFutureValueHandler(req: Request, res: Response): Response {
		// query parameters
		const limit: number = queryNumber(req.query.limit, 100);
		if (Number.isNaN(limit)) return res.status(400).send('malformed limit');
		if (limit < 1) return res.status(400).send('Non-positive limit');
		const startId: FutureValueId = queryFutureValueId(req.query.startid, 0);
		if (Number.isNaN(startId)) return res.status(400).send('malformed startId');
		if (startId < 0) return res.status(400).send('Invalid startId');
		const entity: EntityId | null = queryEntityId(req.query.entity);
		const type: EntityTypeId | null = queryEntityTypeId(req.query.type);
		const link: string | null = queryString(req.query.link);

		const events = this.getFutureValue(limit, startId, entity, type, link);
		return res.status(200).send(events);
	}

	private deleteFutureValueHandler(req: Request, res: Response): Response {
		const id: FutureValueId = queryFutureValueId(req.params.id, Number.NaN);
		if (Number.isNaN(id)) return res.status(400).send('malformed id');
		const r = this.deleteFutureValue(id);
		if (!r) return res.sendStatus(404);
		return res.sendStatus(203);
	}


}
