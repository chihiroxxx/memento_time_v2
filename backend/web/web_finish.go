package web

import (
	"backend/db"
	"fmt"
	"net/http"

	"github.com/labstack/echo"
)

func FinishIndex(c echo.Context) error {
	id := c.Param("id")

	index, err := db.Finish_record_index(id)
	if err != nil {
		fmt.Println(err)
		return echo.NewHTTPError(http.StatusBadRequest, "no record...")
	}
	return c.JSON(http.StatusOK, index)
}
