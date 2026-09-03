package helloworld

import (
	"time"

	"github.com/WHILnl/backend/providers"
)

type HelloWorldProvider struct{}

func (p *HelloWorldProvider) Name() string {
	return "helloworld"
}

func New(secret string) *HelloWorldProvider {
	return &HelloWorldProvider{}
}

func (p *HelloWorldProvider) GetTimetable(userID string) providers.Timetable {
	now := time.Now()
	lessonTime := time.Date(
		now.Year(),
		now.Month(),
		now.Day(),
		8, 30, 0, 0,
		now.Location(),
	)

	return providers.Timetable{
		UserID:   userID,
		Provider: p.Name(),
		Lessons: []providers.Lesson{
			{
				Name:     "Hello World",
				Location: "Planet Earth",
				Time:     lessonTime,
			},
		},
	}
}
