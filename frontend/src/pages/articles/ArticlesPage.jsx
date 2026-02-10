import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import SitaBreadcrumb from "../breadcrumbs/SitaBreadcrumb";
import "../../assets/herosection.css";
import "../about/About.css";
import "../homepage/Homepage.css";
import { FileText } from "lucide-react";

const BACKEND_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const sanitizeDescription = (html) => {
  return html
    .replace(/class="ql-align-[^"]*"/g, "")
    .replace(/style="[^"]*"/g, "");
};

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

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
  const fetchArticles = async () => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/articles`);
      const data = await res.json();
      console.log("Fetched articles:", data);
      const filtered = data
        .filter((article) => !article.suspended)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      console.log("Filtered articles:", filtered);
      setArticles(filtered);
    } catch (err) {
      console.error("Failed to fetch articles", err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle,
  );
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  return (
    <>
      <section className="sita-inner-hero">
        <div className="sita-hero-inner-bg" data-aos="fade-in"></div>
        <div className="sita-inner-hero-image">
          <div
            className="sita-inner-hero-image-banner"
            data-aos="zoom-out"
            data-aos-duration="1500">
            <img src="/about-banner.webp" alt="About Banner" />
          </div>
        </div>
      </section>

      <SitaBreadcrumb
        items={[{ label: "Home", path: "/" }, { label: "Articles" }]}
      />
      <div className="container" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-4 text-center">
          {/* HEADER */}
          <h2 className="font-serifSita text-[#8b171b] text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-tight text-center">
            ARTICLES BY SITA
          </h2>
          <img
            src="/sita-motif.webp"
            alt="Sita Motif"
            className="mx-auto mt-1 w-40 sm:w-48 mb-6"
          />

          {/* ARTICLE GRID */}
          <div className="row">
            {currentArticles.map((article, index) => {
              const btnColors = ["pink", "peach", "rose"];
              const btnColor = btnColors[index % btnColors.length]; // Cycle colors

              return (
                <div
                  key={article._id}
                  className="col-lg-4 col-md-4 col-sm-12 col-12"
                  data-aos="fade-up"
                  data-aos-delay={(index + 1) * 100}>
                  <div className="sita-blog-card">
                    <div className="sita-blog-image">
                      <img
                        src={
                          article.image?.startsWith("http")
                            ? article.image
                            : `${BACKEND_BASE_URL}${article.image}`
                        }
                        className="img-fluid w-100"
                        alt={article.title}
                        style={{ height: "250px", objectFit: "cover" }}
                      />
                      <p className="blog-date">
                        {new Date(article.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>

                    <h4>{article.title}</h4>

                    <div className="blog-description-wrapper">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: sanitizeDescription(
                            article.description.length > 150
                              ? article.description.slice(0, 150) + "..."
                              : article.description,
                          ),
                        }}
                      />
                    </div>

                    <span className="blog-author mb-3">
                      - {article.author || "Sita Severson"}
                    </span>

                    <Link
                      to={`/articles/${article.slug || article._id}`}
                      className={`sita-blog-btn ${btnColor}`}
                      style={{
                        minWidth: "150px",
                        display: "inline-flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      {article.readMoreText || "Read More"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          {articles.length === 0 && (
            <div className="text-center py-20 text-slate-500 font-montserratLight">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-xl">New articles coming soon.</p>
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div
              className="flex justify-center items-center gap-2 sm:gap-2 lg:gap-3 mt-10 mb-20 flex-wrap"
              data-aos="fade-up"
              data-aos-duration="1500">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center border border-black rounded-full disabled:opacity-30 hover:bg-gray-100 transition">
                <ArrowLeft size={18} strokeWidth={2} />
              </button>

              {currentPage > 3 && (
                <span className="text-gray-400 select-none">...</span>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((num) => {
                  if (currentPage <= 2) return num <= 3;
                  if (currentPage >= totalPages - 1)
                    return num >= totalPages - 2;
                  return (
                    num === currentPage - 1 ||
                    num === currentPage ||
                    num === currentPage + 1
                  );
                })
                .map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm sm:text-base transition
            ${
              currentPage === num
                ? "bg-[#993333] text-white"
                : "border border-transparent text-black hover:border-black hover:bg-gray-100"
            }`}>
                    {num}
                  </button>
                ))}

              {currentPage < totalPages - 2 && (
                <span className="text-gray-400 select-none">...</span>
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center border border-black rounded-full disabled:opacity-30 hover:bg-gray-100 transition">
                <ArrowRight size={18} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ArticlesPage;
