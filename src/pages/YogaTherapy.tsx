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
            therapeutic application of yogic techniques such as asanas, pranayama, mudras,
            mantras, meditation, yoga nidra, Ayurvedic practices and other holistic tools.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <Heart className="text-emerald-600 mb-4" size={32} />
            <h3 className="mb-3 text-emerald-700">Holistic & Personalized</h3>
            <p className="text-gray-600">
              Each Yoga Therapist brings their experience and expertise into each session,
              offering a holistic approach that complements medical and therapeutic care.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <Users className="text-emerald-600 mb-4" size={32} />
            <h3 className="mb-3 text-emerald-700">Multi-Dimensional Healing</h3>
            <p className="text-gray-600">
              Yoga therapy supports spiritual, emotional, mental, and physical healing,
              addressing the whole person.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <Calendar className="text-emerald-600 mb-4" size={32} />
            <h3 className="mb-3 text-emerald-700">Complementary Care</h3>
            <p className="text-gray-600">
              Yoga therapy works alongside doctors and holistic practitioners to support
              long-term well-being.
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

      {/* 🔹 Yoga Therapy Programs (NEW SECTION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="mb-4 text-emerald-700">Yoga Therapy Programs</h1>
             <p className="mb-8 opacity-90 max-w-2xl mx-auto">Changing For Your Health</p>
          <p className="text-gray-700">
            Our Yoga Therapy Programs offer a wide range of tools to support healing across
            mind, body, and spirit. Feeling off in any area of your life? Yoga Therapy can
            help you come home to yourself.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6 text-gray-700">
          <p>
            Depending on your needs, your program may include guided meditations, asana
            practices specific to your condition, mudras, mantras, pranayama, and other
            yogic tools that speak to all layers of your being.
          </p>

          <blockquote className="border-l-4 border-emerald-600 pl-4 italic text-emerald-700">
            “Yoga is not just repetition of a few postures—it is more about the exploration
            and discovery of the subtle energies of life.” — Amit Ray
          </blockquote>

          <h3 className="text-emerald-700 mt-8">
            Who Benefits Most from Yoga Therapy Programs?
          </h3>

          <p>
            You don’t need to be flexible or a certain age or body type. Sita designs
            programs specific to your needs—whether you’re working with digestive issues,
            anxiety, recovery, or seeking deeper spiritual connection.
          </p>

          <ul className="space-y-2">
            {[
              'Yoga Postures (Asana)',
              'Gestures (Mudras)',
              'Sacred Sound (Mantra)',
              'Breath Control (Pranayama)',
              'Meditation (Dhyāna)',
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="text-emerald-600 mt-1" size={20} />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p>
            Your personalized Yoga Therapy plan is created after intake and evolves with
            you. Whether you’re healing from chronic conditions, recovering from surgery,
            or seeking balance and strength, Sita meets you where you are and guides you
            forward.
          </p>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
            <h4 className="text-emerald-700 mb-2">Package Includes</h4>
            <ul className="space-y-2">
              <li>• Private asana & meditation classes</li>
              <li>• Ongoing personalized wellness plan</li>
              <li>• Hatha, Yin & Kundalini-based practices</li>
              <li>• Class recordings, mantra playlists & posture maps</li>
              <li>• Progress appointments and easy daily practices</li>
            </ul>
            <p className="mt-4">
              Initial session: <strong>$285</strong>. Package pricing varies based on
              frequency and duration.
            </p>
          </div>
        </div>
      </section>

      {/* CTA – Set Up a Call (UNCHANGED) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
