package server

import (
	"context"
	"errors"

	"connectrpc.com/connect"
	"github.com/alecsavvy/shreddr/server/api"
	"github.com/gagliardetto/solana-go"
)

// Authenticate accepts a public key and signature and returns a JWT.
// The JWT is used to authenticate the user for the rest of the API.
// The public key is stored as a new user in the database if it doesn't exist.
func (s *Server) Authenticate(ctx context.Context, req *connect.Request[api.AuthenticateRequest]) (*connect.Response[api.AuthenticateResponse], error) {
	pubKey, err := solana.PublicKeyFromBase58(req.Msg.PublicKey)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	signature, err := solana.SignatureFromBase58(req.Msg.Signature)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	if !signature.Verify(pubKey, pubKey.Bytes()) {
		return nil, connect.NewError(connect.CodeInvalidArgument, errors.New("invalid signature"))
	}

	_, err = s.db.InsertUser(ctx, pubKey.String())
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	jwt, err := s.GenerateJWT(pubKey.String())
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&api.AuthenticateResponse{
		Jwt: jwt,
	}), nil
}
