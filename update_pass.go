package main

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	hash, _ := bcrypt.GenerateFromPassword([]byte("Lendo1a2b@"), bcrypt.DefaultCost)
	fmt.Println(string(hash))
}
