[Back](./readme.md)
# Definitions

[models.ts](../src/models/models.ts)

## Lesson

| field             | value    |                       |
| ----------------- | -------- | --------------------- |
| id                | number   | Provider-dependent ID |
|                   |
| subjects          | string[] |
| changeDescription | string   |
|                   |
| locationChanged   | boolean  |
| locations         | string[] |
|                   |
| teacherChanged    | boolean  |
| teachers          | string[] |
|                   |
| groupChanged      | boolean  |
| groups            | string[] |
|                   |
| timeChanged       | boolean  |
| start             | Date     |
| end               | Date     |
| startTimeSlot     | number   |
| startTimeSlotName | string   |
| endTimeSlot       | number   |
| endTimeSlotName   | string   |
|                   |
| cancelled         | boolean  |

## Timetable

| field    | value    |
| -------- | -------- |
| user_id  | string   |
| provider | string   |
| lessons  | Lesson[] |

## User

| field      | value  |
| ---------- | ------ |
| user_id    | string |
| provider   | string |
| email      | string |
| first_name | string |
