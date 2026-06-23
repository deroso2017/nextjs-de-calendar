import { initTRPC, TRPCError } from "@trpc/server";
import { type NextRequest } from "next/server";
import { prisma } from "../prisma";
import { getSession } from "../session";
import { z } from "zod/v4";
import bcrypt from "bcryptjs";

export async function createContext(req: NextRequest) {
  const session = await getSession();
  return { req, session, prisma };
}

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx: { ...ctx, session: ctx.session } });
});

const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session || ctx.session.user.role !== "admin")
    throw new TRPCError({ code: "FORBIDDEN" });
  return next({ ctx: { ...ctx, session: ctx.session } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAdmin);

export const authRouter = router({
  signup: publicProcedure
    .input(
      z.object({
        email: z.email(),
        name: z.string().min(2),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const exists = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (exists)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already in use",
        });
      const hashed = await bcrypt.hash(input.password, 10);
      const user = await ctx.prisma.user.create({
        data: { email: input.email, name: input.name, password: hashed },
      });
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    }),

  signin: publicProcedure
    .input(z.object({ email: z.email(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (!user || !(await bcrypt.compare(input.password, user.password)))
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      const { createSession } = await import("../session");
      const token = await createSession(user.id);
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    }),

  me: protectedProcedure.query(({ ctx }) => {
    const { id, email, name, role } = ctx.session.user;
    return { id, email, name, role };
  }),

  signout: publicProcedure.mutation(async ({ ctx }) => {
    const { deleteSession } = await import("../session");

    if (ctx.session) await deleteSession(ctx.session.token);

    return { success: true };
  }),
});

export const userRouter = router({
  list: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }),

  updateRole: adminProcedure
    .input(z.object({ userId: z.string(), role: z.enum(["user", "admin"]) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: input.userId },
        data: { role: input.role },
        select: { id: true, email: true, name: true, role: true },
      });
    }),

  delete: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.delete({ where: { id: input.userId } });
      return { success: true };
    }),
});

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
