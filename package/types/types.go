package types

import "time"

type Lesson struct {
	Name     string    `json:"name"`
	Location string    `json:"location"`
	Teacher  string    `json:"teacher"`
	Time     time.Time `json:"time"`
}

type Timetable struct {
	UserID   string   `json:"user_id"`
	Provider string   `json:"provider"`
	Lessons  []Lesson `json:"lessons"`
}
