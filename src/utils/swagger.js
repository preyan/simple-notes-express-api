/* eslint-disable no-undef */

import fs from 'fs';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';

const BASE_URL = 'http://localhost:5000/api/v1';
const pkgPath = path.resolve(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Simple Notes REST Api Docs',
      version: pkg.version,
      description: `<strong>Base URL :</strong> <code>${BASE_URL}</code>`,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          format: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: BASE_URL,
      },
    ],
    externalDocs: {
      description: `/openapi-spec.yaml`,
      url: `/openapi-spec.yaml`,
    },
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

export const swagger = (app) => {
  // Serve the Swagger UI along
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  // Serve the openapi spec in yaml format
  app.get(`/openapi-spec.yaml`, (req, res) => {
    const swaggerYaml = yaml.dump(specs1);
    res.setHeader('Content-Type', 'text/yaml');
    res.send(swaggerYaml);
  });
};

export default swagger;
