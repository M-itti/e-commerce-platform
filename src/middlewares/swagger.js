require("dotenv").config(); 

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Backend shopping API",
      version: "1.0.0",
    },
    servers: [
      {
        url: process.env.API_BASE_URL,
      },
    ],
    components: {
      securitySchemes: {
        CustomerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Authorization for Customer role",
        },
        SellerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Authorization for Seller role",
        },
      },
    },
  },
  apis: ["./routes/v1/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerDocs,
};
