# sg.statuslog
Simple Status Event Log

## Project Statement
This project is about creating a simple web API to post and query minimal status data.
The data is assigned to entities, like machines, or services.
A simple extrapolation setup allows to change status values based on the time passed since the last message was received, e.g. to model status for unresponsive services.

It is not a generic log service.
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
* API definition -- TODO
* Documentation on
	* Getting Started -- TODO
	* Usage Examples -- TODO
* A test framework to test implementations of this API -- TODO
* A mock implementation of this API to easily tests clients -- TODO

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


## License
This project is freely available under the [MIT License](./LICENSE).
