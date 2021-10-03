package db

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

func User_record_delete(u *User) error {

	cmd := `DELETE FROM users WHERE name = ?`
	_, err := db.Exec(cmd, u.Name)

	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("don't delete... %v", err)
	}
	return nil
}

func User_record_create(u *User) (int, error) {

	cmd := `INSERT INTO users (name, password_digest) VALUES (?, ?)`
	result, err := db.Exec(cmd, u.Name, u.Password_digest)
	if err != nil {
		fmt.Println(err)
		return -1, fmt.Errorf("can't create user... %v", err)
	}
	fmt.Println("Userのrecord作りました！！！")
	resultId, _ := result.LastInsertId()
	fmt.Println(resultId)

	return int(resultId), nil
}

func User_record_login(u *User) (int, error) {

	cmd := `SELECT * FROM users WHERE name = ?`

	rows, err := db.Query(cmd, u.Name)
	if err != nil {
		return -1, fmt.Errorf("user record login error %v", err)
	}
	defer rows.Close()

	var user User
	for rows.Next() {
		err := rows.Scan(&user.Id,
			&user.Name,
			&user.Password_digest,
			&user.Created_at,
			&user.Updated_at,
		)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(user)
	}

	fmt.Println(user.Password_digest)
	if err != nil {
		fmt.Println(err)
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password_digest), []byte(u.Password_digest))
	if err != nil {

		fmt.Println(err)
		return -1, err
	}

	fmt.Println("ログインできました！！！")
	return user.Id, nil
}
