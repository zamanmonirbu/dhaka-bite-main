import Image from "next/image"

interface ServiceHeroProps {
  title: string
  description: string
  backgroundImage: string
}

export default function ServiceHero({ title, description, backgroundImage }: ServiceHeroProps) {
  return (
    <section className="relative h-64 md:h-80 flex items-center justify-center">
      <Image src={backgroundImage || "/placeholder.svg"} alt={title} fill className="object-cover" priority />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">{description}</p>
      </div>
    </section>
  )
}
