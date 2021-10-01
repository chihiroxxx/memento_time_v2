package web

import (
	"backend/db"
	"fmt"
	"net/http"
	"sort"

	"github.com/labstack/echo"
)

func GetMonthTotal(c echo.Context) error {
	id := c.Param("id")
	index, err := db.Thought_record_index(id)
	if err != nil {
		fmt.Println(err)
		return echo.NewHTTPError(http.StatusBadRequest, "no record...")
	}
	mapin := make(map[string]int)
	if len(index) > 0 {
		for i := 0; i < len(index); i++ {
			mapin[index[i].Date[0:7]] += index[i].Page

		}

	}
	var arr []Total
	for d, p := range mapin {
		arr = append(arr, Total{Date: d, Page: p})
	}

	fmt.Println(arr)
	return c.JSON(http.StatusOK, arr)
}

func GetDailyTotal(c echo.Context) error {
	id := c.Param("id")
	index, err := db.Thought_record_index(id)
	if err != nil {
		fmt.Println(err)
		return echo.NewHTTPError(http.StatusBadRequest, "no record...")
	}

	mapin := make(map[string]int)
	if len(index) > 0 {
		for i := 0; i < len(index); i++ {

			mapin[index[i].Date[0:10]] += index[i].Page

		}

	}
	var arr []Total
	for d, p := range mapin {
		arr = append(arr, Total{Date: d, Page: p})
	}

	sort.Slice(arr, func(i, j int) bool { return index[i].Date < index[j].Date })
	fmt.Println(arr)
	return c.JSON(http.StatusOK, arr)
}

type Total struct {
	Date         string `json:"date"`
	Page         int    `json:"page"`
	Reading_time int    `json:"readingtime"`
}
