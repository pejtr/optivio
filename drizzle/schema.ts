import { bigint, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  businessDescription: text("businessDescription"),
  packageType: varchar("packageType", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  status: mysqlEnum("status", ["new", "contacted", "converted"]).default("new").notNull(),
  notes: text("notes"),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

export const portfolioProjects = mysqlTable("portfolio_projects", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  imageUrl: varchar("imageUrl", { length: 500 }),
  testimonialAuthor: varchar("testimonialAuthor", { length: 255 }),
  testimonialText: text("testimonialText"),
  testimonialRating: int("testimonialRating"),
  results: text("results"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PortfolioProject = typeof portfolioProjects.$inferSelect;
export type InsertPortfolioProject = typeof portfolioProjects.$inferInsert;

export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  author: varchar("author", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }),
  company: varchar("company", { length: 255 }),
  text: text("text").notNull(),
  rating: int("rating"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

export const nichePackages = mysqlTable("niche_packages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  niche: varchar("niche", { length: 255 }).notNull(),
  description: text("description"),
  price: int("price").notNull(), // Price in CZK (e.g., 1290 for 1 290 Kč)
  features: text("features").notNull(), // JSON array of features
  active: int("active").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NichePackage = typeof nichePackages.$inferSelect;
export type InsertNichePackage = typeof nichePackages.$inferInsert;

export const customerSubscriptions = mysqlTable("customer_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(), // References inquiries.id
  packageId: int("packageId").notNull(), // References nichePackages.id
  active: int("active").default(1).notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  endDate: timestamp("endDate"),
  monthlyPrice: int("monthlyPrice").notNull(), // Price in CZK
  nextBillingDate: timestamp("nextBillingDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomerSubscription = typeof customerSubscriptions.$inferSelect;
export type InsertCustomerSubscription = typeof customerSubscriptions.$inferInsert;

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  inquiryId: int("inquiryId").notNull(),
  packageType: varchar("packageType", { length: 100 }).notNull(),
  totalPrice: int("totalPrice").notNull(),
  depositPercentage: int("depositPercentage").default(30).notNull(),
  depositAmount: int("depositAmount").notNull(),
  remainingAmount: int("remainingAmount").notNull(),
  status: mysqlEnum("status", ["pending", "deposit_paid", "completed", "cancelled"]).default("pending").notNull(),
  stripeCheckoutSessionId: varchar("stripeCheckoutSessionId", { length: 255 }),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  amount: int("amount").notNull(),
  type: mysqlEnum("type", ["deposit", "final", "refund"]).notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }).unique(),
  status: mysqlEnum("status", ["pending", "succeeded", "failed", "refunded"]).default("pending").notNull(),
  invoiceUrl: varchar("invoiceUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

export const manusTaskLogs = mysqlTable("manus_task_logs", {
  id: int("id").autoincrement().primaryKey(),
  taskId: varchar("taskId", { length: 100 }).notNull(),
  eventType: varchar("eventType", { length: 50 }).notNull(),
  agentStatus: varchar("agentStatus", { length: 30 }),
  content: text("content"),
  rawEvent: text("rawEvent"), // JSON string
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ManusTaskLog = typeof manusTaskLogs.$inferSelect;
export type InsertManusTaskLog = typeof manusTaskLogs.$inferInsert;

// LeadOS Projects — orchestrated via Manus API v2
export const projects = mysqlTable("projects", {
  id: varchar("id", { length: 64 }).primaryKey(),
  orderId: int("orderId").notNull().references(() => orders.id),
  leadsOsProjectId: varchar("leadsOsProjectId", { length: 255 }), // Manus API project ID
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "failed"]).default("pending").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  packageType: varchar("packageType", { length: 50 }).notNull(), // lite, basic, lead_gen, automation
  assignedTo: varchar("assignedTo", { length: 255 }), // Team member email
  deadline: bigint("deadline", { mode: "number" }), // Unix timestamp (ms)
  completionPercentage: int("completionPercentage").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// Project Milestones — track progress within a project
export const projectMilestones = mysqlTable("project_milestones", {
  id: varchar("id", { length: 64 }).primaryKey(),
  projectId: varchar("projectId", { length: 64 }).notNull().references(() => projects.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "in_progress", "completed"]).default("pending").notNull(),
  dueDate: bigint("dueDate", { mode: "number" }), // Unix timestamp (ms)
  completedAt: bigint("completedAt", { mode: "number" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProjectMilestone = typeof projectMilestones.$inferSelect;
export type InsertProjectMilestone = typeof projectMilestones.$inferInsert;

// Heartbeat Job Tracking — autonomous monitoring and healing
export const heartbeatJobs = mysqlTable("heartbeat_jobs", {
  id: varchar("id", { length: 64 }).primaryKey(),
  taskUid: varchar("taskUid", { length: 255 }).notNull().unique(),
  projectId: varchar("projectId", { length: 64 }).references(() => projects.id),
  jobType: varchar("jobType", { length: 50 }).notNull(), // monitoring, alert, healing
  name: varchar("name", { length: 255 }).notNull(),
  cronExpression: varchar("cronExpression", { length: 50 }).notNull(),
  isActive: int("isActive").default(1),
  lastExecutedAt: bigint("lastExecutedAt", { mode: "number" }),
  nextExecutionAt: bigint("nextExecutionAt", { mode: "number" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HeartbeatJob = typeof heartbeatJobs.$inferSelect;
export type InsertHeartbeatJob = typeof heartbeatJobs.$inferInsert;
