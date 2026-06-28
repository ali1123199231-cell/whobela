import { buildMetadata } from "@/lib/seo/metadata";
import { ToolShell } from "@/components/marketing/tool-shell";
import { DateIdeaGenerator } from "@/components/tools/date-idea-generator";
import { getTool } from "@/content/tools";

const tool = getTool("date-idea-generator")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/tools/${tool.slug}`,
});

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <DateIdeaGenerator />
    </ToolShell>
  );
}
