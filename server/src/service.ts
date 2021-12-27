//
// Simple implementation of sg.statuslog
// Service Route implementation
// Available under MIT LICENSE
//
import { Application, Request, Response } from 'express';
import { StatusLog, EntityType, Entity, Event, FutureValue } from './status-log';

export class StatusLogService extends StatusLog {
	private apiRoot: string;

	public constructor(_apiRoot: string = '/status/') {
		super();
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
}
