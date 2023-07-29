import { config } from "dotenv";
if (process.env.NODE_ENV !== "production") {
  config();
}

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();

app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors({ 
  origin: "*",
  methods: ["POST", "GET"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 3600
}));

// Global error catcher and handler middleware
app.use(function(error: Error, request: Request, response: Response, next: NextFunction) {
  next();
});

const PORT = parseInt(process.env.PORT!) || 3000;
app.listen(PORT, function() {
  console.log(`🚀 Server ready at port: ${PORT}`);
})