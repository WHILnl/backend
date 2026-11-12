# API documentation
Base url : `/api/`

[All endpoints](./endpoints.md) \
[Model definitions](./definitions.md)


## Basic response wrapper
All API responses are wrapped in a default wrapper, documented below. A successfull response will contain the `data` field, which is an array containing one or multiple results, depending on the request.

**Success response**
```json
{
    "status": 200,
    "message": "",
    "data": []
}
```
**Failure response**
```json
{
    "status": 401,
    "message": "Unauthenticated.",
}
```