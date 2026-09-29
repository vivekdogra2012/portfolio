import { handleConversationPost } from "@/lib/server-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return handleConversationPost(request);
}
