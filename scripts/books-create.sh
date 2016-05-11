#!/bin/sh

curl --include --request POST http://localhost:3000/books \
  --header "Authorization: Token token=$TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "book": {
      "title": "Jonathan Strange and Mr. Norrell",
      "author": "Susanna Clarke",
      "price": 14.99
    }
  }'

curl --include --request POST http://localhost:3000/books \
  --header "Authorization: Token token=$TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "book": {
      "title": "Sideways Stories from Wayside School",
      "author": "Louis Sachar",
      "price": 5.49
    }
  }'
