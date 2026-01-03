package server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/alecsavvy/shreddr/server/api"
)

// GetVenue implements apiconnect.VenueServiceHandler.
func (s *Server) GetVenue(context.Context, *connect.Request[api.GetVenueRequest]) (*connect.Response[api.GetVenueResponse], error) {
	panic("unimplemented")
}

// ListVenues implements apiconnect.VenueServiceHandler.
func (s *Server) ListVenues(context.Context, *connect.Request[api.ListVenuesRequest]) (*connect.Response[api.ListVenuesResponse], error) {
	panic("unimplemented")
}

// CreateVenue implements apiconnect.VenueServiceHandler.
func (s *Server) CreateVenue(context.Context, *connect.Request[api.CreateVenueRequest]) (*connect.Response[api.CreateVenueResponse], error) {
	panic("unimplemented")
}
