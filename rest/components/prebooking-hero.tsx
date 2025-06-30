import Image from "next/image"

export default function PrebookingHero() {
  return (
    <section className="relative h-[300px] md:h-[400px] w-full">
      <Image src="/food-spread-background.jpg" alt="Prebooking Hero" fill className="object-cover" priority />
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Meal Prebooking</h1>
        <p className="text-lg md:text-xl max-w-3xl text-center">
          Plan ahead and pre-order your meals for special events, gatherings, or just to ensure your favorite dishes are
          ready when you need them.
        </p>
      </div>
    </section>
  )
}
