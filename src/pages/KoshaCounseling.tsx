import { Link } from 'react-router-dom';
import { Brain, Layers, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function KoshaCounseling() {
  const koshas = [
    {
      name: 'Annamaya Kosha',
      translation: 'Physical Body',
      description: 'The outermost layer composed of food and physical matter. Relates to our physical health, structure, and bodily sensations.',
      practices: 'Asana (yoga postures), nutrition, proper rest',
    },
    {
      name: 'Pranamaya Kosha',
      translation: 'Energy Body',
      description: 'The vital energy layer that animates the physical body. Includes breath, circulation, and life force.',
      practices: 'Pranayama (breathwork), energy practices, movement',
    },
    {
      name: 'Manomaya Kosha',
      translation: 'Mental-Emotional Body',
      description: 'The layer of thoughts, emotions, and sensory processing. Our reactive mind and emotional patterns.',
      practices: 'Mindfulness, emotional regulation, sensory awareness',
    },
    {
      name: 'Vijnanamaya Kosha',
      translation: 'Wisdom Body',
      description: 'The layer of intuition, discernment, and higher knowledge. Our capacity to witness and understand.',
      practices: 'Meditation, self-inquiry, contemplation',
    },
    {
      name: 'Anandamaya Kosha',
      translation: 'Bliss Body',
      description: 'The innermost layer of pure consciousness and joy. Our true nature beyond all conditioning.',
      practices: 'Deep meditation, yoga nidra, self-realization',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-indigo-700/60 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1556832647-5b857ebd06e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5kZnVsbmVzcyUyMG1lZGl0YXRpb24lMjBzdG9uZXN8ZW58MXx8fHwxNzY0ODM4NzM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Mindfulness and meditation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <h1 className="mb-4 text-white">Kosha Counseling</h1>
          <p className="text-white opacity-90">
            Journey through the five layers of being to discover your authentic self
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="mb-6 text-emerald-700">What is Kosha Counseling?</h2>
          <p className="text-gray-700 mb-4">
            Kosha Counseling is a profound approach to self-exploration and healing based on 
            the ancient yogic model of the Pancha Koshas, or five layers of being. This model 
            recognizes that we are multi-dimensional beings, and true transformation requires 
            addressing all aspects of our existence.
          </p>
          <p className="text-gray-700">
            Unlike traditional talk therapy that focuses primarily on the mind, Kosha 
            Counseling guides you through all five layers—from the physical body to the 
            innermost essence of pure consciousness—helping you identify and heal imbalances 
            at their root.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1641391400871-3a6578a11d5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwbWVkaXRhdGlvbiUyMHBlYWNlZnVsfGVufDF8fHx8MTc2NDgzODczNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Peaceful meditation"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="mb-4 text-emerald-700">A Holistic Approach</h3>
            <p className="text-gray-700 mb-4">
              Many challenges we face—anxiety, depression, lack of purpose, chronic stress, 
              relationship difficulties—have roots that extend beyond the mental-emotional 
              layer. They may originate in physical imbalances, energetic blockages, or 
              disconnection from our deeper wisdom.
            </p>
            <p className="text-gray-700 mb-4">
              By systematically exploring each kosha, we uncover where imbalances truly exist 
              and develop targeted practices to restore harmony at every level. This creates 
              lasting change that addresses the whole person.
            </p>
          </div>
        </div>
      </section>

      {/* The Five Koshas */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-emerald-700 text-center">The Five Layers of Being</h2>
          <div className="space-y-8">
            {koshas.map((kosha, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                      <span className="text-gray-500">Practices:</span> {kosha.practices}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
            <p className="text-gray-700">
              <strong>Important:</strong> While presented sequentially, the koshas are 
              interconnected and influence each other. Work in one layer naturally affects 
              the others, creating comprehensive healing.
            </p>
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="mb-12 text-emerald-700 text-center">The Counseling Process</h2>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="mb-6 text-emerald-700">What to Expect</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="text-gray-700 mb-1">Initial Assessment</h4>
                  <p className="text-gray-600">
                    We begin with a comprehensive exploration of your current challenges, 
                    life circumstances, and goals, mapping them to the kosha model.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="text-gray-700 mb-1">Layer-by-Layer Exploration</h4>
                  <p className="text-gray-600">
                    Through guided inquiry, somatic awareness, and contemplative practices, 
                    we explore each layer to identify imbalances and resources.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="text-gray-700 mb-1">Personalized Practices</h4>
                  <p className="text-gray-600">
                    Receive specific practices tailored to address imbalances in each kosha, 
                    from physical techniques to meditation and self-inquiry.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="text-gray-700 mb-1">Integration & Insight</h4>
                  <p className="text-gray-600">
                    As we work through the layers, new insights emerge about patterns, 
                    beliefs, and possibilities for authentic living.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="text-gray-700 mb-1">Ongoing Support</h4>
                  <p className="text-gray-600">
                    Regular sessions provide space to process experiences, refine practices, 
                    and deepen your understanding of yourself.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-emerald-700">Benefits of Kosha Counseling</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <Layers className="text-emerald-600 mb-3" size={32} />
              <h4 className="text-gray-700 mb-2">Holistic Understanding</h4>
              <p className="text-gray-600">
                Gain a comprehensive understanding of yourself and the interconnected nature 
                of your challenges and strengths.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <Brain className="text-emerald-600 mb-3" size={32} />
              <h4 className="text-gray-700 mb-2">Root Cause Healing</h4>
              <p className="text-gray-600">
                Address issues at their source rather than just managing symptoms, creating 
                lasting transformation.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <Sparkles className="text-emerald-600 mb-3" size={32} />
              <h4 className="text-gray-700 mb-2">Authentic Living</h4>
              <p className="text-gray-600">
                Reconnect with your true nature and live from a place of authenticity, 
                clarity, and purpose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Benefits */}
      <section className="bg-emerald-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-emerald-700 text-center">Who Benefits from Kosha Counseling?</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              'Individuals seeking deeper self-understanding',
              'Those feeling disconnected from their authentic self',
              'People experiencing existential or spiritual questions',
              'Anyone dealing with recurring patterns or behaviors',
              'Individuals in major life transitions',
              'Those seeking purpose and meaning',
              'People who want to integrate mind, body, and spirit',
              'Anyone ready for profound personal transformation',
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Session Format */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="mb-8 text-emerald-700 text-center">Session Format</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <p className="text-gray-700 mb-4">
            Kosha Counseling sessions are typically 75-90 minutes and may include:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
              <span>Guided exploration through dialogue and inquiry</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
              <span>Somatic awareness practices to connect with the body</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
              <span>Breathwork and meditation techniques</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
              <span>Contemplative exercises and journaling prompts</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
              <span>Integration practices for daily life</span>
            </li>
          </ul>
          <p className="text-gray-700 mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
            Sessions are conducted in a safe, confidential space with deep respect for your 
            unique journey. This work is not about fixing or changing you, but about 
            uncovering and reconnecting with who you truly are.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="mb-4 text-white">Begin Your Journey of Self-Discovery</h2>
          <p className="mb-8 opacity-90 max-w-2xl mx-auto">
            Schedule a consultation to explore how Kosha Counseling can support your path 
            to wholeness and authentic living.
          </p>
          <Link
            to="/book-meeting"
            className="inline-flex items-center gap-2 bg-white text-purple-700 px-8 py-3 rounded-full hover:bg-purple-50 transition-colors"
          >
            Book Your Consultation
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
