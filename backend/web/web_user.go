package web

import (
	"backend/db"
	"crypto/rsa"
	"fmt"
	"io/ioutil"
	"strconv"
	"time"
	"unicode/utf8"

	"net/http"

	"github.com/dgrijalva/jwt-go"

	"github.com/labstack/echo"
	"golang.org/x/crypto/bcrypt"
)

func UserCreate(c echo.Context) error {

	p := c.FormValue("name")

	fmt.Println(p)

	err := userRecordValidation(c)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)

	}

	u := newUserRecord(c)
	fmt.Println(&u)
	resultId, err := db.User_record_create(u)
	if resultId == -1 || err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "can't create...")
	}
	token, err := getAuth(u, resultId)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "can't login...")
	}

	return c.JSON(http.StatusOK, echo.Map{
		"token":  token,
		"userid": strconv.Itoa(resultId),
	})
}

func UserLogin(c echo.Context) error {

	u := loginUserRecord(c)
	fmt.Println("まずuserRecordはOK?", u)
	resultId, err := db.User_record_login(u)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "don't login...")
	}

	token, err := getAuth(u, resultId)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "don't login...")
	}

	return c.JSON(http.StatusOK, echo.Map{
		"token":  token,
		"userid": strconv.Itoa(resultId),
	})
}

var (
	verifyKey *rsa.PublicKey
	signKey   *rsa.PrivateKey
)

func CheckAuth(c echo.Context) error {
	verifyBytes, err := ioutil.ReadFile("./public.key")
	if err != nil {
		fmt.Println(err)

	}
	verifyKey, err = jwt.ParseRSAPublicKeyFromPEM(verifyBytes)
	if err != nil {
		fmt.Println(err)

	}

	token := c.Get("token").(*jwt.Token)
	fmt.Println(token)

	return nil
}

func getAuth(u *db.User, resultId int) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["name"] = u.Name
	claims["userid"] = resultId
	claims["admin"] = true
	claims["exp"] = time.Now().Add(time.Hour * 12).Unix()

	tokenString, err := token.SignedString([]byte("secret"))
	if err != nil {
		fmt.Println(err)
		return "", err
	}
	fmt.Println(tokenString)

	return tokenString, nil
}

func userRecordValidation(c echo.Context) error {

	u := new(db.User)
	u.Name = c.FormValue("name")
	if utf8.RuneCountInString(u.Name) >= 16 {
		return fmt.Errorf("validation error Name is too long!!! %v", u)
	}
	u.Password_digest = c.FormValue("password_digest")
	if utf8.RuneCountInString(u.Password_digest) < 8 {
		return fmt.Errorf("validation error Password is too short!!! %v", u)
	}

	return nil
}
func newUserRecord(c echo.Context) *db.User {
	u := new(db.User)

	u.Name = c.FormValue("name")

	hash, err := bcrypt.GenerateFromPassword([]byte(c.FormValue("password_digest")), 12)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(hash)
	u.Password_digest = string(hash)
	fmt.Println([]byte(u.Password_digest))
	return u

}

func loginUserRecord(c echo.Context) *db.User {
	u := new(db.User)

	u.Name = c.FormValue("name")
	u.Password_digest = c.FormValue("password_digest")

	return u
}
