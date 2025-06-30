import Link from "next/link"
import { FileText, ArrowRight } from "lucide-react"

interface MenuCardProps {
  title: string
  description: string
  link: string
}

export default function MenuCard({ title, description, link }: MenuCardProps) {
  return (
    <div className="bg-primary rounded-lg p-8 text-center text-white">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 flex items-center justify-center">
          <FileText size={48} className="text-secondary" />
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="mb-8">{description}</p>

      <Link
        href={link}
        className="inline-flex items-center gap-2 bg-white text-primary px-6 py-2 rounded-md hover:bg-secondary hover:text-white transition-colors"
      >
        <span>Explore Now</span>
        <ArrowRight size={16} />
      </Link>
    </div>
  )
}
