interface HeroSectionProps {
  title: string;
  description: string;
  backgroundImage?: string;
}

export default function HeroSection({
  title,
  description,
  backgroundImage = "/food-spread-overhead.jpg", 
}: HeroSectionProps) {
  return (
    <section className="relative h-[400px] flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">{description}</p>
      </div>
    </section>
  );
}

