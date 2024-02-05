# Simple Notes Backend

A project made only to lean backend development using NodeJS.
This project creates a simple backend for a note taking app similar to Google Keep.

## Table of Contents

- [Data Models](#data-models)
- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Data Models

### User

```json
{
  "_id": "string",
  "username": "string",
  "fullname": "string",
  "email": "string",
  "password": "string",
  "notes": "ObjectId[] notes",
  "refreshToken": "string", // jwt token
  "avatar": "string", // cloudinary url
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Note

```json
{
  "_id": "string",
  "title": "string",
  "content": "string",
  "author": "ObjectId user",
  "images": "String[]", //array of cloudinary urls
  "isDeleted": "boolean",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "deletedAt": "timestamp"
}
```

## Introduction

Simple Notes Backend is a project that aims to provide a simple and easy-to-use backend for a note taking app. It is built using Node.js, Express, and MongoDB. The project includes user authentication, note creation, and note management features. It also includes an API for accessing and managing notes. The project is designed to be easy to set up and use, making it a great starting point for building a note taking app. It also includes detailed documentation on how to use the API, making it easy for developers to integrate the backend into their projects. Go to [API Documentation](#api-documentation) for more details.

## Features

- User authentication
- Note creation
- Note management
- API for accessing and managing notes
- Detailed documentation

## Technologies

Mention the technologies and frameworks used in your project. Include versions if necessary.

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- SwaggerDocs

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Cloudinary Account

### Installation

1. Clone the repo
   ```sh
   git clone
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a .env file in the root directory and add the following environment variables
   ```sh
   PORT=5000
   MONGO_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Run the server
   ```sh
   npm start
   ```
5. The server should be running on [http://localhost:5000](http://localhost:5000)

## Usage

The project is designed to be easy to use and integrate into other projects. The API documentation provides detailed information on how to use the API. The project includes user authentication, note creation, and note management features, making it a great starting point for building a note taking app.

## API Documentation

The API documentation is made available via [Swagger](https://localhost:5000/swagger)

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated. Feel free to fork the project and create a pull request with your changes.

## License

MIT @ [Preyan Bhowmick]
