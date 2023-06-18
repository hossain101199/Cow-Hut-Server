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

## Endpoint: POST api/vi/users

## Endpoint: POST api/vi/cows

## Endpoint: POST api/vi/orders
