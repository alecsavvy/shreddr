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
func (s *Server) GetEvent(ctx context.Context, req *connect.Request[api.GetEventRequest]) (*connect.Response[api.GetEventResponse], error) {
	event, err := s.db.GetEvent(ctx, req.Msg.EventId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&api.GetEventResponse{
		Event: &api.Event{
			Id:   event.ID,
			Name: event.Name,
			Date: event.Date.Time.Format(time.RFC3339),
			Location: &api.Location{
				Latitude:  event.Location.(pgtype.Vec2).X,
				Longitude: event.Location.(pgtype.Vec2).Y,
			},
			Description:    event.Description,
			CreatorAddress: event.CreatorAddress,
			PriceCents:     event.PriceCents,
			ImageUrl:       event.ImageUrl,
		},
	}), nil
}

// GetUserByWallet implements apiconnect.ShreddrServiceHandler.
func (s *Server) GetUserByWallet(ctx context.Context, req *connect.Request[api.GetUserByWalletRequest]) (*connect.Response[api.GetUserByWalletResponse], error) {
	user, err := s.db.GetUserByWallet(ctx, req.Msg.WalletAddress)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&api.GetUserByWalletResponse{
		User: &api.User{
			Id:            user.ID,
			WalletAddress: user.WalletAddress,
			CreatedAt:     user.CreatedAt.Time.Format(time.RFC3339),
			UpdatedAt:     user.UpdatedAt.Time.Format(time.RFC3339),
		},
	}), nil
}

// ListEvents implements apiconnect.ShreddrServiceHandler.
func (s *Server) ListEvents(ctx context.Context, req *connect.Request[api.ListEventsRequest]) (*connect.Response[api.ListEventsResponse], error) {
	events, err := s.db.ListEvents(ctx)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	apiEvents := make([]*api.Event, 0, len(events))
	for _, event := range events {
		apiEvent := &api.Event{
			Id:   event.ID,
			Name: event.Name,
			Date: event.Date.Time.Format(time.RFC3339),
			Location: &api.Location{
				Latitude:  event.Location.(pgtype.Vec2).X,
				Longitude: event.Location.(pgtype.Vec2).Y,
			},
			Description:    event.Description,
			CreatorAddress: event.CreatorAddress,
			PriceCents:     event.PriceCents,
			ImageUrl:       event.ImageUrl,
		}
		apiEvents = append(apiEvents, apiEvent)
	}
	return connect.NewResponse(&api.ListEventsResponse{
		Events: apiEvents,
	}), nil
}

var _ apiconnect.ShreddrServiceHandler = (*Server)(nil)
