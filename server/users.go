package server

import (
	"net/http"

	db "github.com/alecsavvy/shreddr/server/db"
	"github.com/labstack/echo/v4"
)

func (s *Server) Login(c echo.Context) error {
	return c.String(http.StatusOK, "ok")
}

func (s *Server) CreateUser(c echo.Context) error {
	var body db.User
	if err := c.Bind(&body); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	user, err := s.db.InsertUser(c.Request().Context(), body.PublicKey)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, user)
}

func (s *Server) GetUser(c echo.Context) error {
	id := c.Param("id")

	user, err := s.db.GetUser(c.Request().Context(), id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, user)
}

func (s *Server) DeleteUser(c echo.Context) error {
	id := c.Param("id")

	err := s.db.DeleteUser(c.Request().Context(), id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "User deleted successfully"})
}
