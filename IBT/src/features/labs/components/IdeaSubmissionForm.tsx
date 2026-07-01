import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiX, FiCheck, FiArrowDown } from 'react-icons/fi';
import { apiClient } from '@/src/api/client';
import { Toast } from '@/src/components/Toast';

const CATEGORY_OPTIONS = [
  'Select a category',
  'Product feature',
  'Process improvement',
  'New service or offering',
  'Partnership or collaboration',
  'Other'
];

export function IdeaSubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', variant: 'success' as 'success' | 'error' });
  const showToast = (message: string, variant: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, variant });
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    category: '',
    ideaTitle: '',
    description: '',
    privacyAccepted: false,
    otherCategory: '',
  });

  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue = value;
    if (name === 'firstName' || name === 'lastName') {
      finalValue = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (name === 'email') {
      finalValue = value.replace(/[^a-zA-Z0-9@.]/g, '');
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : finalValue
    }));
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    setFiles(prev => {
      const combined = [...prev, ...newFiles];
      return combined.slice(0, 5); // Max 5 files
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim()) {
      showToast('Please fill the First name field.', 'error');
      return;
    }
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(formData.firstName.trim())) {
      showToast('First name must contain only letters and spaces.', 'error');
      return;
    }

    if (formData.lastName.trim() && !nameRegex.test(formData.lastName.trim())) {
      showToast('Last name must contain only letters and spaces.', 'error');
      return;
    }

    if (!formData.email.trim()) {
      showToast('Please fill the Email address field.', 'error');
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email.trim())) {
      showToast('Please enter a valid email address containing "@".', 'error');
      return;
    }

    if (!formData.category || formData.category === 'Select a category') {
      showToast('Please select a Category.', 'error');
      return;
    }
    if (formData.category === 'Other' && !formData.otherCategory.trim()) {
      showToast('Please specify your category.', 'error');
      return;
    }

    if (!formData.ideaTitle.trim()) {
      showToast('Please fill the Idea title field.', 'error');
      return;
    }

    if (!formData.description.trim()) {
      showToast('Please fill the Describe your idea field.', 'error');
      return;
    }

    if (!formData.privacyAccepted) {
      showToast('You must accept the privacy policy.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('email', formData.email);
      submitData.append('category', formData.category === 'Other' ? formData.otherCategory : formData.category);
      submitData.append('ideaTitle', formData.ideaTitle);
      submitData.append('description', formData.description);
      submitData.append('privacyAccepted', formData.privacyAccepted ? 'true' : 'false');

      files.forEach(file => {
        submitData.append('attachments', file);
      });

      await apiClient.submitLabIdea(submitData);
      showToast('Idea submitted successfully!', 'success');
      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        category: '',
        ideaTitle: '',
        description: '',
        privacyAccepted: false,
        otherCategory: '',
      });
      setFiles([]);
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'An error occurred while submitting your idea.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheck size={32} />
        </div>
        <h3 className="text-2xl font-black text-[#0f172a] mb-4">Idea Submitted Successfully!</h3>
        <p className="text-slate-500 mb-8">Thank you for sharing your idea. Our team will review it and get back to you soon.</p>
        <button
          onClick={() => setSuccess(false)}
          className="px-6 py-3 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors"
        >
          Submit Another Idea
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold mb-4">
          <FiCheck /> Your submission is private
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">First name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Eg. Jane"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">Last name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Eg. Doe"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">Email address <span className="text-red-500">*</span></label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Eg. jane@example.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">Category <span className="text-red-500">*</span></label>
          <select
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all appearance-none"
          >
            {CATEGORY_OPTIONS.map(opt => (
              <option key={opt} value={opt === 'Select a category' ? '' : opt}>{opt}</option>
            ))}
          </select>
          {formData.category === 'Other' && (
            <input
              type="text"
              name="otherCategory"
              required
              value={formData.otherCategory}
              onChange={handleChange}
              placeholder="Eg. Please specify..."
              className="w-full mt-3 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all animate-in fade-in slide-in-from-top-2"
            />
          )}
        </div>


        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">Idea title <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="ideaTitle"
            required
            value={formData.ideaTitle}
            onChange={handleChange}
            placeholder="Eg. Your idea title..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">Describe your idea <span className="text-red-500">*</span></label>
          <div className="relative">
            <textarea
              name="description"
              required
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="Eg. What's the idea? What problem does it solve? How might it work?"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none"
              maxLength={1000}
            />
            <div className="absolute bottom-3 right-4 text-xs font-medium text-slate-400">
              {formData.description.length}/1000
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">Attachments</label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="w-full border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <FiUploadCloud className="text-3xl text-slate-400 mb-3" />
            <p className="text-sm font-bold text-slate-800 mb-1">Drop files here or click to browse</p>
            <p className="text-xs text-slate-500">Screenshots, mockups, or documents — up to 5 files, 10 MB each</p>
            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
            />
          </div>
          <p className="text-xs font-medium text-slate-500 mt-2">Accepted: Images, PDF, Word, PowerPoint</p>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-sm font-medium text-slate-700 truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="mt-1 flex-shrink-0">
              <input
                type="checkbox"
                name="privacyAccepted"
                checked={formData.privacyAccepted}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
            </div>
            <span className="text-sm text-slate-600 font-medium">
              I agree that my idea and contact details may be stored and reviewed by the team. I have read the privacy policy.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit my idea'}
        </button>
      </form>

      <Toast
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
