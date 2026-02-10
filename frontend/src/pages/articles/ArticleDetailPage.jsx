import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { CalendarDays } from "lucide-react";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";
import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import "../../assets/herosection.css";
import "../homepage/Homepage.css";

const BACKEND_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const sanitizeDescription = (html) => {
  return html
    .replace(/class="ql-align-[^"]*"/g, "")
    .replace(/style="[^"]*"/g, "");
};

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [latestArticles, setLatestArticles] = useState([]);
  const { data: books = [] } = useFetchAllBooksQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 3;
  const activeBooks = books.filter((book) => !book.suspended);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out-cubic",
      once: false,
      mirror: true,
      offset: 120,
      debounceDelay: 50,
    });

    setTimeout(() => AOS.refreshHard(), 400);
  }, []);

  useEffect(() => {
    if (books.length === 0) return;
    const interval = setInterval(() => handleNext(), 4000);
    return () => clearInterval(interval);
  }, [books]);

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === 0 ? activeBooks.length - 1 : prev - 1,
      );
      setFade(true);
    }, 300);
  };

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBooks.length);
      setFade(true);
    }, 300);
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        // Using slug from params, but route might send id or slug. Endpoint handles slug.
        const res = await fetch(`${BACKEND_BASE_URL}/api/articles/${slug}`);
        const data = await res.json();
        if (data.suspended) {
          setArticle(null);
        } else {
          setArticle(data);
        }
      } catch (err) {
        console.error("Failed to fetch article", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchLatestArticles = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/articles`);
        const data = await res.json();
        const sorted = data
          .filter((a) => a.slug !== slug && a._id !== slug && !a.suspended)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLatestArticles(sorted);
      } catch (err) {
        console.error("Failed to fetch latest articles", err);
      }
    };

    fetchArticle();
    fetchLatestArticles();
  }, [slug]);

  if (loading)
    return (
      <p className="text-center mt-10 animate-pulse text-gray-500">
        Loading article details...
      </p>
    );

  if (!article)
    return (
      <p className="text-center mt-10 text-gray-600">Article not found.</p>
    );

  const totalPages = Math.ceil(latestArticles.length / articlesPerPage);
  const indexOfLast = currentPage * articlesPerPage;
  const indexOfFirst = indexOfLast - articlesPerPage;
  const currentArticles = latestArticles.slice(indexOfFirst, indexOfLast);

  return (
    <>
      <section className="booking-inner-hero">
        <div className="booking-inner-hero-bg" data-aos="fade-in"></div>
        <div className="booking-inner-hero-image">
          <div
            className="sita-inner-hero-image-banner"
            data-aos="zoom-out"
            data-aos-duration="1500">
            <img
              src={
                article.image
                  ? article.image.startsWith("http")
                    ? article.image
                    : `${BACKEND_BASE_URL}${article.image}`
                  : "/about-banner.webp"
              }
              alt={article.title}
            />
          </div>
        </div>
      </section>

      <SitaBreadcrumb
        items={[
          { label: "Home", path: "/" },
          {
            label: "Articles",
            path: "/articles",
          },
          { label: article.title },
        ]}
      />

      <div className="container" data-aos="fade-up" data-aos-duration="1000">
        <div className="max-w-8xl mx-auto py-0 text-center flex flex-col justify-center items-center px-4">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1
              className="font-serifSita text-[#8b171b] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-tight text-center"
              data-aos="zoom-in"
              data-aos-duration="1300">
              {article.title}
            </h1>
            <img
              src="/sita-motif.webp"
              alt="Sita Motif"
              className="mx-auto mt-1 mb-8"
            />
          </div>

          <div
            className="w-full px-0 py-6"
            data-aos="fade-up"
            data-aos-duration="1200">
            <div className="w-full">
              <p className="flex items-center gap-2 text-gray-400 text-md font-regular mt-0 mb-2">
                <CalendarDays className="w-5 h-5" />
                {new Date(article.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div
                className="text-left max-w-none text-gray-800 text-[15px] sm:text-[17px] md:text-[17px] lg:text-[18px] xl:text-[18px] font-Figtree leading-snug whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: sanitizeDescription(article.description),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleDetailPage;
