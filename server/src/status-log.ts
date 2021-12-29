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
export interface EntityTypeWithId extends EntityType {
	id: EntityTypeId
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
export interface EntityWithId extends Entity {
	id: EntityId
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
export interface EventWithId extends Event {
	id: EventId
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
export interface FutureValueWithId extends FutureValue {
	id: FutureValueId
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

	private entities: Array<EntityWithId> = new Array<EntityWithId>();
	private entityTypes: Array<EntityTypeWithId> = new Array<EntityTypeWithId>();
	private events: Array<EventWithId> = new Array<EventWithId>();
	private nextEventId: EventId = 1;
	private futureValues: Array<FutureValueWithId> = new Array<FutureValueWithId>();
	private nextFutureValueId: FutureValueId = 1;

	protected hasEntity(id: EntityId): boolean {
		return this.entities.findIndex((e: EntityWithId) => e.id === id) >= 0;
	}

	protected postEntity(id: EntityId, en: Entity): EntityId {
		if (this.hasEntity(id)) throw new RangeError("id conflict");

		// ensure entity type exists
		if (en.type && !this.hasEntityType(en.type)) {
			this.postEntityType(en.type, cleanEntityType({} as EntityType))
		}

		this.entities.push({ ...cleanEntity(en), id: id } as EntityWithId);
		return id;
	}

	protected patchEntity(id: EntityId, en: Entity): void {
		const idx = this.entities.findIndex((e: EntityWithId) => e.id === id);
		if (idx < 0) throw new RangeError("id not found");

		const e = cleanEntity(en);
		if (e.type !== undefined) {
			if (e.type !== null) {
				// ensure entity type exists
				if (e.type && !this.hasEntityType(e.type)) {
					this.postEntityType(e.type, cleanEntityType({} as EntityType))
				}
			}
			this.entities[idx].type = e.type;
		}
		if (e.maxAge !== undefined) {
			this.entities[idx].maxAge = e.maxAge;
		}
		if (e.maxCount !== undefined) {
			this.entities[idx].maxCount = e.maxCount;
		}
		if (e.text !== undefined) {
			this.entities[idx].text = e.text; 
		}
		if (e.link !== undefined) {
			this.entities[idx].link = e.link;
		}
	}

	protected getEntity(limit: number, startId: EntityId | null, type: EntityTypeId | null, link: string | null): Array<EntityWithId> {
		return this.entities.filter(
			(e: EntityWithId): boolean => {
				if (link !== null && e.link !== link) return false;
				if (type !== null && e.type !== link) return false;
				if (startId !== null && e.id < startId) return false;
				return true;
			})
			.sort((a, b) => a.id.localeCompare(b.id))
			.slice(0, limit);
	}

	protected deleteEntity(id: EntityId): boolean {
		const idx = this.entities.findIndex((e: EntityWithId): boolean => e.id === id)
		if (idx < 0) return false;

		if (this.events.findIndex((e: EventWithId) : boolean => e.entity === id) >= 0) return false; // conflict
		if (this.futureValues.findIndex((v: FutureValueWithId) : boolean => v.entity === id) >= 0) return false; // conflict

		this.entities.splice(idx, 1);

		return true;
	}

	protected hasEntityType(id: EntityTypeId): boolean {
		return this.entityTypes.findIndex((et: EntityTypeWithId) => et.id === id) >= 0;
	}

	protected postEntityType(id: EntityTypeId, ty: EntityType): EntityTypeId {
		if (this.hasEntityType(id)) throw new RangeError("id conflict");
		this.entityTypes.push({ ...cleanEntityType(ty), id: id } as EntityTypeWithId);
		return id;
	}

