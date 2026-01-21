import { useEffect, useState } from "react"
import { usePreloadedData } from "../../context/DataContext"
import AOS from "aos"
import "aos/dist/aos.css"

const Banner = () => {
  const preloadedData = usePreloadedData()
  const [data, setData] = useState(null)

  useEffect(() => {
    AOS.init({ once: true, easing: "ease-in-out" })
    if (preloadedData.banner) {
      setData(preloadedData.banner)
    }
  }, [preloadedData])

  if (!data) return null

  return (
    <div className="max-w-screen-9xl mx-auto font-Figtree overflow-hidden pt-4 px-4 grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[700px] sm:min-h-[750px] md:min-h-[800px] lg:min-h-[500px] xl:min-h-[600px] 2xl:min-h-[700px]">
      <div
        className="flex items-center justify-center px-4 lg:px-8 xl:px-12 2xl:px-16 h-full"
        data-aos="fade-right"
        data-aos-duration="1500">
        <img
          src={data.imageUrl}
          alt="Langshott Foundation Author"
          className="w-full max-h-[700px] object-contain mx-auto select-none transition duration-500"
          data-aos="zoom-in"
          data-aos-duration="1800"
        />
      </div>
      <div
        className="relative bg-transparent px-4 lg:py-0 text-center flex flex-col justify-center items-center overflow-visible max-w-[700px] xl:max-w-[800px] mx-auto h-full"
        data-aos="fade-left"
        data-aos-duration="1500">
        <div
          className="mb-3 sm:mb-5"
          data-aos="fade-down"
          data-aos-duration="1200">
          <img
            src={data.logoUrl}
            alt={data.title}
            className="h-24 sm:h-32 max-h-32 w-auto block select-none mx-auto mt-0 mb-0"
          />
        </div>

        <div
          className="relative inline-block text-center"
          data-aos="fade-up"
          data-aos-duration="1500">
          <h1 className="text-[30px] sm:text-[34px] md:text-[50px] font-playfair font-light text-black leading-tight mt-3 mb-4 sm:mb-6">
            {data.title}
          </h1>
          <img
            src="/motif.webp"
            alt="feather"
            className="absolute left-1/2 -bottom-2 sm:-bottom-0 transform -translate-x-1/2 w-20 sm:w-24 md:w-32 h-auto [opacity:0.15] mb-4 md:mb-6"
          />
        </div>

        <p
          className="text-[16px] sm:text-[18px] md:text-[18px] lg:text-[20px] xl:text-[20px] text-black-800 font-Figtree font-regular leading-tight lg:leading-[1.3] mt-2 lg:mt-4 mb-3 px-2 sm:px-2 text-center"
          data-aos="fade-up"
          data-aos-duration="1800"
          data-aos-delay="200">
          {data.description}
        </p>

        <div
          className="flex justify-center gap-2 text-gray-600 mb-0 font-bellmt flex-wrap"
          data-aos="fade-up"
          data-aos-duration="1800"
          data-aos-delay="400">
          {[...Array(data.starsCount || 6)].map((_, i) => (
            <span key={i} className="text-2xl sm:text-3xl lg:text-4xl">
              *
            </span>
          ))}
        </div>

        <p
          className="text-[17px] sm:text-[22px] md:text-[24px] lg:text-[25px] xl:text-[25px] font-Figtree font-regular leading-snug leading-tight text-[#8c2f2f] italic lg:leading-[1.3] px-4 sm:px-10 text-center"
          data-aos="fade-up"
          data-aos-duration="2000"
          data-aos-delay="500">
          {data.quote}
        </p>
      </div>
    </div>
  )
}

export default Banner
