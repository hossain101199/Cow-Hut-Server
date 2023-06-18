# Cow hut API Documentation:

## Endpoint: POST api/vi/auth/signup

**Description:** This endpoint is used to sign up and create a new user.

**Request Body:**

```
{
  "password": "password24",
  "role": "seller",
  "name": {
    "firstName": "Charlotte",
    "lastName": "Taylor"
  },
  "phoneNumber": "2224446666",
  "address": "333 Pine St",
}
```

```
{
  "password": "password25",
  "role": "buyer",
  "name": {
    "firstName": "Logan",
    "lastName": "Anderson"
  },
  "phoneNumber": "8885552222",
  "address": "777 Maple St",
  "budget": 4500,
}
```

## Endpoint: GET api/vi/users

**Description:** This endpoint is used to retrieve a list of users.

**Query Parameters:**

- `searchTerm` : A search term to filter users based on certain fields.
- `role` : Filter users by role.
- `name.firstName` : Filter users by first name.
- `name.lastName` : Filter users by last name.
- `phoneNumber` : Filter users by phone number.
- `address` : Filter users by address.
- `page` : The page number for pagination. Default is 1.
- `limit` : The number of users to return per page. Default is 10.
- `sortBy` : The field to sort the users by.
- `sortOrder` : The sort order for the users. Valid values are "asc" for ascending and "desc" for descending.

**Example Request:**

- Endpoint: GET api/vi/users?role=seller
- Endpoint: GET api/vi//users?searchTerm=john
- Endpoint: GET api/vi/users?page=1&limit=9&sortBy=name.firstName&sortOrder=asc
- Endpoint: GET api/vi/users?role=buyer&limit=20&page=2&sortBy=name.firstName&sortOrder=asc

## Endpoint: GET api/vi/users/:id

**Description:** This endpoint is used to retrieve a single user by their ID.

**Example Request:**

- Endpoint: GET api/vi/users/648e25f482659a50fb5500b8
- Endpoint: GET api/vi//users/648e25d782659a50fb5500b2

## Endpoint: PATCH api/vi/users/:id

**Description:** This endpoint is used to update a user by their ID.

**Example Request:**

- Endpoint: GET api/vi/users/648e25f482659a50fb5500b8
- Endpoint: GET api/vi//users/648e25d782659a50fb5500b2

**Request Body:**

```
{
  "password": "password25",
}
```

```
{
  "budget": 5000,
}
```

## Endpoint: DELETE api/vi/users/:id

**Description:** This endpoint is used to delete a user by their ID.

**Example Request:**

- Endpoint: GET api/vi/users/648e25f482659a50fb5500b8
- Endpoint: GET api/vi//users/648e25d782659a50fb5500b2

## Endpoint: POST api/vi/cows

**Description:** This endpoint is used to create a new cow.

**Request Body:**

```
{
  "name": "Cow 40",
  "age": 2,
  "price": 2000,
  "location": "Mymensingh",
  "breed": "Guernsey",
  "weight": 480,
  "label": "for sale",
  "category": "Dairy",
  "seller": "648e25c082659a50fb5500ae"
}
```

```
{
  "name": "Cow 39",
  "age": 4,
  "price": 2200,
  "location": "Rangpur",
  "breed": "Limousin",
  "weight": 550,
  "label": "for sale",
  "category": "Dairy",
  "seller": "648e25d782659a50fb5500b2"
}
```

## Endpoint: GET api/vi/cows

**Description:** This endpoint is used to retrieve a list of cows based on specified filters and pagination options.

**Query Parameters:**

**Query Parameters:**

- `searchTerm` : Search term to filter cows by specific fields.
- `location` : Filter cows by location.
- `minPrice` : Filter cows by minimum price.
- `maxPrice` : Filter cows by maximum price.
- `page` : Page number for pagination.
- `limit` : Number of results to include per page.
- `sortBy` : Field to sort the results by.
- `sortOrder` : Sort order for the results (asc for ascending, desc for descending).

**Example Request:**

- Endpoint: GET api/vi/cows?location=Rangpur
- Endpoint: GET api/vi//cows?searchTerm=Dairy
- Endpoint: GET api/vi/cows?minPrice=1000&maxPrice=2000
- Endpoint: GET api/vi/cows?page=1&limit=11&sortBy=price&sortOrder=desc

---

## Endpoint: GET api/vi/cows/:id

**Description:** This endpoint is used to retrieve a single cow by their ID.

**Example Request:**

- Endpoint: GET api/vi/cows/648e2889c0c0f820ca1307c4
- Endpoint: GET api/vi//cows/648e2876c0c0f820ca1307c0

## Endpoint: PATCH api/vi/cows/:id

**Description:** This endpoint is used to update a cow by their ID.

**Example Request:**

- Endpoint: GET api/vi/cows/648e2889c0c0f820ca1307c4
- Endpoint: GET api/vi//cows/648e2876c0c0f820ca1307c0

**Request Body:**

```
{
  "price": 1800,
}
```

```
{
  "age": 20,
}
```

## Endpoint: DELETE api/vi/cows/:id

**Description:** This endpoint is used to delete a cow by their ID.

**Example Request:**

- Endpoint: GET api/vi/cows/648e2889c0c0f820ca1307c4
- Endpoint: GET api/vi//cows/648e2876c0c0f820ca1307c0

## Endpoint: POST api/vi/orders
