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
                description: `${BASE_URL}/swagger.json`,
                url: 'swagger.json',
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

        expect(app.use).toHaveBeenCalledWith('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));
    });

    it('should serve the Swagger JSON', () => {
        swagger(app);

        expect(app.get).toHaveBeenCalledWith('swagger.json', expect.any(Function));
    });

    it('should set the Content-Type header to application/json', () => {
        const req = {};
        const res = {
            setHeader: jest.fn(),
            send: jest.fn(),
        };

        swagger(app);

        const getSwaggerJsonHandler = app.get.mock.calls[0][1];
        getSwaggerJsonHandler(req, res);

        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    });

    it('should send the generated HTML', () => {
        const req = {};
        const res = {
            setHeader: jest.fn(),
            send: jest.fn(),
        };

        swagger(app);

        const getSwaggerJsonHandler = app.get.mock.calls[0][1];
        getSwaggerJsonHandler(req, res);

        expect(res.send).toHaveBeenCalledWith(swaggerUi.generateHTML(swaggerJsdoc(options)));
    });
});
