//
// Simple implementation of sg.statuslog
// Route implementation
// Available under MIT LICENSE
//
import { Application, Request, Response } from 'express';

export class StatusLog {
	private apiRoot: string;

	public constructor(_apiRoot:string = '/status/') {
		this.apiRoot = _apiRoot
	}

	public registerRoutes(app: Application) {
		app.get(this.apiRoot, (req: Request, res: Response): Response => {
			return res.status(200).json({message: 'Hello World!'})
		});
	}

}
