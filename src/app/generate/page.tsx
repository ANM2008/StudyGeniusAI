'use client'

import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {useState, useEffect} from "react";
import {generateStudyMaterials, GenerateStudyMaterialsOutput} from '@/ai/flows/generate-study-materials';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useRouter} from "next/navigation";
import {Loader2, File, Copy, Check} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useToast} from "@/hooks/use-toast";
import {v4 as uuidv4} from 'uuid';
import { Input } from "@/components/ui/input"

export default function Generate() {
  const [syllabusContent, setSyllabusContent] = useState("");
  const [studyMaterials, setStudyMaterials] = useState<GenerateStudyMaterialsOutput | null>(null);
  const [numberOfMcqQuestions, setNumberOfMcqQuestions] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {toast} = useToast();
  const router = useRouter();
  const [topicTitle, setTopicTitle] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSyllabusContent(event.target.value);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          setSyllabusContent(content);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await generateStudyMaterials({
        syllabusContent: syllabusContent,
        numberOfMcqQuestions: numberOfMcqQuestions
      });
      setStudyMaterials(result);

      // Save to local storage
      const savedMaterials = JSON.parse(localStorage.getItem('studyMaterials') || '[]');
      const newMaterialId = uuidv4();
        // Replace spaces with underscores in topicTitle for a cleaner ID
        const sanitizedTopicTitle = topicTitle.replace(/\s+/g, '_');
      savedMaterials.push({
        id: newMaterialId, // Generate a simple ID
        title: topicTitle,
        description: `Study material for ${topicTitle}`,
        studyGuide: result.studyGuide,
        flashcards: result.flashcards,
        mcqTest: result.mcqTest,
      });
      localStorage.setItem('studyMaterials', JSON.stringify(savedMaterials));

      toast({
        description: "Study materials generated and saved successfully!",
      });

      router.push('/dashboard');

    } catch (error) {
      console.error("Error generating study materials:", error);
      toast({
        variant: "destructive",
        title: "Error generating study materials",
        description: "Please check your syllabus content and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(syllabusContent);
    setIsCopied(true);
    toast({
      description: "Syllabus content copied to clipboard.",
    });
    
    // Reset after 2 seconds
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-start justify-center w-full flex-1 px-4 sm:px-6 lg:px-8 text-left max-w-3xl">
        <h1 className="text-4xl font-bold mb-4">
          Generate Study Materials
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Upload a file or paste your syllabus content below to generate your study materials.
        </p>

        {/* Topic Title Input */}
        <div className="w-full mb-4">
          <label htmlFor="topic-title" className="block text-sm font-medium text-gray-700">
            Topic Title
          </label>
          <Input
            type="text"
            id="topic-title"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter topic title"
            value={topicTitle}
            onChange={(e) => setTopicTitle(e.target.value)}
            required
          />
        </div>

        {/* File Upload and Text Area */}
        <div className="w-full mb-4">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="upload-file"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 cursor-pointer"
            >
              <File className="mr-2 h-4 w-4" />
              {selectedFile ? selectedFile.name : "Upload File"}
            </label>
            <input
              type="file"
              id="upload-file"
              accept=".pdf, .txt"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyContent}
              disabled={!syllabusContent || isCopied}
            >
              {isCopied ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {isCopied ? "Copied!" : "Copy Content"}
            </Button>
          </div>
          <Textarea
            placeholder="Paste your syllabus content here..."
            className="mb-4 border-none shadow-sm"
            value={syllabusContent}
            onChange={handleContentChange}
          />
        </div>

        {/* Generate Button */}
        <Button onClick={handleSubmit} disabled={isLoading || !topicTitle} className="mb-4">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Study Materials"
          )}
        </Button>
        <Button variant="secondary" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>

        {/* Study Materials Display */}
        {studyMaterials && (
          <div className="mt-8 w-full">
            <Card>
              <CardHeader>
                <CardTitle>Generated Study Materials for {topicTitle}</CardTitle>
                <CardDescription>Review your generated study materials below.</CardDescription>
              </CardHeader>
              <CardContent className="pl-6">
                <Tabs defaultValue="study-guide" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="study-guide">Study Guide</TabsTrigger>
                    <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                    <TabsTrigger value="mcq-test">MCQ Test</TabsTrigger>
                  </TabsList>
                  <TabsContent value="study-guide" className="mt-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Study Guide</h3>
                      <p className="text-muted-foreground">{studyMaterials.studyGuide}</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="flashcards" className="mt-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Flashcards</h3>
                      {studyMaterials.flashcards.map((flashcard, index) => (
                        <div key={index} className="mb-4 p-4 rounded-md shadow-sm">
                          <h4 className="font-semibold">{flashcard.term}</h4>
                          <p className="text-muted-foreground">{flashcard.definition}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="mcq-test" className="mt-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">MCQ Test</h3>
                      {studyMaterials.mcqTest.mcqTest.map((mcq, index) => (
                        <div key={index} className="mb-4 p-4 rounded-md shadow-sm">
                          <p className="font-semibold">{mcq.question}</p>
                          <ul>
                            {mcq.options.map((option, optionIndex) => (
                              <li key={optionIndex} className="text-muted-foreground">{option}</li>
                            ))}
                          </ul>
                          <p className="text-green-500">Correct Answer: {mcq.correctAnswer}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

