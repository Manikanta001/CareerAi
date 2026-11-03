import React from 'react';
import { SKILL_TAXONOMY } from '../../utils/constants';
import SkillBadge from '../../components/SkillBadge';
import { Award } from 'lucide-react';

const AdminSkills = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Award className="h-6 w-6 text-amber-400" /> Manage Skills Database Taxonomy
        </h1>
      </div>

      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <p className="text-xs text-slate-400">Default verified skill taxonomy used across Resume Analysis, Career Matcher & Skill Gap analysis.</p>
        <div className="flex flex-wrap gap-2">
          {['C', 'C++', 'Java', 'Python', 'JavaScript', 'SQL', 'React', 'FastAPI', 'Node.js', 'MongoDB', 'MySQL', 'Pandas', 'NumPy', 'Docker', 'AWS', 'Git', 'DSA', 'OOP', 'DBMS', 'OS', 'CN'].map((s, idx) => (
            <SkillBadge key={idx} skill={s} status="Strong" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSkills;
