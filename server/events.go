package server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/alecsavvy/shreddr/server/api"
)

// CreateEvent implements apiconnect.EventServiceHandler.
func (s *Server) CreateEvent(context.Context, *connect.Request[api.CreateEventRequest]) (*connect.Response[api.CreateEventResponse], error) {
	panic("unimplemented")
}

// GetEvent implements apiconnect.EventServiceHandler.
func (s *Server) GetEvent(context.Context, *connect.Request[api.GetEventRequest]) (*connect.Response[api.GetEventResponse], error) {
	panic("unimplemented")
}

// ListEvents implements apiconnect.EventServiceHandler.
func (s *Server) ListEvents(context.Context, *connect.Request[api.ListEventsRequest]) (*connect.Response[api.ListEventsResponse], error) {
	panic("unimplemented")
}
