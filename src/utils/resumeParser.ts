import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

export interface ParsedResumeData {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experience: string[];
  education: string[];
  rawText: string;
}

export const parseResume = async (file: File): Promise<ParsedResumeData> => {
  let text = '';
  
  try {
    if (file.type === 'application/pdf') {
      text = await extractTextFromPDF(file);
    } else if (file.name.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      text = result.value;
    } else {
      throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
    }

    if (!text.trim()) {
      throw new Error('No text could be extracted from the file. Please ensure the file contains readable text.');
    }

    return parseTextContent(text);
  } catch (error) {
    console.error('Resume parsing error:', error);
    throw error;
  }
};

const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF. The file may be corrupted or contain only images.');
  }
};

const parseTextContent = (text: string): ParsedResumeData => {
  const lines = text.split('\n').filter(line => line.trim());
  
  // Extract email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : '';

  // Extract phone
  const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
  const phoneMatch = text.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // Extract name (usually first line or near email)
  const name = extractName(lines, email);

  // Extract location
  const location = extractLocation(text);

  // Extract skills
  const skills = extractSkills(text);

  // Extract experience
  const experience = extractExperience(text);

  // Extract education
  const education = extractEducation(text);

  // Extract summary
  const summary = extractSummary(text);

  return {
    name,
    email,
    phone,
    location,
    summary,
    skills,
    experience,
    education,
    rawText: text
  };
};

const extractName = (lines: string[], email: string): string => {
  // Look for name in first few lines, avoiding email line
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (line && 
        !line.includes('@') && 
        !line.includes('http') && 
        !line.includes('www.') &&
        !line.includes('+') &&
        line.length > 5 && 
        line.length < 50) {
      // Check if it looks like a name (contains spaces, proper case, or is a single capitalized word)
      if (/^[A-Z][a-z]+ [A-Z][a-z]+/.test(line) || /^[A-Z][a-z]+$/.test(line)) {
        return line;
      }
    }
  }
  
  // Fallback: look for any line with proper name pattern
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[A-Z][a-z]+ [A-Z][a-z]+( [A-Z][a-z]+)?$/.test(trimmed) && 
        !trimmed.includes('@') && 
        trimmed.length < 50) {
      return trimmed;
    }
  }
  
  return 'Name Not Found';
};

const extractLocation = (text: string): string => {
  // Look for common location patterns
  const locationPatterns = [
    /([A-Z][a-z]+,?\s*[A-Z]{2})/g, // City, ST
    /([A-Z][a-z]+,?\s*[A-Z][a-z]+)/g, // City, State
    /([A-Z][a-z]+\s*[A-Z][a-z]+,?\s*[A-Z]{2})/g, // City Name, ST
  ];

  for (const pattern of locationPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      // Filter out common false positives
      const validLocations = matches.filter(match => 
        !match.toLowerCase().includes('university') &&
        !match.toLowerCase().includes('college') &&
        !match.toLowerCase().includes('company') &&
        !match.toLowerCase().includes('corp')
      );
      if (validLocations.length > 0) {
        return validLocations[0];
      }
    }
  }
  
  return '';
};

const extractSkills = (text: string): string[] => {
  const skillsSection = text.toLowerCase();
  const commonSkills = [
    'javascript', 'python', 'react', 'node.js', 'typescript', 'html', 'css',
    'sql', 'aws', 'docker', 'kubernetes', 'git', 'agile', 'scrum',
    'machine learning', 'data analysis', 'figma', 'photoshop', 'excel',
    'project management', 'leadership', 'communication', 'java', 'c++',
    'angular', 'vue.js', 'mongodb', 'postgresql', 'redis', 'jenkins',
    'terraform', 'ansible', 'linux', 'windows', 'macos', 'azure',
    'google cloud', 'firebase', 'graphql', 'rest api', 'microservices',
    'devops', 'ci/cd', 'testing', 'debugging', 'optimization'
  ];

  const foundSkills = commonSkills.filter(skill => 
    skillsSection.includes(skill.toLowerCase())
  );

  // Also look for skills section explicitly
  const lines = text.split('\n');
  let inSkillsSection = false;
  const explicitSkills: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim().toLowerCase();
    if (trimmed.includes('skill') || trimmed.includes('technolog') || trimmed.includes('competenc')) {
      inSkillsSection = true;
      continue;
    }
    
    if (inSkillsSection && trimmed) {
      if (trimmed.includes('experience') || trimmed.includes('education') || trimmed.includes('work')) {
        break;
      }
      // Extract skills from this line
      const skillsInLine = line.split(/[,•·\-\|]/).map(s => s.trim()).filter(s => s.length > 2);
      explicitSkills.push(...skillsInLine);
    }
  }

  // Combine and deduplicate
  const allSkills = [...new Set([...foundSkills, ...explicitSkills.slice(0, 10)])];
  return allSkills.slice(0, 12);
};

