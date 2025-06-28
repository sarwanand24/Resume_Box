import React, { useState } from 'react';
import { Search, Briefcase, Code, Palette, TrendingUp, Users, Cpu, Wrench, Zap } from 'lucide-react';

interface RoleSelectionProps {
  onRoleSelect: (role: string) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const popularRoles = [
    { title: 'Software Engineer', icon: Code, color: 'from-blue-500 to-cyan-500' },
    { title: 'Data Scientist', icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
    { title: 'Product Manager', icon: Briefcase, color: 'from-purple-500 to-violet-500' },
    { title: 'UX/UI Designer', icon: Palette, color: 'from-pink-500 to-rose-500' },
    { title: 'Marketing Manager', icon: Users, color: 'from-orange-500 to-amber-500' },
    { title: 'DevOps Engineer', icon: Wrench, color: 'from-gray-500 to-slate-500' },
    { title: 'ML Engineer', icon: Cpu, color: 'from-indigo-500 to-blue-500' },
    { title: 'Sales Representative', icon: Zap, color: 'from-green-500 to-emerald-500' },
  ];

  const handleRoleClick = (role: string) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    const roleToSubmit = showCustom ? customRole : selectedRole;
    if (roleToSubmit.trim()) {
      onRoleSelect(roleToSubmit);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customRole.trim()) {
      onRoleSelect(customRole);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">
          What's your target role?
        </h2>
        <p className="text-xl text-gray-300">
          Choose your dream job to get AI-personalized content
        </p>
      </div>

      {!showCustom ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {popularRoles.map((role) => (
              <button
                key={role.title}
                onClick={() => handleRoleClick(role.title)}
                className={`group p-6 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 ${
                  selectedRole === role.title
                    ? 'bg-white/10 backdrop-blur-sm shadow-lg shadow-purple-500/20 ring-2 ring-purple-400'
                    : 'bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <role.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2 text-lg">{role.title}</h3>
                <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              </button>
            ))}
          </div>

          <div className="text-center mb-8">
            <button
              onClick={() => setShowCustom(true)}
              className="text-purple-400 hover:text-purple-300 font-medium flex items-center space-x-2 mx-auto transition-colors duration-200"
            >
              <Search className="w-5 h-5" />
              <span>Don't see your role? Enter custom role</span>
            </button>
          </div>

          {selectedRole && (
            <div className="text-center">
              <button
                onClick={handleContinue}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25 text-lg"
              >
                Continue with {selectedRole} →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="max-w-md mx-auto">
          <form onSubmit={handleCustomSubmit} className="space-y-6">
            <div>
              <label htmlFor="customRole" className="block text-lg font-medium text-white mb-3">
                Enter your target role
              </label>
              <input
                type="text"
                id="customRole"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="e.g., Senior Frontend Developer"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 text-lg"
                autoFocus
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowCustom(false)}
                className="flex-1 px-6 py-4 border border-white/20 text-gray-300 rounded-xl hover:bg-white/5 transition-all duration-200 font-medium"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={!customRole.trim()}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RoleSelection;