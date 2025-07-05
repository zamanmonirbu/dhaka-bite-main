import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function ContactInfo() {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
            <p className="text-gray-600 mb-8">
              Have questions or feedback? We're here to help. Contact us through any of the channels below or fill out
              the form and we'll get back to you as soon as possible.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-primary text-white p-3 rounded-full mr-4">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Phone</h3>
                  <p className="text-gray-600">+880 1398-787656</p>
                  <p className="text-gray-600">+880 1999-999990</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary text-white p-3 rounded-full mr-4">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-gray-600">dhakabite@gmail.com</p>
                  <p className="text-gray-600">support@dhakabite.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary text-white p-3 rounded-full mr-4">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Address</h3>
                  <p className="text-gray-600">Mirbagh, Rampura, Dhaka</p>
                  <p className="text-gray-600">Dhaka, Bangladesh</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary text-white p-3 rounded-full mr-4">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Business Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 10:00 PM</p>
                  <p className="text-gray-600">Saturday - Sunday: 10:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div>
            <div className="h-[400px] rounded-lg overflow-hidden shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14602.254272231177!2d90.41279565!3d23.7937758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7a0f70deb73%3A0x30c36498f90fe23!2sGulshan%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1653458236889!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dhaka Bite Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
