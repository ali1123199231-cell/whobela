import { buildMetadata } from "@/lib/seo/metadata";
import { ToolShell } from "@/components/marketing/tool-shell";
import { FirstDateQuestions } from "@/components/tools/first-date-questions";
import { getTool } from "@/content/tools";

const tool = getTool("first-date-questions")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/tools/${tool.slug}`,
});

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <FirstDateQuestions />
    </ToolShell>
  );
}
