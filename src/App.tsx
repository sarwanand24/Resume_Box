import React, { useState } from 'react';
import { Upload, User, Sparkles, RotateCcw, FolderPlus, Globe } from 'lucide-react';
import FileUpload from './components/FileUpload';
import RoleSelection from './components/RoleSelection';
import DataEditor from './components/DataEditor';
import ProjectUpload from './components/ProjectUpload';
import Results from './components/Results';
import PortfolioDeployment from './components/PortfolioDeployment';
import BuiltWithBoltBadge from './components/BuiltWithBoltBadge';
import { ParsedResumeData } from './utils/resumeParser';
import { Project } from './types/project';

interface UserData extends ParsedResumeData {
  targetRole: string;
  resumeFile: File | null;
  projects: Project[];
}

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    skills: [],
    experience: [],
    education: [],
    summary: '',
    rawText: '',
    targetRole: '',
    resumeFile: null,
    projects: [],
  });

  const handleFileUpload = (file: File, extractedData: ParsedResumeData) => {
    setUserData({
      ...extractedData,
      targetRole: '',
      resumeFile: file,
      projects: [],
    });
    setCurrentStep(2);
  };

  const handleRoleSelection = (role: string) => {
    setUserData({
      ...userData,
      targetRole: role,
    });
    setCurrentStep(3);
  };

  const handleDataUpdate = (updatedData: ParsedResumeData) => {
    setUserData({
      ...userData,
      ...updatedData,
    });
    setCurrentStep(4);
  };

  const handleProjectsUpdate = (projects: Project[]) => {
    setUserData({
      ...userData,
      projects,
    });
  };

  const handleProjectsContinue = () => {
    setCurrentStep(5);
  };

  const handlePortfolioDeployment = () => {
    setCurrentStep(6);
  };

  const handleBackToResults = () => {
    setCurrentStep(5);
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setUserData({
      name: '',
      email: '',
      phone: '',
      location: '',
      skills: [],
      experience: [],
      education: [],
      summary: '',
      rawText: '',
      targetRole: '',
      resumeFile: null,
      projects: [],
    });
  };

  const steps = [
    { number: 1, title: 'Upload Resume', icon: Upload },
    { number: 2, title: 'Select Role', icon: User },
    { number: 3, title: 'Edit Data', icon: Sparkles },
    { number: 4, title: 'Add Projects', icon: FolderPlus },
    { number: 5, title: 'Generate Content', icon: Sparkles },
    { number: 6, title: 'Deploy Portfolio', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Built with Bolt Badge */}
      <BuiltWithBoltBadge />

      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ResumeBox
                </h1>
                <p className="text-sm text-gray-400">Drop your resume. Get hired faster.</p>
              </div>
            </div>
            {currentStep > 1 && (
              <button
                onClick={handleRestart}
                className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-purple-400 transition-colors duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Start Over</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-12 overflow-x-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-white/10 text-gray-400 border-2 border-white/20'
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span
                  className={`mt-2 text-sm font-medium transition-colors duration-300 text-center ${
                    currentStep >= step.number ? 'text-purple-400' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-2 transition-colors duration-300 ${
                    currentStep > step.number ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="transition-all duration-500 ease-in-out">
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <FileUpload onFileUpload={handleFileUpload} />
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="animate-fade-in">
              <RoleSelection onRoleSelect={handleRoleSelection} />
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="animate-fade-in">
              <DataEditor userData={userData} onDataUpdate={handleDataUpdate} />
            </div>
          )}
          
          {currentStep === 4 && (
            <div className="animate-fade-in">
              <ProjectUpload 
                projects={userData.projects}
                onProjectsUpdate={handleProjectsUpdate}
                onContinue={handleProjectsContinue}
              />
            </div>
          )}
          
          {currentStep === 5 && (
            <div className="animate-fade-in">
              <Results 
                userData={userData} 
                onRestart={handleRestart}
                onPortfolioDeployment={handlePortfolioDeployment}
              />
            </div>
          )}
          
          {currentStep === 6 && (
            <div className="animate-fade-in">
              <PortfolioDeployment 
                portfolioData={userData}
                onBack={handleBackToResults}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;