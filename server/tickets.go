package server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/alecsavvy/shreddr/server/api"
)

// GetTicket implements apiconnect.TicketServiceHandler.
func (s *Server) GetTicket(context.Context, *connect.Request[api.GetTicketRequest]) (*connect.Response[api.GetTicketResponse], error) {
	panic("unimplemented")
}
