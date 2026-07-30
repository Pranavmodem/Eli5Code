import { notFound } from "next/navigation";
import { allLessons, getLesson } from "@/lib/curriculum";
import LessonView from "@/components/LessonView";

export function generateStaticParams() {
  return allLessons.map((l) => ({ lessonId: l.id }));
}

export function generateMetadata({ params }: { params: { lessonId: string } }) {
  const hit = getLesson(params.lessonId);
  return { title: hit ? `${hit.lesson.t} — ELI5Code` : "Lesson" };
}

export default function LessonPage({ params }: { params: { lessonId: string } }) {
  if (!getLesson(params.lessonId)) notFound();
  return <LessonView lessonId={params.lessonId} />;
}
