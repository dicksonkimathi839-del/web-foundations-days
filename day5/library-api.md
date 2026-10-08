# Library API Documentation

## Overview

The Library API provides endpoints for managing books in a library system. The API uses standard HTTP methods and JSON request/response bodies.

**Base URL:**

```text
https://api.example.com
```

All request and response bodies use JSON.

---

## 1. Get All Books

Retrieves a list of all books in the library.

**Method:**

```text
GET
```

**Endpoint:**

```text
/books
```

**Example Request:**

```http
GET /books
```

**Example Response:**

```json
[
  {
    "id": 1,
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "year": 1958
  },
  {
    "id": 2,
    "title": "The River Between",
    "author": "Ngugi wa Thiong'o",
    "year": 1965
  }
]
```

**Status Code:**

```text
200 OK
```

---

## 2. Get a Single Book

Retrieves one book using its unique ID.

**Method:**

```text
GET
```

**Endpoint:**

```text
/books/:id
```

**Example Request:**

```http
GET /books/1
```

**Example Response:**

```json
{
  "id": 1,
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "year": 1958
}
```

**Status Code:**

```text
200 OK
```

If the requested book does not exist, the API returns a `404 Not Found` response.

---

## 3. Create a Book

Creates a new book in the library.

**Method:**

```text
POST
```

**Endpoint:**

```text
/books
```

**Request Headers:**

```http
Content-Type: application/json
```

**Example Request:**

```http
POST /books
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "A Grain of Wheat",
  "author": "Ngugi wa Thiong'o",
  "year": 1967
}
```

**Example Response:**

```json
{
  "id": 3,
  "title": "A Grain of Wheat",
  "author": "Ngugi wa Thiong'o",
  "year": 1967
}
```

**Status Code:**

```text
201 Created
```

A `400 Bad Request` response is returned when required fields are missing or the submitted data is invalid.

---

## 4. Update a Book

Updates an existing book using its unique ID.

**Method:**

```text
PUT
```

**Endpoint:**

```text
/books/:id
```

**Request Headers:**

```http
Content-Type: application/json
```

**Example Request:**

```http
PUT /books/3
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "A Grain of Wheat",
  "author": "Ngugi wa Thiong'o",
  "year": 1967
}
```

**Example Response:**

```json
{
  "id": 3,
  "title": "A Grain of Wheat",
  "author": "Ngugi wa Thiong'o",
  "year": 1967
}
```

**Status Code:**

```text
200 OK
```

If the book does not exist, the API returns `404 Not Found`.

---

## 5. Delete a Book

Deletes a book using its unique ID.

**Method:**

```text
DELETE
```

**Endpoint:**

```text
/books/:id
```

**Example Request:**

```http
DELETE /books/3
```

**Example Response:**

```json
{
  "message": "Book deleted successfully"
}
```

**Status Code:**

```text
200 OK
```

If the requested book does not exist, the API returns `404 Not Found`.

---

## 6. Filter Books by Author

Retrieves books written by a specific author using a query parameter.

**Method:**

```text
GET
```

**Endpoint:**

```text
/books?author=<author-name>
```

**Example Request:**

```http
GET /books?author=Chinua%20Achebe
```

The `author` query parameter is used to filter the results.

**Example Response:**

```json
[
  {
    "id": 1,
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "year": 1958
  }
]
```

**Status Code:**

```text
200 OK
```

If no books match the specified author, the API returns an empty array:

```json
[]
```

---

# Error Responses

## 400 Bad Request

The server returns `400 Bad Request` when the client sends invalid or incomplete data.

Common causes include:

* Missing required fields
* Invalid data types
* Invalid request body
* Malformed JSON

**Example Response:**

```json
{
  "error": "Invalid request data"
}
```

---

## 404 Not Found

The server returns `404 Not Found` when the requested resource does not exist.

For example, requesting:

```http
GET /books/999
```

when book `999` does not exist.

**Example Response:**

```json
{
  "error": "Book not found"
}
```

---

# Endpoint Summary

| Method | Endpoint                      | Purpose                 |
| ------ | ----------------------------- | ----------------------- |
| GET    | `/books`                      | Retrieve all books      |
| GET    | `/books/:id`                  | Retrieve one book       |
| POST   | `/books`                      | Create a new book       |
| PUT    | `/books/:id`                  | Update an existing book |
| DELETE | `/books/:id`                  | Delete a book           |
| GET    | `/books?author=<author-name>` | Filter books by author  |

## HTTP Status Codes

| Status Code | Meaning                       |
| ----------- | ----------------------------- |
| 200         | Request successful            |
| 201         | Resource successfully created |
| 400         | Bad request or invalid data   |
| 404         | Requested resource not found  |
