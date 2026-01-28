import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAppUrl } from "../../utils/subdomain";
import { ArrowLeft, CalendarDays, ArrowRight } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const sanitizeDescription = (html) => {
  return html
    .replace(/class="ql-align-[^"]*"/g, "")
    .replace(/style="[^"]*"/g, "");
};

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/blogs`);
      const data = await res.json();
      setBlogs(
        data
          .filter((blog) => !blog.suspended)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;

  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  return (
    <div className="container" data-aos="fade-up" data-aos-duration="1000">
      <div className="max-w-6xl mx-auto py-0 text-center flex flex-col justify-center items-center px-4">
        <div
          className="breadcrumb-container w-full text-left mb-0 font-figtree font-light"
          data-aos="fade-right"
          data-aos-duration="1200">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb m-0 p-0 flex gap-0 text-sm">
              <li className="breadcrumb-item">
                <a href={getAppUrl(null, '/')} className="text-gray-500 hover:underline">
                  Home
                </a>
              </li>
              <li className="breadcrumb-item">
                <a
                  href="/blogs"
                  className="!text-gray-700 hover:underline breadcrumb-item truncate max-w-[120px] sm:max-w-[200px] md:max-w-full">
                  Blogs
                </a>
              </li>
            </ol>
          </nav>
        </div>

        <div className="max-w-6xl mx-auto px-4 mt-2 text-center">
          {/* TITLE */}
          <h2
            className="text-4xl text-[#8b171b]"
            style={{ fontFamily: "PTSerif-Regular" }}
          >
            Blogs By Sita
          </h2>

          {/* MOTIF */}
          <img
            src="/sita-motif.webp"
            alt="Sita Motif"
            className="mx-auto mt-1 w-48"
          />

          {/* BLOG GRID */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentBlogs.map((blog, index) => {
              const btnColors = [
                "bg-[#d86c87]", // pink
                "bg-[#e29a7a]", // peach
                "bg-[#c36c6c]", // rose
              ];

              return (
                <div
                  key={blog._id}
                  data-aos="fade-up"
                  data-aos-delay={(index + 1) * 100}
                  className="flex flex-col text-center aspect-[2/1] border-b border-[#8b171b]">

                  {/* IMAGE */}
                  <div className="relative w-full aspect-[1.25/1] flex-shrink-0 overflow-hidden rounded-b-md mb-3">
                    <img
                      src={
                        blog.image?.startsWith("http")
                          ? blog.image
                          : `${BACKEND_BASE_URL}${blog.image}`
                      }
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />

                    {/* DATE */}
                    <p
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2
             bg-white px-4 py-1 text-[14px] rounded-t-md shadow"
                      style={{ fontFamily: "Montserrat-Light" }}
                    >
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </p>

                  </div>

                  <div className="flex flex-col flex-grow px-1">
                    {/* TITLE */}
                    <h4
                      className="text-[20px] mb-1 text-black leading-snug"
                      style={{ fontFamily: "Montserrat-Light" }}
                    >
                      {blog.title}
                    </h4>

                    {/* DESCRIPTION (clamped & fixed height) */}
                    <p className="text-[15px] text-black mb-1 leading-snug h-[70px] overflow-hidden">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: sanitizeDescription(
                            blog.description.length > 200
                              ? blog.description.slice(0, 200) + "..."
                              : blog.description
                          ),
                        }}
                      />
                    </p>
                  </div>

                  {/* AUTHOR */}
                  <span
                    className="text-[14px] italic mb-2 mt-2"
                    style={{ fontFamily: "Montserrat-Light" }}
                  >
                    – {blog.author || "Sita Severson"}
                  </span>


                  {/* CTA BUTTON */}
                  <Link
                    to={`/blogs/${blog.slug || blog._id}`}
                    className={`
    ${btnColors[index % btnColors.length]}
    text-white px-4 py-2 text-[16px] mx-auto
    [clip-path:polygon(10%_0%,90%_0%,100%_50%,90%_100%,10%_100%,0%_50%)]
    transition hover:opacity-90 no-underline mb-3
  `}
                    style={{ fontFamily: "Montserrat-Light" }}
                  >
                    {blog.readMoreText || "Get insights"}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
