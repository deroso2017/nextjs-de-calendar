import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "./router";
import { inferRouterOutputs } from "@trpc/server";

// inferRouterOutputs<AppRouter> walks through entire tRPC backend router
// and extracts the RETURN (output) types of every procedure.
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export const trpc = createTRPCReact<AppRouter>();
