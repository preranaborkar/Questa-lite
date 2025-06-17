'use client'

"use client";

// ...existing code...
import React, { useState } from 'react';
import { Plus, Trash2, Save, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CreateQuizPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  type Question = {
    id: number;
    text: string;
    type: 'TEXT' | 'SINGLE_CHOICE';
    options: string[];
    required: boolean;
    order: number;
  };

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: Date.now(),
      text: '',
      type: 'TEXT',
      options: [],
      required: true,
      order: 0
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      text: '',
      type: 'TEXT',
      options: [],
      required: true,
      order: questions.length
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (questionId: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== questionId));
    }
  };

  const updateQuestion = (
    questionId: number,
    field: keyof Omit<Question, 'id'>,
    value: any
  ) => {
    setQuestions(questions.map(question => {
      if (question.id === questionId) {
        const updated = { ...question, [field]: value };

        // When switching to SINGLE_CHOICE, ensure at least 2 options
        if (field === 'type' && value === 'SINGLE_CHOICE') {
          updated.options = updated.options.length >= 2 ? updated.options : ['', ''];
        }

        // When switching to TEXT, clear options
        if (field === 'type' && value === 'TEXT') {
          updated.options = [];
        }

        return updated;
      }
      return question;
    }));
  };

  const addOption = (questionId: number) => {
    setQuestions(questions.map(question => {
      if (question.id === questionId) {
        return { ...question, options: [...question.options, ''] };
      }
      return question;
    }));
  };

  const updateOption = (questionId: number, optionIndex: number, value: string) => {
    setQuestions(questions.map(question => {
      if (question.id === questionId) {
        const newOptions = [...question.options];
        newOptions[optionIndex] = value;
        return { ...question, options: newOptions };
      }
      return question;
    }));
  };

  const removeOption = (questionId: number, optionIndex: number) => {
    setQuestions(questions.map(question => {
      if (question.id === questionId && question.options.length > 2) {
        const newOptions = question.options.filter((_, index) => index !== optionIndex);
        return { ...question, options: newOptions };
      }
      return question;
    }));
  };

  const validateQuiz = () => {
    if (!title.trim()) {
      setError('Quiz title is required');
      return false;
    }

    if (questions.length < 2) {
      setError('At least 2 questions are required');
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      if (!question.text.trim()) {
        setError(`Question ${i + 1} text is required`);
        return false;
      }

      if (question.type === 'SINGLE_CHOICE') {
        if (question.options.length < 2) {
          setError(`Question ${i + 1} must have at least 2 options`);
          return false;
        }

        const validOptions = question.options.filter(opt => opt.trim());
        if (validOptions.length < 2) {
          setError(`Question ${i + 1} must have at least 2 non-empty options`);
          return false;
        }
      }
    }

    return true;
  };

  interface QuizQuestion {
    text: string;
    type: 'TEXT' | 'SINGLE_CHOICE';
    options: string[];
    required: boolean;
    order: number;
  }

  interface QuizData {
    title: string;
    description?: string;
    questions: QuizQuestion[];
  }

  const handleSubmit = async (e?: React.FormEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateQuiz()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call - replace with your actual API endpoint
      const quizData: QuizData = {
        title: title.trim(),
        description: description.trim() || undefined,
        questions: questions.map((q, index): QuizQuestion => ({
          text: q.text.trim(),
          type: q.type,
          options: q.type === 'SINGLE_CHOICE'
            ? q.options.filter(opt => opt.trim()).map(opt => opt.trim())
            : [],
          required: q.required,
          order: index
        }))
      };

      console.log('Quiz data to submit:', quizData);
      
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/signin')
        return
      }
      
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(quizData)
      });

      if (!response.ok) {
        throw new Error('Failed to create quiz');
      }

      setSuccess('Quiz created successfully! ');
      
      // Redirect to dashboard after a short delay to show success message
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (error) {
      setError('Failed to create quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const previewQuiz = () => {
    if (!validateQuiz()) {
      return;
    }

    console.log('Preview Quiz:', {
      title,
      description,
      questions: questions.map((q, index) => ({
        ...q,
        order: index
      }))
    });

    alert('Quiz preview logged to console. Check developer tools.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Quiz</h1>
          <p className="text-gray-600">Build your quiz with custom questions and options</p>
        </div>

        <div className="space-y-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Quiz Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Quiz Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your quiz title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your quiz..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Questions ({questions.length})</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </button>
            </div>

            {questions.map((question, index) => (
              <div key={question.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">Question {index + 1}</h3>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Remove question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text *
                    </label>
                    <textarea
                      value={question.text}
                      onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                      placeholder="Enter your question"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Question Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Answer Type
                    </label>
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`question-type-${question.id}`}
                          value="TEXT"
                          checked={question.type === 'TEXT'}
                          onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                          className="mr-2"
                        />
                        Short Text Answer
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`question-type-${question.id}`}
                          value="SINGLE_CHOICE"
                          checked={question.type === 'SINGLE_CHOICE'}
                          onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                          className="mr-2"
                        />
                        Single Choice (Radio)
                      </label>
                    </div>
                  </div>

                  {/* Options for Single Choice */}
                  {question.type === 'SINGLE_CHOICE' && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Options * (minimum 2 required)
                        </label>
                        <button
                          type="button"
                          onClick={() => addOption(question.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Option
                        </button>
                      </div>

                      {question.options.length < 2 && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 rounded mb-3 text-sm">
                          ⚠️ Single choice questions require at least 2 options
                        </div>
                      )}

                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500 w-6">
                              {optionIndex + 1}.
                            </span>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                            {question.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(question.id, optionIndex)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Remove option"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {question.options.length >= 2 && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded mt-3 text-sm">
                          ✅ Question has {question.options.length} options - ready for submission
                        </div>
                      )}
                    </div>
                  )}

                  {/* Required Toggle */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`required-${question.id}`}
                      checked={question.required}
                      onChange={(e) => updateQuestion(question.id, 'required', e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
                      Required question
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6">
            <button
              type="button"
              onClick={previewQuiz}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Quiz
            </button>

            <div className="space-x-3">
              <button
                type="button"
                onClick={() => {
                  setTitle('');
                  setDescription('');
                  setQuestions([{
                    id: Date.now(),
                    text: '',
                    type: 'TEXT',
                    options: [],
                    required: true,
                    order: 0
                  }]);
                  setError('');
                  setSuccess('');
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Creating...' : 'Create Quiz'}
              </button>
            </div>
          </div>

          {/* Quiz Summary */}
          {title && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-3">Quiz Summary</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Title:</strong> {title}</p>
                {description && <p><strong>Description:</strong> {description}</p>}
                <p><strong>Questions:</strong> {questions.length}</p>
                <p><strong>Required Questions:</strong> {questions.filter(q => q.required).length}</p>
                <p><strong>Single Choice Questions:</strong> {questions.filter(q => q.type === 'SINGLE_CHOICE').length}</p>
                <p><strong>Text Questions:</strong> {questions.filter(q => q.type === 'TEXT').length}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateQuizPage;