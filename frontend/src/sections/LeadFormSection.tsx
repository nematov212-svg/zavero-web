import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, User, Store, MapPin, MessageSquare, AlertCircle, CheckCircle2, Sparkles, Check, Flame } from 'lucide-react';
import { Button } from '../components/common/Button';
import { SuccessModal } from '../components/common/SuccessModal';
import { publicApi } from '../api/publicApi';

export const LeadFormSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    businessName: '',
    city: '',
    message: '',
  });

  const [selectedPlan, setSelectedPlan] = useState<string>('1 Yillik Tarif');
  const [isPlanPulsing, setIsPlanPulsing] = useState<boolean>(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    const handleSelectPlan = (event: any) => {
      const plan = event.detail?.plan;
      if (plan) {
        setSelectedPlan(plan);
        setIsPlanPulsing(true);
        setTimeout(() => setIsPlanPulsing(false), 2200);
      }
    };

    window.addEventListener('zavero-select-plan', handleSelectPlan);
    return () => window.removeEventListener('zavero-select-plan', handleSelectPlan);
  }, []);

  const availablePlans = [
    { id: '1 Oylik Tarif', name: '1 Oylik', price: '200,000 so\'m', badge: 'Oylik' },
    { id: '3 Oylik Tarif', name: '3 Oylik', price: '550,000 so\'m', badge: 'Tejamkor' },
    { id: '9 Oylik Tarif', name: '9 Oylik', price: '1,500,000 so\'m', badge: '🔥 Ommabop' },
    { id: '1 Yillik Tarif', name: '1 Yillik', price: '2,000,000 so\'m', badge: '⭐ Eng Manfaatli' },
  ];

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [submittedLeadInfo, setSubmittedLeadInfo] = useState<{ name: string; businessName: string }>({
    name: '',
    businessName: '',
  });

  const validateField = (field: string, value: string): string => {
    const trimmed = (value || '').trim();
    switch (field) {
      case 'name':
        if (!trimmed || trimmed.length < 2) {
          return "Iltimos, ismingizni kiriting!";
        }
        return '';
      case 'phone': {
        const digits = trimmed.replace(/\D/g, '');
        if (!digits || (digits.startsWith('998') ? digits.length < 12 : digits.length < 9)) {
          return "Iltimos, telefon raqamingizni to'liq kiriting (+998 90 123 45 67)!";
        }
        return '';
      }
      case 'businessName':
        if (!trimmed || trimmed.length < 2) {
          return "Iltimos, Cafe yoki Restaurant nomini kiriting!";
        }
        return '';
      case 'city':
        if (!trimmed || trimmed.length < 2) {
          return "Iltimos, Shahar yoki Viloyatingizni kiriting!";
        }
        return '';
      default:
        return '';
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (submitAttempted) {
      const fieldError = validateField(field, value);
      setErrors((prev) => {
        const updated = { ...prev };
        if (!fieldError) {
          delete updated[field];
        } else {
          updated[field] = fieldError;
        }
        return updated;
      });
    }
  };

  const validateAll = () => {
    const newErrors: Record<string, string> = {};
    const nameErr = validateField('name', formData.name);
    if (nameErr) newErrors.name = nameErr;

    const phoneErr = validateField('phone', formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const businessErr = validateField('businessName', formData.businessName);
    if (businessErr) newErrors.businessName = businessErr;

    const cityErr = validateField('city', formData.city);
    if (cityErr) newErrors.city = cityErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await publicApi.createLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        businessName: formData.businessName.trim(),
        city: formData.city.trim(),
        plan: selectedPlan,
        message: formData.message.trim() || undefined,
      });

      if (response.success) {
        setSubmittedLeadInfo({
          name: formData.name,
          businessName: formData.businessName,
        });
        setIsSuccessModalOpen(true);
        // Reset form completely
        setFormData({
          name: '',
          phone: '',
          businessName: '',
          city: '',
          message: '',
        });
        setSubmitAttempted(false);
      }
    } catch (err: any) {
      setErrors({
        submit: err.message || 'Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-form" className="relative py-16 sm:py-24 md:py-28 bg-white dark:bg-[#080A10] overflow-hidden transition-colors">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-red-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Information */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold">
              <Store className="w-3.5 h-3.5" />
              <span>Zavero Hamkorlik Dasturi</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
              Zavero haqida ma'lumot olish
            </h2>

            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              Formani to'ldiring. Zavero mutaxassisi 15 daqiqa ichida siz bilan bog'lanib, restoraningiz uchun mos tarif va bepul demo taqdimotini tashkil qiladi.
            </p>

            <div className="p-4 sm:p-6 rounded-2xl glass-panel border border-gray-200 dark:border-white/10 space-y-3 sm:space-y-4 shadow-sm">
              <h4 className="text-gray-900 dark:text-white font-bold text-sm">Zavero bilan nimalarga ega bo'lasiz?</h4>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                  <span>14 kunlik to'liq bepul sinov davri</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                  <span>Joyiga chiqib bepul o'rnatish va printerlarni ulash</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                  <span>Ofitsiant va kassirlarni o'qitish</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                  <span>24/7 uzluksiz texnik yordam</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Active Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-panel p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-white/10 bg-white/95 dark:bg-[#0E1322]/95 shadow-xl relative"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">Bog'lanish uchun ariza</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 sm:mb-8">Ma'lumotlaringiz xavfsiz saqlanadi va uchinchi shaxslarga berilmaydi.</p>

              {errors.submit && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.submit}</span>
                </div>
              )}

              {submitAttempted && (errors.name || errors.phone || errors.businessName || errors.city) && (
                <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border-2 border-red-500/30 flex items-center gap-2.5 text-red-600 dark:text-red-400 text-xs font-bold animate-pulse">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>Iltimos, ariza yuborish uchun qizil rangda ko'rsatilgan barcha maydonlarni to'ldiring!</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Tanlangan Tarif Tanlagich (Interactive Plan Selector) */}
                <div className={`p-4 rounded-2xl border transition-all duration-300 ${isPlanPulsing
                  ? 'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20 scale-[1.01]'
                  : 'border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-white/[0.03]'
                  }`}>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-red-500" />
                      <span>Tanlangan Tarif:</span>
                    </label>
                    <span className="text-[11px] font-extrabold text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                      {selectedPlan}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {availablePlans.map((p) => {
                      const isSelected = selectedPlan === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedPlan(p.id)}
                          className={`relative p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${isSelected
                            ? 'border-red-500 bg-white dark:bg-[#12172A] shadow-md shadow-red-500/15 ring-2 ring-red-500/30'
                            : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 bg-white/70 dark:bg-white/[0.02]'
                            }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                              {p.badge}
                            </span>
                            {isSelected && (
                              <span className="w-3.5 h-3.5 rounded-full bg-red-500 text-white flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-black text-gray-900 dark:text-white truncate">
                            {p.name}
                          </div>
                          <div className="text-[11px] font-extrabold text-red-600 dark:text-red-400 font-mono mt-0.5">
                            {p.price}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Ism */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Ismingiz <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.name ? 'text-red-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      placeholder="Masalan: Azizbek"
                      value={formData.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      className={`w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm transition-all ${
                        errors.name ? '!border-red-500 !ring-2 !ring-red-500/25 bg-red-50/50 dark:bg-red-950/20' : ''
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs font-bold text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Telefon & Cafe Nomi Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Telefon raqamingiz <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <Phone className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.phone ? 'text-red-500' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        placeholder="+998 90 123 45 67"
                        value={formData.phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        className={`w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm font-mono transition-all ${
                          errors.phone ? '!border-red-500 !ring-2 !ring-red-500/25 bg-red-50/50 dark:bg-red-950/20' : ''
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs font-bold text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Cafe / Restaurant nomi <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <Store className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.businessName ? 'text-red-500' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        placeholder="Masalan: Family Cafe"
                        value={formData.businessName}
                        onChange={(e) => handleFieldChange('businessName', e.target.value)}
                        className={`w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm transition-all ${
                          errors.businessName ? '!border-red-500 !ring-2 !ring-red-500/25 bg-red-50/50 dark:bg-red-950/20' : ''
                        }`}
                      />
                    </div>
                    {errors.businessName && (
                      <p className="text-xs font-bold text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                        <span>{errors.businessName}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Shahar */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Shahar / Hudud <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.city ? 'text-red-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      placeholder="Masalan: Toshkent, Samarqand, Farg'ona, Buxoro..."
                      value={formData.city}
                      onChange={(e) => handleFieldChange('city', e.target.value)}
                      className={`w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm transition-all ${
                        errors.city ? '!border-red-500 !ring-2 !ring-red-500/25 bg-red-50/50 dark:bg-red-950/20' : ''
                      }`}
                    />
                  </div>
                  {errors.city && (
                    <p className="text-xs font-bold text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                      <span>{errors.city}</span>
                    </p>
                  )}
                </div>

                {/* Izoh */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Qo'shimcha izoh yoki savollaringiz
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <textarea
                      rows={3}
                      placeholder="Stollar soni, filiallar, qiziqtirgan savollar..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm resize-none"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  rightIcon={<Send className="w-4 h-4" />}
                  className="w-full justify-center py-4 text-base mt-2 shadow-lg shadow-red-500/20 cursor-pointer"
                >
                  Bog'lanish
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Success Modal with Confetti */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        leadName={submittedLeadInfo.name}
        businessName={submittedLeadInfo.businessName}
      />
    </section>
  );
};
