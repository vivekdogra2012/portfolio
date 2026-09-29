import { hostedModelAvailable } from "@/lib/conversation-stream";
import type { ModelInfo } from "@/lib/types";

export const dynamic = "force-dynamic";

export function GET() {
  const models: ModelInfo[] = [{ id: "gpt-prototype", label: "gpt-prototype", provider: "local" }];
  if (hostedModelAvailable()) {
    const id = process.env.OPENAI_MODEL || "gpt-4o-mini";
    models.push({ id, label: id, provider: "openai" });
  }
  return Response.json({ models });
}
