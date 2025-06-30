export default function OffersHero() {
  return (
    <section className="relative h-[400px] flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/food-spread-overhead.jpg')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Special Offers & Deals</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Discover amazing discounts on your favorite meals. Limited time offers that bring you the best value for
          delicious, home-style cooking.
        </p>
      </div>
    </section>
  )
}