	protected patchEntityType(id: EntityTypeId, ty: EntityType): void {
		const idx = this.entityTypes.findIndex((et: EntityTypeWithId) => et.id === id);
		if (idx < 0) throw new RangeError("id not found");

		if (ty.maxAge !== undefined) {
			this.entityTypes[idx].maxAge = ty.maxAge;
		}
		if (ty.maxCount !== undefined) {
			this.entityTypes[idx].maxCount = ty.maxCount;
		}
		if (ty.text !== undefined) {
			this.entityTypes[idx].text = ty.text; 
		}
		if (ty.link !== undefined) {
			this.entityTypes[idx].link = ty.link;
		}
	}

	protected getEntityType(limit: number, startId: EntityTypeId | null, link: string | null): Array<EntityTypeWithId> {
		return this.entityTypes.filter(
			(et: EntityTypeWithId): boolean => {
				if (link !== null && et.link !== link) return false;
				if (startId !== null && et.id < startId) return false;
				return true;
			})
			.sort((a, b) => a.id.localeCompare(b.id))
			.slice(0, limit);
	}

	protected deleteEntityType(id: EntityTypeId): boolean {
		const idx = this.entityTypes.findIndex((et: EntityTypeWithId): boolean => et.id === id)
		if (idx < 0) return false;

		if (this.entities.findIndex((e: EntityWithId) : boolean => e.type === id) >= 0) return false; // conflict
		if (this.futureValues.findIndex((v: FutureValueWithId) : boolean => v.type === id) >= 0) return false; // conflict

		this.entityTypes.splice(idx, 1);

		return true;
	}

	protected postEvent(ev: Event): EventId {
		// ensure entity exists
		if (!this.hasEntity(ev.entity)) {
			this.postEntity(ev.entity, cleanEntity({} as Entity))
		}

		// store event
		const id = this.nextEventId++;
		this.events.push({ ...cleanEvent(ev), id: id } as EventWithId);
		// console.log(`Posted event [${id}]:`);
		// console.log(this.events.get(id));

		// cleanup

		// TODO

		return id;
	}

	protected getEvents(limit: number, startId: EventId, entity: EntityId | null, link: string | null): Array<EventWithId> {
		return this.events.filter(
			(e: EventWithId): boolean => {
				if (entity !== null && e.entity !== entity) return false;
				if (link !== null && e.link !== link) return false;
				if (e.id < startId) return false;
				return true;
			})
			.sort((a, b) => (a.id - b.id))
			.slice(0, limit);
	}

	protected deleteEvent(id: EventId): boolean {
		const idx = this.events.findIndex((e: EventWithId): boolean => e.id === id)
		if (idx < 0) return false;
		this.events.splice(idx, 1);
		return true;
	}

	protected postFutureValue(fv: FutureValue): FutureValueId {
		// ensure entity type exists
		if (fv.type && !this.hasEntityType(fv.type)) {
			this.postEntityType(fv.type, cleanEntityType({} as EntityType))
		}
		// ensure entity exists
		if (fv.entity && !this.hasEntity(fv.entity)) {
			let ne = {} as Entity;
			if (fv.type) ne.type = fv.type;
			this.postEntity(fv.entity, cleanEntity(ne))
		}

		// story future value
		const id = this.nextFutureValueId++;
		this.futureValues.push({ ...cleanFutureValue(fv), id: id } as FutureValueWithId);

		return id;
	}

	protected getFutureValue(limit: number, startId: FutureValueId, entity: EntityId | null, type: EntityTypeId | null, link: string | null): Array<FutureValueWithId> {
		return this.futureValues.filter(
			(v: FutureValueWithId): boolean => {
				if (entity !== null && v.entity !== entity) return false;
				if (type !== null && v.type !== type) return false;
				if (link !== null && v.link !== link) return false;
				if (v.id < startId) return false;
				return true;
			})
			.sort((a, b) => (a.id - b.id))
			.slice(0, limit);
	}

	protected deleteFutureValue(id: FutureValueId): boolean {
		const idx = this.futureValues.findIndex((v: FutureValueWithId): boolean => v.id === id)
		if (idx < 0) return false;
		this.futureValues.splice(idx, 1);
		return true;
	}

}