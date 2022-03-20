# sg.StatusLog
Simple Status Event Log


## Project Statement
This project is about creating a simple web API to post and query minimal status data.
The data is assigned to entities, like machines, or services.
A simple extrapolation setup allows to change status values based on the time passed since the last message was received, e.g. to model status for unresponsive services.

**Example**:
```json
{
	"entity": "My Worker 03",
	"status": "Warning",
	"timestamp": "2021-12-25T10:28:01",
	"validuntil": "2021-12-25T11:28:01",
	"description": "HDD storage warning"
}
```

It is not a generic log service.
It is not a performance log service.
It is not a time-series data base.

Data needs to be pushed/published into this status event log services, by the machines and services which are represented by the entities.
This is why the extrapolation [Data Model](./data-model.md) is in place, to model unresponsive services.
For many services, an additional simple observer service might be a good idea, which checks, collects information and send the status info periodically.
See the [Getting Started](./getting-started.md) and [Extended Examples](./examples.md) sections for more details.


## Descriptions
Description of the service and API:
* [Data Model](./data-model.md)
* [POST API](./post-api.md)
* [Query API](./query-api.md)
* [Management API](./management-api.md)
* [General Concerns](./general.md)

Development Resources:
* [Getting Started](./getting-started.md)
* [Extended Examples](./examples.md)
* [Testing](./testing.md)

This project does **not** contain:
* A production ready implementation of this API
* Clients for Analysis, Visualization, etc.
* Workers to collect status information, etc.


## Alternatives
This service, due to it's specialized and minimalistic nature, might not be what you are searching for.
There are plenty of alternatives, including:

* [InfluxDB](https://www.influxdata.com/)
* [SolarWinds Loggly](https://www.loggly.com/)
* [Microsoft Azure Logs](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/data-platform-logs)
* [Amazon CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs)
* etc.


## License
This project is freely available under the [MIT License](./LICENSE).
