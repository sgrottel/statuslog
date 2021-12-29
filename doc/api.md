# sg.statuslog API
The statuslog API is designed to be hosted as a web service.
For this documentation, the API root is assumed to be `/status/`.
An implementation could provide options to change this root.
Every client should therefore assume the _host_ and the _API root_ to be configurable.


## POST `/status/event/`
Posts a status event.
The message body must be a json object of the following format:
```js
{
	"entity": string,
	"value": string,
	"timestamp": string | null,
	"validFor": number,
	"text": string | null,
	"link": string | null
}
```
* `entity` identifies the entity, for which this status information is being posted.
There might be an implementation dependent maximum length of the identifier.
* `value` specifies the value of the event.
It can be one of the following one-character strings:
	* `e` Error -- (Red) Error status; Something is not working.
	* `w` Warning -- (Yellow) Warning status; Operations might be impacted.
	* `g` Good -- (Green) All is good.
	* `n` Neutral -- Status was not evaluated, is unknown, or has no meaning.
	* `d` Dark -- (Black) Entity is (expectedly) unavailable, or status is explicitly hidden.
* `timestamp` (optional) is the time of the event.
If this field is missing or `null`, the server will set a current timestamp.
The recommended format is `YYYY-MM-DDThh:mm:ss` (aligned with ISO 8601).
Fractional seconds and time zone information can be present.
* `validFor` the number of days this status information will be valid, counting from `timestamp`.
The value must be larger than zero.
Use fractional values for time, e.g. `0.25` for six hours.
* `text` (optional) a human-readable text providing more information for the event.
A value of `null` has the same meaning as if the field is missing.
* `link` (optional) a hyperlink to a resource with more information on the event, or the source entity.
A value of `null` has the same meaning as if the field is missing.

Return values:
* `200` in case of successfully posting the event.
The return message body is a JSON object providing a sortable id of the newly posted event: `{ "id": number | string }`.
An implementation should either use numeric values or unique, sortable string values.
Never mix both.
* `400` in case of a malformed message body, e.g. invalid values, wrong value types, or missing required fields.


## GET `/status/event/`
Gets the status events posted earlier matching the respective search query.

Query parameters:
* `limit` (number) limits the number of events in the response array.
The number must be one or larger.
The default value is implementation dependent (recommendation, not smaller than 100).
Using `limit` and `startid` pagination is available for the returned response array.
* `startid` (number | string) only returns events with an `id` larger or equal to the specified value.
The returned response array is sorted by `id` ascending.
Using `limit` and `startid` pagination is available for the returned response array.
* `entity` (string) only returns events which reference the specified entity id.
* `link` (string) only returns events which have the specified link.

In case of success, the route response with an JSON array of objects for all events:
```js
[
	{
		"id": number | string,
		"entity": string,
		"value": string,
		"timestamp": string,
		"validFor": number,
		"text": string | null,
		"link": string | null
	},
	...
]
```
* `id` is a sortable id of the event
* `entity` identifies the entity referenced by this event.
* `value` specifies the value of the event.
It can be one of the following one-character strings:
	* `e` Error -- (Red) Error status; Something is not working.
	* `w` Warning -- (Yellow) Warning status; Operations might be impacted.
	* `g` Good -- (Green) All is good.
	* `n` Neutral -- Status was not evaluated, is unknown, or has no meaning.
	* `d` Dark -- (Black) Entity is (expectedly) unavailable, or status is explicitly hidden.
* `timestamp` is the time of the event.
The recommended format is `YYYY-MM-DDThh:mm:ss` (aligned with ISO 8601).
Fractional seconds and time zone information can be present.
* `validFor` the number of days this status information will be valid, counting from `timestamp`.
Fractional values are used for time, e.g. `0.25` for six hours.
* `text` an optional human-readable text providing more information for the event.
* `link` an optional hyperlink to a resource with more information on the event, or the source entity.

The returned response array is sorted by `id` ascending.
Using `limit` and `startid` pagination is available for the returned response array.

Return values:
* `200` in case of success.
The body is the JSON array described above.
* `400` in case the query parameters were somewhat malformed, e.g. wrong types or invalid values.


## DELETE `/status/event/{id}`
Deletes an event.
The route parameter `id` specifies the event to be deleted.

Return values:
* `203` in case of successful deletion of the specified event.
* `400` in case of a malformed event id.
* `404` in case the specified id does not address an existing event.


