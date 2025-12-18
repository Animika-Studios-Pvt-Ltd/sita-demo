import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { AboutSita } from './pages/AboutSita';
import { SitaFactor } from './pages/SitaFactor';
import { YogaTherapy } from './pages/YogaTherapy';
import { Ayurveda } from './pages/Ayurveda';
import { KoshaCounseling } from './pages/KoshaCounseling';
import { BookMeeting } from './pages/BookMeeting';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutSita />} />
            <Route path="/sita-factor" element={<SitaFactor />} />
            <Route path="/yoga-therapy" element={<YogaTherapy />} />
            <Route path="/ayurveda" element={<Ayurveda />} />
            <Route path="/kosha-counseling" element={<KoshaCounseling />} />
            <Route path="/book-meeting" element={<BookMeeting />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
