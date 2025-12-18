import { Link } from 'react-router-dom';
import { Leaf, Sun, Moon, Wind, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Ayurveda() {
  const doshas = [
    {
      name: 'Vata',
      elements: 'Air + Ether',
      icon: Wind,
      qualities: ['Creative', 'Energetic', 'Quick-thinking'],
      imbalances: ['Anxiety', 'Insomnia', 'Digestive issues'],
    },
    {
      name: 'Pitta',
      elements: 'Fire + Water',
      icon: Sun,
      qualities: ['Focused', 'Ambitious', 'Warm'],
      imbalances: ['Inflammation', 'Anger', 'Skin issues'],
    },
    {
      name: 'Kapha',
      elements: 'Earth + Water',
      icon: Moon,
      qualities: ['Calm', 'Stable', 'Nurturing'],
      imbalances: ['Weight gain', 'Lethargy', 'Congestion'],
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-orange-700/60 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1667904498869-933d459ddb1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxheXVydmVkYSUyMGhlcmJzJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzY0ODM2NTY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Ayurveda herbs and wellness"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <h1 className="mb-4 text-white">Ayurveda Integration</h1>
          <p className="text-white opacity-90">
            Ancient wisdom for modern wellness through personalized nutrition and lifestyle
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="mb-6 text-emerald-700">What is Ayurveda?</h2>
          <p className="text-gray-700 mb-4">
            Ayurveda, meaning "science of life," is a 5,000-year-old holistic healing system 
            from India that recognizes each person's unique constitution and provides 
            personalized guidelines for achieving optimal health.
          </p>
          <p className="text-gray-700">
            Rather than a one-size-fits-all approach, Ayurveda teaches us to understand our 
            individual nature and make choices that support our unique balance, from the foods 
            we eat to our daily routines and lifestyle practices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1551992315-907fbf183932?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMHRoZXJhcHklMjBuYXR1cmV8ZW58MXx8fHwxNzY0ODM4NzM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Natural wellness"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="mb-4 text-emerald-700">Core Principles</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <p className="text-gray-700">
                    <strong>Unique Constitution:</strong> Everyone has a distinct combination 
                    of energies (doshas) that determine their physical, mental, and emotional 
                    characteristics.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <p className="text-gray-700">
                    <strong>Balance is Health:</strong> Wellness comes from maintaining balance 
                    in our doshas, digestion, and elimination.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <p className="text-gray-700">
                    <strong>Prevention First:</strong> Ayurveda emphasizes preventing disease 
                    through healthy daily routines and seasonal practices.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <p className="text-gray-700">
                    <strong>Food as Medicine:</strong> Proper nutrition tailored to your 
                    constitution is the foundation of health.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Three Doshas */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-emerald-700">Understanding Your Dosha</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              The three doshas—Vata, Pitta, and Kapha—are fundamental energies that govern 
              all biological, psychological, and physiological functions in the body and mind.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {doshas.map((dosha, index) => {
              const Icon = dosha.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-md p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="text-amber-600" size={36} />
                    <div>
                      <h3 className="text-emerald-700">{dosha.name}</h3>
                      <p className="text-gray-500">{dosha.elements}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-gray-700 mb-2">Balanced Qualities:</h4>
                    <ul className="space-y-1">
                      {dosha.qualities.map((quality, qIndex) => (
                        <li key={qIndex} className="text-gray-600 flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                          {quality}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-gray-700 mb-2">Common Imbalances:</h4>
                    <ul className="space-y-1">
                      {dosha.imbalances.map((imbalance, iIndex) => (
                        <li key={iIndex} className="text-gray-600">
                          • {imbalance}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center bg-amber-50 border border-amber-200 rounded-lg p-6">
            <p className="text-gray-700">
              Most people have a unique combination of all three doshas. Understanding your 
              personal constitution helps you make informed choices for optimal health.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="mb-12 text-emerald-700 text-center">Ayurvedic Services</h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <Leaf className="text-emerald-600 mb-4" size={36} />
            <h3 className="mb-3 text-emerald-700">Constitutional Assessment</h3>
            <p className="text-gray-700 mb-4">
              Comprehensive dosha assessment to determine your unique constitution and current 
              state of balance. Includes detailed questionnaire and personalized consultation.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-1" />
                <span>Prakriti (natural constitution) evaluation</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-1" />
                <span>Vikriti (current imbalance) assessment</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-1" />
                <span>Personalized recommendations report</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <Leaf className="text-emerald-600 mb-4" size={36} />
            <h3 className="mb-3 text-emerald-700">Nutrition & Lifestyle Counseling</h3>
            <p className="text-gray-700 mb-4">
              Personalized guidance on food choices, meal planning, eating habits, and lifestyle 
              practices aligned with your constitution and health goals.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-1" />
                <span>Customized food guidelines</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-1" />
                <span>Seasonal eating recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-1" />
                <span>Daily routine (dinacharya) design</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <Leaf className="text-emerald-600 mb-4" size={36} />
            <h3 className="mb-3 text-emerald-700">Herbal Support</h3>
            <p className="text-gray-700 mb-4">
              Recommendations for traditional Ayurvedic herbs and formulations to support your 
              specific health needs and restore balance.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-1" />
                <span>Personalized herbal protocols</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-1" />
                <span>Guidance on safe, effective use</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-1" />
                <span>Quality herb sourcing recommendations</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <Leaf className="text-emerald-600 mb-4" size={36} />
            <h3 className="mb-3 text-emerald-700">Seasonal Cleansing Programs</h3>
            <p className="text-gray-700 mb-4">
              Guided detoxification and rejuvenation programs designed to reset your system 
              and align with seasonal changes.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-1" />
                <span>Gentle, sustainable cleanse protocols</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-1" />
                <span>Daily guidance and support</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-1" />
                <span>Post-cleanse integration plan</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Integration with Therapy */}
      <section className="bg-emerald-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-emerald-700 text-center">Integration with Yoga Therapy</h2>
          <p className="text-gray-700 mb-6">
            Ayurveda and Yoga are sister sciences that work beautifully together. When combined 
            with yoga therapy practices, Ayurvedic recommendations create a comprehensive 
            approach to healing and transformation.
          </p>
          <p className="text-gray-700 mb-6">
            Your personalized yoga therapy program will take into account your Ayurvedic 
            constitution, ensuring that all practices—from movement to breathwork to 
            meditation—support your unique needs and restore balance at every level.
          </p>
          <div className="bg-white rounded-lg p-6 border border-emerald-200">
            <h3 className="mb-4 text-emerald-700">Example Integration:</h3>
            <p className="text-gray-700">
              If you have a Vata imbalance (characterized by anxiety, irregular digestion, 
              and restlessness), your program might include grounding yoga practices, 
              calming breathwork, warming and nourishing foods, regular routines, and 
              specific herbs to calm the nervous system.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-12 text-center text-white">
          <h2 className="mb-4 text-white">Discover Your Unique Constitution</h2>
          <p className="mb-8 opacity-90 max-w-2xl mx-auto">
            Schedule a consultation to learn about your dosha and receive personalized 
            Ayurvedic recommendations for optimal health and vitality.
          </p>
          <Link
            to="/book-meeting"
            className="inline-flex items-center gap-2 bg-white text-amber-700 px-8 py-3 rounded-full hover:bg-amber-50 transition-colors"
          >
            Book Your Consultation
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
