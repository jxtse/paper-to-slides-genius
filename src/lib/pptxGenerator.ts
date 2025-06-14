
import PptxGenJS from 'pptxgenjs';
import { toast } from 'sonner';
import { ImageSuggestionState } from '@/hooks/useImageGeneration';

export const generatePptx = async (markdownContent: string, imageStates: Map<string, ImageSuggestionState>) => {
  if (!markdownContent) {
    toast.error("No outline content available to generate a presentation.");
    return;
  }
  
  toast.info("Generating .pptx presentation...", { id: "pptx-gen" });

  try {
    const pptx = new PptxGenJS();
    const slidesMd = markdownContent.split('---');

    for (const [slideIndex, slideMd] of slidesMd.entries()) {
      const slide = pptx.addSlide();
      
      const linesForPptx = slideMd.trim().split('\n').filter(line => line.trim() !== '');
      const titleLineForPptx = linesForPptx.find(line => line.startsWith('#')) || `Slide ${slideIndex + 1}`;
      slide.addText(titleLineForPptx.replace(/^#+\s*/, ''), { x: 0.5, y: 0.25, w: '90%', h: 0.75, fontSize: 24, bold: true, color: '363636' });

      const contentLinesForPptx = linesForPptx.filter(line => !line.startsWith('#') && !line.startsWith('[Suggested Image:'));
      const bodyText = contentLinesForPptx.join('\n').replace(/^- /g, '');
      slide.addText(bodyText, { x: 0.5, y: 1.2, w: '90%', h: 3.8, fontSize: 16, bullet: true, color: '494949' });
      
      const imageSuggestionRegex = /\[Suggested Image:\s*(.*?)\]/g;
      let match;

      const linesForKeyGen = slideMd.trim().split('\n');
      const titleLineForKeyGen = linesForKeyGen.find(line => line.startsWith('#')) || linesForKeyGen[0] || `Slide ${slideIndex + 1}`;
      const contentLinesForKeyGen = linesForKeyGen.filter(line => line !== titleLineForKeyGen);
      const rawContentForKeyGen = contentLinesForKeyGen.join('\n');
      
      imageSuggestionRegex.lastIndex = 0;

      while ((match = imageSuggestionRegex.exec(rawContentForKeyGen)) !== null) {
        const suggestionKey = `slide-${slideIndex}-img-${match.index}`;
        const imageState = imageStates.get(suggestionKey);

        if (imageState?.svgCode) {
          const svgBase64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(imageState.svgCode)));
          slide.addImage({
            data: svgBase64,
            x: 5.5, y: 1.5, w: 4, h: 3,
          });
        }
      }
    }

    const fileName = `presentation-${new Date().toISOString().slice(0, 10)}.pptx`;
    await pptx.writeFile({ fileName });
    toast.success("Presentation generated successfully!", { id: "pptx-gen" });

  } catch (error: any) {
    console.error("Error generating PPTX file:", error);
    toast.error("Failed to generate presentation.", { description: error.message, id: "pptx-gen" });
  }
};
