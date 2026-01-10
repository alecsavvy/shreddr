package server

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"os"

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

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "dev-jwt-secret"
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

	// add health check handler
	e.GET("/health", func(c echo.Context) error {
		return c.String(http.StatusOK, "ok")
	})

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "welcome to the shreddr api")
	})

	s.e = e

	s.jwtSecret = []byte(jwtSecret)

	return s, nil
}

func (s *Server) Start() error {
	return s.e.Start(fmt.Sprintf("%s:%s", s.address, s.port))
}

func (s *Server) Stop() error {
	return s.e.Shutdown(context.Background())
}
