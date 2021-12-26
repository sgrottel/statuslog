//
// Simple implementation of sg.statuslog
// Route implementation
// Available under MIT LICENSE
//
import { Application, Request, Response } from 'express';

export class StatusLog {
	private apiRoot: string;

	public constructor(_apiRoot: string = '/status/') {
		this.apiRoot = _apiRoot
	}

	public registerRoutes(app: Application) {
		app.post(`${this.apiRoot}event/`, (req: Request, res: Response): Response => { return res.status(500).send('not implemented'); });
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

}
