# API Documentation

## Regions Endpoints

### `GET /regions`

Retrieve a paginated list of regions.

**Query Parameters:**

- `page` (optional, default: `1`): Page number.
- `limit` (optional, default: `10`): Number of regions per page.

**Response:**

```json
{
  "rows": [ { "region data" } ],
  "page": 1,
  "limit": 10,
  "total": 100
}
```

---

### `GET /regions/:id`

Retrieve a region by its ID.

**Response:**

- 200: Region data.
- 404: Region not found.

---

### `POST /regions`

Create a new region.

**Request Body:**

```json
{
  "name": "string",
  "coordinates": "array",
  "userId": "string"
}
```

**Response:**

- 201: Created region data.
- 404: User not found.
- 500: Internal server error.

---

### `PUT /regions/:id`

Update an existing region by ID.

**Request Body:**

```json
{
  "name": "string",
  "coordinates": "array"
}
```

**Response:**

- 200: Updated region data.
- 404: Region not found.

---

### `DELETE /regions/:id`

Delete a region by ID.

**Response:**

- 200: Deletion success message.
- 404: Region not found.

---

### `GET /regions/nearby`

Retrieve regions within a certain distance from a point.

**Query Parameters:**

- `latitude`: Latitude of the point.
- `longitude`: Longitude of the point.
- `maxDistance` (optional, default: `10000`): Maximum distance in meters.
- `userId` (optional): Filter by user ID.
- `exclude` (optional, default: `false`): Exclude regions of the given user.

**Response:**

- 200: List of nearby regions.
- 400: Latitude and longitude are required.

---

### `GET /regions/withinPoint`

Retrieve regions containing a specific point.

**Query Parameters:**

- `latitude`: Latitude of the point.
- `longitude`: Longitude of the point.

**Response:**

- 200: List of regions containing the point.
- 400: Latitude and longitude are required.

---

## Users Endpoints

### `GET /users`

Retrieve a paginated list of users.

**Query Parameters:**

- `page` (optional, default: `1`): Page number.
- `limit` (optional, default: `10`): Number of users per page.

**Response:**

```json
{
  "rows": [ { "user data" } ],
  "page": 1,
  "limit": 10,
  "total": 100
}
```

---

### `GET /users/:id`

Retrieve a user by ID.

**Response:**

- 200: User data.
- 404: User not found.

---

### `POST /users`

Create a new user.

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "address": "string",
  "coordinates": "array"
}
```

**Response:**

- 201: Created user data.
- 500: Internal server error.

---

### `PUT /users/:id`

Update an existing user by ID.

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "address": "string",
  "coordinates": "array"
}
```

**Response:**

- 200: Updated user data.
- 404: User not found.

---

### `DELETE /users/:id`

Delete a user by ID.

**Response:**

- 200: Deletion success message.
- 404: User not found.
