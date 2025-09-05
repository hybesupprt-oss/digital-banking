import { Router, Request, Response } from "express";
import { users, accounts, transactions, kyc_submissions, audit_logs, sessions } from "./schema";
import { db } from "./server";

const router = Router();

// Users
router.get("/users", async (_req: Request, res: Response) => {
  const result = await db.select().from(users);
  res.json(result);
});

// Accounts
router.get("/accounts", async (_req: Request, res: Response) => {
  const result = await db.select().from(accounts);
  res.json(result);
});

// Transactions
router.get("/transactions", async (_req: Request, res: Response) => {
  const result = await db.select().from(transactions);
  res.json(result);
});

// KYC Submissions
router.get("/kyc", async (_req: Request, res: Response) => {
  const result = await db.select().from(kyc_submissions);
  res.json(result);
});

// Audit Logs
router.get("/audit-logs", async (_req: Request, res: Response) => {
  const result = await db.select().from(audit_logs);
  res.json(result);
});

// Sessions
router.get("/sessions", async (_req: Request, res: Response) => {
  const result = await db.select().from(sessions);
  res.json(result);
});

export default router;
