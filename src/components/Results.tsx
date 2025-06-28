import React from 'react';
import { Download, RefreshCw, FileText, Mail, Linkedin, Github, CheckCircle, Copy, Globe } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';
import { generateContent } from '../utils/contentGenerator';
import { ParsedResumeData } from '../utils/resumeParser';
import { Project } from '../types/project';

interface UserData extends ParsedResumeData {
  targetRole: string;
  resumeFile: File | null;
  projects: Project[];
}

interface ResultsProps {
  userData: UserData;
  onRestart: () => void;
  onPortfolioDeployment: () => void;
}

const Results: React.FC<ResultsProps> = ({ userData, onRestart, onPortfolioDeployment }) => {
  const [copiedSection, setCopiedSection] = React.useState<string | null>(null);

  const generatedContent = generateContent(userData, userData.targetRole, userData.projects);

  const handleCopy = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownloadResume = () => {
    generatePDF(generatedContent.tailoredResume, `${userData.name.replace(/\s+/g, '_')}_Resume.pdf`);
  };

  const handleDownloadText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    // Download all files with a small delay between each
    setTimeout(() => handleDownloadResume(), 100);
    setTimeout(() => handleDownloadText(generatedContent.coverLetter, `${userData.name.replace(/\s+/g, '_')}_CoverLetter.txt`), 300);
    setTimeout(() => handleDownloadText(generatedContent.linkedinBio, `${userData.name.replace(/\s+/g, '_')}_LinkedIn_Bio.txt`), 500);
    setTimeout(() => handleDownloadText(generatedContent.githubBio, `${userData.name.replace(/\s+/g, '_')}_GitHub_Bio.txt`), 700);
  };

  const sections = [
    {
      id: 'resume',
      title: 'Tailored Resume',
      icon: FileText,
      content: generatedContent.tailoredResume,
      color: 'from-blue-500 to-cyan-500',
      downloadAction: handleDownloadResume
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter',
      icon: Mail,
      content: generatedContent.coverLetter,
      color: 'from-purple-500 to-violet-500',
      downloadAction: () => handleDownloadText(generatedContent.coverLetter, `${userData.name.replace(/\s+/g, '_')}_CoverLetter.txt`)
    },
    {
      id: 'linkedin',
      title: 'LinkedIn Bio',
      icon: Linkedin,
      content: generatedContent.linkedinBio,
      color: 'from-blue-600 to-blue-700',
      downloadAction: () => handleDownloadText(generatedContent.linkedinBio, `${userData.name.replace(/\s+/g, '_')}_LinkedIn_Bio.txt`)
    },
    {
      id: 'github',
      title: 'GitHub Bio',
      icon: Github,
      content: generatedContent.githubBio,
      color: 'from-gray-600 to-gray-700',
      downloadAction: () => handleDownloadText(generatedContent.githubBio, `${userData.name.replace(/\s+/g, '_')}_GitHub_Bio.txt`)
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
          <h2 className="text-4xl font-bold text-white">
            Your Toolkit is Ready!
          </h2>
        </div>
        <p className="text-xl text-gray-300">
          Personalized content for {userData.name}'s {userData.targetRole} applications
        </p>
        {userData.projects.length > 0 && (
          <p className="text-lg text-purple-300 mt-2">
            Including {userData.projects.length} project{userData.projects.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        <button
          onClick={handleDownloadAll}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg shadow-emerald-500/25"
        >
          <Download className="w-5 h-5" />
          <span>Download All</span>
        </button>
        
        <button
          onClick={onPortfolioDeployment}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg shadow-purple-500/25"
        >
          <Globe className="w-5 h-5" />
          <span>Create Portfolio</span>
        </button>
        
        <button
          onClick={onRestart}
          className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Start Over</span>
        </button>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {sections.map((section) => (
          <div key={section.id} className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{section.title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(section.content, section.id)}
                    className="flex items-center space-x-1 text-sm text-gray-400 hover:text-purple-400 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-white/5"
                  >
                    {copiedSection === section.id ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={section.downloadAction}
                    className="flex items-center space-x-1 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
              <div className="bg-black/20 rounded-2xl p-6 max-h-80 overflow-y-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {section.content}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;