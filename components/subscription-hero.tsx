import Image from "next/image"

export default function SubscriptionHero() {
  return (
    <section className="relative py-16 md:py-24">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image src="/subscription-bg.jpg" alt="Subscription Background" fill className="object-cover" priority />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6">Subscription Plans</h1>

          <p className="text-white mb-8">
            Subscribe to our meal plans and enjoy delicious, healthy meals delivered to your doorstep every day. Choose
            the plan that best fits your needs and budget.
          </p>

          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-3">Why Subscribe?</h3>
            <ul className="space-y-2 text-white">
              <li className="flex items-start">
                <span className="text-secondary mr-2">✓</span> Save money with discounted rates
              </li>
              <li className="flex items-start">
                <span className="text-secondary mr-2">✓</span> Priority delivery and special treatment
              </li>
              <li className="flex items-start">
                <span className="text-secondary mr-2">✓</span> Customize your meal preferences
              </li>
              <li className="flex items-start">
                <span className="text-secondary mr-2">✓</span> Skip, pause, or cancel anytime
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
