package web

import (
	"backend/db"
	"encoding/json"
	"fmt"
	"os"
	"strconv"

	"strings"
	"testing"

	"net/http"
	"net/http/httptest"
	"net/url"

	"github.com/labstack/echo"
)

var (
	testname     string = "tesMan2dsd"
	testpassword string = "12345678"
	token        string
	testuserid   string
	testbook     db.Book = db.Book{Booktitle: "test本", Author: "me", Bookimage: "httpfdsajkf.com"}

	createdbookid string
)

var (
	base *url.URL
	err  error
	e    *echo.Echo
)

func TestMain(m *testing.M) {
	e = echo.New()
	base, err = url.Parse("http://localhost:9090")
	if err != nil {
		fmt.Println(err)
	}
	status := m.Run()
	defer os.Exit(status)
}

func TestUserCreate(t *testing.T) {

	endUrl, err := url.Parse("/api/v1/users")
	if err != nil {
		fmt.Println(err)
	}
	endpoint := base.ResolveReference(endUrl).String()

	values := make(url.Values)
	values.Set("name", testname)
	values.Set("password_digest", testpassword)

	req, err := http.NewRequest(http.MethodPost,
		endpoint,

		strings.NewReader(values.Encode()))

	if err != nil {
		fmt.Println(err)
	}

	fmt.Println(strings.NewReader(values.Encode()))

	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
	res := httptest.NewRecorder()
	c := e.NewContext(req, res)
	err = UserCreate(c)

	if err != nil {
		t.Error(err)
	}

}

func TestUserLogin(t *testing.T) {

	endUrl, err := url.Parse("/api/v1/login")
	if err != nil {
		fmt.Println(err)
	}
	endpoint := base.ResolveReference(endUrl).String()

	values := make(url.Values)
	values.Set("name", testname)
	values.Set("password_digest", testpassword)

	fmt.Println(values.Encode())
	req, err := http.NewRequest(http.MethodPost,
		endpoint,
		strings.NewReader(values.Encode()))
	if err != nil {
		t.Error(err)
	}
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
	res := httptest.NewRecorder()

	c := e.NewContext(req, res)
	err = UserLogin(c)
	if err != nil {
		t.Error(err)
	}

	if res.Result().StatusCode != 200 {
		t.Error(err)
	}
	fmt.Println("とって来れてる？？？")

	a := res.Body.Bytes()
	var result Result
	json.Unmarshal(a, &result)

	token = result.Token
	testuserid = result.Userid
}

type Result struct {
	Token  string `json:"token"`
	Userid string `json:"userid"`
}

func TestBookCreate(t *testing.T) {

	endUrl, err := url.Parse("/api/v1/restricted/books")
	if err != nil {
		fmt.Println(err)
	}

	values := make(url.Values)
	values.Set("booktitle", testbook.Booktitle)
	values.Set("author", testbook.Author)
	values.Set("bookimage", testbook.Bookimage)

	values.Set("userid", testuserid)

	endpoint := base.ResolveReference(endUrl).String()
	fmt.Println(endpoint)
	req, err := http.NewRequest(http.MethodPost,
		endpoint,
		strings.NewReader(values.Encode()))
	if err != nil {
		t.Error(err)
	}
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationForm)
	req.Header.Set(echo.HeaderAuthorization, fmt.Sprintf("Bearer %v", token))
	res := httptest.NewRecorder()

	c := e.NewContext(req, res)
	err = BookCreate(c)
	if err != nil {
		t.Error(err)
	}
	fmt.Println(res.Body)
}

func TestBookIndex(t *testing.T) {

	endUrl, err := url.Parse("/api/v1/restricted/books/")
	if err != nil {
		fmt.Println(err)
	}

	endpoint := base.ResolveReference(endUrl).String()

	req, err := http.NewRequest(http.MethodGet,
		endpoint,

		nil)
	if err != nil {
		t.Error(err)
	}

	req.Header.Set(echo.HeaderAuthorization, fmt.Sprintf("Bearer %v", token))

	res := httptest.NewRecorder()

	c := e.NewContext(req, res)
	c.SetPath("/:id")
	c.SetParamNames("id")
	c.SetParamValues(testuserid)

	if err != nil {
		t.Error(err)
	}
	fmt.Println(res.Result().StatusCode)

	a := res.Body.Bytes()
	var result []db.Book
	json.Unmarshal(a, &result)
	createdbookid = strconv.Itoa(result[0].Id)
}

func TestBookDelete(t *testing.T) {

	endUrl, err := url.Parse("/api/v1/restricted/books/")
	if err != nil {
		fmt.Println(err)
	}
	endpoint := base.ResolveReference(endUrl).String()
	fmt.Println(endpoint)
	req, err := http.NewRequest(http.MethodDelete,
		endpoint,
		nil)
	if err != nil {
		t.Error(err)
	}

	req.Header.Set(echo.HeaderAuthorization, fmt.Sprintf("Bearer %v", token))

	res := httptest.NewRecorder()

	c := e.NewContext(req, res)

	c.SetPath("/:id")
	c.SetParamNames("id")
	c.SetParamValues(createdbookid)

	if err != nil {
		t.Error(err)
	}
}

func TestUserDelete(t *testing.T) {
	u := new(db.User)
	u.Name = testname
	err := db.User_record_delete(u)
	if err != nil {
		t.Error(err)
	}
}
