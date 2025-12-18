import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "../components/animations/Reveal";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function Services() {
  return (
    <div>

      {/* ================= HERO ================= */}
      <section className="bg-[#F5EBE8] py-24 text-center">
        <Reveal>
          <h1 className="text-[#A67365] mb-4 p-4">Services</h1>
          <p className="max-w-3xl mx-auto text-gray-700 leading-relaxed">
            Thoughtfully designed offerings that integrate Yoga Therapy,
            Ayurveda, and Kosha Counseling to support healing, resilience,
            and sustainable well-being.
          </p>
        </Reveal>
      </section>

      {/* ================= SERVICES GRID ================= */}
      <section className="max-w-7xl mx-auto p-4 px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-3 gap-12">

          {/* Service Card */}
          <Reveal delay={0.1}>
            <div className="bg-white rounded-2xl overflow-hidden shadow-md
                            hover:shadow-xl transition-all h-full flex flex-col">
              <div className="h-60 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?q=80&w=1200"
                  alt="Private wellness session"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="mb-4 text-[#A67365]">
                  1:1 Private Sessions
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Personalized one-to-one sessions integrating Yoga Therapy,
                  Ayurvedic lifestyle guidance, and Kosha-based inquiry to
                  address physical discomfort, emotional stress, and inner balance.
                </p>
                <span className="text-sm text-gray-500 mt-auto">
                  Available online & in-person
                </span>
              </div>
            </div>
          </Reveal>

          {/* Service Card */}
          <Reveal delay={0.2}>
            <div className="bg-white rounded-2xl overflow-hidden shadow-md
                            hover:shadow-xl transition-all h-full flex flex-col">
              <div className="h-60 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1607962837359-5e7e89f86776?q=80&w=1200"
                  alt="Healing programs"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="mb-4 text-[#A67365]">
                  Healing Programs
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Structured multi-week programs designed for deeper transformation,
                  combining movement, breath, nourishment, reflection, and integration
                  practices.
                </p>
                <span className="text-sm text-gray-500 mt-auto">
                  Short & long-term formats
                </span>
              </div>
            </div>
          </Reveal>

          {/* Service Card */}
          <Reveal delay={0.3}>
            <div className="bg-white rounded-2xl overflow-hidden shadow-md
                            hover:shadow-xl transition-all h-full flex flex-col">
              <div className="h-60 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200"
                  alt="Corporate wellness"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="mb-4 text-[#A67365]">
                  Corporate & Group Wellness
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Wellness workshops, talks, and group programs supporting
                  nervous system regulation, resilience, and mindful leadership
                  in organizations and communities.
                </p>
                <span className="text-sm text-gray-500 mt-auto">
                  On-site & virtual
                </span>
              </div>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 p-4 bg-gray-50 text-center">
        <Reveal>
          <h2 className="mb-4 p-4 text-[#A67365]">
            Unsure where to begin?
          </h2>
          <p className="mb-8 text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Begin with a complimentary consultation to explore your needs
            and discover the most supportive path forward.
          </p>
          <Link
            to="/book-meeting"
            className="inline-flex items-center gap-2 bg-[#A67365] text-white
                       px-8 py-3 rounded-full hover:bg-[#8B5E4F] transition-colors"
          >
            Book a Meeting
            <ArrowRight size={18} />
          </Link>
        </Reveal>
      </section>

    </div>
  );
}
