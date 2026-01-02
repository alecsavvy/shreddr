package server

import (
	"context"
	"time"

	"connectrpc.com/connect"
	"github.com/alecsavvy/shreddr/server/api"
	db "github.com/alecsavvy/shreddr/server/db"
)

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
