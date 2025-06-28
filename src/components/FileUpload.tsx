import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import { parseResume, ParsedResumeData } from '../utils/resumeParser';

interface FileUploadProps {
  onFileUpload: (file: File, extractedData: ParsedResumeData) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);
    
    if (!file.name.match(/\.(pdf|docx?)$/i)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return;
    }

    setProcessing(true);
    
    try {
      const extractedData = await parseResume(file);
      onFileUpload(file, extractedData);
    } catch (error) {
      console.error('File processing error:', error);
      setError('Failed to process resume. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const openFileSelector = () => {
    inputRef.current?.click();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-4">
          Upload Your Resume
        </h2>
        <p className="text-xl text-gray-300">
          Let AI extract your skills and experience in seconds
        </p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
          dragActive
            ? 'border-purple-400 bg-purple-500/10 backdrop-blur-sm'
            : 'border-white/20 hover:border-purple-400/50 hover:bg-white/5'
        } ${processing ? 'pointer-events-none opacity-75' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileSelector}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
        />

        {processing ? (
          <div className="space-y-6">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-purple-200/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 animate-spin"></div>
              <Sparkles className="absolute inset-0 w-6 h-6 m-auto text-purple-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                AI is analyzing your resume...
              </h3>
              <p className="text-gray-300">
                Extracting skills, experience, and key information
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Upload className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                Drop your resume here
              </h3>
              <p className="text-gray-300 mb-6">
                Or click to browse files
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>PDF</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>DOCX</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 bg-red-500/10 backdrop-blur-sm rounded-xl p-4 border border-red-500/20">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      )}

      <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-6 h-6 text-emerald-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-white mb-2">Privacy & Security</h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              Your resume is processed securely and never stored permanently. We extract only the necessary information to help you create better job applications. All data is deleted after your session ends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;