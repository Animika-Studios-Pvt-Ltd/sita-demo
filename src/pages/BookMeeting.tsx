import { useState } from 'react';
import { Calendar, Mail, Phone, MapPin, CheckCircle2, Send } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function BookMeeting() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send data to a backend
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const faqs = [
    {
      question: 'What happens in a first consultation?',
      answer: 'The initial consultation is a 60-minute session where we discuss your health history, current concerns, and wellness goals. This helps me understand your needs and create a personalized plan. There\'s no obligation to continue after the consultation.',
    },
    {
      question: 'How long are typical sessions?',
      answer: 'Yoga therapy sessions are typically 60-90 minutes, Ayurveda consultations are 75 minutes, and Kosha Counseling sessions are 75-90 minutes. The initial assessment for any modality is usually longer.',
    },
    {
      question: 'Do I need prior experience with yoga?',
      answer: 'No prior yoga experience is necessary. All practices are adapted to your current abilities and can be modified for any physical limitations or health concerns. The focus is on therapeutic benefit, not performance.',
    },
    {
      question: 'How often should I have sessions?',
      answer: 'This varies based on your needs and goals. Typically, clients start with weekly sessions for the first 4-6 weeks, then transition to bi-weekly or monthly sessions as appropriate. We\'ll discuss the best schedule during your consultation.',
    },
    {
      question: 'Can I work with multiple modalities?',
      answer: 'Absolutely! The Sita Factor integrates Yoga Therapy, Ayurveda, and Kosha Counseling for comprehensive healing. Many clients benefit from combining modalities, and we\'ll discuss the best approach for your needs.',
    },
    {
      question: 'Are sessions available online?',
      answer: 'Yes, I offer both in-person and virtual sessions via secure video conferencing. Virtual sessions are just as effective for most therapeutic work.',
    },
    {
      question: 'What should I prepare for my first session?',
      answer: 'Wear comfortable clothing that allows for gentle movement. Have a quiet space where you won\'t be disturbed. For virtual sessions, ensure you have a stable internet connection. Bring any questions or concerns you\'d like to discuss.',
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'Please provide at least 24 hours notice for cancellations or rescheduling. This allows me to offer your time slot to someone else. Late cancellations may be charged a fee.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-teal-700/60 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1641391400871-3a6578a11d5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwbWVkaXRhdGlvbiUyMHBlYWNlZnVsfGVufDF8fHx8MTc2NDgzODczNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Begin your journey"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <h1 className="mb-4 text-white">Book a Meeting</h1>
          <p className="text-white opacity-90">
            Take the first step toward transformation
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="mb-6 text-emerald-700">How We'll Work Together</h2>
          <p className="text-gray-700 mb-4">
            I'm honored that you're considering working together. Every journey begins with a 
            conversation, and I'd love to learn about your unique needs and how I can best 
            support you.
          </p>
          <p className="text-gray-700">
            Your first consultation is complimentary and provides an opportunity for us to 
            connect, discuss your goals, and explore which approach might be most beneficial 
            for you.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <Mail className="text-emerald-600 mx-auto mb-3" size={32} />
            <h3 className="mb-2 text-emerald-700">Email</h3>
            <p className="text-gray-600">contact@sitafactor.com</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <Phone className="text-emerald-600 mx-auto mb-3" size={32} />
            <h3 className="mb-2 text-emerald-700">Phone</h3>
            <p className="text-gray-600">+1 (555) 123-4567</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <MapPin className="text-emerald-600 mx-auto mb-3" size={32} />
            <h3 className="mb-2 text-emerald-700">Location</h3>
            <p className="text-gray-600">In-person & Virtual Sessions Available</p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-emerald-600" size={32} />
              <h2 className="text-emerald-700">Request a Consultation</h2>
            </div>
            
            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 text-center">
                <CheckCircle2 className="text-emerald-600 mx-auto mb-4" size={48} />
                <h3 className="mb-3 text-emerald-700">Thank You!</h3>
                <p className="text-gray-700">
                  Your request has been received. I'll be in touch within 24 hours to schedule 
                  your complimentary consultation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-gray-700 mb-2">
                    Primary Interest *
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select a service</option>
                    <option value="yoga-therapy">Yoga Therapy</option>
                    <option value="ayurveda">Ayurveda Integration</option>
                    <option value="kosha-counseling">Kosha Counseling</option>
                    <option value="integrated">Integrated Approach (All Three)</option>
                    <option value="not-sure">Not Sure / Need Guidance</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-2">
                    Tell me about your needs and goals
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Share what brings you here and what you hope to achieve..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Send Request
                </button>

                <p className="text-gray-500 text-center">
                  By submitting this form, you agree to be contacted about your consultation request.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="mb-12 text-emerald-700 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="mb-3 text-emerald-700">{faq.question}</h3>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Info */}
      <section className="bg-emerald-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-emerald-700 text-center">What to Know Before Your Session</h2>
          <div className="bg-white rounded-lg p-8 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-gray-700 mb-1">Privacy & Confidentiality</h4>
                <p className="text-gray-600">
                  All sessions are completely confidential. Your privacy and trust are paramount.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-gray-700 mb-1">Virtual Sessions</h4>
                <p className="text-gray-600">
                  Online sessions are conducted via secure, HIPAA-compliant video conferencing 
                  platform. You'll receive a link before your appointment.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-gray-700 mb-1">Investment</h4>
                <p className="text-gray-600">
                  Session rates and package options will be discussed during your consultation. 
                  The initial consultation is complimentary.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-gray-700 mb-1">Medical Disclaimer</h4>
                <p className="text-gray-600">
                  Yoga therapy, Ayurveda, and Kosha Counseling are complementary practices and 
                  not substitutes for medical care. Please consult your physician regarding any 
                  health concerns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}