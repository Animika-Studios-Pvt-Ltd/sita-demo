import Reveal from "../components/animations/Reveal";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import wellnessRetreat from "../assets/seasonal-wellness-retreat.jpg";
import onlineHealing from "../assets/online-healing-circles.jpg";
import guestTalks from "../assets/guest-talks-&-teaching.jpg";

export default function Events() {
  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="bg-[#F5EBE8] py-24 text-center">
        <Reveal>
          <h1 className="text-[#A67365] mb-4 p-4">Events & Workshops</h1>
          <p className="max-w-3xl mx-auto text-gray-700 leading-relaxed">
            Curated experiences that create space for reflection, learning, and
            collective healing — online and in person.
          </p>
        </Reveal>
      </section>

      {/* ================= EVENTS GRID ================= */}
      <section className="max-w-7xl p-4 mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Event */}
          <Reveal delay={0.1}>
            <div
              className="bg-white rounded-2xl overflow-hidden shadow-md
                            hover:-translate-y-1 hover:shadow-xl transition-all h-full">
              <div className="h-56 overflow-hidden">
                <ImageWithFallback
                  // src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200"
                  src={wellnessRetreat}
                  alt="Wellness retreat"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-4">
                <h3 className="text-[#A67365] mb-3 p-6">
                  Seasonal Wellness Retreat
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4 p-6">
                  A multi-day immersive retreat designed to restore balance
                  through gentle practices, nourishment, and mindful rest.
                </p>
                <span className="text-sm text-gray-500 p-6">
                  Upcoming • Limited spaces
                </span>
              </div>
            </div>
          </Reveal>

          {/* Event */}
          <Reveal delay={0.2}>
            <div
              className="bg-white rounded-2xl overflow-hidden shadow-md
                            hover:-translate-y-1 hover:shadow-xl transition-all h-full">
              <div className="h-56 overflow-hidden">
                <ImageWithFallback
                  // src="https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=1200"
                  src={onlineHealing}
                  alt="Online healing circles"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-4">
                <h3 className="text-[#A67365] mb-3 p-6">
                  Online Healing Circles
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4 p-6">
                  Monthly online gatherings exploring mindfulness, kosha
                  awareness, and shared reflection in a safe space.
                </p>
                <span className="text-sm text-gray-500 p-6">
                  Monthly • Online
                </span>
              </div>
            </div>
          </Reveal>

          {/* Event */}
          <Reveal delay={0.3}>
            <div
              className="bg-white rounded-2xl overflow-hidden shadow-md
                            hover:-translate-y-1 hover:shadow-xl transition-all h-full">
              <div className="h-56 overflow-hidden">
                <ImageWithFallback
                  // src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=1200"
                  src={guestTalks}
                  alt="Guest talks"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-4">
                <h3 className="text-[#A67365] mb-3 p-6">
                  Guest Talks & Teaching
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4 p-6">
                  Speaking engagements, podcasts, and teaching collaborations
                  centered on holistic health and embodied wisdom.
                </p>
                <span className="text-sm text-gray-500 p-6">By invitation</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
