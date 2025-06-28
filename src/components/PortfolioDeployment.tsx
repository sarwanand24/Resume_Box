import React, { useState } from 'react';
import { Globe, ExternalLink, Copy, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { generatePortfolioHTML, PortfolioData } from '../utils/portfolioGenerator';
import { deployToVercel } from '../utils/vercelDeployment';
import type { VercelDeploymentResponse } from '../utils/vercelDeployment';


interface PortfolioDeploymentProps {
  portfolioData: PortfolioData;
  onBack: () => void;
}

const PortfolioDeployment: React.FC<PortfolioDeploymentProps> = ({ portfolioData, onBack }) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<VercelDeploymentResponse | null>(null)
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleDeploy = async () => {
    const vercelToken = import.meta.env.VITE_VERCEL_TOKEN;
    
    if (!vercelToken) {
      setDeploymentResult({
        success: false,
        error: 'Vercel token not configured. Please add VITE_VERCEL_TOKEN to your environment variables.'
      });
      return;
    }

    setIsDeploying(true);
    setDeploymentResult(null);

    try {
      console.log('entry1')
      const htmlContent = generatePortfolioHTML(portfolioData);
      const projectName = `${portfolioData.name.replace(/\s+/g, '-').toLowerCase()}-portfolio`;
      console.log('entry2')
      const result = await deployToVercel(htmlContent, projectName, vercelToken);
      console.log('Portfolio --------->', result)
      setDeploymentResult({ ...result, success: true });
    } catch (error) {
      setDeploymentResult({
        success: false,
        error: error instanceof Error ? error.message : 'Deployment failed'
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCopyUrl = async () => {
    if (deploymentResult?.url) {
      try {
        await navigator.clipboard.writeText(deploymentResult.url);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    }
  };

  const handlePreview = () => {
    const htmlContent = generatePortfolioHTML(portfolioData);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleDownloadHTML = () => {
    const htmlContent = generatePortfolioHTML(portfolioData);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${portfolioData.name.replace(/\s+/g, '_')}_Portfolio.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Globe className="w-10 h-10 text-purple-400" />
          <h2 className="text-4xl font-bold text-white">
            Deploy Your Portfolio
          </h2>
        </div>
        <p className="text-xl text-gray-300">
          Your portfolio is ready! Deploy it to Vercel for a live website.
        </p>
      </div>

      {/* Portfolio Preview */}
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-8">
        <h3 className="text-2xl font-semibold text-white mb-6">Portfolio Preview</h3>
        
        <div className="bg-black/20 rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="flex-1 bg-white/10 rounded px-3 py-1 text-sm text-gray-400">
              {portfolioData.name.replace(/\s+/g, '-').toLowerCase()}-portfolio.vercel.app
            </div>
          </div>
          
          <div className="space-y-4 text-gray-300">
            <div className="text-center">
              <h4 className="text-2xl font-bold text-white">{portfolioData.name}</h4>
              <p className="text-purple-400">{portfolioData.targetRole}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {portfolioData.skills.slice(0, 8).map((skill, index) => (
                <div key={index} className="bg-white/10 rounded px-2 py-1 text-xs text-center">
                  {skill}
                </div>
              ))}
            </div>
            
            {portfolioData.projects.length > 0 && (
              <div>
                <h5 className="font-semibold mb-2">Featured Projects ({portfolioData.projects.length})</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {portfolioData.projects.slice(0, 2).map((project, index) => (
                    <div key={index} className="bg-white/10 rounded p-3">
                      <h6 className="font-medium text-sm">{project.title}</h6>
                      <p className="text-xs text-gray-400 mt-1">{project.description.slice(0, 60)}...</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handlePreview}
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
          >
            <ExternalLink className="w-5 h-5" />
            <span>Preview Portfolio</span>
          </button>
          
          <button
            onClick={handleDownloadHTML}
            className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
          >
            <Globe className="w-5 h-5" />
            <span>Download HTML</span>
          </button>
        </div>
      </div>

      {/* Deployment Section */}
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-8">
        <h3 className="text-2xl font-semibold text-white mb-6">Deploy to Vercel</h3>
        
        {!deploymentResult && !isDeploying && (
          <div className="text-center">
            <p className="text-gray-300 mb-6">
              Deploy your portfolio to Vercel for free hosting with a custom domain.
            </p>
            <button
              onClick={handleDeploy}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg shadow-purple-500/25"
            >
              Deploy to Vercel
            </button>
          </div>
        )}

        {isDeploying && (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Loader className="w-6 h-6 text-purple-400 animate-spin" />
              <span className="text-white text-lg">Deploying your portfolio...</span>
            </div>
            <p className="text-gray-300">This may take a few moments.</p>
          </div>
        )}

        {deploymentResult && (
          <div className="text-center">
            {deploymentResult.success ? (
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                  <span className="text-white text-xl font-semibold">Portfolio Deployed Successfully!</span>
                </div>
                
                <div className="bg-black/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <a 
                      href={deploymentResult.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 transition-colors flex items-center space-x-2"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>{deploymentResult.url}</span>
                    </a>
                    <button
                      onClick={handleCopyUrl}
                      className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-white/10"
                    >
                      {copiedUrl ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-sm">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-300">
                  Your portfolio is now live! Share this URL with potential employers and clients.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                  <span className="text-white text-xl font-semibold">Deployment Failed</span>
                </div>
                
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <p className="text-red-300">{deploymentResult.error}</p>
                </div>
                
                <button
                  onClick={handleDeploy}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20"
        >
          <span>← Back to Results</span>
        </button>
      </div>
    </div>
  );
};

export default PortfolioDeployment;