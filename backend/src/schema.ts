import { pgTable, serial, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const accountTypeEnum = pgEnum("account_type", ["checking", "savings"]);
export const statusEnum = pgEnum("status", ["active", "inactive", "pending"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  kyc_status: statusEnum("kyc_status").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id),
  type: accountTypeEnum("type").notNull(),
  balance: integer("balance").notNull(),
  status: statusEnum("status").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// Add transactions, KYC submissions, audit logs, sessions similarly
