'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { apiClient, type PublicBranch } from '@/src/api/client'
import { Toast } from '@/src/components/Toast'

type InquiryType = 'Partnership' | 'Internship' | 'IBT Labs' | 'General'

type ContactFormClientProps = {
  initialSettings: any
  initialBranches: PublicBranch[]
}

type FormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  message: string
}

export function ContactFormClient({ initialSettings, initialBranches }: ContactFormClientProps) {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ open: false, message: '', variant: 'success' as 'success' | 'error' })
  const showToast = (message: string, variant: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, variant })
  }
  const [inquiryType, setInquiryType] = useState<InquiryType>('IBT Labs')
  const [formData, setFormData] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  })

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = event.target.value
    if (field === 'phone') {
      // Allow only numbers and the plus sign
      value = value.replace(/[^\d+]/g, '')
    } else if (field === 'firstName' || field === 'lastName') {
      // Allow only letters and spaces
      value = value.replace(/[^a-zA-Z\s]/g, '')
    } else if (field === 'email') {
      // Allow only valid email characters
      value = value.replace(/[^a-zA-Z0-9@.]/g, '')
    }
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formData.firstName.trim()) {
      showToast('Please fill the First Name field.', 'error')
      return
    }
    const nameRegex = /^[a-zA-Z\s]+$/
    if (!nameRegex.test(formData.firstName.trim())) {
      showToast('First Name must contain only letters and spaces.', 'error')
      return
    }

    if (!formData.lastName.trim()) {
      showToast('Please fill the Last Name field.', 'error')
      return
    }
    if (!nameRegex.test(formData.lastName.trim())) {
      showToast('Last Name must contain only letters and spaces.', 'error')
      return
    }

    if (!formData.email.trim()) {
      showToast('Please fill the Email field.', 'error')
      return
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(formData.email.trim())) {
      showToast('Please enter a valid email address containing "@".', 'error')
      return
    }

    if (!formData.phone.trim()) {
      showToast('Please fill the Phone field.', 'error')
      return
    }
    const phoneDigits = formData.phone.replace(/\D/g, '')
    if (phoneDigits.length < 10) {
      showToast('Phone number must contain at least 10 digits.', 'error')
      return
    }

    if (!formData.message.trim()) {
      showToast('Please fill the Message field.', 'error')
      return
    }

    setLoading(true)

    try {
      await apiClient.submitContactForm({
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        company: formData.company.trim() || undefined,
        subject: inquiryType,
        message: formData.message.trim(),
      })

      showToast('Inquiry submitted successfully!', 'success')
      setFormSubmitted(true)
      setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '', message: '' })
    } catch (error) {
      console.error('Contact form submission failed:', error)
      showToast('Unable to send your message right now. Please try again in a moment.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full p-6 sm:p-8">
      <span className="inline-block text-[#3b82f6] font-bold text-[16px] tracking-widest uppercase mb-6">
        SEND US A MESSAGE
      </span>

      {!formSubmitted ? (
        <form onSubmit={handleSubmit} noValidate className="space-y-5 sm:space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#0f172a]">First Name <span className="text-red-500 ml-1">*</span></label>
              <input
                required
                value={formData.firstName}
                onChange={handleChange('firstName')}
                type="text"
                placeholder="Eg. John"
                className="w-full h-11 bg-white border border-slate-200 rounded-lg px-4 text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#0f172a]">Last Name <span className="text-red-500 ml-1">*</span></label>
              <input
                required
                value={formData.lastName}
                onChange={handleChange('lastName')}
                type="text"
                placeholder="Eg. Doe"
                className="w-full h-11 bg-white border border-slate-200 rounded-lg px-4 text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#0f172a]">Email<span className="text-red-500 ml-1">*</span></label>
            <input
              required
              value={formData.email}
              onChange={handleChange('email')}
              type="email"
              placeholder="Eg. john@company.com"
              className="w-full h-11 bg-white border border-slate-200 rounded-lg px-4 text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#0f172a]">Phone<span className="text-red-500 ml-1">*</span></label>
              <input
                required
                value={formData.phone}
                onChange={handleChange('phone')}
                type="tel"
                minLength={10}
                maxLength={15}
                placeholder="Eg. +91 98765 43210"
                className="w-full h-11 bg-white border border-slate-200 rounded-lg px-4 text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#0f172a]">Company (Optional)</label>
              <input
                value={formData.company}
                onChange={handleChange('company')}
                type="text"
                placeholder="Eg. Your company name"
                className="w-full h-11 bg-white border border-slate-200 rounded-lg px-4 text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-[11px] font-bold text-[#0f172a] block">Inquiry Type</label>
            <div className="flex flex-wrap gap-2">
              {(['Partnership', 'Internship', 'IBT Labs', 'General'] as InquiryType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setInquiryType(type)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all ${inquiryType === type
                    ? 'bg-[#0f172a] border-[#0f172a] text-white'
                    : 'bg-[#f8fafc] border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-[#0f172a]">Message <span className="text-red-500 ml-1">*</span></label>
              <span className="text-[10px] font-medium text-slate-400">{formData.message.length}/500</span>
            </div>
            <textarea
              required
              maxLength={500}
              value={formData.message}
              onChange={handleChange('message')}
              rows={4}
              placeholder="Eg. How can we help you?"
              className="w-full bg-white border border-slate-200 rounded-lg p-4 text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all resize-none placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#e63946] text-white rounded-lg text-sm font-bold hover:bg-[#d62839] transition-colors flex items-center justify-center gap-2 shadow-md shadow-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Submit Inquiry'}
              {!loading && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              )}
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-50 text-red-500">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              Your information is safe with us. We respect your privacy.
            </div>
          </div>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 mb-4">
            <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent Successfully!</h3>
          <p className="text-slate-500 text-sm mb-6">Thank you for getting in touch. We will respond shortly.</p>
          <button
            onClick={() => setFormSubmitted(false)}
            className="text-xs font-bold text-[#e63946] hover:text-[#d62839]"
          >
            Send another inquiry
          </button>
        </motion.div>
      )}

      <Toast
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </div>
  )
}
