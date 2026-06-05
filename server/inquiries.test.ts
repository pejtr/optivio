import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the notification module
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock the database module
vi.mock("./db", () => ({
  createInquiry: vi.fn().mockResolvedValue({ insertId: 1 }),
  listInquiries: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      phone: "+420123456789",
      businessDescription: "Test business",
      packageType: "web-lead-gen",
      createdAt: new Date(),
      status: "new",
      notes: null,
    },
  ]),
  getPortfolioProjects: vi.fn().mockResolvedValue([]),
  getTestimonials: vi.fn().mockResolvedValue([]),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "owner@example.com",
      name: "Test Owner",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("inquiries.create", () => {
  it("creates an inquiry with valid data", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.inquiries.create({
      name: "Jan Novák",
      email: "jan@example.com",
      phone: "+420123456789",
      businessDescription: "Elektrikářství",
      packageType: "web-lead-gen",
    });

    expect(result).toEqual({ success: true, id: 1 });
  });

  it("creates an inquiry with minimal data", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.inquiries.create({
      name: "Jana Svobodová",
      email: "jana@example.com",
    });

    expect(result).toEqual({ success: true, id: 1 });
  });

  it("requires name and email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.inquiries.create({
        name: "",
        email: "test@example.com",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe("inquiries.list", () => {
  it("returns list of inquiries for authenticated users", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.inquiries.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  it("rejects unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.inquiries.list();
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe("portfolio.list", () => {
  it("returns portfolio projects for public access", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.portfolio.list();

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("testimonials.list", () => {
  it("returns testimonials for public access", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.testimonials.list();

    expect(Array.isArray(result)).toBe(true);
  });
});
