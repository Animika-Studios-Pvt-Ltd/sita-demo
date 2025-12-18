import { Award, BookOpen, Heart, Users } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function AboutSita() {
  const certifications = [
    {
      title: 'Master Ayurvedic Digestion & Nutrition (500 hr)',
      organization: 'Advanced Professional Training',
      year: '2023–2024',
    },
    {
      title: 'Ayurvedic Panchakarma',
      organization: 'Clinical Ayurvedic Therapies',
      year: '2023–2024',
    },
    {
      title: 'Yoga Therapist – IAYT (800 hr)',
      organization: 'International Association of Yoga Therapists',
      year: '2021–2023',
    },
    {
      title: 'Clinical Ayurveda',
      organization: 'Advanced Ayurvedic Studies',
      year: '2021–2023',
    },
    {
      title: 'Marma Point Therapy (100 hr)',
      organization: 'AyurPrana – Dr. Vasant Lad',
      year: '2022',
    },
    {
      title: 'Holy Fire Reiki Master',
      organization: 'International Reiki Training',
      year: '2022',
    },
    {
      title: 'Kundalini Yoga – 200 hr',
      organization: 'The Soul of Yoga, San Diego',
      year: '2020',
    },
    {
      title: 'Restorative Yoga – 50 hr',
      organization: 'Yoga Teacher Training',
      year: '2020',
    },
    {
      title: 'Western Herbalism',
      organization: 'Herbal Medicine Studies',
      year: '2019',
    },
    {
      title: 'Ayurvedic Lifestyle – 200 hr',
      organization: 'Yama Institute, Maryland',
      year: '2007',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-teal-700/60 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1551992315-907fbf183932?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="Wellness therapy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <h1 className="mb-4 text-white">Sita Severson</h1>
          <p className="text-white opacity-90">
            R.A.Y.T., C-IAYT, R.A.P., RYT-500, YACEP
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[500px] rounded-lg overflow-hidden shadow-lg">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1641391400871-3a6578a11d5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Peaceful meditation practice"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="mb-6 text-emerald-700">About Sita Severson</h2>

            <p className="text-gray-700 mb-4">
              Sita began her career in the wellness industry in 2000 as an
              Esthetician, working in day spas and as a top freelance makeup
              artist on film sets, runway shows, and bridal events across
              Baltimore, Maryland. Her passion for wellness as a business led
              her to help a struggling spa grow and thrive, as well as to
              develop a natural skincare and makeup line.
            </p>

            <p className="text-gray-700 mb-4">
              By 2005, Sita was ready to deepen her education and began studying
              with Yama Therapeutics. She became a yoga asana instructor and
              pursued extensive training in Ayurveda, meditation, and
              breathing techniques. In 2007, she established her Ayurvedic
              Lifestyle Coaching practice.
            </p>

            <p className="text-gray-700">
              Her work expanded into hospitals, universities, senior centers,
              and conscious corporations. She taught mindfulness and yoga at
              Johns Hopkins University and Hospital, supported oncology staff
              with burnout prevention, and created wellness curriculums for
              the Baltimore County Department of Aging.
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Bio */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-emerald-700 text-center">
            Philosophy & Approach
          </h2>

          <div className="space-y-6 text-gray-700">
            <p>
              Sita is an Ayurvedic Yoga Therapist, Certified Yoga Therapist
              (C-IAYT), Ayurvedic Practitioner, and plant-based culinarian. Her
              work blends Ayurveda, Yoga Therapy, meditation, somatic movement,
              and spiritual counseling.
            </p>

            <p>
              Since establishing her practice in 2007, she has worked with
              thousands of individuals worldwide and is a published author and
              a beloved teacher on The Shift Network and Wisdom From North.
            </p>

            <blockquote className="border-l-4 border-emerald-600 pl-4 italic text-emerald-700">
              “So often we want to change, but we don’t want to be inconvenienced
              by it.”
            </blockquote>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Heart className="text-emerald-600 mb-3" size={32} />
              <h3 className="mb-2 text-emerald-700">Compassionate Care</h3>
              <p className="text-gray-600">
                Creating safe, supportive spaces for deep and lasting healing.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <BookOpen className="text-emerald-600 mb-3" size={32} />
              <h3 className="mb-2 text-emerald-700">Rooted Wisdom</h3>
              <p className="text-gray-600">
                Integrating ancient Ayurvedic and yogic traditions into modern life.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Users className="text-emerald-600 mb-3" size={32} />
              <h3 className="mb-2 text-emerald-700">Leadership & Community</h3>
              <p className="text-gray-600">
                Supporting individuals, teams, and organizations in wellbeing.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Award className="text-emerald-600 mb-3" size={32} />
              <h3 className="mb-2 text-emerald-700">Depth of Training</h3>
              <p className="text-gray-600">
                Over two decades of study, practice, and teaching experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="mb-12 text-emerald-700 text-center">
          History of Sita’s Training
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <Award className="text-emerald-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="mb-2 text-emerald-700">{cert.title}</h3>
                  <p className="text-gray-600 mb-1">{cert.organization}</p>
                  <p className="text-gray-500">{cert.year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
