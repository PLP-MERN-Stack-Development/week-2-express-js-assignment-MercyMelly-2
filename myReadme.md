
# Express.js RESTful API – Week 2 Assignment
### ✅ Prerequisites

- Node.js (v18+ recommended)
- npm (Node package manager)


## 📝 Overview

This project is a RESTful API for managing products. It is built using **Express.js** and supports:

- CRUD operations
- Filtering by category
- Pagination
- Search by name
- Statistics (count by category)
- Authentication & validation middleware
- Centralized error handling

---

## 🚀 Getting Started

### 📦 Installation

```bash
git clone <your-repo-url>
cd <project-directory>
npm install
```

### 📦 Project Structure


├── server.js 

├── .env

├── README.md 

└── Week2-Assignment.md 


### 🔥 API Features
#### 🏗 CRUD Operations

- GET /api/products – Fetch all products

- GET /api/products/:id – Retrieve a single product by ID

- POST /api/products – Create a new product

- PUT /api/products/:id – Update an existing product

- DELETE /api/products/:id – Remove a product

#### Advanced Features
- Query parameters – Filter products by category

- Pagination – Limit & navigate product listings

- Search – Retrieve products by name

- Statistics – Count products by category

#### Middleware Implementation
- Request Logging – Logs method, URL, timestamp

- Authentication – API key validation

- Validation – Ensures required product fields

- Error Handling – Custom error responses



### 🔄 Running the Server
```bash
npm start
```
By default, the server runs on http://localhost:3000. Modify the PORT variable in .env if needed.

#### 🛠 Setup & Dependencies
Ensure Node.js (v18+) is installed. Install dependencies with:

```bash
npm install express body-parser uuid
```
To test your API, use Postman.