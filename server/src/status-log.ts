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

export type EntityTypeId = string;
export interface EntityType {
	// id is map key
	maxAge: number | null,
	maxCount: number | null,
	text: string | null,
	link: string | null
}

function cleanEntityType(i: EntityType): EntityType {
	// explicitly copy only known values
	return cleanObject({
		maxAge: i.maxAge,
		maxCount: i.maxCount,
		text: i.text,
		link: i.link
	})
}

export type EntityId = string;
export interface Entity {
	// id is map key
	type: EntityTypeId | null,
	maxAge: number | null,
	maxCount: number | null,
	text: string | null,
	link: string | null
}

function cleanEntity(i: Entity): Entity {
	// explicitly copy only known values
	return cleanObject({
		type: i.type,
		maxAge: i.maxAge,
		maxCount: i.maxCount,
		text: i.text,
		link: i.link
	})
}

export type EventId = number;
export interface Event {
	entity: EntityId,
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
		timestamp: i.timestamp ?? new Date(),
		validFor: i.validFor,
		text: i.text,
		link: i.link
	})
}

export type FutureValueId = number;
export interface FutureValue {
	entity: EntityId | null,
	type: EntityTypeId | null,
	value: string,
	validFor: number,
	text: string | null,
	link: string | null
}

function cleanFutureValue(i: FutureValue): FutureValue {
	// explicitly copy only known values
	return cleanObject({
		entity: i.entity,
		type: i.type,
		value: i.value,
		validFor: i.validFor,
		text: i.text,
		link: i.link
	})
}

export class StatusLog {

	private entities: Map<EntityId, Entity> = new Map<EntityId, Entity>();
	private entityTypes: Map<EntityTypeId, EntityType> = new Map<EntityTypeId, EntityType>();
	private events: Map<EventId, Event> = new Map<EventId, Event>();
	private nextEventId: EventId = 1;
	private futureValues: Map<FutureValueId, FutureValue> = new Map<FutureValueId, FutureValue>();
	private nextFutureValueId: FutureValueId = 1;

	protected hasEntity(id: EntityId) : boolean {
		return this.entities.has(id);
	}

	protected postEntity(id: EntityId, ty: Entity): EntityId {
		if (this.entities.has(id)) throw new RangeError("id conflict");
		this.entities.set(id, cleanEntity(ty));
		return id;
	}

	protected hasEntityType(id: EntityTypeId) : boolean {
		return this.entityTypes.has(id);
	}

	protected postEntityType(id: EntityTypeId, ty: EntityType): EntityTypeId {
		if (this.entityTypes.has(id)) throw new RangeError("id conflict");
		this.entityTypes.set(id, cleanEntityType(ty));
		return id;
	}

	protected postEvent(ev: Event): EventId {
		// ensure entity exists
		if (!this.entities.has(ev.entity)) {
			this.entities.set(ev.entity, cleanEntity({} as Entity))
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

	protected postFutureValue(fv: FutureValue): FutureValueId {
		// ensure entity type exists
		if (fv.type && !this.entityTypes.has(fv.type)) {
			this.entityTypes.set(fv.type, cleanEntityType({} as EntityType))
		}
		// ensure entity exists
		if (fv.entity && !this.entities.has(fv.entity)) {
			let ne = {} as Entity;
			if (fv.type) ne.type = fv.type;
			this.entities.set(fv.entity, cleanEntity(ne))
		}

		// story future value
		const id = this.nextFutureValueId++;
		this.futureValues.set(id, cleanFutureValue(fv));

		return id;
	}

}