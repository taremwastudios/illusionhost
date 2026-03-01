import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export type HostingPlan = "free" | "starter" | "professional" | "business";

// Plan limits configuration
export const PLAN_LIMITS = {
  free: {
    domains: 0,
    databases: 0,
    diskGB: 0,
    dnsRecords: 0,
    emailAccounts: 0,
    bandwidthGB: 0,
  },
  starter: {
    domains: 1,
    databases: 2,
    diskGB: 5,
    dnsRecords: 50,
    emailAccounts: 5,
    bandwidthGB: 50,
  },
  professional: {
    domains: 3,
    databases: 10,
    diskGB: 25,
    dnsRecords: 200,
    emailAccounts: 25,
    bandwidthGB: 200,
  },
  business: {
    domains: 10,
    databases: 50,
    diskGB: 100,
    dnsRecords: 500,
    emailAccounts: 100,
    bandwidthGB: 1000,
  },
} as const;

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  plan: text("plan", { enum: ["free", "starter", "professional", "business"] }).default("free"),
  // Usage tracking
  domainsUsed: integer("domains_used").default(0),
  databasesUsed: integer("databases_used").default(0),
  diskUsedMB: integer("disk_used_mb").default(0),
  dnsRecordsUsed: integer("dns_records_used").default(0),
  emailAccountsUsed: integer("email_accounts_used").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
