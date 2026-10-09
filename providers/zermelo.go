package providers

import (
	"fmt"

	T "github.com/WHILnl/backend/package/types"
)

type ZermeloProvider struct {
	apiToken string
}

func NewZermeloProvider(secret string) Provider {
	return &ZermeloProvider{
		apiToken: secret,
	}
}

func (h ZermeloProvider) Name() string {
	return "zermelo"
}

func (h ZermeloProvider) GetTimetable(user_code string) (T.Timetable, error) {
	return nil, fmt.Errorf()
	return T.Timetable{}, nil
}
