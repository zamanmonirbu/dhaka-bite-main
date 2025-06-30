interface BlogPostContentProps {
  content: string
}

export default function BlogPostContent({ content }: BlogPostContentProps) {
  return (
    <section className="py-8 bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto prose prose-lg prose-green">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </section>
  )
}
