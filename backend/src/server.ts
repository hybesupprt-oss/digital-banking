import express from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { drizzle } from "drizzle-orm";
import { Pool } from "pg";
import router from "./routes";

const PgSession = pgSession(session);
const app = express();

app.use(express.json());

app.use(
  session({
    store: new PgSession({
      conString: process.env.DATABASE_URL,
    }),
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

app.use("/api", router);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
