import { buildMetadata } from "@/lib/seo/metadata";
import { ToolShell } from "@/components/marketing/tool-shell";
import { AskQuiz } from "@/components/tools/ask-quiz";
import { getTool } from "@/content/tools";

const tool = getTool("how-to-ask-someone-out-quiz")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.description,
  path: `/tools/${tool.slug}`,
});

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AskQuiz />
    </ToolShell>
  );
}
