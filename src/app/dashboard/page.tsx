'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { File, Rocket, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from 'react';

interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  studyGuide: string;
  flashcards: any[];
  mcqTest: any;
}

export default function Dashboard() {
  const router = useRouter();
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);

  useEffect(() => {
    // Load study materials from local storage
    const savedMaterials = JSON.parse(localStorage.getItem('studyMaterials') || '[]');
    setStudyMaterials(savedMaterials);
  }, []);

  const handleDeleteMaterial = (id: string) => {
    const updatedMaterials = studyMaterials.filter(material => material.id !== id);
    localStorage.setItem('studyMaterials', JSON.stringify(updatedMaterials));
    setStudyMaterials(updatedMaterials);
  };

  return (
    <div className="container py-10">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Study Dashboard</h1>
        <Button onClick={() => router.push('/generate')}><File className="mr-2"/> Generate New Materials</Button>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studyMaterials.map((material) => (
          <Card key={material.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <File className="mr-2 text-gray-500"/>{material.title}
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteMaterial(material.id)}>
                  <Trash className="h-4 w-4"/>
                </Button>
              </CardTitle>
              <CardDescription>{material.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="secondary" asChild className="mr-2">
                <Link href={`/study-guide/${material.id}`}>View Study Guide <Rocket className="ml-2"/></Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href={`/flashcards/${material.id}`}>Review Flashcards <Rocket className="ml-2"/></Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
