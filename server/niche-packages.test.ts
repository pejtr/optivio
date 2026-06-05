import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("nichePackages", () => {
  it("lists niche packages", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const packages = await caller.nichePackages.list();
    
    // Should return an array (even if empty in test DB)
    expect(Array.isArray(packages)).toBe(true);
  });
});

describe("subscriptions", () => {
  it("lists customer subscriptions", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const subscriptions = await caller.subscriptions.list({ customerId: 1 });
    
    // Should return an array (even if empty in test DB)
    expect(Array.isArray(subscriptions)).toBe(true);
  });

  it("creates a customer subscription", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.subscriptions.create({
      customerId: 1,
      packageId: 1,
      monthlyPrice: 1000,
    });

    // Should return insert result
    expect(result).toBeDefined();
  });

  it("cancels a customer subscription", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.subscriptions.cancel({
      subscriptionId: 1,
    });

    // Should return update result
    expect(result).toBeDefined();
  });
});
