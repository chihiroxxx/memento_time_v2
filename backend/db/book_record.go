package db

import (
	"fmt"
)

func Book_record_exist_checker(b *Book) (int, error) {

	if b.Booktitle == "" {

		return -1, fmt.Errorf("can't search blanc title")
	}

	cmd := `SELECT * FROM books WHERE booktitle = ? AND user_id = ?`
	rows, err := db.Query(cmd, b.Booktitle, b.User_id)
	if err != nil {
		fmt.Println(err)

		return -1, nil

	}
	defer rows.Close()

	var index []Book
	for rows.Next() {
		var b Book
		err := rows.Scan(&b.Id, &b.Booktitle, &b.Author, &b.Bookimage,
			&b.Bookurl, &b.Finish_count,

			&b.Created_at,
			&b.Updated_at, &b.User_id)
		if err != nil {
			fmt.Println(err)
			return -1, fmt.Errorf("can't get row next... %v", err)
		}
		index = append(index, b)
	}
	for _, p := range index {
		fmt.Println(p.Booktitle)
	}

	fmt.Println("indexのlengthは...？->", len(index))
	if len(index) == 0 {
		return -1, nil
	}
	return index[0].Id, nil

}

func Book_record_create(b *Book) (int, error) {

	cmd := `INSERT INTO books
					(booktitle, author, bookimage,
						bookurl, finish_count, user_id)
					VALUES (?, ?, ?, ?, ?, ?)`
	result, err := db.Exec(cmd, b.Booktitle, b.Author, b.Bookimage, b.Bookurl, b.Finish_count, b.User_id)

	if err != nil {
		fmt.Println(err)
		return -1, fmt.Errorf("can't create... %v", err)
	}
	fmt.Println("book record作りました！！！")
	fmt.Println(result.LastInsertId())
	createdid, err := result.LastInsertId()
	if err != nil {
		fmt.Println(err)

	}

	err = Finish_record_first_create(int(createdid))
	if err != nil {
		fmt.Println(err)
		return -1, fmt.Errorf("can't create finishrecord... %v", err)
	}

	return int(createdid), nil

}

func Book_record_finish_count_up(id string) error {
	cmd := `INSERT INTO finishes (count, book_id) SELECT (SELECT MAX(count) FROM finishes WHERE book_id = ?) + 1, ?;`
	_, err := db.Exec(cmd, id, id)
	if err != nil {
		fmt.Println(err)
	}
	return nil
}

func Book_record_index(id string) ([]Book, error) {

	cmd := `SELECT
									booksA.id, booksA.booktitle,
									booksA.author, booksA.bookimage,
									booksA.bookurl, finishesA.count, booksA.created_at,
	 								booksA.updated_at, booksA.user_id
						FROM
							(books AS booksA,
							finishes AS finishesA)
							INNER JOIN (SELECT
															book_id,
															MAX(count) AS MaxCount
													FROM
															finishes
													GROUP BY
															book_id) AS finishesB
							ON booksA.id = finishesB.book_id
							AND finishesA.count = finishesB.MaxCount
							WHERE user_id = ?
							GROUP BY id`

	rows, err := db.Query(cmd, id)
	if err != nil {
		fmt.Println(err)
		return nil, fmt.Errorf("can't get index... %v", err)
	}
	defer rows.Close()

	var index []Book
	for rows.Next() {
		var b Book
		err := rows.Scan(&b.Id, &b.Booktitle, &b.Author, &b.Bookimage,
			&b.Bookurl, &b.Finish_count,

			&b.Created_at,
			&b.Updated_at, &b.User_id)
		if err != nil {
			fmt.Println(err)
			return nil, fmt.Errorf("can't get row next... %v", err)
		}
		index = append(index, b)
	}
	for _, p := range index {
		fmt.Println(p.Booktitle)
	}
	return index, nil

}
