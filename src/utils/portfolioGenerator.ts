import { ParsedResumeData } from './resumeParser';
import { Project } from '../types/project';

export interface PortfolioData extends ParsedResumeData {
  targetRole: string;
  projects: Project[];
  githubUrl?: string;
  linkedinUrl?: string;
}

export const generatePortfolioHTML = (data: PortfolioData): string => {
  const firstName = data.name.split(' ')[0];
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} - ${data.targetRole}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .card-hover { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-200">
        <div class="max-w-6xl mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold text-gray-800">${firstName}</h1>
                <div class="hidden md:flex space-x-8">
                    <a href="#about" class="text-gray-600 hover:text-purple-600 transition-colors">About</a>
                    <a href="#skills" class="text-gray-600 hover:text-purple-600 transition-colors">Skills</a>
                    <a href="#projects" class="text-gray-600 hover:text-purple-600 transition-colors">Projects</a>
                    <a href="#experience" class="text-gray-600 hover:text-purple-600 transition-colors">Experience</a>
                    <a href="#contact" class="text-gray-600 hover:text-purple-600 transition-colors">Contact</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="gradient-bg min-h-screen flex items-center justify-center text-white">
        <div class="text-center max-w-4xl mx-auto px-4">
            <h1 class="text-5xl md:text-7xl font-bold mb-6">${data.name}</h1>
            <h2 class="text-2xl md:text-3xl font-light mb-8">${data.targetRole}</h2>
            <p class="text-xl md:text-2xl mb-12 opacity-90">${data.location}</p>
            <div class="flex justify-center space-x-6">
                ${data.githubUrl ? `<a href="${data.githubUrl}" target="_blank" class="bg-white/20 backdrop-blur-sm px-8 py-3 rounded-full hover:bg-white/30 transition-all duration-300">GitHub</a>` : ''}
                ${data.linkedinUrl ? `<a href="${data.linkedinUrl}" target="_blank" class="bg-white/20 backdrop-blur-sm px-8 py-3 rounded-full hover:bg-white/30 transition-all duration-300">LinkedIn</a>` : ''}
                <a href="#contact" class="bg-white text-purple-600 px-8 py-3 rounded-full hover:bg-gray-100 transition-all duration-300 font-semibold">Get In Touch</a>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-20 bg-white">
        <div class="max-w-6xl mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-gray-800 mb-4">About Me</h2>
                <div class="w-24 h-1 bg-purple-600 mx-auto"></div>
            </div>
            <div class="max-w-4xl mx-auto">
                <p class="text-lg text-gray-600 leading-relaxed text-center">
                    ${data.summary || `Passionate ${data.targetRole} with expertise in modern technologies and a commitment to delivering exceptional results. I love building innovative solutions that make a real impact.`}
                </p>
            </div>
        </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="py-20 bg-gray-50">
        <div class="max-w-6xl mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-gray-800 mb-4">Skills & Technologies</h2>
                <div class="w-24 h-1 bg-purple-600 mx-auto"></div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                ${data.skills.map(skill => `
                    <div class="bg-white rounded-lg p-4 text-center shadow-sm card-hover">
                        <span class="text-gray-700 font-medium">${skill}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    ${data.projects.length > 0 ? `
    <section id="projects" class="py-20 bg-white">
        <div class="max-w-6xl mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-gray-800 mb-4">Featured Projects</h2>
                <div class="w-24 h-1 bg-purple-600 mx-auto"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${data.projects.map(project => `
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
                        ${project.screenshot ? `
                            <div class="h-48 bg-gray-200">
                                <img src="${project.screenshot}" alt="${project.title}" class="w-full h-full object-cover">
                            </div>
                        ` : `
                            <div class="h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <h3 class="text-white text-2xl font-bold">${project.title}</h3>
                            </div>
                        `}
                        <div class="p-6">
                            <h3 class="text-xl font-bold text-gray-800 mb-3">${project.title}</h3>
                            <p class="text-gray-600 mb-4">${project.description}</p>
                            <div class="flex flex-wrap gap-2 mb-4">
                                ${project.technologies.map(tech => `
                                    <span class="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">${tech}</span>
                                `).join('')}
                            </div>
                            <div class="flex space-x-4">
                                ${project.githubUrl ? `
                                    <a href="${project.githubUrl}" target="_blank" class="text-gray-600 hover:text-purple-600 transition-colors">
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path>
                                        </svg>
                                    </a>
                                ` : ''}
                                ${project.liveUrl ? `
                                    <a href="${project.liveUrl}" target="_blank" class="text-gray-600 hover:text-purple-600 transition-colors">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                        </svg>
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Experience Section -->
    <section id="experience" class="py-20 bg-gray-50">
        <div class="max-w-6xl mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-gray-800 mb-4">Experience & Education</h2>
                <div class="w-24 h-1 bg-purple-600 mx-auto"></div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <!-- Experience -->
                <div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-6">Work Experience</h3>
                    <div class="space-y-6">
                        ${data.experience.length > 0 ? data.experience.map(exp => `
                            <div class="bg-white rounded-lg p-6 shadow-sm">
                                <p class="text-gray-700">${exp}</p>
                            </div>
                        `).join('') : `
                            <div class="bg-white rounded-lg p-6 shadow-sm">
                                <p class="text-gray-700">Experience details will be added here.</p>
                            </div>
                        `}
                    </div>
                </div>
                
                <!-- Education -->
                <div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-6">Education</h3>
                    <div class="space-y-6">
                        ${data.education.length > 0 ? data.education.map(edu => `
                            <div class="bg-white rounded-lg p-6 shadow-sm">
                                <p class="text-gray-700">${edu}</p>
                            </div>
                        `).join('') : `
                            <div class="bg-white rounded-lg p-6 shadow-sm">
                                <p class="text-gray-700">Education details will be added here.</p>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 bg-white">
        <div class="max-w-6xl mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-gray-800 mb-4">Get In Touch</h2>
                <div class="w-24 h-1 bg-purple-600 mx-auto"></div>
            </div>
            <div class="max-w-2xl mx-auto text-center">
                <p class="text-lg text-gray-600 mb-8">
                    I'm always interested in new opportunities and collaborations. Let's connect!
                </p>
                <div class="space-y-4">
                    <div class="flex items-center justify-center space-x-3">
                        <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                        <a href="mailto:${data.email}" class="text-lg text-gray-700 hover:text-purple-600 transition-colors">${data.email}</a>
                    </div>
                    ${data.phone ? `
                        <div class="flex items-center justify-center space-x-3">
                            <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                            </svg>
                            <span class="text-lg text-gray-700">${data.phone}</span>
                        </div>
                    ` : ''}
                    <div class="flex items-center justify-center space-x-3">
                        <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="text-lg text-gray-700">${data.location}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8">
        <div class="max-w-6xl mx-auto px-4 text-center">
            <p>&copy; ${new Date().getFullYear()} ${data.name}. All rights reserved.</p>
        </div>
    </footer>

    <!-- Smooth Scrolling Script -->
    <script>
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    </script>
</body>
</html>`;
};