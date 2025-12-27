import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createExam } from '../../services/adminServices';
import toast from 'react-hot-toast';

interface FormData {
  title: string;
  description: string;
  duration: number;
  totalMarks: number;
  isActive: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
  duration?: string;
  totalMarks?: string;
  isActive?: string;
}

const CreateExam: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    duration: 30,
    totalMarks: 100,
    isActive: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = (data: FormData): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.title.trim()) newErrors.title = 'Exam title is required';
    else if (data.title.trim().length < 3) newErrors.title = 'Title must be at least 3 characters';

    if (!data.description.trim()) newErrors.description = 'Description is required';
    else if (data.description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters';

    if (!data.duration || data.duration < 10 || data.duration > 300) 
      newErrors.duration = 'Duration must be between 10-300 minutes';

    if (!data.totalMarks || data.totalMarks < 10 || data.totalMarks > 1000)
      newErrors.totalMarks = 'Total marks must be between 10-1000';

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, isActive: (e.target as HTMLInputElement).checked }));
    } else if (name === 'duration' || name === 'totalMarks') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
        createExam(formData).then((response)=>{
            toast.success(response.data.message)
            navigate('/admin/dashboard')
        })
    }
  };

  setLoading(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Create New Exam
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fill out the details below to create a new exam for your students.
          </p>
        </div>

        {/* Create Form */}
        <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-gray-100 p-10">
          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-3">
                Exam Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., JavaScript Fundamentals"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-5 py-4 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:outline-none text-lg placeholder-gray-400 font-medium
                  ${errors.title 
                    ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100' 
                    : 'border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-2 pt-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-3">
                Exam Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Describe what this exam covers (e.g., topics, skills tested, difficulty level)"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-5 py-4 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:outline-none text-base placeholder-gray-400 resize-vertical
                  ${errors.description 
                    ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100' 
                    : 'border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-2 pt-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.description}
                </p>
              )}
            </div>

            {/* Duration & Total Marks Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Duration Field */}
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-3">
                  Duration (minutes)
                </label>
                <input
                  id="duration"
                  name="duration"
                  type="number"
                  min="10"
                  max="300"
                  placeholder="45"
                  value={formData.duration}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:outline-none text-lg placeholder-gray-400 font-mono
                    ${errors.duration 
                      ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-indigo-100'
                    }`}
                  aria-invalid={!!errors.duration}
                />
                {errors.duration && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-2 pt-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.duration}
                  </p>
                )}
              </div>

              {/* Total Marks Field */}
              <div>
                <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700 mb-3">
                  Total Marks
                </label>
                <input
                  id="totalMarks"
                  name="totalMarks"
                  type="number"
                  min="10"
                  max="1000"
                  placeholder="100"
                  value={formData.totalMarks}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:outline-none text-lg placeholder-gray-400 font-mono
                    ${errors.totalMarks 
                      ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-indigo-100'
                    }`}
                  aria-invalid={!!errors.totalMarks}
                />
                {errors.totalMarks && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-2 pt-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.totalMarks}
                  </p>
                )}
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
              />
              <label htmlFor="isActive" className="ml-3 block text-sm font-medium text-gray-900">
                Exam is Active
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-5 px-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500 flex items-center justify-center gap-3 text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Exam
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="flex-1 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-900 font-semibold py-5 px-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-500 text-lg flex items-center justify-center gap-3"
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
    </div>
  );
};

export default CreateExam;
