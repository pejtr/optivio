import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createInquiry, listInquiries, getPortfolioProjects, getTestimonials, getNichePackages, createNichePackage, getCustomerSubscriptions, createCustomerSubscription, cancelCustomerSubscription } from "./db";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  inquiries: router({
    create: publicProcedure
      .input((data: unknown) => {
        const obj = data as Record<string, unknown>;
        return {
          name: String(obj.name || ""),
          email: String(obj.email || ""),
          phone: obj.phone ? String(obj.phone) : undefined,
          businessDescription: obj.businessDescription ? String(obj.businessDescription) : undefined,
          packageType: obj.packageType ? String(obj.packageType) : undefined,
        };
      })
      .mutation(async ({ input, ctx }) => {
        const inquiry = await createInquiry({
          name: input.name,
          email: input.email,
          phone: input.phone,
          businessDescription: input.businessDescription,
          packageType: input.packageType,
        });

        // Notify owner of new inquiry
        try {
          await notifyOwner({
            title: "Nová poptávka z webu",
            content: `Nová poptávka od ${input.name} (${input.email}, ${input.phone || "bez telefonu"})\n\nBalíček: ${input.packageType || "neuvedeno"}\nPopis: ${input.businessDescription || "neuvedeno"}`,
          });
        } catch (error) {
          console.error("Failed to notify owner:", error);
        }

        return { success: true, id: (inquiry as any).insertId || 0 };
      }),
    list: protectedProcedure.query(async () => {
      return await listInquiries();
    }),
  }),
  portfolio: router({
    list: publicProcedure.query(async () => {
      return await getPortfolioProjects();
    }),
  }),
  testimonials: router({
    list: publicProcedure.query(async () => {
      return await getTestimonials();
    }),
  }),
  nichePackages: router({
    list: publicProcedure.query(async () => {
      return await getNichePackages();
    }),
  }),
  subscriptions: router({
    list: protectedProcedure
      .input((data: unknown) => {
        const obj = data as Record<string, unknown>;
        return { customerId: Number(obj.customerId || 0) };
      })
      .query(async ({ input }) => {
        return await getCustomerSubscriptions(input.customerId);
      }),
    create: protectedProcedure
      .input((data: unknown) => {
        const obj = data as Record<string, unknown>;
        return {
          customerId: Number(obj.customerId || 0),
          packageId: Number(obj.packageId || 0),
          monthlyPrice: Number(obj.monthlyPrice || 0),
        };
      })
      .mutation(async ({ input }) => {
        return await createCustomerSubscription({
          customerId: input.customerId,
          packageId: input.packageId,
          monthlyPrice: input.monthlyPrice,
        });
      }),
    cancel: protectedProcedure
      .input((data: unknown) => {
        const obj = data as Record<string, unknown>;
        return { subscriptionId: Number(obj.subscriptionId || 0) };
      })
      .mutation(async ({ input }) => {
        return await cancelCustomerSubscription(input.subscriptionId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
