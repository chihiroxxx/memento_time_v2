package db

import (
	"fmt"
	"sort"
)

func Thought_record_create(t *Thoughts) error {

	cmd := `INSERT INTO thoughts
					(idea, page, reading_time, date, book_id)
					VALUES (?, ?, ?, ?, ?)`
	_, err := db.Exec(cmd, t.Idea, t.Page, t.Reading_time, t.Date, t.Book_id)

	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("can't thought create... %v", err)
	}
	fmt.Println("thought record作りました！！！")
	return nil
}

func Thought_record_index(userid string) ([]JoinedThoughtRecord, error) {

	cmd := `SELECT thoughts.id, thoughts.idea, thoughts.page, thoughts.reading_time, thoughts.date, books.booktitle ,
	 					books.author, books.bookimage, books.created_at,books.updated_at, books.id ,books.user_id
	 					FROM thoughts
						JOIN books
						ON thoughts.book_id = books.id
						WHERE books.user_id = ?`

	rows, err := db.Query(cmd, userid)
	if err != nil {
		fmt.Println(err)
		return nil, fmt.Errorf("can't get index... %v", err)
	}
	defer rows.Close()
	var index []JoinedThoughtRecord
	for rows.Next() {
		var jt JoinedThoughtRecord
		err := rows.Scan(&jt.Id, &jt.Idea, &jt.Page,
			&jt.Reading_time, &jt.Date, &jt.Booktitle,
			&jt.Author, &jt.Bookimage, &jt.Created_at, &jt.Updated_at,
			&jt.Book_id, &jt.User_id,
		)
		if err != nil {
			fmt.Println(err)
			return nil, fmt.Errorf("can't get row next on mysql... %v", err)
		}
		index = append(index, jt)
	}

	sort.Slice(index, func(i, j int) bool { return index[i].Id < index[j].Id })

	return index, nil
}

type JoinedThoughtRecord struct {
	Id   int    `json:"id"`
	Idea string `json:"thoughts"`

	Page         int    `json:"page"`
	Reading_time int    `json:"readingtime"`
	Date         string `json:"date"`

	Created_at string `json:"createdat"`
	Updated_at string `json:"updatedat"`
	Book_id    int    `json:"bookid"`

	Booktitle string `json:"booktitle"`
	Author    string `json:"author"`
	Bookimage string `json:"bookimage"`
	User_id   int    `json:"userid"`
}

func Thought_record_delete(id string) error {

	fmt.Println("idは", id)

	cmd := `DELETE FROM thoughts WHERE id = ?`
	_, err := db.Exec(cmd, id)
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("can't delete... %v", err)
	}
	return nil
}

func Thought_record_update(t *Thoughts) error {

	cmd := `UPDATE thoughts SET idea = ? WHERE id = ?`

	_, err := db.Exec(cmd, t.Idea, t.Id)

	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("can't update... %v", err)
	}
	return nil
}
