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
	echoSwagger "github.com/swaggo/echo-swagger"

	_ "github.com/alecsavvy/shreddr/server/docs"
)

type Server struct {
	db      db.Querier
	server  *http.Server
	address string
	port    string
	e       *echo.Echo

	jwtSecret []byte
}

// @title Shreddr API
// @version 1.0
// @description API for the Shreddr platform
// @termsOfService http://swagger.io/terms/

// @host api.shreddr.live
// @BasePath /v1
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
	jwtSecretBytes := []byte(jwtSecret)

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

	e := echo.New()
	e.HideBanner = true

	e.Use(middleware.RequestID())
	e.Use(middleware.RequestLogger())
	e.Use(middleware.CORS())
	e.Use(middleware.Recover())

	s := &Server{db: queries, address: address, port: port, e: e, jwtSecret: jwtSecretBytes}

	e.GET("/swagger", echoSwagger.WrapHandler)
	e.GET("/swagger/*", echoSwagger.WrapHandler)

	v1 := e.Group("/v1")

	v1.POST("/user/login", s.Login)
	v1.POST("/user", s.CreateUser)
	v1.GET("/user/:id", s.GetUser)
	v1.DELETE("/user/:id", s.DeleteUser)

	v1.POST("/event", s.stubRoute)
	v1.GET("/event/:id", s.stubRoute)
	v1.GET("/events", s.stubRoute)
	v1.PUT("/event/:id", s.stubRoute)
	v1.DELETE("/event/:id", s.stubRoute)

	v1.POST("/venue", s.stubRoute)
	v1.GET("/venue/:id", s.stubRoute)
	v1.GET("/venues", s.stubRoute)
	v1.PUT("/venue/:id", s.stubRoute)
	v1.DELETE("/venue/:id", s.stubRoute)

	v1.GET("/health", s.stubRoute)
	v1.GET("/", s.stubRoute)

	adminv1 := e.Group("/v1/admin")
	adminv1.POST("/user", s.stubRoute)

	return s, nil
}

func (s *Server) Start() error {
	return s.e.Start(fmt.Sprintf("%s:%s", s.address, s.port))
}

func (s *Server) Stop() error {
	return s.e.Shutdown(context.Background())
}

func (s *Server) stubRoute(c echo.Context) error {
	return c.String(http.StatusOK, "ok")
}
