'use client';

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from 'react';

interface Flashcard {
    term: string;
    definition: string;
}

interface StudyMaterial {
    id: string;
    title: string;
    description: string;
    studyGuide: string;
    flashcards: Flashcard[];
    mcqTest: any;
}

export default function Flashcards({ params }: { params: { topicId: string } }) {
  const { topicId } = params;
  const router = useRouter();
    const [topicFlashcards, setTopicFlashcards] = useState<Flashcard[]>([]);
    const [topicTitle, setTopicTitle] = useState<string>('');
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [learnedCards, setLearnedCards] = useState<number[]>([]);
    const [needToReview, setNeedToReview] = useState<number[]>([]);
    const [practiceMode, setPracticeMode] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);


    useEffect(() => {
        const savedMaterialsString = localStorage.getItem('studyMaterials');
        if (savedMaterialsString) {
            const savedMaterials: StudyMaterial[] = JSON.parse(savedMaterialsString);
            const material = savedMaterials.find(m => m.id === topicId);

            if (material) {
                setTopicFlashcards(material.flashcards);
                setTopicTitle(material.title);
            }
        }
    }, [topicId]);

    const startPractice = () => {
        setPracticeMode(true);
        setCurrentCardIndex(0);
        setLearnedCards([]);
        setNeedToReview([]);
    };

    const nextCard = () => {
        setShowAnswer(false); // Hide answer when moving to the next card

        if (currentCardIndex < topicFlashcards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
        } else if (needToReview.length > 0) {
            // Move to review queue if available
            setCurrentCardIndex(needToReview[0]);
            setNeedToReview(needToReview.slice(1)); // Remove the card from review queue
        } else {
            setPracticeMode(false);
            alert("You've reviewed all flashcards!");
        }
    };

    const markLearned = () => {
        setLearnedCards([...learnedCards, currentCardIndex]);
        nextCard();
    };

    const markNeedToReview = () => {
        setNeedToReview([...needToReview, currentCardIndex]);
        nextCard();
    };

    const toggleAnswerVisibility = () => {
        setShowAnswer(!showAnswer);
    };

  return (
    <div className="container py-10">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2" />
        Back to Dashboard
      </Button>

          <h1 className="text-3xl font-bold mb-4">Flashcards for {topicTitle}</h1>

      {!practiceMode ? (
            <>
                <Button variant="secondary" onClick={startPractice} className="mb-4">
                    Start Practice
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topicFlashcards.map((flashcard, index) => (
                        <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle>{flashcard.term}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{flashcard.definition}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </>
        ) : (
            <>
                {topicFlashcards.length > 0 ? (
                    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                            <CardTitle>{topicFlashcards[currentCardIndex].term}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!showAnswer ? (
                                null
                            ) : (
                                <p>{topicFlashcards[currentCardIndex].definition}</p>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <p>No flashcards available.</p>
                )}

                <div className="flex justify-between mt-4" style={{display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px',
                  flexWrap: 'wrap'}}>
                  {!showAnswer ? (
                      <Button onClick={toggleAnswerVisibility} variant="secondary">Show Answer</Button>
                  ) : (
                      <>
                          <Button onClick={markNeedToReview} variant="destructive">Need to Review</Button>
                          <Button onClick={markLearned} variant="primary" style={{ backgroundColor: 'green', color: 'white' }}>Learned</Button>
                      </>
                  )}
                    <Button onClick={nextCard} variant="secondary">Next</Button>
                </div>
            </>
        )}
    </div>
  );
}

