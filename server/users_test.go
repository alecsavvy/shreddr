package server

import (
	"context"
	"net/http"
	"testing"

	"connectrpc.com/connect"
	"github.com/alecsavvy/shreddr/server/api"
	"github.com/alecsavvy/shreddr/server/api/apiconnect"
	"github.com/gagliardetto/solana-go"
)

func TestCreateUser(t *testing.T) {
	client := apiconnect.NewShreddrServiceClient(http.DefaultClient, "http://localhost:8080")

	// use solana go sdk to generate a signature
	wallet := solana.NewWallet()
	pubkey := wallet.PublicKey()
	address := pubkey.String()
	t.Logf("address: %s", address)

	signature, err := wallet.PrivateKey.Sign(pubkey.Bytes())
	if err != nil {
		t.Fatalf("failed to sign message: %v", err)
	}

	req := connect.NewRequest(&api.CreateUserRequest{
		Signature: signature.String(),
		Address:   address,
	})

	resp, err := client.CreateUser(context.Background(), req)
	if err != nil {
		t.Fatalf("failed to create user: %v", err)
	}

	t.Logf("response: %v", resp)
}
