package server

import (
	"context"

	"connectrpc.com/connect"
	"github.com/alecsavvy/shreddr/server/api"
)

// GetUser implements apiconnect.UserServiceHandler.
func (s *Server) GetUser(ctx context.Context, req *connect.Request[api.GetUserRequest]) (*connect.Response[api.GetUserResponse], error) {
	pubkey, err := s.VerifyJWT(req.Msg.AuthHeader.GetJwt())
	if err != nil {
		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	user, err := s.db.GetUser(ctx, pubkey)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&api.GetUserResponse{
		User: &api.User{
			PublicKey: user.PublicKey,
		},
	}), nil
}
