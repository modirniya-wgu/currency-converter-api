declare module '*/swagger.json' {
  interface PathItem {
    get?: OperationObject;
    post?: OperationObject;
    put?: OperationObject;
    delete?: OperationObject;
    parameters?: ParameterObject[];
    responses?: ResponsesObject;
  }

  interface OperationObject {
    tags?: string[];
    summary?: string;
    description?: string;
    parameters?: ParameterObject[];
    responses: ResponsesObject;
  }

  interface ParameterObject {
    name: string;
    in: 'query' | 'path' | 'header' | 'cookie';
    description?: string;
    required?: boolean;
    schema: SchemaObject;
  }

  interface SchemaObject {
    type: string;
    format?: string;
    properties?: Record<string, SchemaObject>;
    items?: SchemaObject;
    required?: string[];
    enum?: string[];
    description?: string;
  }

  interface ResponsesObject {
    [statusCode: string]: {
      description: string;
      content?: {
        [mediaType: string]: {
          schema: SchemaObject;
        };
      };
    };
  }

  const value: {
    openapi: string;
    info: {
      title: string;
      description: string;
      version: string;
      contact: {
        name: string;
        url: string;
      };
    };
    servers: Array<{
      url: string;
      description: string;
    }>;
    paths: Record<string, PathItem>;
    components: {
      schemas: Record<string, SchemaObject>;
    };
    tags: Array<{
      name: string;
      description: string;
    }>;
  };
  export default value;
} 