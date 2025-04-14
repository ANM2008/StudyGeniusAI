import { type Metadata } from 'next'

export async function generateMetadata({
  params
}: {
  params: Promise<{ topicId: string }>
}): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Flashcards - StudyGenius`
  }
}