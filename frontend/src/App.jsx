import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import FloatingAssistant from './components/FloatingAssistant';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
const Home = lazy(() => import('./pages/public/Home'));
const Login = lazy(() => import('./pages/public/Login'));
const Register = lazy(() => import('./pages/public/Register'));
const About = lazy(() => import('./pages/public/About'));
const Features = lazy(() => import('./pages/public/Features'));

// User Pages
const Dashboard = lazy(() => import('./pages/user/Dashboard'));
const Profile = lazy(() => import('./pages/user/Profile'));
const ResumeAnalyzer = lazy(() => import('./pages/user/ResumeAnalyzer'));
const CareerRecommendations = lazy(() => import('./pages/user/CareerRecommendations'));
const SkillGap = lazy(() => import('./pages/user/SkillGap'));
const Jobs = lazy(() => import('./pages/user/Jobs'));
const JobDetails = lazy(() => import('./pages/user/JobDetails'));
const Subjects = lazy(() => import('./pages/user/Subjects'));
const Topics = lazy(() => import('./pages/user/Topics'));
const Lessons = lazy(() => import('./pages/user/Lessons'));
const Lesson = lazy(() => import('./pages/user/Lesson'));
const MCQPractice = lazy(() => import('./pages/user/MCQPractice'));
const MockTests = lazy(() => import('./pages/user/MockTests'));
const TestPage = lazy(() => import('./pages/user/TestPage'));
const TestResult = lazy(() => import('./pages/user/TestResult'));
const Performance = lazy(() => import('./pages/user/Performance'));
const CodingPractice = lazy(() => import('./pages/user/CodingPractice'));
const CodeEditor = lazy(() => import('./pages/user/CodeEditor'));
const InterviewPrep = lazy(() => import('./pages/user/InterviewPrep'));
const CompanyPatterns = lazy(() => import('./pages/user/CompanyPatterns'));
const CompanyPrep = lazy(() => import('./pages/user/CompanyPrep'));
const Assistant = lazy(() => import('./pages/user/Assistant'));
const Onboarding = lazy(() => import('./pages/public/Onboarding'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminCareers = lazy(() => import('./pages/admin/Careers'));
const AdminSkills = lazy(() => import('./pages/admin/Skills'));
const AdminJobs = lazy(() => import('./pages/admin/Jobs'));
const AdminQuestions = lazy(() => import('./pages/admin/Questions'));
const AdminCompanyLinks = lazy(() => import('./pages/admin/CompanyLinks'));
const AdminUpdates = lazy(() => import('./pages/admin/Updates'));
const Updates = lazy(() => import('./pages/user/Updates'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<div className="min-h-screen grid place-items-center text-sm text-slate-400">Loading CareerAI…</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="admin-login" element={<Login adminMode />} />
            <Route path="register" element={<Register />} />
            <Route path="about" element={<About />} />
            <Route path="features" element={<Features />} />
          </Route>

          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

          {/* User Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="updates" element={<Updates />} />
            <Route path="profile" element={<Profile />} />
            <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
            <Route path="career-recommendations" element={<CareerRecommendations />} />
            <Route path="skill-gap" element={<SkillGap />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/:id" element={<JobDetails />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="subjects/:subjectId/topics" element={<Topics />} />
            <Route path="topics/:topicId/lessons" element={<Lessons />} />
            <Route path="lessons/:lessonId" element={<Lesson />} />
            <Route path="mcq-practice" element={<MCQPractice />} />
            <Route path="mock-tests" element={<MockTests />} />
            <Route path="mock-tests/:testId" element={<TestPage />} />
            <Route path="test-result" element={<TestResult />} />
            <Route path="performance" element={<Performance />} />
            <Route path="coding-practice" element={<CodingPractice />} />
            <Route path="code-editor" element={<CodeEditor />} />
            <Route path="interview-prep" element={<InterviewPrep />} />
            <Route path="company-patterns" element={<CompanyPatterns />} />
            <Route path="company-prep/:companySlug" element={<CompanyPrep />} />
            <Route path="assistant" element={<Assistant />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="careers" element={<AdminCareers />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="questions" element={<AdminQuestions />} />
            <Route path="company-links" element={<AdminCompanyLinks />} />
            <Route path="updates" element={<AdminUpdates />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <FloatingAssistant />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
