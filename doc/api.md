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
* `400` is case of a malformed message body, e.g. invalid values, wrong value types, or missing required fields.


## GET `/status/event/`
TODO

## DELETE `/status/event/{id}`
TODO

## POST `/status/entity/`
TODO

## GET `/status/entity/`
TODO

## PATCH `/status/entity/{id}`
TODO

## DELETE `/status/entity/{id}`
TODO

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
