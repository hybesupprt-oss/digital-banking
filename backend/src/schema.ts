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

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  account_id: integer("account_id").references(() => accounts.id),
  amount: integer("amount").notNull(),
  type: text("type").notNull(), // e.g., deposit, withdrawal, transfer
  status: statusEnum("status").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const kyc_submissions = pgTable("kyc_submissions", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id),
  status: statusEnum("status").notNull(),
  submitted_at: timestamp("submitted_at").defaultNow(),
  reviewed_at: timestamp("reviewed_at"),
  notes: text("notes"),
});

export const audit_logs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  resource_type: text("resource_type").notNull(),
  resource_id: integer("resource_id"),
  ip_address: text("ip_address"),
  user_agent: text("user_agent"),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id),
  session_id: text("session_id").notNull(),
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
