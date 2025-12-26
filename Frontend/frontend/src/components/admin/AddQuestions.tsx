import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addQuestions, getExam } from '../../services/adminServices';

interface Choice {
  text: string;
  isCorrect: boolean;
}

interface Question {
  questionText: string;
  type: 'MCQ' | 'TRUE_FALSE';
  marks: number;
  choices: Choice[];
}

interface Exam {
  id: number;
  title: string;
}

const AddQuestions: React.FC = () => {
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  const newQuestionTemplate: Question = {
    questionText: '',
    type: 'MCQ',
    marks: 5,
    choices: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]
  };

  useEffect(() => {
    if (!examId) {
      navigate('/admin/dashboard');
      return;
    }

    fetchExam(parseInt(examId));
  }, [examId]);

  const fetchExam = async (id: number) => {
    try {
      setLoading(true);
      const result = await getExam(id)
      console.log(result)
      setExam({
        id: parseInt(examId || '0'),
        title: result.data.data.title
      });
    } catch (error) {
      toast.error('Failed to load exam');
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { ...newQuestionTemplate }]);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    if (field === 'choices') {
      setQuestions(prev => 
        prev.map((q, i) => i === index ? { ...q, choices: value } : q)
      );
    } else {
      setQuestions(prev => 
        prev.map((q, i) => i === index ? { ...q, [field]: value } : q)
      );
    }
  };

  const updateChoice = (questionIndex: number, choiceIndex: number, field: keyof Choice, value: any) => {
    setQuestions(prev => 
      prev.map((q, qIndex) => {
        if (qIndex === questionIndex) {
          const newChoices = [...q.choices];
          newChoices[choiceIndex] = { ...newChoices[choiceIndex], [field]: value };
          
          if (field === 'isCorrect' && q.type === 'MCQ') {
            newChoices.forEach((choice, cIndex) => {
              if (cIndex !== choiceIndex) choice.isCorrect = false;
            });
          }
          
          return { ...q, choices: newChoices };
        }
        return q;
      })
    );
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const questionsData = questions.map(q => ({
        examId: parseInt(examId || '0'),
        questionText: q.questionText,
        type: q.type,
        marks: q.marks,
        options: q.choices.map(c => ({ text: c.text, isCorrect: c.isCorrect }))
      }));
      await addQuestions(questionsData)
      toast.success('Questions saved successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.log(error)
      toast.error('Failed to save questions');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Add Questions - {exam?.title}
          </h1>
          <p className="text-xl text-gray-600">
            Create multiple choice questions for your exam. Each MCQ has 4 choices.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-gray-100 p-8">
            {/* Questions List */}
            <div className="space-y-6 mb-8">
              {questions.map((question, qIndex) => (
                <div key={qIndex} className="border-2 border-gray-200 rounded-2xl p-8 hover:border-indigo-300 transition-colors">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Question {qIndex + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-500 hover:text-red-700 font-semibold text-lg"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Question Text */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Question Text *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Enter your question here..."
                      value={question.questionText}
                      onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  {/* Question Type */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Question Type *
                    </label>
                    <select
                      value={question.type}
                      onChange={(e) => updateQuestion(qIndex, 'type', e.target.value as 'MCQ' | 'TRUE_FALSE')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
                    >
                      <option value="MCQ">Multiple Choice (4 options)</option>
                    </select> 
                  </div>

                  {/* Choices */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {question.type === 'MCQ' ? 'Choices (4 options) *' : 'True/False Options *'}
                    </label>
                    <div className="space-y-3">
                      {question.choices.map((choice, cIndex) => (
                        <div key={cIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <span className="font-semibold text-gray-900 w-8">{String.fromCharCode(65 + cIndex)}.</span>
                          <input
                            type="text"
                            placeholder={`Option ${String.fromCharCode(65 + cIndex)}`}
                            value={choice.text}
                            onChange={(e) => updateChoice(qIndex, cIndex, 'text', e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                          />
                          {question.type === 'MCQ' ? (
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={choice.isCorrect}
                                onChange={(e) => updateChoice(qIndex, cIndex, 'isCorrect', e.target.checked)}
                                className="w-5 h-5 text-indigo-600"
                              />
                              <span className="text-sm font-medium text-gray-700">Correct</span>
                            </label>
                          ) : (
                            <div className="flex gap-2">
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`correct-${qIndex}`}
                                  checked={choice.isCorrect}
                                  onChange={(e) => {
                                    updateChoice(qIndex, 0, 'isCorrect', e.target.checked);
                                    updateChoice(qIndex, 1, 'isCorrect', !e.target.checked);
                                  }}
                                  className="w-4 h-4 text-indigo-600"
                                />
                                True
                              </label>
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`correct-${qIndex}`}
                                  checked={!question.choices[1]?.isCorrect}
                                  onChange={(e) => {
                                    updateChoice(qIndex, 1, 'isCorrect', e.target.checked);
                                    updateChoice(qIndex, 0, 'isCorrect', !e.target.checked);
                                  }}
                                  className="w-4 h-4 text-indigo-600"
                                />
                                False
                              </label>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Marks */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Marks *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={question.marks}
                      onChange={(e) => updateQuestion(qIndex, 'marks', parseInt(e.target.value))}
                      className="w-24 px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add Question Button */}
            <button
              type="button"
              onClick={addQuestion}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-3 mx-auto max-w-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Question
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-3 text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save All Questions
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="flex-1 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-900 font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-3 text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestions;
