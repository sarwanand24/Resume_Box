import { ParsedResumeData } from './resumeParser';
import { Project } from '../types/project';

export interface GeneratedContent {
  tailoredResume: string;
  coverLetter: string;
  linkedinBio: string;
  githubBio: string;
}

export const generateContent = (
  resumeData: ParsedResumeData & { targetRole: string },
  targetRole: string,
  projects: Project[] = []
): GeneratedContent => {
  return {
    tailoredResume: generateTailoredResume(resumeData, targetRole, projects),
    coverLetter: generateCoverLetter(resumeData, targetRole),
    linkedinBio: generateLinkedInBio(resumeData, targetRole),
    githubBio: generateGitHubBio(resumeData, targetRole)
  };
};

const generateTailoredResume = (resumeData: ParsedResumeData & { targetRole: string }, targetRole: string, projects: Project[]): string => {
  const relevantSkills = getRelevantSkills(resumeData.skills, targetRole);
  
  let resumeContent = `${resumeData.name}
${targetRole}
${resumeData.email} | ${resumeData.phone} | ${resumeData.location}

PROFESSIONAL SUMMARY
${resumeData.summary || `Dedicated ${targetRole} with expertise in ${relevantSkills.slice(0, 3).join(', ')}. Proven track record of delivering high-quality solutions and driving results in fast-paced environments. Passionate about leveraging technology to solve complex problems and create meaningful impact.`}

CORE COMPETENCIES
${relevantSkills.join(' • ')}

PROFESSIONAL EXPERIENCE
${resumeData.experience.length > 0 ? resumeData.experience.join('\n\n') : `• Developed and maintained applications using modern technologies
• Collaborated with cross-functional teams to deliver projects on time
• Implemented best practices for code quality and performance optimization
• Contributed to technical decision-making and architecture planning`}`;

  // Add projects section if projects exist
  if (projects.length > 0) {
    resumeContent += `\n\nKEY PROJECTS
${projects.map(project => `${project.title}
${project.description}
Technologies: ${project.technologies.join(', ')}${project.githubUrl ? `\nGitHub: ${project.githubUrl}` : ''}${project.liveUrl ? `\nLive: ${project.liveUrl}` : ''}`).join('\n\n')}`;
  }

  resumeContent += `\n\nEDUCATION
${resumeData.education.length > 0 ? resumeData.education.join('\n') : 'Education details to be added'}

KEY ACHIEVEMENTS
• Successfully delivered projects that improved efficiency and user experience
• Demonstrated strong problem-solving skills in challenging technical environments
• Maintained high code quality standards and contributed to team knowledge sharing
• Adapted quickly to new technologies and methodologies`;

  return resumeContent;
};

const generateCoverLetter = (resumeData: ParsedResumeData & { targetRole: string }, targetRole: string): string => {
  const relevantSkills = getRelevantSkills(resumeData.skills, targetRole);
  const firstName = resumeData.name.split(' ')[0];
  
  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${targetRole} position at your organization. With my background in ${relevantSkills.slice(0, 3).join(', ')}, I am excited about the opportunity to contribute to your team's continued success.

${resumeData.summary ? resumeData.summary.split('.')[0] + '.' : `As a passionate ${targetRole}, I bring a unique combination of technical expertise and problem-solving abilities.`} My experience has enabled me to tackle complex challenges while maintaining a focus on delivering high-quality solutions that drive business value.

What particularly excites me about this opportunity is the chance to leverage my expertise in ${relevantSkills.slice(0, 2).join(' and ')} to make a meaningful impact. I am confident that my technical skills, combined with my dedication to continuous learning and collaboration, would make me a valuable addition to your team.

Key highlights of my qualifications include:
• Proficiency in ${relevantSkills.slice(0, 4).join(', ')}
• Strong track record of delivering projects on time and within scope
• Excellent communication and teamwork abilities
• Passion for staying current with industry trends and best practices

I would welcome the opportunity to discuss how my experience and enthusiasm can contribute to your organization's objectives. Thank you for your consideration, and I look forward to hearing from you.

Best regards,
${resumeData.name}`;
};

const generateLinkedInBio = (resumeData: ParsedResumeData & { targetRole: string }, targetRole: string): string => {
  const relevantSkills = getRelevantSkills(resumeData.skills, targetRole);
  const firstName = resumeData.name.split(' ')[0];
  
  return `${targetRole} | ${relevantSkills.slice(0, 3).join(' • ')} | Building innovative solutions

${resumeData.summary ? resumeData.summary.split('.')[0] + '.' : `Passionate ${targetRole} with expertise in modern technologies and a commitment to delivering exceptional results.`} Currently seeking new opportunities to drive impact in ${targetRole.toLowerCase()} roles.

🚀 Expertise: ${relevantSkills.slice(0, 5).join(', ')}
💡 Passionate about continuous learning and emerging technologies
🤝 Always open to connecting with fellow professionals
🎯 Focused on delivering solutions that create meaningful business value
📍 ${resumeData.location}

Let's connect and explore how we can collaborate to build something amazing together!

#${targetRole.replace(/\s+/g, '')} #Technology #Innovation #ProfessionalDevelopment`;
};

