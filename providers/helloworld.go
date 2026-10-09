package providers

import (
	T "github.com/WHILnl/backend/package/types"
)

type HelloWorldProvider struct{}

func NewHelloWorldProvider(secret string) Provider {
	return HelloWorldProvider{}
}

func (h HelloWorldProvider) Name() string {
	return "helloworld"
}

func (h HelloWorldProvider) GetTimetable(user string) (T.Timetable, error) {
	return T.Timetable{}, nil
}
