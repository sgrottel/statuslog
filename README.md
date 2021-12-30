# sg.statuslog
Simple Status Event Log

## Project Statement
This project is about creating a simple web API to post and query minimal status data, only carrying as little data as an "I am here" heart beat ping.
The data is assigned to entities, like machines, or services.
A simple extrapolation model allows to change status values based on the time passed since the last received message, e.g. to model services dropping unresponsive and silent.

It is not a generic log service.
It is not a value tracking service.
It is not a performance log service.
It is not a time-series data base.


### Example
This service hosts simple status, like:
`{ "entity": "My Worker 03", "status": "Warning", "timestamp": "2021-12-25T10:28:01", "description": "HDD storage warning" }`.

It will **not** host detailed information, like `{ "name": "My Worker 03", "hdd-usage": 97.56 }`.

Data like this is to be updated every some minutes, hourly, daily, etc.
This service is not meant to update with second or microsecond speed.


### Scope
This project contains:
* [API definition](./doc/api.md)
* Documentation on
	* [Getting Started](./doc/getting-started.md)
	* Usage Examples -- TODO
* A [mock server](./server/README.md) implementation of this API to easily tests clients
* A test framework to test implementations of this API -- TODO

This project does **not** contain:
* A production ready implementation of this API
* Clients for Analysis, Visualization, etc.
* Workers to collect status information, etc.


## Alternatives
This service, due to it's specialized and minimalistic nature, might not be what you are searching for.
There are plenty of alternatives:

* [InfluxDB](https://www.influxdata.com/)
* [SolarWinds Loggly](https://www.loggly.com/)
* [Microsoft Azure Logs](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/data-platform-logs)
* [Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs)
* etc.


## Version
This API specification is version 4.0.1

### Changelog
#### Version 4.0
_Never published_

API specification contained a design flaw, resulting in an evaluation conflict when combining status values.

#### Versions before 4.0
_Never published_

All versions of this status event log API before version 4.0 were only used for private projects, and were not publicly available.


## License
This project is freely available under the [MIT License](./LICENSE).