## POST `/status/entity/`
Posts a new entity object.
Note: if you want to change an existing entity object, e.g. created by posting a referencing event first, use the [PATCH `/status/entity/{id}`](#patch-statusentityid) route.
The message body must be a json object of the following format:
```js
{
	"id": string,
	"type": string | null,
	"maxAge": number | null,
	"maxCount": number | null,
	"text": string | null,
	"link": string | null
}
```
* `id` identifies this entity.
There might be an implementation dependent maximum length of the identifier.
* `type` (optional) references an entity type.
There might be an implementation dependent maximum length of the identifier.
A value of `null` has the same meaning as if the field is missing.
* `maxAge` (optional) specifies the maximum number of days an event must be stored for this entity.
This is a hint.
An implementation does not have to delete older events, nor does it not have to guarantee to keep newer events.
A value of `null` has the same meaning as if the field is missing.
* `maxCount` (optional) specifies the maximum number of events to store for this entity.
This is a hint.
An implementation does not have to delete events beyond the limit, nor does it have to guarantee storage for fewer events.
A value of `null` has the same meaning as if the field is missing.
* `text` (optional) a human-readable text providing more information for the entity.
A value of `null` has the same meaning as if the field is missing.
* `link` (optional) a hyperlink to a resource with more information on the entity.
A value of `null` has the same meaning as if the field is missing.

You must specify at least one field in addition to `id`.

Return values:
* `200` in case of successfully posting the entity.
The return message body is a JSON object returning the entity id: `{ "id": string }`.
* `400` in case of a malformed message body, e.g. invalid values, wrong value types, or missing required fields.
* `409` in case an entity with the specified `id` already exists.
Use [PATCH `/status/entity/{id}`](#patch-statusentityid) to modify existing entities.


## GET `/status/entity/`
Gets the entities matching the respective search query.

Query parameters:
* `limit` (number) limits the number of entities in the response array.
The number must be one or larger.
The default value is implementation dependent (recommendation, not smaller than 100).
Using `limit` and `startid` pagination is available for the returned response array.
* `startid` (string) only returns entities with an `id` larger or equal to the specified value.
The returned response array is sorted by `id` ascending.
Using `limit` and `startid` pagination is available for the returned response array.
* `type` (string) only returns entities which reference the specified entity type id.
* `link` (string) only returns entities which have the specified link.

In case of success, the route response with an JSON array of objects for all entities:
```js
[
	{
		"id": string,
		"type": string | null,
		"maxAge": number | null,
		"maxCount": number | null,
		"text": string | null,
		"link": string | null
	},
	...
]
```
* `id` identifies this entity.
* `type` optionally references an entity type.
* `maxAge` optionally specifies the maximum number of days an event must be stored for this entity.
* `maxCount` optionally specifies the maximum number of events to store for this entity.
* `text` optional human-readable text providing more information for the entity.
* `link` optional hyperlink to a resource with more information on the entity.

The returned response array is sorted by `id` ascending.
Using `limit` and `startid` pagination is available for the returned response array.

Return values:
* `200` in case of success.
The body is the JSON array described above.
* `400` in case the query parameters were somewhat malformed, e.g. wrong types or invalid values.


## PATCH `/status/entity/{id}`
Changes an existing entity, specified by the route parameter `id`.
The message body must be a json object of the following format:
```js
{
	"type": string | null,
	"maxAge": number | null,
	"maxCount": number | null,
	"text": string | null,
	"link": string | null
}
```
* `type` (optional) references an entity type.
There might be an implementation dependent maximum length of the identifier.
A value of `null` has the same meaning as if the field is missing.
* `maxAge` (optional) specifies the maximum number of days an event must be stored for this entity.
This is a hint.
An implementation does not have to delete older events, nor does it not have to guarantee to keep newer events.
A value of `null` has the same meaning as if the field is missing.
* `maxCount` (optional) specifies the maximum number of events to store for this entity.
This is a hint.
An implementation does not have to delete events beyond the limit, nor does it have to guarantee storage for fewer events.
A value of `null` has the same meaning as if the field is missing.
* `text` (optional) a human-readable text providing more information for the entity.
A value of `null` has the same meaning as if the field is missing.
* `link` (optional) a hyperlink to a resource with more information on the entity.
A value of `null` has the same meaning as if the field is missing.

You must specify at least one field.

Return values:
* `203` in case of successfully changing the entity.
* `400` in case of a malformed id parameter or message body, e.g. invalid values, wrong value types, or missing required fields.
* `404` in case not entity with the specified `id` was found.
Use [POST `/status/entity/`](#post-statusentity) to create a new entity.


## DELETE `/status/entity/{id}`
Deletes an entity.
The route parameter `id` specifies the entity to be deleted.

Return values:
* `203` in case of successful deletion of the specified entity.
* `400` in case of a malformed entity id.
* `404` in case the specified id does not address an existing entity.
* `409` in case the entity specified id is still references by an event or a future value.
You need to delete those objects first (see [DELETE `/status/event/{id}`](#delete-statuseventid) and [DELETE `/status/future-value/{id}`](#delete-statusfuture-valueid)).

## POST `/status/type/`
TODO

## GET `/status/type/`
TODO

## PATCH `/status/type/{id}`
TODO

## DELETE `/status/type/{id}`
TODO

## POST `/status/future-value/`
TODO

## GET `/status/future-value/`
TODO

## DELETE `/status/future-value/{id}`
TODO

## GET `/status/`
This route evaluates the status of all known entries, and returns a summary with all values.

TODO
