[Back](./readme.md)

# Definitions

[models.ts](../src/models/models.ts)

## Lesson

```jsonc
  "id": "number", // Provider-dependent ID

  "subjects": "string[]",
  "changeDescription": "string",

  "locationChanged": "boolean",
  "locations": "string[]",

  "teacherChanged": "boolean",
  "teachers": "string[]",

  "groupChanged": "boolean",
  "groups": "string[]",

  "timeChanged": "boolean",
  "start": "Date",
  "end": "Date",
  "startTimeSlot": "number",
  "startTimeSlotName": "string",
  "endTimeSlot": "number",
  "endTimeSlotName": "string",

  "cancelled": "boolean",
```

## Timetable

```jsonc
  "user_id": "string",
  "provider": "string",
  "lessons": "Lesson[]",
```

## User

```jsonc
  "user_id": "string",
  "provider": "string",
  "email": "string",
  "first_name": "string",
```

