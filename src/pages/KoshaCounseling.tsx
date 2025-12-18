import { Link } from 'react-router-dom';
import { Brain, Layers, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function KoshaCounseling() {
  const koshas = [
    {
      name: 'Annamaya Kosha',
      translation: 'Physical Sheath',
      description:
        'The outermost layer, Annamaya Kosha, is the physical body. Composed of food and matter, it includes our skin, muscles, bones, and all physical attributes. This sheath is nourished and sustained by the food we eat.',
      practices: 'Physical health, nutrition and diet, exercise and bodily care',
    },
    {
      name: 'Pranamaya Kosha',
      translation: 'Energy Sheath',
      description:
        'The energy body that governs breath, vitality, and life force, influencing how energy flows through the physical body.',
      practices: 'Breath awareness, energetic balance, vitality practices',
    },
    {
      name: 'Manomaya Kosha',
      translation: 'Mental / Emotional Sheath',
      description:
        'The layer of thoughts, emotions, and mental patterns that shape perception and emotional experience.',
      practices: 'Emotional awareness, mental clarity, mindfulness',
    },
    {
      name: 'Vijnanamaya Kosha',
      translation: 'Wisdom Sheath',
      description:
        'The layer of discernment, intuition, and inner knowing that guides wise choices and insight.',
      practices: 'Self-inquiry, intuition development, reflection',
    },
    {
      name: 'Anandamaya Kosha',
      translation: 'Bliss Sheath',
      description:
        'The innermost layer of joy and inner peace, where we experience connection to our true nature beyond the material world.',
      practices: 'Meditation, inner stillness, spiritual connection',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-indigo-700/60 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1556832647-5b857ebd06e9"
          alt="Mindfulness and meditation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <h1 className="mb-4 text-white">Kosha Counseling</h1>
          <p className="text-white opacity-90">
            Deeper through the layers
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="mb-6 text-emerald-700">Understanding the Koshas</h2>
          <p className="text-gray-700 mb-4">
            The koshas, a concept from ancient Vedantic philosophy, represent the five layers
            or sheaths that envelop the true self, known as the Atman. These layers help us
            understand different aspects of our being, from the physical to the spiritual.
          </p>
          <p className="text-gray-700">
            The focus of Kosha counseling is on the energy, mental, wisdom, and bliss layers.
            By understanding and working through all five koshas, we journey toward
            self-realization and uncover the true essence of our being.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1641391400871-3a6578a11d5a"
              alt="Peaceful meditation"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="mb-4 text-emerald-700">A Journey Inward</h3>
            <p className="text-gray-700 mb-4">
              Dive deeper into the koshas and discover how they influence your daily life.
              Whether you’re seeking physical wellness, mental clarity, or spiritual
              connection, this work offers a pathway toward balance.
            </p>
            <p className="text-gray-700">
              “When we listen to the inner wisdom of our heart and soul, we are guided to live
              in harmony with the rhythms of nature.” — Maya Tiwari
            </p>
          </div>
        </div>
      </section>

      {/* The Five Koshas */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-emerald-700 text-center">
            What Are the Different Koshas?
          </h2>

          <div className="space-y-8">
            {koshas.map((kosha, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-700">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-emerald-700">{kosha.name}</h3>
                        <p className="text-gray-600">{kosha.translation}</p>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-700 mb-3">{kosha.description}</p>
                    <p className="text-gray-600">
                      <span className="text-gray-500">Focus:</span> {kosha.practices}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="mb-12 text-emerald-700 text-center">
          What Is the Benefit of Kosha Counseling?
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <Layers className="text-emerald-600 mb-3" size={32} />
              <p className="text-gray-700">
                The koshas offer a holistic framework for understanding human existence beyond
                the physical body, allowing you to address imbalances and cultivate harmony
                within.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <Brain className="text-emerald-600 mb-3" size={32} />
              <p className="text-gray-700">
                This integrative approach supports emotional stability, mental clarity,
                spiritual fulfillment, and stress reduction through practices such as
                meditation, pranayama, and mindfulness.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <Sparkles className="text-emerald-600 mb-3" size={32} />
              <p className="text-gray-700">
                As balance deepens, you may experience greater empathy, compassion, purpose,
                and fulfillment, empowering you to take charge of your own well-being.
              </p>
            </div>
          </div>

          <div>
            <p className="text-gray-700 mb-6">
              Exploring the deeper layers of the koshas helps clear emotional, mental, and
              spiritual debris that may cloud intuition. This work invites profound personal
              growth and transformation.
            </p>
            <p className="text-gray-700">
              As you become more centered, relationships improve and life aligns more
              naturally with your inner values and wisdom.
            </p>
          </div>
        </div>
      </section>

      {/* Package */}
      <section className="bg-emerald-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-emerald-700 text-center">Package Includes</h2>

          <p className="text-gray-700 mb-6">
            Sita uses a Kosha Dyad method to guide you deeper into reflection and intuitive
            awareness, helping clear blocks that may limit your growth.
          </p>

          <ul className="space-y-3 text-gray-700 mb-6">
            <li>• Three-month commitment beginning with an initial intake</li>
            <li>• Weekly, bi-weekly, or four-session packages available</li>
            <li>• Cost ranges from $1750 – $2999</li>
          </ul>

          <p className="text-gray-700">
            Receive support through life transitions and as you cross the threshold toward
            your next breakthrough.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="mb-4 text-white">Book an Appointment</h2>
          <p className="mb-8 opacity-90 max-w-2xl mx-auto">
            Access intuitive tools, guided sessions, optional recordings, and ongoing
            support as you awaken all layers of yourself.
          </p>
          <Link
            to="/book-meeting"
            className="inline-flex items-center gap-2 bg-white text-purple-700 px-8 py-3 rounded-full hover:bg-purple-50 transition-colors"
          >
            Book Now
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
