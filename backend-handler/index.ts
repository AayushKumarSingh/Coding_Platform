import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import rootRouter from './routes/index'

dotenv.config()

const app = express()

app.use(express.json());

app.use(cors())

const PORT = process.env.PORT || 5000

app.use("/api/v1", rootRouter);

//Error handler for bad JSON or unhandled errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.message === "Invalid JSON") {
    return res.status(400).json({ message: "Malformed JSON payload" });
  }

  // console.error("Unexpected error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

//Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});