package db

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

var (
	db     *sql.DB
	dbname = "test_go_test10"
)

func init() {
	db_create()

	var err error
	db, err = sql.Open(SQL_DRIVER, SQL_CONFIG+dbname)
	if err != nil {
		fmt.Println(err)

	}
	fmt.Println("initテスト！！！initされてる？？")

}

func Db_main() {
	fmt.Println(sql.Drivers())
}

type Book struct {
	Id        int    `json:"id"`
	Booktitle string `json:"booktitle"`
	Author    string `json:"author"`
	Bookimage string `json:"bookimage"`
	Bookurl   string `json:"bookurl"`

	Finish_count int `json:"finishcount"`

	Created_at string `json:"createdat"`
	Updated_at string `json:"updatedat"`
	User_id    int    `json:"userid"`
}

type User struct {
	Id              int    `json:"id"`
	Name            string `json:"name"`
	Password_digest string `json:"passworddigest"`
	Created_at      string `json:"createdat"`
	Updated_at      string `json:"updatedat"`
}

type Thoughts struct {
	Id           int    `json:"id"`
	Idea         string `json:"idea"`
	Page         int    `json:"page"`
	Reading_time int    `json:"readingtime"`
	Date         string `json:"date"`
	Created_at   string `json:"createdat"`
	Updated_at   string `json:"updatedat"`
	Book_id      int    `json:"bookid"`
}

type Finish struct {
	Id          int    `json:"id"`
	Count       int    `json:"count"`
	Finish_date string `json:"finishdate"`
	Created_at  string `json:"createdat"`
	Updated_at  string `json:"updatedat"`
	Book_id     int    `json:"bookid"`
}

const SQL_DRIVER string = "mysql"

// 接続機密情報はTerraform CLI注入 及び本番用実行repoで修正
const SQL_CONFIG string = "root:password@tcp(memento_mysql:3306)/"

func db_create() {

	db, err := sql.Open(SQL_DRIVER, SQL_CONFIG)
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	cmd := `CREATE DATABASE IF NOT EXISTS ` + dbname
	_, err = db.Exec(cmd)
	if err != nil {
		fmt.Println(err)
	}

	cmd = `USE ` + dbname
	_, err = db.Exec(cmd)
	if err != nil {
		fmt.Println(err)
	}

	cmd = `CREATE TABLE IF NOT EXISTS users (id BIGINT auto_increment primary key,
		name VARCHAR(255) unique NOT NULL,
		password_digest VARCHAR(255) NOT NULL,
		created_at DATETIME default current_timestamp NOT NULL,
		updated_at DATETIME default current_timestamp on update current_timestamp NOT NULL
		)`
	_, err = db.Exec(cmd)
	if err != nil {
		fmt.Println(err)
	}

	cmd = `CREATE TABLE IF NOT EXISTS books
	(id BIGINT auto_increment primary key,
		booktitle VARCHAR(255),
		author VARCHAR(255),
		bookimage VARCHAR(255),
		bookurl VARCHAR(255),
		finish_count BIGINT default 0,
		created_at DATETIME default current_timestamp NOT NULL,
		updated_at DATETIME default current_timestamp on update current_timestamp NOT NULL,
		user_id BIGINT NOT NULL,
		FOREIGN KEY(user_id) REFERENCES users(id)
		)`
	_, err = db.Exec(cmd)
	if err != nil {
		fmt.Println(err)
	}

	cmd = `CREATE TABLE IF NOT EXISTS thoughts (id BIGINT auto_increment primary key,
		idea VARCHAR(255),
		page BIGINT default 0,
		reading_time BIGINT default 0,
		date DATETIME default current_timestamp,
		created_at DATETIME default current_timestamp NOT NULL,
		updated_at DATETIME default current_timestamp on update current_timestamp NOT NULL,
		book_id BIGINT NOT NULL,
		FOREIGN KEY(book_id) REFERENCES books(id)
		)`
	_, err = db.Exec(cmd)
	if err != nil {
		fmt.Println(err)
	}

	cmd = `CREATE TABLE IF NOT EXISTS finishes (id BIGINT auto_increment primary key,
		count BIGINT default 0,
		finish_date DATETIME default current_timestamp,
		created_at DATETIME default current_timestamp NOT NULL,
		updated_at DATETIME default current_timestamp on update current_timestamp NOT NULL,
		book_id BIGINT NOT NULL,
		FOREIGN KEY(book_id) REFERENCES books(id)
		)`
	_, err = db.Exec(cmd)
	if err != nil {
		fmt.Println(err)
	}
}
