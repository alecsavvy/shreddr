package server

import (
	"context"
	"fmt"
	"time"

	"connectrpc.com/connect"
	"github.com/alecsavvy/shreddr/server/api"
	db "github.com/alecsavvy/shreddr/server/db"
	"github.com/gagliardetto/solana-go"
)

// CreateUser implements apiconnect.ShreddrServiceHandler.
func (s *Server) CreateUser(ctx context.Context, req *connect.Request[api.CreateUserRequest]) (*connect.Response[api.CreateUserResponse], error) {
	signatureStr := req.Msg.Signature
	addressStr := req.Msg.Address

	// Parse the public key from the base58 address string
	pubkey, err := solana.PublicKeyFromBase58(addressStr)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, fmt.Errorf("invalid address: %w", err))
	}

	// Parse the signature from the base58 string
	signature, err := solana.SignatureFromBase58(signatureStr)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, fmt.Errorf("invalid signature: %w", err))
	}

	// Verify the signature - the message is the public key bytes
	valid := signature.Verify(pubkey, pubkey.Bytes())
	if !valid {
		return nil, connect.NewError(connect.CodeUnauthenticated, fmt.Errorf("signature verification failed"))
	}

	_, err = s.db.InsertUser(ctx, db.InsertUserParams{
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
