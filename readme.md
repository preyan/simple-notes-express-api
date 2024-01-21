# Simple Notes Backend

A project made only to lean backend development using NodeJS.

## Table of Contents

- [DataModels] (#data-model)
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
  "id": "string",
  "name": "string",
  "email": "string",
  "password": "string",
  "refreshToken": "string",
  "avatar": "couldinary url",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "deletedAt": "timestamp",
  "notes": "array of note_ids"
}
```

### Note

```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "author": "string",
  "images": "array of cloundinary urls",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "deletedAt": "timestamp"
}
```

## Introduction

Provide an overview of your project and its purpose. Explain why you created it and what problem it solves.

## Features

List the key features of your project. Highlight the functionalities that make it unique and useful.

## Technologies

Mention the technologies and frameworks used in your project. Include versions if necessary.

- Node.js
- Express
- MongoDB

## Getting Started

Provide instructions on how to set up the project locally. Include any prerequisites, installation steps, and configuration details.

## Usage

Explain how to use your project. Provide examples and code snippets to demonstrate its functionality.

## API Documentation

If your project includes an API, provide detailed documentation on how to use it. Include endpoints, request/response examples, and any authentication/authorization requirements.

## Contributing

Explain how others can contribute to your project. Provide guidelines for submitting bug reports, feature requests, and pull requests.

## License

MIT © [Preyan Bhowmick]
