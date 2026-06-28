import { buildMetadata } from "@/lib/seo/metadata";
import { ToolShell } from "@/components/marketing/tool-shell";
import { CuteWaysGenerator } from "@/components/tools/cute-ways-generator";
import { getTool } from "@/content/tools";

const tool = getTool("cute-ways-to-ask-generator")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/tools/${tool.slug}`,
});

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CuteWaysGenerator />
    </ToolShell>
  );
}
