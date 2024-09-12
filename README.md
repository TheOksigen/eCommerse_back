# API Documentation for Frontend Developers

This backend API provides routes for managing Brands, Categories, Products, File uploads, and User Authentication. Below are the descriptions of each available endpoint along with their HTTP methods, example requests, and brief instructions.

## Authentication Middleware

All routes with `auth` middleware require a valid JWT token. You must include the token in the `Authorization` header.

domain - ecommerse.davidhtml.xyz

### Headers

```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

## Brand Routes

| HTTP Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/brands/create` | Create a new brand | Yes |
| GET | `/brands/all` | Get a list of all brands | No |
| GET | `/brands/get/:id` | Get a specific brand by ID | No |
| PUT | `/brands/update/:id` | Update a specific brand by ID | Yes |
| DELETE | `/brands/delete/:id` | Delete a brand by ID | Yes |

### Example Request (Create Brand)

```bash
POST /brands/create
Content-Type: application/json
{
  "name": "Nike", // interface de istifade etmek ucundur
  "slug": "nike" // routerde istifade etmek ucundur 
}
```

### Example Request (Update Brand)

```bash
PUT /brands/update/1
Content-Type: application/json
{
  "name": "Adidas",
  "slug": "nike"
}

```

---

## Category Routes

| HTTP Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/categories/create` | Create a new category | Yes |
| GET | `/categories/all` | Get a list of all categories | No |
| GET | `/categories/get/:id` | Get a specific category by ID | No |
| PUT | `/categories/update/:id` | Update a specific category by ID | Yes |
| DELETE | `/categories/delete/:id` | Delete a category by ID | Yes |
| POST | `/categories/subcategory/create` | Create a subcategory | Yes |
| PUT | `/categories/subcategory/update/:id` | Update a subcategory by ID | Yes |
| DELETE | `/categories/subcategory/delete/:id` | Delete a subcategory by ID | Yes |

### Example Request (Create Category)

```bash
POST /categories/create
Content-Type: application/json
{
  "name": "Shoes",
  "slug": "shoes"
}

```

### Example Request (Create Subcategory)

```bash
POST /categories/subcategory/create
Content-Type: application/json
{
  "name": "Sneakers",
  "slug": "sneakers",
  "categoryId": 1
}

```

---

## Product Routes

| HTTP Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/products/create` | Create a new product | Yes |
| GET | `/products/all` | Get a list of all products | No |
| GET | `/products/get/:id` | Get a specific product by ID | No |
| PUT | `/products/update/:id` | Update a specific product by ID | Yes |
| DELETE | `/products/delete/:id` | Delete a product by ID | Yes |
| GET | `/products/search` | Search for a product | No |
| GET | `/products/category/:categoryid` | Get products by category | No |
| GET | `/products/subcategory/:subcategoryid` | Get products by subcategory | No |

Məsələn, aşağıda verilən URL-də müxtəlif parametrlər ilə məhsul sorğusu həyata keçirilir:

```bash
GET /products?page=1&limit=10&color=RED,GREEN&size=S,M&minPrice=10&maxPrice=100&discount=true

```

Bu URL aşağıdakıları edir:

- **`page=2`**: İkinci səhifədə olan məhsulları gətirir.
- **`limit=5`**: Hər səhifədə 5 məhsul göstərir.
- **`sortBy=price` & `sortOrder=asc`**: Məhsulları qiymətə görə artan sıralama ilə sıralayır.
- **`categoryId=1`**: 1-ci kateqoriyaya aid olan məhsulları filtr edir.
- **`subcategoryId=3`**: 3-cü subkateqoriyaya aid olan məhsulları filtr edir.
- **`brandId=2`**: 2-ci brendə aid olan məhsulları filtr edir.
- **`colorId=4`**: 4-cü rəngə aid olan məhsulları filtr edir.
- **`sizeId=1`**: 1-ci ölçüyə aid olan məhsulları filtr edir.
- **`minPrice=50`** & **`maxPrice=500`**: Qiyməti 50 ilə 500 arasında olan məhsulları filtr edir.
- **`discount=true`**: Endirimi olan məhsulları göstərir (yəni `discount > 0`).

### Example Request (Create Product)

```bash
POST /products/create
Content-Type: application/json
{
  "name": "Air Max",
  "description": "Comfortable running shoes",
  "discount": 10,
  "price": 120,
  "images": ["url/image1.jpg", "url/image2.jpg"],
  "categoryId": 1,
  "subcategoryId": 1,
  "brandsId": 1,
  "colors": "RED",
  "size": "XXL",
}
```

---

## File Upload Routes

| HTTP Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/img/upload` | Upload an image file | Yes |
| DELETE | `/img/delete/:filename` | Delete a file by filename | Yes |

### Example Request (File Upload)

```bash
POST /files/upload
Content-Type: multipart/form-data
{
  "image": <file>
}
```

---

## User Authentication Routes

| HTTP Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/register` | Register a new user | No |
| POST | `/login` | Login a user | No |
| POST | `/cart/add` | Add product to cart | Yes |
| DELETE | `/cart/delete/:itemId` | Remove product from cart | Yes |

### Example Request (Register and Login)

```bash
POST /auth/login
Content-Type: application/json
{
  "username": "john_doe",
  "password": "password123"
}
```

```bash
POST /auth/register
Content-Type: application/json
{
  "name": "John Doe",
  "username": "john_doe",
  "phone": "1234567890",
  "address": "123 Main St",
  "dob": "1990-01-01T00:00:00Z",
  "gender": "MALE",
  "email": "john@example.com",
  "password": "password123"
}
```

### Example Request (Add to Cart)

```bash
POST /auth/cart/add
Content-Type: application/json
{
  "productId": 1
}

```