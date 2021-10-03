package db

import (
	"fmt"
	"sort"
)

func Finish_record_first_create(id int) error {

	cmd := `INSERT INTO finishes (count, book_id) VALUES (?, ?)`
	_, err := db.Exec(cmd, 0, id)
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("can't create finishrecord... %v", err)
	}
	return nil
}

func Finish_record_index(userid string) ([]JoinedFinishRecord, error) {

	cmd := `SELECT finishes.id, finishes.count, finishes.finish_date,
								finishes.created_at, finishes.updated_at ,
								finishes.book_id ,books.user_id
	 					FROM finishes
						JOIN books
						ON finishes.book_id = books.id
						WHERE books.user_id = ?`

	rows, err := db.Query(cmd, userid)
	if err != nil {
		fmt.Println(err)
		return nil, fmt.Errorf("can't get index... %v", err)
	}
	defer rows.Close()
	var index []JoinedFinishRecord
	for rows.Next() {
		var jf JoinedFinishRecord
		err := rows.Scan(&jf.Id, &jf.Count, &jf.Finish_date,
			&jf.Created_at, &jf.Updated_at,
			&jf.Book_id, &jf.User_id,
		)
		if err != nil {
			fmt.Println(err)
			return nil, fmt.Errorf("can't get row next on mysql... %v", err)
		}
		index = append(index, jf)
	}

	sort.Slice(index, func(i, j int) bool { return index[i].Count < index[j].Count })

	return index, nil
}

type JoinedFinishRecord struct {
	Id          int    `json:"id"`
	Count       int    `json:"count"`
	Finish_date string `json:"finishdate"`
	Created_at  string `json:"createdat"`
	Updated_at  string `json:"updatedat"`
	Book_id     int    `json:"bookid"`
	User_id     int    `json:"userid"`
}
