package scraping

import (
	"fmt"

	"net/http"
	"strconv"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"github.com/labstack/echo"
)

type Scraping struct {
	Title  string `json:"title"`
	Author string `json:"author"`
	URL    string `json:"itemUrl"`

	Image string `json:"imageUrl"`
}

func Test(c echo.Context) error {
	return c.JSON(http.StatusOK, "hello go!!!")
}
func Kino(c echo.Context) error {
	q := c.QueryParam("q")
	pg := c.QueryParam("page")
	var arr []Scraping

	count := 0
	for i := 1; i <= 2; i++ {
		pg, _ := strconv.Atoi(pg)
		newpg := pg + count
		url := "https://www.kinokuniya.co.jp/disp/CSfDispListPage_001.jsp?qs=true&ptk=01&q=" + q + "&p=" + strconv.Itoa(newpg)

		doc, err := goquery.NewDocument(url)
		if err != nil {
			fmt.Println(err)
		}

		doc.Find("div.list_area").Each(func(index int, s *goquery.Selection) {
			var data Scraping
			str := s.Find("h3.heightLine-2").Text()
			data.Title = str
			if s.Find("h3.heightLine-2 > a").Text() != "" {
				str := s.Find("h3.heightLine-2 > a").Text()
				data.Title = str
			}

			aut := s.Find("p.clearfix").Text()
			aut = strings.TrimSpace(aut)

			data.Author = aut
			href, _ := s.Find("h3.heightLine-2 > a").Attr("href")
			data.URL = href
			img, err := s.Find("div.listphoto > a.thumbnail_box > img").Attr("src")
			if !err {
				img = "testest"
			} else {
				img = "https://www.kinokuniya.co.jp" + img[2:]

			}
			data.Image = img
			arr = append(arr, data)

		})
		count++

	}
	fmt.Println(arr)
	return c.JSON(http.StatusOK, arr)
}

func Tsutaya(c echo.Context) error {
	q := c.QueryParam("q")
	pg := c.QueryParam("page")
	var arr []Scraping

	url := "https://tsutaya.tsite.jp/search?dm=0&ds=1&st=0&p=" + pg + "&ic=3&k=" + q

	doc, err := goquery.NewDocument(url)
	if err != nil {
		fmt.Println(err)
	}
	doc.Find("div.c_unit_col-main_in > ul.c_thumb_list_row > li").Each(func(index int, s *goquery.Selection) {
		var data Scraping
		str := s.Find("div > div.c_thumb_info > p.c_thumb_tit").Children().Text()

		data.Title = str
		aut := s.Find("div > div.c_thumb_info > p.c_thumb_author").Children().Text()
		data.Author = aut

		href, _ := s.Find("a").Attr("href")
		data.URL = "https://tsutaya.tsite.jp/" + href
		img, _ := s.Find("a > div > span > img").Attr("src")

		data.Image = img
		arr = append(arr, data)

	})

	return c.JSON(http.StatusOK, arr)
}
