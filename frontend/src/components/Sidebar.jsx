import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, User, FileText, Target, Award, Briefcase, 
  BookOpen, HelpCircle, FileQuestion, LineChart, Code2, 
  MessageSquareCode, Bot, Building2, ShieldCheck, ListOrdered
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const userLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'My Profile', icon: User },
    { to: '/resume-analyzer', label: 'Resume Analyzer', icon: FileText },
    { to: '/career-recommendations', label: 'Career Matcher', icon: Target },
    { to: '/skill-gap', label: 'Skill Gap Analysis', icon: Award },
    { to: '/jobs', label: 'Jobs & Placement', icon: Briefcase },
    { to: '/subjects', label: 'Learning Center', icon: BookOpen },
    { to: '/mcq-practice', label: 'MCQ Practice', icon: HelpCircle },
    { to: '/mock-tests', label: 'Mock Tests', icon: FileQuestion },
    { to: '/performance', label: 'Performance Analytics', icon: LineChart },
    { to: '/coding-practice', label: 'Coding Practice', icon: Code2 },
    { to: '/company-patterns', label: 'Company Patterns', icon: Building2 },
    { to: '/interview-prep', label: 'Interview Prep', icon: MessageSquareCode },
    { to: '/assistant', label: 'AI Assistant', icon: Bot },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Overview', icon: ShieldCheck },
    { to: '/admin/users', label: 'Manage Users', icon: User },
    { to: '/admin/careers', label: 'Manage Careers', icon: Target },
    { to: '/admin/skills', label: 'Manage Skills', icon: Award },
    { to: '/admin/jobs', label: 'Manage Jobs', icon: Briefcase },
    { to: '/admin/subjects', label: 'Manage Subjects', icon: BookOpen },
    { to: '/admin/questions', label: 'Question Bank', icon: ListOrdered },
    { to: '/admin/tests', label: 'Manage Mock Tests', icon: FileQuestion }
  ];

  return (
    <aside className="w-64 bg-slate-900/60 backdrop-blur-md border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Placement Prep
          </div>
          <nav className="space-y-1">
            {userLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {isAdmin && (
          <div className="pt-4 border-t border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 px-3 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin Control
            </div>
            <nav className="space-y-1">
              {adminLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
        CareerAI Placement v1.0
      </div>
    </aside>
  );
};

export default Sidebar;
