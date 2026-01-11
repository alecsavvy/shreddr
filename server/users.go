package server

import (
	"net/http"
	"time"

	db "github.com/alecsavvy/shreddr/server/db"
	"github.com/labstack/echo/v4"
)

func (s *Server) Login(c echo.Context) error {
	return c.String(http.StatusOK, "ok")
}

// @Summary Create a new user
// @Description Create a new user
// @Accept json
// @Produce json
// @Param user body db.User true "User"
// @Success 200 {object} db.User
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /user [post]
// @Tags users
func (s *Server) CreateUser(c echo.Context) error {
	var user db.User
	if err := c.Bind(user); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	userRecord, err := s.db.InsertUser(c.Request().Context(), user.PublicKey)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, userRecord)
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
