import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createInquiry, listInquiries, getPortfolioProjects, getTestimonials, getNichePackages, createNichePackage, getCustomerSubscriptions, createCustomerSubscription, cancelCustomerSubscription, getAllNichePackages, updateNichePackage, deactivateNichePackage, getAllSubscriptions, createOrder, getOrder, updateOrder, createPayment, getPaymentsByOrder } from "./db";
import { notifyOwner } from "./_core/notification";
import { sendOrderConfirmationEmail, sendPaymentConfirmationEmail } from "./email-service";
import Stripe from "stripe";
import { z } from "zod";
import { OPTIVIO_PRODUCTS, calculateDeposit, calculateRemaining } from "./stripe-products";

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
    admin: router({
      list: protectedProcedure.query(async ({ ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return await getAllNichePackages();
      }),
      create: protectedProcedure
        .input((data: unknown) => {
          const obj = data as Record<string, unknown>;
          return {
            name: String(obj.name || ""),
            niche: String(obj.niche || ""),
            description: obj.description ? String(obj.description) : null,
            price: Number(obj.price || 0),
            features: String(obj.features || ""),
          };
        })
        .mutation(async ({ input, ctx }) => {
          if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
          return await createNichePackage(input as any);
        }),
      update: protectedProcedure
        .input((data: unknown) => {
          const obj = data as Record<string, unknown>;
          return {
            id: Number(obj.id || 0),
            name: String(obj.name || ""),
            niche: String(obj.niche || ""),
            description: obj.description ? String(obj.description) : null,
            price: Number(obj.price || 0),
            features: String(obj.features || ""),
          };
        })
        .mutation(async ({ input, ctx }) => {
          if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
          const { id, ...data } = input;
          return await updateNichePackage(id, data as any);
        }),
      deactivate: protectedProcedure
        .input((data: unknown) => {
          const obj = data as Record<string, unknown>;
          return { id: Number(obj.id || 0) };
        })
        .mutation(async ({ input, ctx }) => {
          if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
          return await deactivateNichePackage(input.id);
        }),
    }),
  }),
  subscriptions: router({
    list: protectedProcedure
      .input((data: unknown) => {
        const obj = data as Record<string, unknown>;
        return { customerId: Number(obj.customerId || 0) };
      })
      .query(async ({ input }) => {
        if (input.customerId === 0) {
          return await getAllSubscriptions();
        }
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
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return await cancelCustomerSubscription(input.subscriptionId);
      }),
  }),
  stripe: router({
    createCheckoutSession: publicProcedure
      .input((data: unknown) => {
        const obj = data as Record<string, unknown>;
        return {
          packageType: String(obj.packageType || ""),
          inquiryId: Number(obj.inquiryId || 0),
          customerEmail: String(obj.customerEmail || ""),
          customerName: String(obj.customerName || ""),
        };
      })
      .mutation(async ({ input, ctx }) => {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
        const packageKey = input.packageType.toUpperCase().replace(/-/g, "_") as keyof typeof OPTIVIO_PRODUCTS;
        const product = OPTIVIO_PRODUCTS[packageKey];

        if (!product) {
          throw new Error("Invalid package type");
        }

        const depositAmount = calculateDeposit(product.priceInCzk, product.depositPercentage);
        const remainingAmount = calculateRemaining(product.priceInCzk, depositAmount);

        const orderResult = await createOrder({
          inquiryId: input.inquiryId,
          packageType: input.packageType,
          totalPrice: product.priceInCzk,
          depositPercentage: product.depositPercentage,
          depositAmount,
          remainingAmount,
          status: "pending",
        });

        const orderId = (orderResult as any).insertId || 0;

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "czk",
                product_data: {
                  name: product.name,
                  description: product.description,
                },
                unit_amount: depositAmount,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${ctx.req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${ctx.req.headers.origin}/payment-cancel`,
          customer_email: input.customerEmail,
          client_reference_id: orderId.toString(),
          metadata: {
            orderId: orderId.toString(),
            inquiryId: input.inquiryId.toString(),
            packageType: input.packageType,
            customerName: input.customerName,
          },
        });

        await updateOrder(orderId, {
          stripeCheckoutSessionId: session.id,
        });

        // Send confirmation email to customer
        await sendOrderConfirmationEmail(
          input.customerEmail,
          input.customerName,
          orderId,
          input.packageType,
          product.priceInCzk,
          depositAmount,
          session.url || undefined
        ).catch(err => console.error("Failed to send order confirmation email:", err));

        return {
          sessionId: session.id,
          checkoutUrl: session.url,
          orderId,
        };
      }),
    getOrder: publicProcedure
      .input((data: unknown) => {
        const obj = data as Record<string, unknown>;
        return { orderId: Number(obj.orderId || 0) };
      })
      .query(async ({ input }) => {
        const order = await getOrder(input.orderId);
        if (!order) throw new Error("Order not found");
        return order;
      }),
    getOrderPayments: publicProcedure
      .input((data: unknown) => {
        const obj = data as Record<string, unknown>;
        return { orderId: Number(obj.orderId || 0) };
      })
      .query(async ({ input }) => {
        return await getPaymentsByOrder(input.orderId);
      }),
  }),

  orders: router({
    listByUser: protectedProcedure.query(async ({ ctx }) => {
      const inquiries = await listInquiries();
      const userInquiries = inquiries.filter(i => i.email === ctx.user?.email);
      const inquiryIds = userInquiries.map(i => i.id);
      
      if (inquiryIds.length === 0) return [];
      
      const allOrders = [];
      for (const inquiryId of inquiryIds) {
        const order = await getOrder(inquiryId).catch(() => null);
        if (order) allOrders.push(order);
      }
      return allOrders;
    }),
  }),

  payments: router({
    listByUser: protectedProcedure.query(async ({ ctx }) => {
      const inquiries = await listInquiries();
      const userInquiries = inquiries.filter(i => i.email === ctx.user?.email);
      const inquiryIds = userInquiries.map(i => i.id);
      
      if (inquiryIds.length === 0) return [];
      
      const allPayments = [];
      for (const inquiryId of inquiryIds) {
        const order = await getOrder(inquiryId).catch(() => null);
        if (order) {
          const payments = await getPaymentsByOrder(order.id);
          allPayments.push(...payments);
        }
      }
      return allPayments;
    }),
  }),

  leados: router({
    createProject: protectedProcedure
      .input((data: unknown) => {
        const obj = data as Record<string, unknown>;
        return {
          orderId: Number(obj.orderId || 0),
          title: String(obj.title || ""),
          description: obj.description ? String(obj.description) : undefined,
          packageType: String(obj.packageType || ""),
        };
      })
      .mutation(async ({ input }) => {
        // Verify order exists
        const order = await getOrder(input.orderId).catch(() => null);
        if (!order) {
          throw new Error("Order not found");
        }

        // Create project in database
        const db = await require("./db").getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        const { projects } = await import("../drizzle/schema");
        const projectId = Math.random().toString(36).substring(2, 10);
        const deadline = Date.now() + 14 * 24 * 60 * 60 * 1000; // 2 weeks

        await db.insert(projects).values({
          id: projectId,
          orderId: input.orderId,
          status: "pending",
          title: input.title,
          description: input.description,
          packageType: input.packageType,
          deadline,
        });

        // Notify owner
        await notifyOwner({
          title: `🚀 Nový projekt: ${input.title}`,
          content: `Projekt vytvořen pro objednávku #${input.orderId}. Termín: ${new Date(deadline).toLocaleDateString()}`,
        });

        return { projectId, deadline };
      }),

    getProject: protectedProcedure
      .input((data: unknown) => {
        const obj = data as Record<string, unknown>;
        return { projectId: String(obj.projectId || "") };
      })
      .query(async ({ input }) => {
        const db = await require("./db").getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        const { projects, projectMilestones } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");

        const project = await db
          .select()
          .from(projects)
          .where(eq(projects.id, input.projectId))
          .limit(1);

        if (!project[0]) {
          throw new Error("Project not found");
        }

        const milestones = await db
          .select()
          .from(projectMilestones)
          .where(eq(projectMilestones.projectId, input.projectId));

        return {
          ...project[0],
          milestones,
          timeRemaining: project[0].deadline ? project[0].deadline - Date.now() : null,
        };
      }),

    updateProjectStatus: protectedProcedure
      .input((data: unknown) => {
        const obj = data as Record<string, unknown>;
        return {
          projectId: String(obj.projectId || ""),
          status: String(obj.status || "pending"),
          completionPercentage: Number(obj.completionPercentage || 0),
        };
      })
      .mutation(async ({ input }) => {
        const db = await require("./db").getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        const { projects } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");

        await db
          .update(projects)
          .set({
            status: input.status,
            completionPercentage: input.completionPercentage,
            updatedAt: new Date(),
          })
          .where(eq(projects.id, input.projectId));

        await notifyOwner({
          title: `📊 Aktualizace projektu`,
          content: `Projekt ${input.projectId} změnil status na: ${input.status} (${input.completionPercentage}%)`,
        });

        return { ok: true };
      }),
  }),

  ab: router({
    getVariant: publicProcedure
      .input(z.object({ userId: z.string().optional() }).optional())
      .query(({ input }) => {
        // Deterministic variant assignment (A/B/C/D)
        const variants = ['A', 'B', 'C', 'D'];
        const userId = input?.userId || 'anonymous';
        const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const variant = variants[hash % 4];
        return { variant };
      }),

    trackConversion: publicProcedure
      .input(z.object({
        variant: z.enum(['A', 'B', 'C', 'D']),
        event: z.string(),
        metadata: z.record(z.string(), z.any()).optional(),
      }))
      .mutation(async ({ input }) => {
        // Log AB test events
        console.log(`[AB Test] Variant ${input.variant} - Event: ${input.event}`, input.metadata);
        return { ok: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
