package server

import (
	"context"
	"time"

	"connectrpc.com/connect"
	"github.com/alecsavvy/shreddr/server/api"
	"github.com/alecsavvy/shreddr/server/api/apiconnect"
	db "github.com/alecsavvy/shreddr/server/db"
	"github.com/jackc/pgx/v5/pgtype"
)

type Server struct {
	db *db.Queries
}

// CreateEvent implements apiconnect.ShreddrServiceHandler.
func (s *Server) CreateEvent(ctx context.Context, req *connect.Request[api.CreateEventRequest]) (*connect.Response[api.CreateEventResponse], error) {
	reqEvent := req.Msg.Event
	date, err := time.Parse(time.RFC3339, reqEvent.Date)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	location := pgtype.Vec2{X: reqEvent.Location.Latitude, Y: reqEvent.Location.Longitude}
	event, err := s.db.InsertEvent(ctx, db.InsertEventParams{
		Name:           reqEvent.Name,
		Description:    reqEvent.Description,
		Date:           pgtype.Timestamp{Time: date, Valid: true},
		Location:       location,
		CreatorAddress: reqEvent.CreatorAddress,
		PriceCents:     reqEvent.PriceCents,
		ImageUrl:       reqEvent.ImageUrl,
	})
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	reqEvent.Id = event.ID
	return connect.NewResponse(&api.CreateEventResponse{
		Event: reqEvent,
	}), nil
}

// CreateUser implements apiconnect.ShreddrServiceHandler.
func (s *Server) CreateUser(ctx context.Context, req *connect.Request[api.CreateUserRequest]) (*connect.Response[api.CreateUserResponse], error) {
	_, err := s.db.InsertUser(ctx, db.InsertUserParams{
		WalletAddress: req.Msg.Address,
	})

	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&api.CreateUserResponse{
		Success: true,
	}), nil
}

// GetEvent implements apiconnect.ShreddrServiceHandler.
func (s *Server) GetEvent(context.Context, *connect.Request[api.GetEventRequest]) (*connect.Response[api.GetEventResponse], error) {
	panic("unimplemented")
}

// GetUserByWallet implements apiconnect.ShreddrServiceHandler.
func (s *Server) GetUserByWallet(context.Context, *connect.Request[api.GetUserByWalletRequest]) (*connect.Response[api.GetUserByWalletResponse], error) {
	panic("unimplemented")
}

// ListEvents implements apiconnect.ShreddrServiceHandler.
func (s *Server) ListEvents(context.Context, *connect.Request[api.ListEventsRequest]) (*connect.Response[api.ListEventsResponse], error) {
	panic("unimplemented")
}

var _ apiconnect.ShreddrServiceHandler = (*Server)(nil)
