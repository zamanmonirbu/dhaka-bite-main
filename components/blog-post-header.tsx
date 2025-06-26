import Image from "next/image"
import { Eye, Calendar } from "lucide-react"

interface BlogPostHeaderProps {
  title: string
  subtitle: string
  image: string
  publishDate: string
  views: number
}

export default function BlogPostHeader({ title, subtitle, image, publishDate, views }: BlogPostHeaderProps) {
  return (
    <section className="relative">
      {/* Featured Image */}
      <div className="w-full h-[300px] md:h-[400px] relative">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Post Title and Metadata */}
      <div className="container-custom py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
        <h2 className="text-lg text-primary font-medium mb-6">{subtitle}</h2>

        <div className="flex items-center text-gray-600 text-sm mb-4">
          <div className="flex items-center mr-4">
            <Calendar size={16} className="mr-1" />
            <span>{publishDate}</span>
          </div>
          <div className="flex items-center">
            <Eye size={16} className="mr-1" />
            <span>{views} views</span>
          </div>
        </div>
      </div>
    </section>
  )
}
