import { notFound } from "next/navigation";
import { getLesson, modules } from "@/lib/curriculum";
import LessonView from "@/components/LessonView";

export function generateStaticParams() {
  return modules.flatMap((m) =>
    m.lessons.map((l) => ({ moduleId: m.id, lessonId: l.id }))
  );
}

export function generateMetadata({
  params,
}: {
  params: { moduleId: string; lessonId: string };
}) {
  const hit = getLesson(params.moduleId, params.lessonId);
  return { title: hit ? `${hit.lesson.title} — Zero to Hero` : "Lesson" };
}

export default function LessonPage({
  params,
}: {
  params: { moduleId: string; lessonId: string };
}) {
  const hit = getLesson(params.moduleId, params.lessonId);
  if (!hit) notFound();
  return <LessonView moduleId={params.moduleId} lessonId={params.lessonId} />;
}
