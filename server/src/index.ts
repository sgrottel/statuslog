//
// Simple implementation of sg.statuslog
// Hosting
// Available under MIT LICENSE
//
import express, { Request, Response, Application } from 'express';
import { StatusLog } from "./service"

// express application
const app: Application = express();

// configuration
const PORT = parseInt(process.env.PORT || '8000');

function ensureApiRoot(str: string): string {
	if (str.length === 0) return '/';
	let s = str.toLocaleLowerCase().replace(/[^a-z0-9\/_\-.]/g, '');
	if (s[0] !== '/') s = '/' + s;
	if (s.slice(-1) !== '/') s = s + '/';
	return s;
}
const API_ROOT = ensureApiRoot(process.env.API_ROOT || '/status/');

app.use(express.json());

const service: StatusLog = new StatusLog(API_ROOT);
service.registerRoutes(app);

if (API_ROOT !== '/') {
	// install convenience route to get to the API_ROOT
	app.get('/', (req: Request, res: Response): void => {
		res.redirect(301, `http://localhost:${PORT}${API_ROOT}`);
	});
}

// start express application
app.listen(PORT, (): void => {
	console.log(`Running sg.statuslog at http://localhost:${PORT}${API_ROOT}`);
});
