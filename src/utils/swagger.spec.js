import { jest } from '@jest/globals';
import pkg from '../../package.json';
import { swagger } from './swagger.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

describe('swagger', () => {
  let app;
  let options;
  const BASE_URL = 'http://localhost:5000/api/v1';
  beforeEach(() => {
    app = {
      use: jest.fn(),
      get: jest.fn(),
    };
    options = {
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  //TODO : Fix test case
  xit('should serve the Swagger UI', () => {
    swagger(app);

    expect(app.use).toHaveBeenCalledWith(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerJsdoc(options))
    );
  });

  it('should serve the Swagger as YAML', () => {
    swagger(app);

    expect(app.get).toHaveBeenCalledWith(
      '/openapi-spec.yaml',
      expect.any(Function)
    );
  });

  it('should set the Content-Type header to text/yaml', () => {
    const req = {};
    const res = {
      setHeader: jest.fn(),
      send: jest.fn(),
    };

    swagger(app);

    const getSwaggerYamlHandler = app.get.mock.calls[0][1];
    getSwaggerYamlHandler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/yaml');
  });

  it('should send the generated YAML', () => {
    const req = {};
    const res = {
      setHeader: jest.fn(),
      send: jest.fn(),
    };

    swagger(app);

    const getSwaggerYamlHandler = app.get.mock.calls[0][1];
    getSwaggerYamlHandler(req, res);

    expect(res.send).toHaveBeenCalledWith(expect.any(String));
  });
});
