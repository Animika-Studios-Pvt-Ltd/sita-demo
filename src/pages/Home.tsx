import { Link } from 'react-router-dom';
import { Heart, Leaf, Brain, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import Reveal from "../components/animations/Reveal";
import ParallaxImage from "../components/animations/ParallaxImage";

export function Home() {
  return (
    <div>

      {/* ================= HERO BANNER ================= */}
      <section className="relative h-[600px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#7D5347]/80 to-[#A67365]/60 z-10" />

        <ParallaxImage>
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1641391400871-3a6578a11d5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Peaceful meditation"
            className="w-full h-full object-cover scale-110"
          />
        </ParallaxImage>

        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <Reveal>
            <h1 className="mb-6 text-white">
              Transform Your Life Through Holistic Wellness
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mb-8 opacity-90 max-w-2xl mx-auto">
              Experience the power of integrated Yoga Therapy, Ayurveda, and Kosha Counseling
              to achieve balance, healing, and authentic well-being.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <Link
              to="/book-meeting"
              className="inline-flex items-center gap-2 bg-white text-[#A67365]
                         px-8 py-3 rounded-full hover:scale-105 transition-all"
            >
              Book Your Consultation
              <ArrowRight size={20} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ================= MEET SITA ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          <Reveal>
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
                className="inline-flex items-center gap-2 text-[#A67365]
                           hover:text-[#8B5E4F] transition-colors"
              >
                Learn More About Sita
                <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1551992315-907fbf183932?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Wellness and nature"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </Reveal>

        </div>
      </section>

      {/* ================= THE SITA FACTOR ================= */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <Reveal>
            <div className="text-center mb-12">
              <h2 className="mb-4 text-[#A67365]">The Sita Factor</h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                A comprehensive approach to wellness that integrates three powerful modalities
                to support your complete transformation.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Yoga Therapy */}
            <Reveal delay={0.1}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden group
                              hover:-translate-y-2 hover:shadow-xl transition-all">
                <div className="relative h-48">
                  <ParallaxImage strength={60}>
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1651077920873-ac1be1b82290?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                      alt="Yoga therapy practice"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
                    />
                  </ParallaxImage>
                </div>
                <div className="p-6">
                  <h3 className="mb-3 text-[#A67365]">Yoga Therapy Programs</h3>
                  <p className="text-gray-600 mb-4">
                    Evidence-based therapeutic yoga tailored to your unique needs.
                  </p>
                  <Link to="/yoga-therapy" className="inline-flex items-center gap-2 text-[#A67365]">
                    Explore Programs <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Ayurveda */}
            <Reveal delay={0.2}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden group
                              hover:-translate-y-2 hover:shadow-xl transition-all">
                <div className="relative h-48">
                  <ParallaxImage strength={60}>
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1667904498869-933d459ddb1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                      alt="Ayurveda herbs"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
                    />
                  </ParallaxImage>
                </div>
                <div className="p-6">
                  <h3 className="mb-3 text-[#A67365]">Ayurveda Integration</h3>
                  <p className="text-gray-600 mb-4">
                    Personalized nutrition and lifestyle guidance rooted in Ayurveda.
                  </p>
                  <Link to="/ayurveda" className="inline-flex items-center gap-2 text-[#A67365]">
                    Learn More <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Kosha */}
            <Reveal delay={0.3}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden group
                              hover:-translate-y-2 hover:shadow-xl transition-all">
                <div className="relative h-48">
                  <ParallaxImage strength={60}>
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1556832647-5b857ebd06e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                      alt="Kosha counseling"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
                    />
                  </ParallaxImage>
                </div>
                <div className="p-6">
                  <h3 className="mb-3 text-[#A67365]">Kosha Counseling</h3>
                  <p className="text-gray-600 mb-4">
                    Explore the five layers of being to unlock your full potential.
                  </p>
                  <Link to="/kosha-counseling" className="inline-flex items-center gap-2 text-[#A67365]">
                    Discover More <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <Reveal>
            <div className="text-center mb-12">
              <h2 className="mb-4 text-[#A67365]">Services</h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Personalized offerings designed to support healing, growth, and transformation.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">

            <Reveal delay={0.1}>
              <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all">
                <h3 className="mb-3 text-[#A67365]">1:1 Private Sessions</h3>
                <p className="text-gray-600 mb-4">
                  Individualized Yoga Therapy, Ayurveda, or Kosha Counseling sessions.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all">
                <h3 className="mb-3 text-[#A67365]">Packages & Programs</h3>
                <p className="text-gray-600 mb-4">
                  Multi-session healing journeys designed for deep and lasting change.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all">
                <h3 className="mb-3 text-[#A67365]">Corporate & Group Wellness</h3>
                <p className="text-gray-600 mb-4">
                  Workshops and programs for teams, organizations, and communities.
                </p>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ================= EVENTS ================= */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <Reveal>
            <div className="text-center mb-12">
              <h2 className="mb-4 text-[#A67365]">Events & Workshops</h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Join upcoming retreats, workshops, and live experiences.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">

            <Reveal delay={0.1}>
              <div className="bg-white rounded-xl p-6 shadow-md hover:-translate-y-1 transition-all">
                <h3 className="text-[#A67365] mb-2">Seasonal Wellness Retreat</h3>
                <p className="text-gray-600 mb-3">
                  A multi-day immersive retreat focused on rest, nourishment, and renewal.
                </p>
                <span className="text-sm text-gray-500">Upcoming</span>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="bg-white rounded-xl p-6 shadow-md hover:-translate-y-1 transition-all">
                <h3 className="text-[#A67365] mb-2">Online Healing Circles</h3>
                <p className="text-gray-600 mb-3">
                  Guided group sessions exploring the koshas and mindful practices.
                </p>
                <span className="text-sm text-gray-500">Monthly</span>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="bg-white rounded-xl p-6 shadow-md hover:-translate-y-1 transition-all">
                <h3 className="text-[#A67365] mb-2">Guest Talks & Teaching</h3>
                <p className="text-gray-600 mb-3">
                  Speaking engagements, podcasts, and guest teaching sessions.
                </p>
                <span className="text-sm text-gray-500">By Invitation</span>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Reveal>
          <div className="bg-gradient-to-r from-[#A67365] to-[#8B5E4F]
                          rounded-2xl p-12 text-center text-white">
            <h2 className="mb-4 text-white">Ready to Begin Your Journey?</h2>
            <p className="mb-8 opacity-90 max-w-2xl mx-auto">
              Schedule a complimentary consultation to discuss your wellness goals.
            </p>
            <Link
              to="/book-meeting"
              className="inline-flex items-center gap-2 bg-white text-[#A67365]
                         px-8 py-3 rounded-full hover:scale-105 transition-all"
            >
              Book Your Free Consultation
              <ArrowRight size={20} />
            </Link>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
