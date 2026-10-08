# Library Books REST API Design

This document defines a RESTful API for managing books in a library system.

The main resource is **books**.

---

## 1. List All Books

### Endpoint

`GET /books`

### Description

Returns a list of all books available in the library.

### Success Status

`200 OK`

### Example Request

```http
GET /books