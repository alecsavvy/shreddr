package sdk

import (
	"net/http"
	"strings"

	"github.com/alecsavvy/shreddr/server/api"
	"github.com/alecsavvy/shreddr/server/api/apiconnect"
	"github.com/gagliardetto/solana-go"
)

type ShreddrSDK struct {
	endpoint string
	client   *http.Client

	wallet     *solana.Wallet
	jwt        string
	AuthHeader *api.AuthHeader

	Auth   apiconnect.AuthServiceClient
	Venue  apiconnect.VenueServiceClient
	Ticket apiconnect.TicketServiceClient
	User   apiconnect.UserServiceClient
	Event  apiconnect.EventServiceClient
}

func NewShreddrSDK(endpoint string) *ShreddrSDK {
	endpoint = ensureURLProtocol(endpoint)
	client := http.DefaultClient
	return &ShreddrSDK{
		endpoint: endpoint,
		client:   client,
		Auth:     apiconnect.NewAuthServiceClient(client, endpoint),
		Venue:    apiconnect.NewVenueServiceClient(client, endpoint),
		Ticket:   apiconnect.NewTicketServiceClient(client, endpoint),
		User:     apiconnect.NewUserServiceClient(client, endpoint),
		Event:    apiconnect.NewEventServiceClient(client, endpoint),
	}
}

func ensureURLProtocol(url string) string {
	if !strings.HasPrefix(url, "http://") && !strings.HasPrefix(url, "https://") {
		return "https://" + url
	}
	return url
}
