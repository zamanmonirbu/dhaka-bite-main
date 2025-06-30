import Image from "next/image"
import Link from "next/link"
import { Eye, Calendar } from "lucide-react"

// Sample related posts data
const relatedPosts = [
  {
    id: 2,
    slug: "cheesy-pasta-with-crispy-bacon-1",
    title: "Cheesy pasta with crispy bacon and mozzarella cheese",
    excerpt: "Lorem ipsum dolor sit amet consectetur. Morbi quam facilisi aliquam metus.",
    image: "/blog-laptop-food.jpg",
    views: 50,
    publishDate: "May 10, 2023",
  },
  {
    id: 3,
    slug: "cheesy-pasta-with-crispy-bacon-2",
    title: "Cheesy pasta with crispy bacon and mozzarella cheese",
    excerpt: "Lorem ipsum dolor sit amet consectetur. Morbi quam facilisi aliquam metus.",
    image: "/blog-woman-coffee.jpg",
    views: 50,
    publishDate: "May 5, 2023",
  },
  {
    id: 4,
    slug: "cheesy-pasta-with-crispy-bacon-3",
    title: "Cheesy pasta with crispy bacon and mozzarella cheese",
    excerpt: "Lorem ipsum dolor sit amet consectetur. Morbi quam facilisi aliquam metus.",
    image: "/blog-stuffed-tomatoes.jpg",
    views: 50,
    publishDate: "April 28, 2023",
  },
]

interface RelatedPostsProps {
  currentSlug: string
}

export default function RelatedPosts({ currentSlug }: RelatedPostsProps) {
  // Filter out the current post if it's in the related posts
  const filteredPosts = relatedPosts.filter((post) => post.slug !== currentSlug)

  return (
    <section className="py-12 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-2xl font-bold mb-8">Related Posts</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <Link href={`/blogs/${post.slug}`} className="block relative h-48 w-full overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform"
                />
              </Link>

              <div className="p-4">
                <div className="flex items-center justify-start gap-4 mb-3 text-gray-500 text-sm">
                  <div className="flex items-center">
                    <Eye size={16} className="mr-1" />
                    <span>{post.views}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    <span>{post.publishDate}</span>
                  </div>
                </div>

                <Link href={`/blogs/${post.slug}`}>
                  <h3 className="text-lg font-bold mb-2 hover:text-primary transition-colors">{post.title}</h3>
                </Link>

                <p className="text-gray-600 mb-3">{post.excerpt}</p>

                <Link href={`/blogs/${post.slug}`} className="text-primary font-medium hover:underline">
                  Read more
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
