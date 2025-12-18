import { Link } from 'react-router-dom';
import { Heart, Leaf, Brain, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Home() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[600px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-[#7D5347]/80 to-[#A67365]/60 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1641391400871-3a6578a11d5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwbWVkaXRhdGlvbiUyMHBlYWNlZnVsfGVufDF8fHx8MTc2NDgzODczNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Peaceful meditation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <h1 className="mb-6 text-white">Transform Your Life Through Holistic Wellness</h1>
          <p className="mb-8 text-white opacity-90">
            Experience the power of integrated Yoga Therapy, Ayurveda, and Kosha Counseling 
            to achieve balance, healing, and authentic well-being.
          </p>
          <Link
            to="/book-meeting"
            className="inline-flex items-center gap-2 bg-white text-[#A67365] px-8 py-3 rounded-full hover:bg-[#F5EBE8] transition-colors"
          >
            Book Your Consultation
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* About Sita Short Intro */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="mb-6 text-[#A67365]">Meet Sita</h2>
            <p className="text-gray-700 mb-4">
              With over 15 years of experience in holistic wellness, Sita brings together ancient 
              wisdom and modern therapeutic practices to guide you on your healing journey.
            </p>
            <p className="text-gray-700 mb-6">
              Her unique approach integrates Yoga Therapy, Ayurvedic principles, and Kosha 
              Counseling to address the whole person—body, mind, and spirit.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-[#A67365] hover:text-[#8B5E4F] transition-colors"
            >
              Learn More About Sita
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1551992315-907fbf183932?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMHRoZXJhcHklMjBuYXR1cmV8ZW58MXx8fHwxNzY0ODM4NzM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Wellness and nature"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* The Sita Factor Overview */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-[#A67365]">The Sita Factor</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              A comprehensive approach to wellness that integrates three powerful modalities 
              to support your complete transformation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Yoga Therapy Programs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="relative h-48 bg-gradient-to-br from-[#C49186] to-[#A67365]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1651077920873-ac1be1b82290?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwcHJhY3RpY2UlMjBzdHVkaW98ZW58MXx8fHwxNzY0ODM4NzM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Yoga therapy practice"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart className="text-white" size={48} />
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-[#A67365]">Yoga Therapy Programs</h3>
                <p className="text-gray-600 mb-4">
                  Evidence-based therapeutic yoga tailored to your unique needs, supporting 
                  healing from chronic conditions, stress, and trauma.
                </p>
                <Link
                  to="/yoga-therapy"
                  className="inline-flex items-center gap-2 text-[#A67365] hover:text-[#8B5E4F] transition-colors"
                >
                  Explore Programs
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Ayurveda Integration */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="relative h-48 bg-gradient-to-br from-amber-400 to-orange-500">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1667904498869-933d459ddb1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxheXVydmVkYSUyMGhlcmJzJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzY0ODM2NTY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Ayurveda herbs and wellness"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Leaf className="text-white" size={48} />
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-[#A67365]">Ayurveda Integration</h3>
                <p className="text-gray-600 mb-4">
                  Personalized nutrition and lifestyle guidance rooted in ancient Ayurvedic 
                  wisdom to restore balance and vitality.
                </p>
                <Link
                  to="/ayurveda"
                  className="inline-flex items-center gap-2 text-[#A67365] hover:text-[#8B5E4F] transition-colors"
                >
                  Learn More
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Kosha Counseling */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="relative h-48 bg-gradient-to-br from-[#D4A59A] to-[#A67365]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1556832647-5b857ebd06e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5kZnVsbmVzcyUyMG1lZGl0YXRpb24lMjBzdG9uZXN8ZW58MXx8fHwxNzY0ODM4NzM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Mindfulness and meditation"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="text-white" size={48} />
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-[#A67365]">Kosha Counseling</h3>
                <p className="text-gray-600 mb-4">
                  Deep exploration of the five layers of being to address root causes of 
                  imbalance and unlock your full potential.
                </p>
                <Link
                  to="/kosha-counseling"
                  className="inline-flex items-center gap-2 text-[#A67365] hover:text-[#8B5E4F] transition-colors"
                >
                  Discover More
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book a Meeting CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-[#A67365] to-[#8B5E4F] rounded-2xl p-12 text-center text-white">
          <h2 className="mb-4 text-white">Ready to Begin Your Journey?</h2>
          <p className="mb-8 opacity-90 max-w-2xl mx-auto">
            Schedule a complimentary consultation to discuss your wellness goals and 
            discover how The Sita Factor can support your transformation.
          </p>
          <Link
            to="/book-meeting"
            className="inline-flex items-center gap-2 bg-white text-[#A67365] px-8 py-3 rounded-full hover:bg-[#F5EBE8] transition-colors"
          >
            Book Your Free Consultation
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
