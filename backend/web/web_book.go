package web

import (
	"backend/db"
	"fmt"

	"net/http"

	"strconv"

	"github.com/labstack/echo"
)

func BookFinish(c echo.Context) error {
	id := c.Param("id")
	err := db.Book_record_finish_count_up(id)
	if err != nil {
		fmt.Println(err)
		return echo.NewHTTPError(http.StatusBadRequest, "can't count up...")
	}
	return c.JSON(http.StatusOK, "finish count up OK!")
}

func BookIndex(c echo.Context) error {
	id := c.Param("id")
	fmt.Println(c)
	index, err := db.Book_record_index(id)
	if err != nil {
		fmt.Println(err)
		return echo.NewHTTPError(http.StatusBadRequest, "no record...")
	}

	return c.JSON(http.StatusOK, index)
}

func BookCreate(c echo.Context) error {

	b := newRecord(c)
	bookexistid, err := bookExistChecker(b)
	fmt.Println(bookexistid)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}
	if bookexistid == -1 {
		createdid, err := db.Book_record_create(b)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err)
		}
		fmt.Println(createdid)
		t := newThoughtRecord(c, createdid)
		db.Thought_record_create(t)

	} else {
		t := newThoughtRecord(c, bookexistid)
		db.Thought_record_create(t)

	}

	return c.JSON(http.StatusOK, "book created!!!")
}

func bookExistChecker(b *db.Book) (int, error) {

	bookexistid, err := db.Book_record_exist_checker(b)
	if err != nil {
		fmt.Println(err)
		return -1, err
	}
	return bookexistid, nil
}

func newRecord(c echo.Context) *db.Book {

	b := new(db.Book)

	b.Booktitle = c.FormValue("booktitle")
	b.Author = c.FormValue("author")
	b.Bookimage = c.FormValue("bookimage")

	user_id, err := strconv.Atoi(c.FormValue("userid"))

	if err != nil {
		fmt.Println(err)
	}
	b.User_id = user_id
	return b
}

func updateRecord(c echo.Context) *db.Book {
	b := new(db.Book)

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		fmt.Println(err)
	}
	b.Id = id

	if c.FormValue("date") != "" {

	}

	return b
}
