
interface HeroSectionProps {
  title: string;
  description: string;
  details?: string;
}

export default function HeroSection({
  title,
  description,
  details,
}: HeroSectionProps) {
  return (
    <div>
      <section
        className="w-full sm:w-2/3 rounded-xl overflow-hidden relative aspect-[5/2] mx-auto"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dv4ouaclr/image/upload/v1751178245/Goals_objectives_zqpudo.jpg?_s=public-apps')`,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />

        {/* Centered Content */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center text-white h-full px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-base md:text-lg max-w-2xl">{description}</p>
        </div>
      </section>

      {details && (
        <div className="w-full sm:w-2/3 rounded-xl overflow-hidden relative mx-auto text-justify mt-8">
          <p className="text-base md:text-lg text-gray-700">{details}</p>
        </div>
      )}
    </div>
  );
}

