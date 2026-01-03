package sdk

import (
	"context"

	"connectrpc.com/connect"
	"github.com/alecsavvy/shreddr/server/api"
	"github.com/gagliardetto/solana-go"
)

// Stores the given wallet and generates a JWT for the user
// Follows the pattern given by Phantom Connect
func (s *ShreddrSDK) Authenticate(wallet *solana.Wallet) error {
	s.wallet = wallet

	data := wallet.PublicKey().Bytes()

	sig, err := wallet.PrivateKey.Sign(data)
	if err != nil {
		return err
	}

	encodedSignature := sig.String()

	req := connect.NewRequest(&api.AuthenticateRequest{
		PublicKey: wallet.PublicKey().String(),
		Signature: encodedSignature,
	})

	resp, err := s.Auth.Authenticate(context.Background(), req)
	if err != nil {
		return err
	}

	s.jwt = resp.Msg.Jwt
	s.AuthHeader = &api.AuthHeader{
		Jwt: s.jwt,
	}
	return nil
}
