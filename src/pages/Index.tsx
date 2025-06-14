
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import OutlineDisplay from '@/components/OutlineDisplay';
import { Button } from '@/components/ui/button'; // Ensure Button is imported if used directly here

const Index: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [slideMarkdown, setSlideMarkdown] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setSlideMarkdown(null); // Clear previous outline when new file is selected
  };

  const clearFile = () => {
    setSelectedFile(null);
    setSlideMarkdown(null);
  }

  const mockGenerateOutline = () => {
    if (!selectedFile) return;

    setIsGenerating(true);
    // Simulate API call / LLM processing
    setTimeout(() => {
      const mockPaperName = selectedFile.name.replace('.pdf', '');
      const mockMarkdown = `
# Slide 1: Title - ${mockPaperName}
- Presenter: Your Name
- Date: ${new Date().toLocaleDateString()}
- [Image: University Logo](university_logo.svg)

---

# Slide 2: Introduction
- Brief overview of the paper
- Motivation and problem statement
- Key contributions
- [Image: Abstract concept graphic](concept_graph.svg)

---

# Slide 3: Background / Related Work
- Existing research in the area
- How this paper builds upon or differs from previous work

---

# Slide 4: Methodology
- Detailed explanation of the approach
- Algorithms, datasets, or experimental setup
- [Image: Flowchart of methodology](methodology_flowchart.svg)

---

# Slide 5: Results & Discussion
- Presentation of key findings
- Graphs, charts, and tables (represented by image placeholders for now)
- [Image: Key Result Graph 1](result_graph_1.svg)
- [Image: Comparison Table](comparison_table.svg)
- Interpretation of results

---

# Slide 6: Conclusion & Future Work
- Summary of main points
- Implications of the research
- Potential future research directions

---

# Slide 7: Q&A
- Thank you
- [Image: Contact Information QR Code](contact_qr.svg)
      `;
      setSlideMarkdown(mockMarkdown.trim());
      setIsGenerating(false);
    }, 2000);
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-12">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Transform Your Papers into Engaging Presentations
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload your academic PDF, and let our AI craft a structured slide outline for you.
            Effortless, intelligent, and fast.
          </p>
        </section>

        <FileUpload
          onFileSelect={handleFileSelect}
          onGenerate={mockGenerateOutline}
          isGenerating={isGenerating}
          selectedFile={selectedFile}
          clearFile={clearFile}
        />

        {slideMarkdown && <OutlineDisplay markdownContent={slideMarkdown} />}

      </main>
      <Footer />
    </div>
  );
};

export default Index;
