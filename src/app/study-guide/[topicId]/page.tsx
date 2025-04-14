import { Suspense } from 'react'
import StudyGuideClient from './StudyGuideClient'

// Define the params shape for the dynamic route
export type PageParams = {
  topicId: string;
}

// Updated PageProps with correct typing for Next.js 15
export type PageProps = {
  params: Promise<PageParams>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export function generateStaticParams(): PageParams[] {
  // For a static export, we need to return an array of possible values
  return [
    { topicId: "placeholder1" },
    { topicId: "placeholder2" },
    { topicId: "placeholder3" },
  ];
}

export default async function StudyGuidePage({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudyGuideClient params={resolvedParams} />
    </Suspense>
  );
}
