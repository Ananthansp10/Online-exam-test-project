import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogout, getAllExams } from '../../services/adminServices';
import toast from 'react-hot-toast';

interface Exam {
  id: number;
  title: string;
  description: string | null;
  duration: number;
  totalMarks: number;
  isActive: boolean;
}

interface Admin {
  name: string;
  email: string;
  adminId: number;
}

const AdminDashboard: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminDetails, setAdminDetails] = useState<Admin | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem("adminDetails");
    if (!admin) {
      navigate('/admin/signin');
      return;
    }
    
    const parsedAdmin = JSON.parse(admin);
    setAdminDetails(parsedAdmin);
    
    fetchExams();
  }, []);

  const fetchExams = async () => {
    getAllExams().then((response)=>{
        setExams(response.data.exams)
    })
     setLoading(false)
  };

  const handleLogout = () => {
    localStorage.removeItem("adminDetails");
    adminLogout().then((response)=>{
    toast.success(response.data.message)
    navigate('/admin/signin')
    }).catch((error)=>{
        toast.error(error.response.data.message)
    })
  };

  const handleCreateExam = () => {
    navigate('/admin/create-exam');
  };

  const handleAddQuestions = (examId: number) => {
    navigate(`/admin/add-questions/${examId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Examify
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <span className="text-lg font-semibold text-gray-900">
              Welcome, {adminDetails?.name}
            </span>
            <button
              onClick={handleCreateExam}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500"
            >
              Create Exam
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-500"
            >
              Logout
            </button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-sm">
            <div className="px-4 py-4 space-y-2">
              <span className="block text-lg font-semibold text-gray-900">
                Welcome, {adminDetails?.name}
              </span>
              <button
                onClick={handleCreateExam}
                className="w-full text-left px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Create Exam
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Exam List
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage all exams, create new ones, and monitor student progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-gray-100 p-8 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col"
            >
              <div className="space-y-4 flex-1">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                  {exam.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {exam.description}
                </p>
              </div>

              <div className="pt-6 border-t border-gray-100 mt-auto space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold text-gray-900">{exam.duration} min</p>
                  </div>
                </div>

                <button
                  onClick={() => handleAddQuestions(exam.id)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Questions
                </button>
              </div>
            </div>
          ))}
        </div>
        {exams.length === 0 && (
          <div className="col-span-full text-center py-20">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No exams yet</h3>
            <p className="text-gray-600 mb-6">Create your first exam to get started.</p>
            <button
              onClick={handleCreateExam}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Create First Exam
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
