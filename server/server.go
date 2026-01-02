package server

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"github.com/alecsavvy/shreddr/server/api/apiconnect"
	db "github.com/alecsavvy/shreddr/server/db"
	"github.com/jackc/pgx/v5"
)

type Server struct {
	db     *db.Queries
	server *http.Server
}

var _ apiconnect.ShreddrServiceHandler = (*Server)(nil)

func NewServer() (*Server, error) {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@localhost:5432/shreddr?sslmode=disable"
	}

	address := os.Getenv("ADDRESS")
	if address == "" {
		address = "0.0.0.0"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dbConn, err := sql.Open("postgres", dbURL)
	if err != nil {
		return nil, err
	}

	// run migrations
	err = db.RunMigrations(dbConn)
	if err != nil {
		return nil, err
	}

	pgxConn, err := pgx.Connect(context.Background(), dbURL)
	if err != nil {
		return nil, err
	}

	queries := db.New(pgxConn)

	s := &Server{db: queries}

	mux := http.NewServeMux()
	mux.Handle(apiconnect.NewShreddrServiceHandler(s))

	// add health check handler
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("howdy!"))
	})

	p := new(http.Protocols)
	p.SetHTTP1(true)
	p.SetUnencryptedHTTP2(true)

	server := &http.Server{
		Addr:      fmt.Sprintf("%s:%s", address, port),
		Handler:   mux,
		Protocols: p,
	}
	s.server = server

	return s, nil
}

func (s *Server) Start() error {
	return s.server.ListenAndServe()
}

func (s *Server) Stop() error {
	return s.server.Shutdown(context.Background())
}
