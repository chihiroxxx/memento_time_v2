package main

import (
	"backend/db"
	"backend/scraping"
	"backend/web"

	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func main() {

	db.Db_main()

	e := echo.New()
	e.Use(middleware.CORS())

	e.POST("/api/v1/users", web.UserCreate)
	e.POST("/api/v1/login", web.UserLogin)

	e.GET("/api/go/books/kino", scraping.Kino)
	e.GET("/api/go/books/tsutaya", scraping.Tsutaya)

	r := e.Group("/api/v1/restricted")
	r.Use(middleware.JWT([]byte("secret")))
	r.GET("", restricted)
	r.POST("/books", web.BookCreate)

	r.GET("/books/:id", web.BookIndex)
	r.GET("/books/finish/:id", web.BookFinish)

	r.GET("/thoughts/csv/:userid", web.ThoughtCsv)

	r.GET("/thoughts/:id", web.ThoughtIndex)
	r.DELETE("/thoughts/:id", web.ThoughtDelete)
	r.PATCH("/thoughts/:id", web.ThoughtUpdate)

	r.GET("/finishes/:id", web.FinishIndex)

	r.GET("/thoughts/total/:id", web.GetMonthTotal)
	r.GET("/thoughts/total/daily/:id", web.GetDailyTotal)

	e.Logger.Fatal(e.Start(":9090"))
}

func restricted(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)

	userid := claims["userid"].(float64)
	return c.JSON(http.StatusOK, int(userid))
}
