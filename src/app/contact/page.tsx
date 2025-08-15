export default function ContactPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg mb-6">We’re here to help! Reach out to us for product inquiries, support, or to schedule a visit to our showroom. Our team is ready to assist you with anything you need.</p>
      <div className="mb-8">
        <a
          href="https://api.whatsapp.com/send?phone=%2B923322645235"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow transition-colors text-lg"
        >
          Contact us on WhatsApp
        </a>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Showroom Address</h2>
        <p>21-C, Zulfiqar Commercial Street 2<br/>Phase 8, DHA, Karachi</p>
        <a
          href="https://www.google.com/maps/dir//Demporium,+21+C+Zulfiqar+Commercial+Street+2,+D.H.A.+Phase+8+Zulfiqar+%26+Al+Murtaza+Commercial+Area+Phase+8+Defence+Housing+Authority,+Karachi,+74600,+Pakistan/@24.7903267,67.039578,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3eb33df7598dcb43:0xaf1995ae467b1f0f!2m2!1d67.0776868!2d24.7903267?entry=ttu&g_ep=EgoyMDI1MDczMC4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline mt-2 inline-block"
        >
          View on Google Maps
        </a>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Business Hours</h2>
        <p>Monday – Saturday: 10:00 AM – 8:00 PM<br/>Sunday: 12:00 PM – 6:00 PM</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Phone</h2>
        <p>+92 332 2645235</p>
      </div>
    </main>
  );
}