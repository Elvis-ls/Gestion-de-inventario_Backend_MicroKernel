
# API Documentation

This document provides the documentation for the API endpoints.

## Authentication

### POST /api/auth/login

Logs in a user.

**Request Body:**

```json
{
  "usuario": "admin",
  "contrasena": "admin"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "usuario": "admin"
  },
  "message": "Inicio de sesión exitoso"
}
```

## Categories

### GET /api/categorias

Get all categories.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Category 1"
    },
    {
      "id": 2,
      "nombre": "Category 2"
    }
  ]
}
```

### GET /api/categorias/:id

Get a category by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Category 1"
  }
}
```

### POST /api/categorias

Create a new category.

**Request Body:**

```json
{
  "nombre": "New Category"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 3,
    "nombre": "New Category"
  },
  "message": "Categoría creada con éxito"
}
```

### PUT /api/categorias/:id

Update a category.

**Request Body:**

```json
{
  "nombre": "Updated Category"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Updated Category"
  },
  "message": "Categoría actualizada con éxito"
}
```

### DELETE /api/categorias/:id

Delete a category.

**Response:**

```json
{
  "success": true,
  "message": "Categoría eliminada con éxito"
}
```

## Products

### GET /api/productos

Get all products.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Product 1",
      "precio": 10.99,
      "cantidad": 100,
      "categoria_id": 1
    },
    {
      "id": 2,
      "nombre": "Product 2",
      "precio": 20.50,
      "cantidad": 50,
      "categoria_id": 2
    }
  ]
}
```

### GET /api/productos/bajo-stock

Get products with low stock.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "nombre": "Product 3",
      "precio": 15.00,
      "cantidad": 5,
      "categoria_id": 1
    }
  ]
}
```

### GET /api/productos/:id

Get a product by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Product 1",
    "precio": 10.99,
    "cantidad": 100,
    "categoria_id": 1
  }
}
```

### POST /api/productos

Create a new product.

**Request Body:**

```json
{
  "nombre": "New Product",
  "precio": 30.00,
  "cantidad": 200,
  "categoria_id": 1
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 4,
    "nombre": "New Product",
    "precio": 30.00,
    "cantidad": 200,
    "categoria_id": 1
  },
  "message": "Producto creado con éxito"
}
```

### PUT /api/productos/:id

Update a product.

**Request Body:**

```json
{
  "nombre": "Updated Product",
  "precio": 15.99,
  "cantidad": 150,
  "categoria_id": 2
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Updated Product",
    "precio": 15.99,
    "cantidad": 150,
    "categoria_id": 2
  },
  "message": "Producto actualizado con éxito"
}
```

### DELETE /api/productos/:id

Delete a product.

**Response:**

```json
{
  "success": true,
  "message": "Producto eliminado con éxito"
}
```

## Suppliers

### GET /api/proveedores

Get all suppliers.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Supplier 1",
      "contacto": "contact@supplier1.com"
    },
    {
      "id": 2,
      "nombre": "Supplier 2",
      "contacto": "contact@supplier2.com"
    }
  ]
}
```

### GET /api/proveedores/:id

Get a supplier by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Supplier 1",
    "contacto": "contact@supplier1.com"
  }
}
```

### POST /api/proveedores

Create a new supplier.

**Request Body:**

```json
{
  "nombre": "New Supplier",
  "contacto": "contact@newsupplier.com"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 3,
    "nombre": "New Supplier",
    "contacto": "contact@newsupplier.com"
  },
  "message": "Proveedor creado con éxito"
}
```

### PUT /api/proveedores/:id

Update a supplier.

**Request Body:**

```json
{
  "nombre": "Updated Supplier",
  "contacto": "contact@updatedsupplier.com"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Updated Supplier",
    "contacto": "contact@updatedsupplier.com"
  },
  "message": "Proveedor actualizado con éxito"
}
```

### DELETE /api/proveedores/:id

Delete a supplier.

**Response:**

```json
{
  "success": true,
  "message": "Proveedor eliminado con éxito"
}
```
