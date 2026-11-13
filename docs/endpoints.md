[Back](./readme.md)
# Endpoints

## Device
All endpoints can return a 500 or a 401 if an invalid token is given.
### Authentication
HTTP Header
`Authorization: Bearer <token>`

### `GET /me`
**200**
data:
```json
{
  "id": "number",
  "issuedAt": "number" // unix epoch in sec
}
```

### `GET /user/:user_id`

**200** \
data: [User](./definitions.md#user)\
**400** \
**404**

### `GET /timetable/:user_id`

**200** \
data: [Timetable](./definitions.md#timetable)\
**400** \
**404**

### `POST /enroll/`
```jsonc
{
  "enroll_code": "string" // the N-digit enroll code, lpadded with zeros
}
```

**200** \
data:
```jsonc
{
  "token_id": "number",
  "issued_at": "number", // unix epoch in sec
  "token": "string"
}
```

**400** \
**401**

## Admin
Baseurl: `/api/admmin`

### `GET /device_token`

### `GET /device_token/:id`

### `DELETE /device_token/:id`

### `POST /device_token/:id/revoke`

### `GET /enroll_code`

### `POST /enroll_code`

### `GET /enroll_code/:id`

### `DELETE /enroll_code/:id`

