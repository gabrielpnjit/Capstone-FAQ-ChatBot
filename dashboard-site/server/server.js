import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import login from "./routes/login.js";
import { auth } from 'express-openid-connect';

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SESSION_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use(auth(config));
// app.use("/record", records);
app.use("/login", login);



// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});