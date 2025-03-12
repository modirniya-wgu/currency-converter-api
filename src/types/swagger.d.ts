declare module '*/swagger.json' {
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
    paths: Record<string, any>;
    components: {
      schemas: Record<string, any>;
    };
    tags: Array<{
      name: string;
      description: string;
    }>;
  };
  export default value;
} 