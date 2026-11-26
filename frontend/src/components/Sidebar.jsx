import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, User, FileText, Target, Award, Briefcase, 
  BookOpen, HelpCircle, FileQuestion, LineChart, Code2, 
  MessageSquareCode, Bot, Building2, ShieldCheck, ListOrdered, TerminalSquare, Megaphone, Link as LinkIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const userLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/updates', label: 'CareerAI Updates', icon: Megaphone },
    { to: '/profile', label: 'My Profile', icon: User },
    { to: '/resume-analyzer', label: 'Resume Analyzer', icon: FileText },
    { to: '/career-recommendations', label: 'Career Matcher', icon: Target },
    { to: '/skill-gap', label: 'Skill Gap Analysis', icon: Award },
    { to: '/jobs', label: 'Jobs & Placement', icon: Briefcase },
    { to: '/subjects', label: 'Learning Center', icon: BookOpen },
    { to: '/mcq-practice', label: 'MCQ Practice', icon: HelpCircle },
    { to: '/mock-tests', label: 'Mock Tests', icon: FileQuestion },
    { to: '/performance', label: 'Performance Analytics', icon: LineChart },
    { to: '/coding-practice', label: 'Coding Questions', icon: Code2 },
    { to: '/code-editor', label: 'Code Editor', icon: TerminalSquare },
    { to: '/company-patterns', label: 'Company Patterns', icon: Building2 },
    { to: '/interview-prep', label: 'Interview Prep', icon: MessageSquareCode },
    { to: '/assistant', label: 'AI Assistant', icon: Bot },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Overview', icon: ShieldCheck },
    { to: '/admin/users', label: 'Manage Users', icon: User },
    { to: '/admin/careers', label: 'Manage Careers', icon: Target },
    { to: '/admin/skills', label: 'Skills Taxonomy', icon: Award },
    { to: '/admin/jobs', label: 'Manage Jobs', icon: Briefcase },
    { to: '/admin/questions', label: 'Question Bank', icon: ListOrdered },
    { to: '/admin/company-links', label: 'Company Links', icon: LinkIcon },
    { to: '/admin/updates', label: 'Student Updates', icon: Megaphone }
  ];

  return (
    <aside aria-label="Dashboard navigation" className="w-full shrink-0 border-b border-slate-800/80 bg-slate-900/80 p-2 backdrop-blur-md lg:min-h-[calc(100vh-65px)] lg:w-64 lg:border-b-0 lg:border-r lg:p-4">
      <div className="space-y-3 lg:space-y-6">
        {!isAdmin && <div>
          <div className="mb-2 hidden px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 lg:block">
            Placement Prep
          </div>
          <nav className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {userLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all lg:gap-3 lg:text-sm ${
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
        </div>}

        {isAdmin && (
          <div className="border-t border-slate-800 pt-2 lg:pt-4">
            <div className="mb-2 hidden items-center gap-1.5 px-3 text-[11px] font-bold uppercase tracking-wider text-amber-400 lg:flex">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin Control
            </div>
            <nav className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
              {adminLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                    `flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all lg:gap-3 lg:text-sm ${
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

      <div className="hidden pt-4 text-center text-xs text-slate-400 lg:block lg:border-t lg:border-slate-800">
        CareerAI Placement v1.0
      </div>
    </aside>
  );
};

export default Sidebar;
