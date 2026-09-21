"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { getProject } from "@/content";
import { ProjectWorkspace } from "@/components/ProjectWorkspace";

export default function ProjectPage() {
  const params = useParams<{ projectId: string }>();
  const found = getProject(params.projectId);

  if (!found) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-slate-300">Project not found.</p>
        <Link href="/levels" className="text-sm text-accent-light underline underline-offset-4">
          Back to the curriculum map
        </Link>
      </main>
    );
  }

  return <ProjectWorkspace level={found.level} project={found.project} />;
}
