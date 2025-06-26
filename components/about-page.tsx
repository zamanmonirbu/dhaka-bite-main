import React from "react"

export default function AboutContent() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">About Us</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
        <p>
          At Dhaka Bite, our mission is to deliver delicious, high-quality meals directly to your door.
          We are committed to providing exceptional customer service and ensuring that every meal is satisfying
          and enjoyable.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Our Values</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Quality: We use only the freshest ingredients in our meals.</li>
          <li>Customer Satisfaction: Your happiness is our top priority.</li>
          <li>Innovation: We are constantly looking for ways to improve our services.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
        <p>If you have any questions or feedback, feel free to reach out to us at:</p>
        <p className="mb-1">Email: support@dhakabite.com</p>
        <p>Phone: +880 1398-787656</p>
      </section>
    </main>
  )
}
