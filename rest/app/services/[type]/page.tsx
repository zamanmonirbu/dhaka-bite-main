import NotificationBar from "@/components/notification-bar"
import Navbar from "@/components/navbar"
import ServiceDetail from "@/components/service-detail"
import Testimonials from "@/components/testimonials"
import DeliveryArea from "@/components/delivery-area"
import Footer from "@/components/footer"
import type { Metadata } from "next"

interface ServicePageProps {
  params: {
    type: string
  }
}

// This would typically come from a CMS or database
const getServiceData = (type: string) => {
  const services = {
    "cold-drinks": {
      title: "Cold Drinks 100 ml",
      description: `Lorem ipsum dolor sit amet consectetur. Accumsan consectetur cursus mauris facilisis facilisis. Quam massa eget odio pellentesque velit faucibus et id. Tortor turpis nunc vestibulum neque rhoncus donec. Nibh consequat curabitur non faucibus pellentesque lorem donec urna massa. Eget egestas ullamcorper venenatis facilisis ultricies mauris augue. Ac sit lectus lectus turpis. Dictum urna libero libero mi odio sed gravida aenean dignissim. Arcu neque varius nunc nulla dolor. Tellus aliquam interdum nibh at mauris egestas. Adipiscing purus integer interdum a eget a aliquam risus. Vivamus in etiam maecenas molestie lorem amet. Massa nisl tellus adipiscing vitae lorem eu. Non posuere sit volutpat parturient magnis. Odio sem neque sapien in enim mattis massa tincidunt. Porttitor velit commodo gravida aliquam hac.`,
      price: 90.0,
      image: "/cold-drinks-detail.jpg",
    },
    "fast-food": {
      title: "Burger Combo",
      description: `Lorem ipsum dolor sit amet consectetur. Accumsan consectetur cursus mauris facilisis facilisis. Quam massa eget odio pellentesque velit faucibus et id. Tortor turpis nunc vestibulum neque rhoncus donec. Nibh consequat curabitur non faucibus pellentesque lorem donec urna massa. Eget egestas ullamcorper venenatis facilisis ultricies mauris augue. Ac sit lectus lectus turpis. Dictum urna libero libero mi odio sed gravida aenean dignissim. Arcu neque varius nunc nulla dolor. Tellus aliquam interdum nibh at mauris egestas. Adipiscing purus integer interdum a eget a aliquam risus. Vivamus in etiam maecenas molestie lorem amet. Massa nisl tellus adipiscing vitae lorem eu. Non posuere sit volutpat parturient magnis. Odio sem neque sapien in enim mattis massa tincidunt. Porttitor velit commodo gravida aliquam hac.`,
      price: 150.0,
      image: "/fast-food-detail.jpg",
    },
    catering: {
      title: "Party Catering Service",
      description: `Lorem ipsum dolor sit amet consectetur. Accumsan consectetur cursus mauris facilisis facilisis. Quam massa eget odio pellentesque velit faucibus et id. Tortor turpis nunc vestibulum neque rhoncus donec. Nibh consequat curabitur non faucibus pellentesque lorem donec urna massa. Eget egestas ullamcorper venenatis facilisis ultricies mauris augue. Ac sit lectus lectus turpis. Dictum urna libero libero mi odio sed gravida aenean dignissim. Arcu neque varius nunc nulla dolor. Tellus aliquam interdum nibh at mauris egestas. Adipiscing purus integer interdum a eget a aliquam risus. Vivamus in etiam maecenas molestie lorem amet. Massa nisl tellus adipiscing vitae lorem eu. Non posuere sit volutpat parturient magnis. Odio sem neque sapien in enim mattis massa tincidunt. Porttitor velit commodo gravida aliquam hac.`,
      price: 5000.0,
      image: "/catering-detail.jpg",
    },
    snacks: {
      title: "Snacks & Combos Box",
      description: `Lorem ipsum dolor sit amet consectetur. Accumsan consectetur cursus mauris facilisis facilisis. Quam massa eget odio pellentesque velit faucibus et id. Tortor turpis nunc vestibulum neque rhoncus donec. Nibh consequat curabitur non faucibus pellentesque lorem donec urna massa. Eget egestas ullamcorper venenatis facilisis ultricies mauris augue. Ac sit lectus lectus turpis. Dictum urna libero libero mi odio sed gravida aenean dignissim. Arcu neque varius nunc nulla dolor. Tellus aliquam interdum nibh at mauris egestas. Adipiscing purus integer interdum a eget a aliquam risus. Vivamus in etiam maecenas molestie lorem amet. Massa nisl tellus adipiscing vitae lorem eu. Non posuere sit volutpat parturient magnis. Odio sem neque sapien in enim mattis massa tincidunt. Porttitor velit commodo gravida aliquam hac.`,
      price: 250.0,
      image: "/snacks-detail.jpg",
    },
  }

  return services[type as keyof typeof services] || services["cold-drinks"]
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = getServiceData(params.type)

  return {
    title: `${service.title} | Dhaka Bite`,
    description: service.description.substring(0, 160) + "...",
  }
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = getServiceData(params.type)

  return (
    <main>
      {/* <NotificationBar />
      <Navbar /> */}
      <ServiceDetail
        title={service.title}
        description={service.description}
        price={service.price}
        image={service.image}
      />
      <Testimonials />
      <DeliveryArea />
      {/* <Footer /> */}
    </main>
  )
}
