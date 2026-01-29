import { useParams, Link } from "react-router-dom";
import { useFetchBookByIdQuery } from "../../redux/features/books/booksApi";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useRef, useState, useMemo } from "react";
import HTMLFlipBook from "react-pageflip";
import { ArrowLeft, ArrowRight } from "lucide-react";

const BookPreview = () => {
    const { id } = useParams();
    const { data: book, isLoading, error } = useFetchBookByIdQuery(id);

    const bookRefMobile = useRef(null);
    const bookRefTablet = useRef(null);
    const bookRefDesktop = useRef(null);

    const [screenSize, setScreenSize] = useState(window.innerWidth);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    const getPageCount = (ref) => {
        try {
            return ref?.current?.pageFlip()?.getPageCount() ?? 0;
        } catch {
            return 0;
        }
    };

    const getCurrentIndex = (ref) => {
        try {
            return ref?.current?.pageFlip()?.getCurrentPageIndex() ?? 0;
        } catch {
            return 0;
        }
    };

    const currentSection = useMemo(() => {
        if (screenSize < 768) return "mobile";
        if (screenSize >= 768 && screenSize < 1440) return "tablet";
        return "desktop";
    }, [screenSize]);

    const updateNavForRef = (ref) => {
        const count = getPageCount(ref);
        const idx = getCurrentIndex(ref);

        setCanPrev(idx > 0);
        const lastIndexForNext =
            currentSection === "desktop" ? Math.max(0, count - 2) : Math.max(0, count - 1);

        setCanNext(idx < lastIndexForNext);
    };

    useEffect(() => {
        AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
        const handleResize = () => setScreenSize(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const ref =
            currentSection === "mobile"
                ? bookRefMobile
                : currentSection === "tablet"
                    ? bookRefTablet
                    : bookRefDesktop;
        setTimeout(() => updateNavForRef(ref), 120);
    }, [currentSection, book]);

    const handlePrev = (ref) => ref.current?.pageFlip().flipPrev();
    const handleNext = (ref) => ref.current?.pageFlip().flipNext();

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-64 text-gray-600 text-lg">
                Loading preview...
            </div>
        );

    if (error || !book)
        return (
            <div className="flex justify-center items-center h-64 text-red-600 text-lg">
                Error loading book preview.
            </div>
        );

    const buildPagesFromChapters = (chapters, maxHeight) => {
        if (!chapters || chapters.length === 0) {
            return splitTextByHeight(book?.description || "", maxHeight).map((text) => ({
                type: "content",
                text,
            }));
        }

        const pages = [];
        chapters.forEach((chapter) => {
            const chunks = splitTextByHeight(chapter.description || "", maxHeight);
            chunks.forEach((chunk, idx) => {
                pages.push({
                    type: "content",
                    text: chunk,
                    chapterTitle: idx === 0 ? chapter.title : null,
                });
            });
        });
        return pages;
    };

    const mobilePages = buildPagesFromChapters(book?.chapters, 260);
    const tabletPages = buildPagesFromChapters(book?.chapters, 350);
    const desktopPages = buildPagesFromChapters(book?.chapters, 400);

    const flipbookPagesMobile = [{ type: "front" }, ...mobilePages, { type: "back" }];
    const flipbookPagesTablet = [{ type: "front" }, ...tabletPages, { type: "back" }];
    const flipbookPagesDesktop = [{ type: "front" }, ...desktopPages];
    if (desktopPages.length % 2 !== 0) flipbookPagesDesktop.push({ type: "blank" });
    flipbookPagesDesktop.push({ type: "back" });

    const dynamicHeight = Math.min(window.innerHeight * 0.85, 720);

    const flipbookConfigs = {
        mobile: {
            width: 320,
            height: dynamicHeight,
            minWidth: 300,
            maxWidth: 340,
            minHeight: 500,
            maxHeight: dynamicHeight,
            usePortrait: true,
            showCover: false,
        },
        tablet: {
            width: 500,
            height: dynamicHeight,
            minWidth: 460,
            maxWidth: 520,
            minHeight: 550,
            maxHeight: dynamicHeight,
            usePortrait: true,
            showCover: false,
        },
        desktop: {
            width: 550,
            height: dynamicHeight,
            minWidth: 550,
            maxWidth: 550,
            minHeight: 600,
            maxHeight: dynamicHeight,
            usePortrait: false,
            showCover: false,
        },
    };

    const renderFlipbook = (pages, ref, type) => (
        <HTMLFlipBook
            ref={ref}
            {...flipbookConfigs[type]}
            className="rounded-2xl bg-white border border-gray-200 shadow-xl"
            style={{ perspective: "1500px" }}
            onFlip={(e) => {
                const page = e?.data?.page;
                const count = getPageCount(ref);

                if (typeof page === "number") {
                    setCanPrev(page > 0);
                    const lastIndexForNext =
                        currentSection === "desktop" ? Math.max(0, count - 2) : Math.max(0, count - 1);

                    setCanNext(page < lastIndexForNext);
                } else {
                    updateNavForRef(ref);
                }
            }}
            onInit={() => setTimeout(() => updateNavForRef(ref), 120)}
        >
            {pages.map((page, index) => renderPage(page, index, book))}
        </HTMLFlipBook>
    );

    return (
        <div className="container mx-auto px-4 mb-20" data-aos="fade-up">
            <div className="breadcrumb-container" data-aos="fade-right" data-aos-duration="1500">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item"><a href="/">Publications</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{book.title} Preview</li>
                    </ol>
                </nav>
            </div>

            <div
                className="relative w-full flex justify-center"
                data-aos="zoom-in"
                data-aos-duration="1800"
            >
                <h1 className="text-[32px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-snug mb-4 mt-4 text-center">
                    {book.title} Preview
                </h1>
            </div>

            <div
                className={`relative flex justify-center items-start px-4 min-h-[70vh] ${screenSize >= 1440 ? "mt-4" : "mt-4"
                    }`}
            >
                <div className="relative flex justify-center items-center">
                    {canPrev && (
                        <button
                            onClick={() =>
                                handlePrev(
                                    currentSection === "mobile"
                                        ? bookRefMobile
                                        : currentSection === "tablet"
                                            ? bookRefTablet
                                            : bookRefDesktop
                                )
                            }
                            className="absolute top-1/2 -translate-y-1/2 
              left-[-0.8rem]  sm:left-[-4rem] lg:left-[-4rem]
              text-[#c86836] hover:text-[#99301f] 
              transition-all duration-200 z-10 
              bg-white/70 backdrop-blur-sm rounded-full border-[#c86836] border-1
              p-2 sm:p-3"
                        >
                            <ArrowLeft className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9" />
                        </button>
                    )}

                    {currentSection === "mobile" &&
                        renderFlipbook(flipbookPagesMobile, bookRefMobile, "mobile")}
                    {currentSection === "tablet" &&
                        renderFlipbook(flipbookPagesTablet, bookRefTablet, "tablet")}
                    {currentSection === "desktop" &&
                        renderFlipbook(flipbookPagesDesktop, bookRefDesktop, "desktop")}

                    {canNext && (
                        <button
                            onClick={() =>
                                handleNext(
                                    currentSection === "mobile"
                                        ? bookRefMobile
                                        : currentSection === "tablet"
                                            ? bookRefTablet
                                            : bookRefDesktop
                                )
                            }
                            className="absolute top-1/2 -translate-y-1/2 
              right-[-0.8rem] sm:right-[-4rem] lg:right-[-4rem]
              text-[#c86836] hover:text-[#99301f] 
              transition-all duration-200 z-10 
              bg-white/70 backdrop-blur-sm rounded-full border-[#c86836] border-1
              p-2 sm:p-3"
                        >
                            <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

function splitTextByHeight(text, maxHeight) {
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.visibility = "hidden";
    tempDiv.style.width = "500px";
    tempDiv.style.fontSize = "16px";
    tempDiv.style.lineHeight = "1.5";
    tempDiv.style.fontFamily = "sans-serif";
    document.body.appendChild(tempDiv);

    const words = text.split(" ");
    const pages = [];
    let currentText = "";

    words.forEach((word) => {
        tempDiv.innerText = currentText + " " + word;
        if (tempDiv.offsetHeight > maxHeight) {
            pages.push(currentText.trim());
            currentText = word;
        } else {
            currentText += " " + word;
        }
    });

    if (currentText) pages.push(currentText.trim());
    document.body.removeChild(tempDiv);
    return pages;
}

function renderPage(page, index, book) {
    if (page.type === "front") {
        return (
            <div
                key={index}
                className="relative flex flex-col justify-center items-center bg-gradient-to-br from-[#f8f4ef] to-[#fafafa] rounded-2xl overflow-hidden"
            >
                <img
                    src={book.coverImage || "/default-cover.webp"}
                    alt="Front Cover"
                    className="w-full h-full"
                />
            </div>
        );
    }
    if (page.type === "blank") {
        return (
            <div key={index} className="bg-white rounded-2xl">
                <p className="absolute bottom-0 right-4 text-xs text-gray-400 z-10">
                    - Page {index} -
                </p>
            </div>
        );
    }

    if (page.type === "back") {
        return (
            <div
                key={index}
                className="relative flex flex-col justify-center items-center bg-gradient-to-br from-[#f8f4ef] to-[#fafafa] rounded-2xl overflow-hidden"
            >
                <img
                    src={book.backImage || "/default-back.webp"}
                    alt="Back Cover"
                    className="w-full h-full"
                />
            </div>
        );
    }

    return (
        <div
            key={index}
            className="relative p-6 sm:p-10 bg-white rounded-2xl flex flex-col justify-between border border-gray-100 shadow-sm overflow-hidden"
        >
            <div className="relative z-10">
                {page.chapterTitle && (
                    <h3 className="text-center text-2xl font-semibold mb-4 text-[#c86836]">
                        {page.chapterTitle}
                    </h3>
                )}
                <p className="text-gray-700 text-justify tracking-wide leading-7 sm:leading-8 whitespace-pre-line overflow-hidden text-ellipsis">
                    {page.text}
                </p>
            </div>
            <p className="absolute bottom-0 right-4 text-xs text-gray-400 z-10">
                - Page {index} -
            </p>
        </div>
    );
}

export default BookPreview;
