# Library Books REST API

This document describes a RESTful API design for managing books in a library system. The main resource is **books**.

## 1. List All Books

- **Method:** GET
- **Path:** `/books`
- **Description:** Returns a list of all books in the library.
- **Success status:** `200 OK`

### Example Request

```http
GET /books