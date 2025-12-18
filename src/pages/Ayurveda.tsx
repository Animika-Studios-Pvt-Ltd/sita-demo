import { Link } from 'react-router-dom';
import { Leaf, Sun, Moon, Wind, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Ayurveda() {
  const doshas = [
    {
      name: 'Ayurvedic Nutrition',
      elements: 'Food & Cooking',
      icon: Wind,
      qualities: ['Healing', 'Supportive', 'Personalized'],
      imbalances: ['IBS', 'Constipation', 'Gas & Bloating'],
    },
    {
      name: 'Lifestyle Integration',
      elements: 'Daily Practices',
      icon: Sun,
      qualities: ['Grounding', 'Sustainable', 'Nourishing'],
      imbalances: ['Insomnia', 'Chronic Fatigue', 'Burnout'],
    },
    {
      name: 'Whole-Person Care',
      elements: 'Mind + Body',
      icon: Moon,
      qualities: ['Balanced', 'Compassionate', 'Empowering'],
      imbalances: ['Weight Issues', 'Acid Reflux', 'Stress'],
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-orange-700/60 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1667904498869-933d459ddb1f"
          alt="Ayurveda herbs and wellness"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <h1 className="mb-4 text-white">
            Ayurveda Nutrition & Lifestyle Integration
          </h1>
         <p className="mb-8 opacity-90 max-w-2xl mx-auto">
            Changing for your health
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="mb-6 text-emerald-700">
            Are You Looking for a New Approach to Eating?
          </h2>
          <p className="text-gray-700 mb-4">
            Are you looking for a new approach to eating so you can feel your best?
            Are you currently working with an Ayurvedic Doctor? Do you feel lost where
            and how to start eating and living a new way?
          </p>
          <p className="text-gray-700">
            The paradox about Ayurveda is its simplicity and how complex starting out
            can feel—even with a list of foods best for your condition and goals.
            You might be feeling overwhelmed. You might be feeling lost.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1551992315-907fbf183932"
              alt="Natural wellness"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="mb-4 text-emerald-700">A Loving & Supportive Approach</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
                <p className="text-gray-700">
                  Sita partners with clients to change the trajectory of their life
                  in a loving and easy way.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
                <p className="text-gray-700">
                  “Ayurveda teaches us to cherish our innate nature—to love and honor
                  who we are, not who we think we should be.” — Maya Tiwari
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-emerald-700 text-center">
            Who Is Ayurveda Integration Best For?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              'New diagnosis from a doctor',
              'Understanding complicated treatment plans',
              'Daily practices and lifestyle changes',
              'Food, cooking, and supplement guidance',
              'Ayurvedic nutrition vs mainstream nutrition',
              'Digestive, fatigue, sleep, and weight concerns',
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="mb-12 text-emerald-700 text-center">
          Nutrition, Menus & Healing Support
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <Leaf className="text-emerald-600 mb-4" size={36} />
            <h3 className="mb-3 text-emerald-700">
              Ayurvedic Nutrition & Menu Planning
            </h3>
            <p className="text-gray-700 mb-4">
              IBS, constipation, weight issues, chronic fatigue, gas/bloating,
              insomnia, and acid reflux are some of the common issues Sita helps
              clients overcome. Just want to feel your best? Sita’s got you!
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <Leaf className="text-emerald-600 mb-4" size={36} />
            <h3 className="mb-3 text-emerald-700">
              Food as Medicine
            </h3>
            <p className="text-gray-700 mb-4">
              Food truly is medicine and has the capacity to heal you—just as
              lifestyle choices do. Ayurveda allows healing without feeling
              restricted or deprived.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <Leaf className="text-emerald-600 mb-4" size={36} />
            <h3 className="mb-3 text-emerald-700">
              Cooking Hacks & Ease
            </h3>
            <p className="text-gray-700 mb-4">
              Enjoy delicious, simple recipes and lifestyle nuances that change
              everything. You’ll receive hacks and tips to make cooking easy
              and not time-consuming.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <Leaf className="text-emerald-600 mb-4" size={36} />
            <h3 className="mb-3 text-emerald-700">
              Personalized Treatment Plan
            </h3>
            <p className="text-gray-700 mb-4">
              A comprehensive and manageable plan that integrates seamlessly
              into your life and evolves as you heal.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-12 text-center text-white">
          <h2 className="mb-4 text-white">Book an Appointment</h2>
          <p className="mb-8 opacity-90 max-w-2xl mx-auto">
            Package of 4 sessions $1160 (usable within one year). Includes two
            specialized menus. 8-week option available for $2100.
            Partner, group, and family pricing available.
          </p>
          <Link
            to="/book-meeting"
            className="inline-flex items-center gap-2 bg-white text-amber-700 px-8 py-3 rounded-full hover:bg-amber-50 transition-colors"
          >
            Book Now
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
