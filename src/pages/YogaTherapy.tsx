import { Link } from 'react-router-dom';
import { Heart, Users, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function YogaTherapy() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-teal-700/60 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1651077920873-ac1be1b82290"
          alt="Yoga therapy practice"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <h1 className="mb-4 text-white">What Is Yoga Therapy?</h1>
          <p className="text-white opacity-90">
            You Deserve to Feel Great. I’m Here to Help.
          </p>
        </div>
      </section>

      {/* Approach Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="mb-6 text-emerald-700">What Is Yoga Therapy?</h2>
          <p className="text-gray-700 mb-4">
            Yoga therapy is a self-empowering process that can be a complement to other
            modalities for healing an illness, preventative care, managing a chronic
            illness and will move the seeker towards growing in a multi-dimensional manner.
          </p>
          <p className="text-gray-700">
            Yoga Therapy is an emerging therapy in the world of holistic healing for the
            therapeutic application of yogic techniques such as, but not limited to; asanas
            (postures), pranayama (breathing), mantras, mudras, meditation, yoga nidra,
            sometimes Ayurvedic practices as well as other holistic practices.
          </p>
        </div>

        {/* Approach Details */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <Heart className="text-emerald-600 mb-4" size={32} />
            <h3 className="mb-3 text-emerald-700">Holistic & Personalized</h3>
            <p className="text-gray-600">
              Each Yoga Therapist brings their experience and expertise into each session,
              offering a holistic approach that is complementary to medical or other
              therapeutic care.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <Users className="text-emerald-600 mb-4" size={32} />
            <h3 className="mb-3 text-emerald-700">Multi-Dimensional Healing</h3>
            <p className="text-gray-600">
              Yoga therapy addresses the seeker spiritually, emotionally, and physically,
              supporting healing and growth on all levels.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <Calendar className="text-emerald-600 mb-4" size={32} />
            <h3 className="mb-3 text-emerald-700">Complementary Care</h3>
            <p className="text-gray-600">
              This approach works alongside medical professionals and holistic
              practitioners to support overall well-being.
            </p>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-emerald-700 text-center">
            Common Concerns Yoga Therapy Treats
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              'Feeling lost, blocked, stuck, or disconnected',
              'Grief, anxiety, overwhelm, and facing death',
              'Fibromyalgia, burnout, heart disease, and cancer recovery',
              'Joint issues, insomnia, and chronic physical conditions',
              'Addiction recovery and executive stress',
              'Caretaker burnout and eating disorders',
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Method */}
      <section className="bg-emerald-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-emerald-700 text-center">
            Is Yoga Therapy a Legitimate Treatment?
          </h2>
          <div className="max-w-3xl mx-auto space-y-6 text-gray-700">
            <p>
              Yoga Therapy is governed by The International Association of Yoga Therapists
              (IAYT). Founded in 1989, IAYT supports research and education in yoga and serves
              as a professional organization for yoga teachers and yoga therapists worldwide.
            </p>
            <p>
              IAYT has more than 5,000 members from over 50 countries and more than 150 member
              schools, with 66 accredited yoga therapy training programs as of 2021.
            </p>
            <p>
              The training to become a Certified Yoga Therapist (C-IAYT) is an 805-hour
              program. Sita Severson is completing her training through Soul of Yoga
              Institute in Encinitas, California.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 text-center text-white">
          <h2 className="mb-4 text-white">Set Up a Call</h2>
          <p className="mb-8 opacity-90 max-w-2xl mx-auto">
            Yoga Therapy is not a replacement for medical support. You will receive a
            personalized wellness plan to support your physical, emotional, and spiritual
            well-being.
          </p>
          <Link
            to="/book-meeting"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 px-8 py-3 rounded-full hover:bg-emerald-50 transition-colors"
          >
            Book a Meeting
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