const extractExperience = (text: string): string[] => {
  const lines = text.split('\n');
  const experienceLines: string[] = [];
  let inExperienceSection = false;

  for (const line of lines) {
    const trimmed = line.trim();
    const lowerTrimmed = trimmed.toLowerCase();
    
    if (lowerTrimmed.includes('experience') || 
        lowerTrimmed.includes('work history') ||
        lowerTrimmed.includes('employment') ||
        lowerTrimmed.includes('professional experience')) {
      inExperienceSection = true;
      continue;
    }
    
    if (inExperienceSection && trimmed) {
      if (lowerTrimmed.includes('education') || 
          lowerTrimmed.includes('skills') ||
          lowerTrimmed.includes('certifications')) {
        break;
      }
      if (trimmed.length > 20 && !trimmed.includes('@')) {
        experienceLines.push(trimmed);
      }
    }
  }

  // If no explicit experience section, look for job titles and companies
  if (experienceLines.length === 0) {
    const jobPatterns = [
      /\b(engineer|developer|manager|analyst|specialist|coordinator|director|lead|senior|junior)\b/i,
      /\b(at|@)\s+[A-Z][a-z]+/g
    ];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length > 20 && jobPatterns.some(pattern => pattern.test(trimmed))) {
        experienceLines.push(trimmed);
      }
    }
  }

  return experienceLines.slice(0, 8);
};

const extractEducation = (text: string): string[] => {
  const lines = text.split('\n');
  const educationLines: string[] = [];
  let inEducationSection = false;

  for (const line of lines) {
    const trimmed = line.trim();
    const lowerTrimmed = trimmed.toLowerCase();
    
    if (lowerTrimmed.includes('education') || 
        lowerTrimmed.includes('academic') ||
        lowerTrimmed.includes('degree')) {
      inEducationSection = true;
      continue;
    }
    
    if (inEducationSection && trimmed) {
      if (lowerTrimmed.includes('experience') || 
          lowerTrimmed.includes('skills') ||
          lowerTrimmed.includes('certifications')) {
        break;
      }
      if (trimmed.length > 10 && !trimmed.includes('@')) {
        educationLines.push(trimmed);
      }
    }
  }

  // Also look for degree keywords throughout the text
  const degreeKeywords = ['bachelor', 'master', 'phd', 'doctorate', 'associate', 'certificate', 'diploma'];
  const universityKeywords = ['university', 'college', 'institute', 'school'];

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (degreeKeywords.some(keyword => lowerLine.includes(keyword)) ||
        universityKeywords.some(keyword => lowerLine.includes(keyword))) {
      if (!educationLines.includes(line.trim()) && line.trim().length > 10) {
        educationLines.push(line.trim());
      }
    }
  }

  return educationLines.slice(0, 5);
};

const extractSummary = (text: string): string => {
  const lines = text.split('\n');
  
  // Look for explicit summary sections
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().toLowerCase();
    if (line.includes('summary') || 
        line.includes('objective') ||
        line.includes('profile') ||
        line.includes('about')) {
      // Get next few lines as summary
      const summaryLines = [];
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const summaryLine = lines[j].trim();
        if (summaryLine && 
            summaryLine.length > 20 && 
            !summaryLine.toLowerCase().includes('experience') &&
            !summaryLine.toLowerCase().includes('education') &&
            !summaryLine.toLowerCase().includes('skills')) {
          summaryLines.push(summaryLine);
        } else if (summaryLine.toLowerCase().includes('experience') || 
                   summaryLine.toLowerCase().includes('education') ||
                   summaryLine.toLowerCase().includes('skills')) {
          break;
        }
      }
      if (summaryLines.length > 0) {
        return summaryLines.join(' ');
      }
    }
  }
  
  // Fallback: use first substantial paragraph that's not contact info
  const paragraphs = text.split('\n\n');
  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (trimmed.length > 100 && 
        !trimmed.includes('@') && 
        !trimmed.includes('+') &&
        !trimmed.toLowerCase().includes('experience') &&
        !trimmed.toLowerCase().includes('education')) {
      return trimmed;
    }
  }
  
  return '';
};