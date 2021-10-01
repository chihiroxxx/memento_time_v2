package web

import (
	"backend/db"
	"encoding/csv"
	"io/ioutil"
	"os"

	"fmt"
	"net/http"
	"strconv"

	"github.com/labstack/echo"
)

func newThoughtRecord(c echo.Context, bookexistid int) *db.Thoughts {

	t := new(db.Thoughts)

	t.Idea = c.FormValue("thoughts")
	if c.FormValue("page") != "" {
		page, _ := strconv.Atoi(c.FormValue("page"))
		t.Page = page
	}
	if c.FormValue("readingtime") != "" {
		readingtime, _ := strconv.Atoi(c.FormValue("readingtime"))
		t.Reading_time = readingtime
	}
	t.Date = c.FormValue("date")

	t.Book_id = bookexistid
	return t
}

func ThoughtIndex(c echo.Context) error {
	id := c.Param("id")
	fmt.Println(c)

	index, err := db.Thought_record_index(id)
	if err != nil {
		fmt.Println(err)
		return echo.NewHTTPError(http.StatusBadRequest, "no record...")
	}
	return c.JSON(http.StatusOK, index)
}

func ThoughtDelete(c echo.Context) error {

	id := c.Param("id")
	fmt.Println(id)
	err := db.Thought_record_delete(id)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	return c.JSON(http.StatusOK, "thought deleted!!!")
}

func ThoughtUpdate(c echo.Context) error {
	t := updateThoughtRecord(c)
	err := db.Thought_record_update(t)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}
	return c.JSON(http.StatusOK, "thought updated!!!")
}

func updateThoughtRecord(c echo.Context) *db.Thoughts {
	t := new(db.Thoughts)

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		fmt.Println(err)
	}
	t.Id = id

	t.Idea = c.FormValue("thoughts")

	if c.FormValue("page") != "" {
		t.Page, err = strconv.Atoi(c.FormValue("page"))
		if err != nil {
			fmt.Println(err)
		}
	}

	if c.FormValue("readingtime") != "" {
		t.Reading_time, err = strconv.Atoi(c.FormValue("readingtime"))
		if err != nil {
			fmt.Println(err)
		}
	}

	return t
}

func createThoughtCsv(userid string) error {
	file, err := os.Create("./csv/index.csv")
	if err != nil {
		fmt.Println(err)

		return err
	}
	defer file.Close()
	w := csv.NewWriter(file)
	defer w.Flush()
	w.Write([]string{"No", "BookTitle", "Author", "BookImage", "Idea", "Date", "CreatedAt", "UpdatedAt"})

	index, err := db.Thought_record_index(userid)
	if err != nil {
		fmt.Println(err)

		return err
	}
	for i := 0; i < len(index); i++ {
		var arr []string
		arr = append(arr, strconv.Itoa(i+1), index[i].Booktitle, index[i].Author,
			index[i].Bookimage, index[i].Idea, index[i].Date,
			index[i].Created_at, index[i].Updated_at,
		)
		w.Write(arr)
	}

	return nil
}

func ThoughtCsv(c echo.Context) error {
	userid := c.Param("userid")
	err := createThoughtCsv(userid)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusBadRequest, "no record...")
	}
	byteFile, err := ioutil.ReadFile("./csv/index.csv")
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusBadRequest, "no record...")
	}
	return c.Blob(http.StatusOK, "text/csv", byteFile)
}
