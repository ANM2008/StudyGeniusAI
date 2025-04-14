'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download } from "lucide-react";
import React, { useState, useEffect } from "react";
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx';
import { PageParams } from './page';

interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  studyGuide: string;
  flashcards: any[];
  mcqTest: any;
}

interface Props {
  params: PageParams;
}

export default function StudyGuideClient({ params }: Props) {
  const { topicId } = params;
  const [guideContent, setGuideContent] = useState<string | null>(null);
  const [topicTitle, setTopicTitle] = useState<string>('');

  useEffect(() => {
    const savedMaterialsString = localStorage.getItem('studyMaterials');
    if (savedMaterialsString) {
      const savedMaterials: StudyMaterial[] = JSON.parse(savedMaterialsString);
      const material = savedMaterials.find(m => m.id === topicId);

      if (material) {
        setGuideContent(material.studyGuide);
        setTopicTitle(material.title);
      } else {
        setGuideContent("No study guide available for this topic.");
        setTopicTitle("Unknown Topic");
      }
    } else {
      setGuideContent("No study guide available for this topic.");
      setTopicTitle("Unknown Topic");
    }
  }, [topicId]);

  const downloadAsPDF = () => {
    if (!guideContent) return;
    
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    
    let y = margin;
    const lines = guideContent.split('\n');
    
    // Add title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(24);
    const cleanTitle = topicTitle.replace(/\*(.*?)\*/g, '$1');
    pdf.text(cleanTitle, margin, y);
    y += 20;

    lines.forEach(line => {
      if (line.trim() === '') {
        y += 10;
        if (y >= pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
        return;
      }

      if (y >= pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }

      // Remove asterisks from all text while keeping the content between them
      const cleanLine = line.replace(/\*(.*?)\*/g, '$1');

      if (line.startsWith('### ')) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(20);
        const text = cleanLine.replace('### ', '');
        pdf.text(text, margin, y);
        y += 15;
      } else if (line.startsWith('## ')) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        const text = cleanLine.replace('## ', '');
        pdf.text(text, margin, y);
        y += 12;
      } else if (line.startsWith('# ')) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        const text = cleanLine.replace('# ', '');
        pdf.text(text, margin, y);
        y += 10;
      } else if (line.startsWith('• ')) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);
        const text = cleanLine.substring(2);
        
        const bulletWidth = pdf.getTextWidth('• ');
        const textWidth = maxWidth - bulletWidth;
        const splitText = pdf.splitTextToSize(text, textWidth);
        
        splitText.forEach((textLine: string, index: number) => {
          if (y >= pageHeight - margin) {
            pdf.addPage();
            y = margin;
          }
          if (index === 0) {
            pdf.text('• ', margin, y);
            pdf.text(textLine, margin + bulletWidth, y);
          } else {
            pdf.text(textLine, margin + bulletWidth, y);
          }
          y += 8;
        });
        y += 4;
      } else if (/^\d+\./.test(line)) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);
        const text = cleanLine;
        
        const numberMatch = text.match(/^\d+\./);
        const numberWidth = numberMatch ? pdf.getTextWidth(numberMatch[0] + ' ') : 0;
        const textWidth = maxWidth - numberWidth;
        
        const splitText = pdf.splitTextToSize(text, textWidth);
        splitText.forEach((textLine: string, index: number) => {
          if (y >= pageHeight - margin) {
            pdf.addPage();
            y = margin;
          }
          pdf.text(textLine, margin, y);
          y += 8;
        });
        y += 4;
      } else {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);
        const text = cleanLine;
        
        const splitText = pdf.splitTextToSize(text, maxWidth);
        splitText.forEach((textLine: string) => {
          if (y >= pageHeight - margin) {
            pdf.addPage();
            y = margin;
          }
          pdf.text(textLine, margin, y);
          y += 8;
        });
        y += 4;
      }
    });

    pdf.save(`${topicTitle.replace(/\s+/g, '-').toLowerCase()}-study-guide.pdf`);
  };

  const downloadAsDocx = async () => {
    if (!guideContent) return;
    
    // Clean the title of any asterisks while keeping the content between them
    const cleanTitle = topicTitle.replace(/\*(.*?)\*/g, '$1');

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: cleanTitle,
            heading: HeadingLevel.TITLE,
          }),
          ...guideContent.split('\n').map(line => {
            if (line.trim() === '') {
              return new Paragraph({});
            }

            // Remove asterisks from all text while keeping the content between them
            const cleanLine = line.replace(/\*(.*?)\*/g, '$1');

            let paragraph;
            if (line.startsWith('### ')) {
              paragraph = new Paragraph({
                text: cleanLine.substring(4),
                heading: HeadingLevel.HEADING_1,
              });
            } else if (line.startsWith('## ')) {
              paragraph = new Paragraph({
                text: cleanLine.substring(3),
                heading: HeadingLevel.HEADING_2,
              });
            } else if (line.startsWith('# ')) {
              paragraph = new Paragraph({
                text: cleanLine.substring(2),
                heading: HeadingLevel.HEADING_3,
              });
            } else if (line.startsWith('• ')) {
              paragraph = new Paragraph({
                text: cleanLine,
                bullet: {
                  level: 0,
                },
              });
            } else {
              paragraph = new Paragraph({
                text: cleanLine,
              });
            }
            return paragraph;
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${topicTitle.replace(/\s+/g, '_')}_study_guide.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Helper function to format text with emphasis
  const formatText = (text: string) => {
    if (!text.includes('*')) return text;
    
    // Split on asterisks but keep empty strings to maintain spacing
    const parts = text.split(/(\*[^*]+\*)/);
    return parts.map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        const content = part.slice(1, -1);
        return <em key={i} className="italic font-medium">{content}</em>;
      }
      return part;
    });
  };

  // Format the study guide content with proper spacing and formatting
  const formattedContent = guideContent
    ?.split('\n')
    .map((paragraph, index) => {
      if (paragraph.trim() === '') {
        return <div key={index} className="h-4" />;
      }

      if (paragraph.startsWith('### ')) {
        const headingText = paragraph.substring(4);
        return (
          <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-primary border-b pb-2">
            {formatText(headingText)}
          </h2>
        );
      }

      if (paragraph.startsWith('## ')) {
        const headingText = paragraph.substring(3);
        return (
          <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-foreground/90">
            {formatText(headingText)}
          </h3>
        );
      }

      if (paragraph.startsWith('# ')) {
        const headingText = paragraph.substring(2);
        return (
          <h4 key={index} className="text-lg font-medium mt-4 mb-2 text-foreground/80">
            {formatText(headingText)}
          </h4>
        );
      }

      if (paragraph.startsWith('• ')) {
        const bulletText = paragraph.substring(2);
        return (
          <li key={index} className="ml-6 mb-2 text-foreground/80" style={{ 
            listStyleType: 'none', 
            position: 'relative' 
          }}>
            <span style={{ 
              position: 'absolute',
              left: '-1.2em',
              fontSize: '1.2em',
              lineHeight: '1.2',
            }}>•</span>
            {formatText(bulletText)}
          </li>
        );
      }

      if (/^\d+\.\s/.test(paragraph)) {
        const numberText = paragraph.replace(/^\d+\.\s/, '');
        return (
          <div key={index} className="flex gap-2 ml-6 mb-2">
            <span className="text-primary/70 font-medium min-w-[1.5rem]">{paragraph.match(/^\d+/)?.[0]}.</span>
            <span className="text-foreground/80">{formatText(numberText)}</span>
          </div>
        );
      }

      return (
        <p key={index} className="mb-3 leading-relaxed text-foreground/80">
          {formatText(paragraph)}
        </p>
      );
    })
    .filter(Boolean);

  return (
    <div className="container max-w-4xl py-10">
      <Button variant="ghost" onClick={() => window.history.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">{topicTitle}</h1>
        <div className="flex gap-2">
          <Button onClick={downloadAsPDF} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button onClick={downloadAsDocx} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download DOCX
          </Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle>Study Guide</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {formattedContent ? (
            <div className="space-y-1">
              {formattedContent}
            </div>
          ) : (
            <p className="text-muted-foreground">No study guide available for this topic.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 