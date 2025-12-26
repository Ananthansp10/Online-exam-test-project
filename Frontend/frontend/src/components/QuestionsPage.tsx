import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getQuestions } from '../services/userService';
import { getExam } from '../services/adminServices';
import axiosInstance from '../config/axiosConfig';

interface Option {
  id: number;
  optionText: string;
}

interface Question {
  id: number;
  examId: number;
  questionText: string;
  type: 'MCQ' | 'TRUE_FALSE';
  marks: number;
  Options: Option[];
}

interface Exam {
  id: number;
  title: string;
  duration: number;
}

interface ExamResult {
  score: number;
  totalMarks: number;
  percentage: string;
}

const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [exam, setExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const timerRef = useRef<any | null>(null);

  const STORAGE_KEY = `exam-${examId}`;

  const saveProgress = useCallback(() => {
    if (!examId || isSubmitted) return;
    try {
      const progress = {
        currentQuestionIndex,
        answers,
        timeLeft,
        isSubmitted: false,
        timestamp: Date.now(),
        examStartTime: localStorage.getItem(`${STORAGE_KEY}-startTime`) || new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      localStorage.setItem(`${STORAGE_KEY}-startTime`, progress.examStartTime);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [STORAGE_KEY, currentQuestionIndex, answers, timeLeft, isSubmitted, examId]);

  const loadSavedProgress = useCallback((examDuration: number) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        
        if (data.isSubmitted === true) {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(`${STORAGE_KEY}-startTime`);
          toast.success('Exam already submitted!');
          navigate('/user/dashboard');
          return;
        }
        
        const elapsed = Math.floor((Date.now() - data.timestamp!) / 1000);
        const timeRemaining = Math.max(0, data.timeLeft - elapsed);
        
        setCurrentQuestionIndex(data.currentQuestionIndex || 0);
        setAnswers(data.answers || {});
        setTimeLeft(timeRemaining);
        setIsSubmitted(false);
        
        console.log('✅ Restored:', {
          question: data.currentQuestionIndex + 1,
          timeLeft: timeRemaining,
          answers: Object.keys(data.answers).length
        });
        
        return timeRemaining;
      }
      
      const fullTime = examDuration * 60;
      setTimeLeft(fullTime);
      localStorage.setItem(`${STORAGE_KEY}-startTime`, new Date().toISOString());
      return fullTime;
    } catch (error) {
      console.error('Error loading progress:', error);
      const fullTime = examDuration * 60;
      setTimeLeft(fullTime);
      return fullTime;
    }
  }, [STORAGE_KEY, navigate]);

  useEffect(() => {
    if (!examId) {
      navigate('/user/dashboard');
      return;
    }
    loadExam(parseInt(examId));
  }, [examId, navigate]);

  useEffect(() => {
    if (isSubmitted || loading || !exam) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          console.log('⏰ TIME UP! Auto-submitting exam...');
          toast.error('Time Up! Auto-submitting your answers...', { 
            duration: 2000,
            position: 'top-center'
          });
          submitExam();
          return 0;
        }
        saveProgress();
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isSubmitted, loading, exam, saveProgress]);

  useEffect(() => {
    if (!loading && !isSubmitted && timeLeft > 0) {
      const timeout = setTimeout(saveProgress, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentQuestionIndex, answers, saveProgress, loading, isSubmitted, timeLeft]);

  const loadExam = async (id: number) => {
    try {
      setLoading(true);
      const [questionsRes, examRes] = await Promise.all([
        getQuestions(id),
        getExam(id)
      ]);

      if (questionsRes.data?.success && examRes.data) {
        setQuestions(questionsRes.data.questions || []);
        const duration = examRes.data.data.duration || 60;
        setExam({ id, title: examRes.data.title || 'Exam', duration });
        loadSavedProgress(duration);
      } else {
        throw new Error('Exam not found');
      }
    } catch (error) {
      toast.error('Failed to load exam');
      navigate('/user/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = useCallback((optionId: number) => {
    if (isSubmitted || timeLeft <= 0 || loading) return;
    if (currentQuestionIndex >= questions.length) return;

    const questionId = questions[currentQuestionIndex]?.id;
    if (questionId) {
      setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    }
  }, [isSubmitted, timeLeft, loading, currentQuestionIndex, questions]);

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1 && timeLeft > 0 && !isSubmitted) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0 && timeLeft > 0 && !isSubmitted) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const user = localStorage.getItem("userDetails");
  const userDetails = user ? JSON.parse(user) : null;

  const submitExam = async () => {
    if (isSubmitted) return;

    try {
      setIsSubmitted(true);
      
      const answersFormatted = Object.entries(answers).map(([questionIdStr, selectedOptionId]) => ({
        questionId: parseInt(questionIdStr),
        selectedOptionId: selectedOptionId as number
      }));

      const submitData = {
        examId: parseInt(examId || '0'),
        answers: answersFormatted,
        startTime: localStorage.getItem(`${STORAGE_KEY}-startTime`) || new Date().toISOString(),
        duration: exam?.duration || 60,
        userId: userDetails?.userId ?? null
      };

      console.log('🟢 Submitting:', submitData);

      const response = await axiosInstance.post('/result/submit-exam', submitData);

      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(`${STORAGE_KEY}-startTime`);
      
      toast.success('Exam submitted successfully!');
      setExamResult(response.data.result);
      setShowResultsModal(true);
    } catch (error: any) {
      console.error('❌ Submit error:', error);
      
      if (error.response?.status === 403) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(`${STORAGE_KEY}-startTime`);
        toast.error('Exam already submitted!');
        navigate('/user/dashboard');
        return;
      }
      
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setIsSubmitted(false);
    }
  };

  const closeResultsModal = () => {
    setShowResultsModal(false);
    navigate('/user/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        <div className="text-center p-8">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!exam || questions.length === 0 || !examId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 pt-20">
        <div className="text-center p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No questions found</h2>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = !!answers[currentQuestion.id];
  const timeUp = timeLeft <= 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {exam.title}
                </h1>
                <p className="text-gray-600">
                  Q{currentQuestionIndex + 1} / {questions.length} • 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                    isAnswered ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {isAnswered ? 'Answered' : 'Not Answered'}
                  </span>
                </p>
              </div>
              <div className={`text-right ${timeUp ? 'animate-pulse' : ''}`}>
                <div className={`text-2xl font-bold ${timeUp ? 'text-red-600' : 'text-red-500'}`}>
                  {formatTime(Math.max(0, timeLeft))}
                </div>
                <div className="text-sm text-gray-500">Time Remaining</div>
              </div>
            </div>
          </div>
        </div>

        {/* Question & Options */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-gray-100 p-10 mb-8">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                Q{currentQuestionIndex + 1}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-relaxed">
                  {currentQuestion.questionText}
                </h2>
                <div className="text-sm text-gray-500 mb-4">
                  Marks: <span className="font-semibold text-emerald-600">{currentQuestion.marks}</span> • {currentQuestion.type}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {currentQuestion.Options.map((option, index) => {
                const selected = answers[currentQuestion.id] === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => selectAnswer(option.id)}
                    disabled={isSubmitted || timeUp}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 group disabled:opacity-50 disabled:cursor-not-allowed ${
                      selected
                        ? 'border-emerald-400 bg-emerald-50 shadow-lg'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center transition-all ${
                      selected ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-gray-300 group-hover:border-indigo-400'
                    }`}>
                      {selected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-semibold text-gray-900 text-lg block">{String.fromCharCode(65 + index)}.</span>
                      <span>{option.optionText}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4 justify-between mb-8">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0 || isSubmitted || timeUp}
              className="flex-1 px-6 py-4 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed max-w-xs"
            >
              Previous
            </button>
            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={submitExam}
                disabled={isSubmitted || timeUp}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed max-w-xs"
              >
                {isSubmitted ? 'Submitting...' : 'Submit Exam'}
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={isSubmitted || timeUp}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed max-w-xs"
              >
                Next
              </button>
            )}
          </div>

          <div className="text-center">
            <div className="flex justify-between text-sm text-gray-500 mb-2 max-w-md mx-auto">
              <span>Progress</span>
              <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full shadow-lg transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {showResultsModal && examResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="p-8 text-center border-b border-gray-100">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{exam?.title}</h2>
              <p className="text-gray-600">Exam Completed Successfully!</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  {examResult.score} / {examResult.totalMarks}
                </div>
                <div className="text-3xl font-bold text-gray-900">{examResult.percentage}%</div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-emerald-50 p-6 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-emerald-600">{examResult.score}</div>
                  <div className="text-sm font-medium text-emerald-700 mt-1">Score</div>
                </div>
                <div className="bg-blue-50 p-6 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-blue-600">{examResult.totalMarks}</div>
                  <div className="text-sm font-medium text-blue-700 mt-1">Total Marks</div>
                </div>
                <div className="bg-purple-50 p-6 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-purple-600">{examResult.percentage}%</div>
                  <div className="text-sm font-medium text-purple-700 mt-1">Percentage</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                <button
                  onClick={closeResultsModal}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all text-lg"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionsPage;
