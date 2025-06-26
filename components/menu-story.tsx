import Image from "next/image"

export default function MenuStory() {
  return (
    <section className="py-16 bg-[#f2e2b7]">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
              <Image src="/food-plate.jpg" alt="Delicious food plate" fill className="object-cover" />
            </div>
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
              <Image src="/sandwich-fries.jpg" alt="Sandwich with fries" fill className="object-cover" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-primary mb-2">OUR STORY</h3>
            <h2 className="text-3xl font-bold text-primary mb-6">
              Creativity Is Always
              <br />
              On Our Menu.
            </h2>
            <p className="text-gray-700">
              Glory large points them niffler petrificus. Beaded werewolf gringotts quidditch sunshine dungeons hermione
              thieves tonight dragon scale. Suits them robes willow orbs.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
