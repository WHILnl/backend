package providers

import (
	T "github.com/WHILnl/backend/package/types"
)

type Provider interface {
	Name() string
	GetTimetable(userID string) (T.Timetable, error)
}
