import { Options } from 'swagger-jsdoc';
import path from 'path';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Items API',
      version: '1.0.0',
      description:
        'API for managing a million items with selection, ordering and state persistence',
    },
    servers: [{ url: 'http://localhost:4000/api', description: 'Local server' }],
    components: {
      schemas: {
        Item: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 123 },
            value: { type: 'string', example: 'Item 123' },
            selected: { type: 'boolean', example: false },
            order: { type: 'integer', example: 123 },
          },
          required: ['id', 'value', 'selected', 'order'],
        },
        GetItemsResponse: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/Item' },
            },
            total: { type: 'integer', example: 1000000 },
          },
        },
        SelectionPayload: {
          type: 'object',
          properties: {
            ids: {
              type: 'array',
              items: { type: 'integer' },
            },
            selected: { type: 'boolean' },
          },
          required: ['ids', 'selected'],
        },
        OrderPayload: {
          type: 'object',
          properties: {
            ids: {
              type: 'array',
              items: { type: 'integer' },
            },
          },
          required: ['ids'],
        },
        StateResponse: {
          type: 'object',
          properties: {
            selected: {
              type: 'array',
              items: { type: 'integer' },
            },
            order: {
              type: 'array',
              items: { type: 'integer' },
            },
          },
        },
        ResetResponse: {
          type: 'object',
          properties: {
            reset: { type: 'boolean', example: true },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, '/controllers/*.ts')],
};

export default swaggerOptions;
