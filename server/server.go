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
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Server struct {
	db      db.Querier
	server  *http.Server
	address string
	port    string
	e       *echo.Echo

	jwtSecret []byte
}

var _ apiconnect.VenueServiceHandler = (*Server)(nil)
var _ apiconnect.TicketServiceHandler = (*Server)(nil)
var _ apiconnect.UserServiceHandler = (*Server)(nil)
var _ apiconnect.EventServiceHandler = (*Server)(nil)
var _ apiconnect.AuthServiceHandler = (*Server)(nil)

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

	s := &Server{db: queries, address: address, port: port}

	e := echo.New()
	e.Use(middleware.RequestID())
	e.Use(middleware.RequestLogger())
	e.Use(middleware.CORS())
	e.Use(middleware.Recover())

	rpcGroup := e.Group("")
	path, connectHandler := apiconnect.NewVenueServiceHandler(s)
	rpcGroup.Any(path+"*", echo.WrapHandler(connectHandler))
	path, connectHandler = apiconnect.NewTicketServiceHandler(s)
	rpcGroup.Any(path+"*", echo.WrapHandler(connectHandler))
	path, connectHandler = apiconnect.NewUserServiceHandler(s)
	rpcGroup.Any(path+"*", echo.WrapHandler(connectHandler))
	path, connectHandler = apiconnect.NewEventServiceHandler(s)
	rpcGroup.Any(path+"*", echo.WrapHandler(connectHandler))
	path, connectHandler = apiconnect.NewAuthServiceHandler(s)
	rpcGroup.Any(path+"*", echo.WrapHandler(connectHandler))

	// add health check handler
	e.GET("/health", func(c echo.Context) error {
		return c.String(http.StatusOK, "howdy!")
	})

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "howdy!")
	})

	s.e = e

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "dev-jwt-secret"
	}
	s.jwtSecret = []byte(jwtSecret)

	return s, nil
}

func (s *Server) Start() error {
	return s.e.Start(fmt.Sprintf("%s:%s", s.address, s.port))
}

func (s *Server) Stop() error {
	return s.e.Shutdown(context.Background())
}
