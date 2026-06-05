import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, inquiries, portfolioProjects, testimonials, InsertInquiry, nichePackages, customerSubscriptions, InsertNichePackage, InsertCustomerSubscription } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createInquiry(data: InsertInquiry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(inquiries).values(data);
  return result;
}

export async function listInquiries() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(inquiries).orderBy(inquiries.createdAt);
}

export async function getPortfolioProjects() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(portfolioProjects).orderBy(portfolioProjects.createdAt);
}

export async function getTestimonials() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(testimonials).orderBy(testimonials.createdAt);
}

export async function getNichePackages() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(nichePackages).where(eq(nichePackages.active, 1));
}

export async function createNichePackage(data: InsertNichePackage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(nichePackages).values(data);
}

export async function getCustomerSubscriptions(customerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(customerSubscriptions).where(eq(customerSubscriptions.customerId, customerId));
}

export async function createCustomerSubscription(data: InsertCustomerSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(customerSubscriptions).values(data);
}

export async function cancelCustomerSubscription(subscriptionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(customerSubscriptions).set({ active: 0, endDate: new Date() }).where(eq(customerSubscriptions.id, subscriptionId));
}


