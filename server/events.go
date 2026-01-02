package server

import (
	"context"
	"time"

	"connectrpc.com/connect"
	"github.com/alecsavvy/shreddr/server/api"
	db "github.com/alecsavvy/shreddr/server/db"
	"github.com/jackc/pgx/v5/pgtype"
)

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
