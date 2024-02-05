import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import pkg from '../../package.json' assert { type: 'json' };

const BASE_URL = 'http://localhost:5000/api/v1';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Simple Notes REST API Docs',
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
      description: `${BASE_URL}/swagger.json`,
      url: 'swagger.json',
    },
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

export const swagger = (app) => {
  // Serve the Swagger UI along
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
  // Docs as JSON
  app.get('swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerUi.generateHTML(specs));
  });
};

export default swagger;