const generateGitHubBio = (resumeData: ParsedResumeData & { targetRole: string }, targetRole: string): string => {
  const relevantSkills = getRelevantSkills(resumeData.skills, targetRole);
  const firstName = resumeData.name.split(' ')[0];
  
  return `# Hi there! 👋 I'm ${firstName}

## ${targetRole} | ${relevantSkills.slice(0, 3).join(' • ')}

${resumeData.summary ? resumeData.summary.split('.')[0] + '.' : `Passionate ${targetRole} with expertise in modern technologies and a love for building innovative solutions.`}

### 🔭 Currently working on
- Building scalable applications using ${relevantSkills.slice(0, 2).join(' and ')}
- Exploring new technologies and best practices
- Contributing to open source projects

### 🌱 Always learning
- Latest trends in ${targetRole.toLowerCase()} development
- Best practices for code quality and performance
- New frameworks and tools in the tech ecosystem

### 💬 Ask me about
${relevantSkills.slice(0, 4).join(', ')}, system architecture, and best practices

### 📫 How to reach me
- Email: ${resumeData.email}
- Location: ${resumeData.location}

### ⚡ Fun fact
I love turning complex problems into elegant, scalable solutions!

---

**🛠️ Tech Stack:** ${relevantSkills.join(' | ')}

**🎯 Focus Areas:** Clean Code • Performance Optimization • User Experience • Continuous Learning`;
};

const getRelevantSkills = (skills: string[], targetRole: string): string[] => {
  const roleKeywords = {
    'software engineer': ['javascript', 'python', 'react', 'node.js', 'typescript', 'html', 'css', 'sql', 'git', 'aws'],
    'data scientist': ['python', 'machine learning', 'sql', 'pandas', 'numpy', 'tensorflow', 'scikit-learn', 'tableau', 'r', 'statistics'],
    'product manager': ['project management', 'agile', 'scrum', 'analytics', 'user research', 'roadmapping', 'stakeholder management'],
    'ux/ui designer': ['figma', 'sketch', 'adobe creative suite', 'user research', 'prototyping', 'wireframing', 'design systems'],
    'devops engineer': ['docker', 'kubernetes', 'aws', 'jenkins', 'terraform', 'ansible', 'linux', 'ci/cd', 'monitoring'],
    'frontend developer': ['javascript', 'react', 'vue.js', 'angular', 'typescript', 'html', 'css', 'webpack', 'responsive design'],
    'backend developer': ['node.js', 'python', 'java', 'sql', 'mongodb', 'rest api', 'microservices', 'docker', 'aws'],
    'full stack developer': ['javascript', 'react', 'node.js', 'python', 'sql', 'mongodb', 'html', 'css', 'git', 'aws'],
    'marketing manager': ['digital marketing', 'seo', 'social media', 'analytics', 'content marketing', 'email marketing'],
    'sales representative': ['crm', 'lead generation', 'customer relationship management', 'negotiation', 'communication']
  };

  const roleLower = targetRole.toLowerCase();
  const relevantKeywords = roleKeywords[roleLower as keyof typeof roleKeywords] || [];
  
  // Filter skills that match role keywords
  const matchedSkills = skills.filter(skill => 
    relevantKeywords.some(keyword => 
      skill.toLowerCase().includes(keyword.toLowerCase()) || 
      keyword.toLowerCase().includes(skill.toLowerCase())
    )
  );

  // If we have matched skills, prioritize them, otherwise use all skills
  const prioritizedSkills = matchedSkills.length > 0 ? 
    [...matchedSkills, ...skills.filter(skill => !matchedSkills.includes(skill))] : 
    skills;

  return prioritizedSkills.slice(0, 12);
};