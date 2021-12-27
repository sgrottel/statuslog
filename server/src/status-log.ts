//
// Simple implementation of sg.statuslog
// StatusLog implementation
// Available under MIT LICENSE
//

function cleanObject(i: any): any {
	// remove undefined properties from object
	Object.keys(i).forEach(key => {
		if (i[key] === undefined) {
			delete i[key];
		}
	})
	return i;
}

export interface EntityType {
	// name/id is map key
	maxAge: number | null,
	maxCount: number | null,
	text: string | null,
	link: string | null
}

export interface Entity {
	// name/id is map key
	type: string | null,
	maxAge: number | null,
	maxCount: number | null,
	text: string | null,
	link: string | null
}

export interface Event {
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

export interface FutureValue {
	entity: string | null,
	type: string | null,
	value: string,
	validFor: number,
	text: string | null,
	link: string | null
}

export class StatusLog {

	private entities: Map<string, Entity> = new Map<string, Entity>();
	private entityTypes: Map<string, EntityType> = new Map<string, EntityType>();
	private events: Map<number, Event> = new Map<number, Event>();
	private nextEventId: number = 1;
	private futureValues: Map<number, FutureValue> = new Map<number, FutureValue>();
	private nextFutureValueId: number = 1;

	protected postEvent(ev: Event): number {
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