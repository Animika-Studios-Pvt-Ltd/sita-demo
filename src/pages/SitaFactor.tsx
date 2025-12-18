import { Link } from 'react-router-dom';
import { Heart, Leaf, Brain, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function SitaFactor() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-teal-700/60 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1556832647-5b857ebd06e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5kZnVsbmVzcyUyMG1lZGl0YXRpb24lMjBzdG9uZXN8ZW58MXx8fHwxNzY0ODM4NzM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Mindfulness and balance"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <h1 className="mb-4 text-white">The Sita Factor</h1>
          <p className="text-white opacity-90">
            A holistic approach to wellness that integrates body, mind, and spirit
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="mb-6 text-emerald-700">What is The Sita Factor?</h2>
          <p className="text-gray-700 mb-4">
            The Sita Factor is a comprehensive wellness methodology that brings together
            three powerful healing modalities: Yoga Therapy, Ayurveda, and Kosha Counseling.
          </p>
          <p className="text-gray-700">
            This integrated approach recognizes that true healing requires addressing all
            aspects of our being—physical, energetic, mental, emotional, and spiritual.
            By working with these three complementary practices, we create lasting
            transformation from the inside out.
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-emerald-50 rounded-2xl p-8 md:p-12">
          <h3 className="mb-8 text-emerald-700 text-center">Why Choose an Integrated Approach?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Addresses root causes, not just symptoms',
              'Personalized to your unique constitution and needs',
              'Evidence-based and time-tested practices',
              'Sustainable lifestyle changes',
              'Holistic healing for body, mind, and spirit',
              'Ongoing support and guidance',
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-emerald-700 text-center">The Three Pillars</h2>

          {/* Yoga Therapy */}
          <div className="mb-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="text-emerald-600" size={40} />
                  <h3 className="text-emerald-700">Yoga Therapy Programs</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Evidence-based therapeutic yoga practices designed to support healing from
                  chronic conditions, manage stress, process trauma, and promote overall vitality.
                </p>
                <p className="text-gray-700 mb-6">
                  Our programs include personalized asana (postures), pranayama (breathwork),
                  meditation, and yogic lifestyle practices tailored to your specific needs.
                </p>
                <Link
                  to="/yoga-therapy"
                  className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  Explore Yoga Therapy Programs
                  <ArrowRight size={18} />
                </Link>
              </div>
              <div className="order-1 md:order-2 relative h-[350px] rounded-lg overflow-hidden shadow-lg">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1651077920873-ac1be1b82290?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwcHJhY3RpY2UlMjBzdHVkaW98ZW58MXx8fHwxNzY0ODM4NzM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Yoga therapy practice"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Ayurveda Integration */}
          <div className="mb-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[350px] rounded-lg overflow-hidden shadow-lg">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1667904498869-933d459ddb1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxheXVydmVkYSUyMGhlcmJzJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzY0ODM2NTY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Ayurveda herbs"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Leaf className="text-emerald-600" size={40} />
                  <h3 className="text-emerald-700">Ayurveda Integration</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Ancient wisdom for modern living. Ayurveda provides personalized nutrition,
                  herbal support, and lifestyle recommendations based on your unique
                  constitutional type (dosha).
                </p>
                <p className="text-gray-700 mb-6">
                  Learn to align your daily rhythms with nature's cycles, choose foods that
                  nourish your specific needs, and create sustainable practices that support
                  long-term health and vitality.
                </p>
                <Link
                  to="/ayurveda"
                  className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  Discover Ayurveda Integration
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>

          {/* Kosha Counseling */}
          <div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="text-emerald-600" size={40} />
                  <h3 className="text-emerald-700">Kosha Counseling</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  A profound exploration of the five layers (koshas) of your being: physical,
                  energetic, mental-emotional, wisdom, and bliss. This counseling approach
                  helps you understand and address imbalances at their deepest level.
                </p>
                <p className="text-gray-700 mb-6">
                  Through guided inquiry and contemplative practices, we work together to
                  uncover limiting beliefs, heal old wounds, and reconnect you with your
                  authentic self and innate wisdom.
                </p>
                <Link
                  to="/kosha-counseling"
                  className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  Learn About Kosha Counseling
                  <ArrowRight size={18} />
                </Link>
              </div>
              <div className="order-1 md:order-2 relative h-[350px] rounded-lg overflow-hidden shadow-lg">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1641391400871-3a6578a11d5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwbWVkaXRhdGlvbiUyMHBlYWNlZnVsfGVufDF8fHx8MTc2NDgzODczNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Meditation and mindfulness"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="mb-12 text-emerald-700 text-center">How We Work Together</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-emerald-700">1</span>
            </div>
            <h3 className="mb-3 text-emerald-700">Initial Consultation</h3>
            <p className="text-gray-600">
              We begin with a comprehensive assessment of your health history, current
              concerns, and wellness goals.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-emerald-700">2</span>
            </div>
            <h3 className="mb-3 text-emerald-700">Personalized Plan</h3>
            <p className="text-gray-600">
              Receive a customized wellness plan integrating yoga therapy, Ayurvedic
              recommendations, and kosha-based counseling.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-emerald-700">3</span>
            </div>
            <h3 className="mb-3 text-emerald-700">Ongoing Support</h3>
            <p className="text-gray-600">
              Regular sessions to refine practices, address challenges, and celebrate
              progress on your healing journey.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/book-meeting"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-full hover:bg-emerald-700 transition-colors"
          >
            Start Your Journey Today
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
