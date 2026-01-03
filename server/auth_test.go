package server

import (
	"context"
	"testing"

	"connectrpc.com/connect"
	"github.com/alecsavvy/shreddr/server/api"
	"github.com/alecsavvy/shreddr/server/sdk"
	"github.com/gagliardetto/solana-go"
)

func TestCreateUser(t *testing.T) {
	sdr := sdk.NewShreddrSDK("api-dev.shreddr.live")
	wallet := solana.NewWallet()
	err := sdr.Authenticate(wallet)
	if err != nil {
		t.Fatalf("failed to authenticate: %v", err)
	}

	userReq := connect.NewRequest(&api.GetUserRequest{
		AuthHeader: sdr.AuthHeader,
	})
	userResp, err := sdr.User.GetUser(context.Background(), userReq)
	if err != nil {
		t.Fatalf("failed to get user: %v", err)
	}

	t.Logf("user: %v", userResp.Msg.User)
}
