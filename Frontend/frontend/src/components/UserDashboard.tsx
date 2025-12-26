import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userLogout } from '../services/userService';
import toast from 'react-hot-toast';
import { getAllExams } from '../services/adminServices';

interface Exam {
  id: number;
  title: string;
  description: string | null;
  duration: number;
  totalMarks: number;
  isActive: boolean;
}

interface User {
  name: string;
  email: string;
  userId: number;
}

const UserDashboard: React.FC = () => {
  const [userName] = useState('Alex Doe'); // Replace with real user data
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("userDetails");
    const parsedUser = user ? JSON.parse(user) : null;
    setUserDetails(parsedUser);
    
    if (!user) {
      navigate('/signin');
      return;
    }
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const result = await getAllExams()
      setExams(result.data.exams)
    } catch (error) {
      console.log('Network error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendExam = (examId: number) => {
    console.log('Attending exam:', examId);
    navigate(`/exam/questions/${examId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("userDetails");
    userLogout().then((response)=>{
      toast.success(response.data.message)
      navigate('/signin');
    }).catch((error)=>{
      toast.error(error.response.data.message)
    })
  };

  const getExamStatus = (exam: Exam): 'upcoming' | 'live' | 'completed' => {
    if (!exam.isActive) return 'completed';
    return 'upcoming';
  };

  const getStatusColor = (status: ReturnType<typeof getExamStatus>) => {
    switch (status) {
      case 'upcoming': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'live': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Site Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Examify
              </h1>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-900 hidden md:block">
                Welcome, {userDetails?.name}
              </span>
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                {userDetails?.name?.charAt(0).toUpperCase() || userName.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Your Exams
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose an exam below to get started. Track your progress and prepare effectively.
          </p>
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {exams.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No exams available</h3>
              <p className="text-gray-600 mb-6">Check back later for new exams.</p>
              <button
                onClick={fetchExams}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Refresh
              </button>
            </div>
          ) : (
            exams.map((exam) => {
              const status = getExamStatus(exam);
              return (
                <div
                  key={exam.id}
                  className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-gray-100 p-8 transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                >
                  {/* Status Badge */}
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border mb-6 ${getStatusColor(status)}`}>
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {status === 'upcoming' && 'Upcoming'}
                    {status === 'live' && 'Live Now'}
                    {status === 'completed' && 'Completed'}
                  </div>

                  {/* Exam Content */}
                  <div className="space-y-4 h-full flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                      {exam.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed flex-1">
                      {exam.description}
                    </p>

                    {/* Exam Details */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-semibold text-gray-900">{exam.duration} min</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-sm text-gray-500">Total Marks</p>
                        <p className="font-semibold text-indigo-600">{exam.totalMarks}</p>
                      </div>
                    </div>

                    {/* Attend Button */}
                    <button
                      onClick={() => handleAttendExam(exam.id)}
                      disabled={!exam.isActive}
                      className={`w-full mt-6 py-4 px-6 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 ${
                        !exam.isActive
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-2xl'
                      }`}
                    >
                      {!exam.isActive ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          View Results
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Attend Exam
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
