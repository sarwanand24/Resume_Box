import React, { useState } from 'react';
import { Plus, Trash2, Upload, ExternalLink, Github, Image, X } from 'lucide-react';
import { Project } from '../types/project';

interface ProjectUploadProps {
  projects: Project[];
  onProjectsUpdate: (projects: Project[]) => void;
  onContinue: () => void;
}

const ProjectUpload: React.FC<ProjectUploadProps> = ({ projects, onProjectsUpdate, onContinue }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    title: '',
    description: '',
    technologies: [],
    githubUrl: '',
    liveUrl: '',
    screenshot: ''
  });
  const [newTechnology, setNewTechnology] = useState('');

  const handleAddProject = () => {
    if (newProject.title.trim() && newProject.description.trim()) {
      const project: Project = {
        ...newProject,
        id: Date.now().toString()
      };
      onProjectsUpdate([...projects, project]);
      setNewProject({
        title: '',
        description: '',
        technologies: [],
        githubUrl: '',
        liveUrl: '',
        screenshot: ''
      });
      setShowAddForm(false);
    }
  };

  const handleRemoveProject = (id: string) => {
    onProjectsUpdate(projects.filter(p => p.id !== id));
  };

  const handleAddTechnology = () => {
    if (newTechnology.trim() && !newProject.technologies.includes(newTechnology.trim())) {
      setNewProject(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setNewProject(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewProject(prev => ({
          ...prev,
          screenshot: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">
          Add Your Projects
        </h2>
        <p className="text-xl text-gray-300">
          Showcase your best work to make your portfolio stand out
        </p>
      </div>

      {/* Existing Projects */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                <button
                  onClick={() => handleRemoveProject(project.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              {project.screenshot && (
                <div className="mb-4">
                  <img 
                    src={project.screenshot} 
                    alt={project.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <p className="text-gray-300 mb-4">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="flex space-x-4">
                {project.githubUrl && (
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span className="text-sm">Code</span>
                  </a>
                )}
                {project.liveUrl && (
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">Live</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Project Button */}
      {!showAddForm && (
        <div className="text-center mb-8">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Add Project</span>
          </button>
        </div>
      )}

      {/* Add Project Form */}
      {showAddForm && (
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-white">Add New Project</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project Title</label>
              <input
                type="text"
                value={newProject.title}
                onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                placeholder="My Awesome Project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL (Optional)</label>
              <input
                type="url"
                value={newProject.githubUrl}
                onChange={(e) => setNewProject(prev => ({ ...prev, githubUrl: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                placeholder="https://github.com/username/project"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                placeholder="Describe what this project does and what technologies you used..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Live URL (Optional)</label>
              <input
                type="url"
                value={newProject.liveUrl}
                onChange={(e) => setNewProject(prev => ({ ...prev, liveUrl: e.target.value }))}
                className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                placeholder="https://myproject.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Screenshot (Optional)</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="screenshot-upload"
                />
                <label
                  htmlFor="screenshot-upload"
                  className="flex items-center justify-center w-full px-4 py-3 bg-black/20 border border-white/20 rounded-xl text-gray-400 hover:text-white cursor-pointer transition-colors"
                >
                  <Image className="w-5 h-5 mr-2" />
                  {newProject.screenshot ? 'Change Screenshot' : 'Upload Screenshot'}
                </label>
              </div>
              {newProject.screenshot && (
                <div className="mt-2">
                  <img 
                    src={newProject.screenshot} 
                    alt="Preview"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Technologies</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {newProject.technologies.map((tech, index) => (
                  <span key={index} className="flex items-center space-x-1 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                    <span>{tech}</span>
                    <button
                      onClick={() => handleRemoveTechnology(tech)}
                      className="text-purple-400 hover:text-purple-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTechnology()}
                  className="flex-1 px-4 py-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  placeholder="Add technology (React, Python, etc.)"
                />
                <button
                  onClick={handleAddTechnology}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-3 border border-white/20 text-gray-300 rounded-xl hover:bg-white/5 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddProject}
              disabled={!newProject.title.trim() || !newProject.description.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Project
            </button>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="text-center">
        <button
          onClick={onContinue}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-4 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25 text-lg"
        >
          Continue to Results →
        </button>
      </div>
    </div>
  );
};

export default ProjectUpload;