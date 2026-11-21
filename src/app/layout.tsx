import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#FFF9F3",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Yogita's Beauty Parlour & Beauty Salon | Exclusive Women-Only Luxury Salon",
  description:
    "Experience bespoke haircare, bridal couture makeup, hydra-glow facials, and indulgent spa rituals at Yogita's Beauty Parlour & Beauty Salon. Exclusive sanctuary for women. Book online or via WhatsApp.",
  keywords: [
    "luxury beauty salon",
    "women only beauty parlour",
    "bridal makeup artist",
    "hair spa treatments",
    "hydra facial",
    "gel nail art extensions",
    "girls parlour Mumbai",
    "Yogita beauty salon",
    "appointment booking salon",
  ],
  authors: [{ name: "Yogita's Beauty Parlour" }],
  creator: "Yogita's Beauty Parlour & Beauty Salon",
  publisher: "Yogita's Beauty Parlour & Beauty Salon",
  metadataBase: new URL("https://yogitasbeauty.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://yogitasbeauty.com",
    siteName: "Yogita's Beauty Parlour & Beauty Salon",
    title: "Yogita's Beauty Parlour & Beauty Salon | Luxury 3D Salon Experience",
    description:
      "Where beauty meets elegance. Personalized haircare, bridal makeup, and skincare rituals crafted exclusively for women.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Yogita's Beauty Parlour & Beauty Salon Luxury Interior",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yogita's Beauty Parlour & Beauty Salon",
    description: "Exclusive Women-Only Luxury Beauty Sanctuary. Discover your true elegance.",
    images: ["https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&h=630&q=80"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: "Yogita's Beauty Parlour & Beauty Salon",
    description:
      "Exclusive girls-only and women-only luxury beauty salon offering bespoke hair styling, bridal makeup, skincare facials, nail art, and restorative spa treatments.",
    slogan: "Your Beauty, Our Passion.",
    url: "https://yogitasbeauty.com",
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, In-Salon Card / UPI on Visit",
    openingHours: "Mo-Su 10:00-20:30",
    audience: {
      "@type": "Audience",
      audienceType: "Women and Girls Only",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Salon & Spa Services",
      itemListElement: [
        { "@type": "Offer", name: "Haircut & Hair Styling" },
        { "@type": "Offer", name: "Hair Spa & Hair Treatments" },
        { "@type": "Offer", name: "Facial & Skin Care" },
        { "@type": "Offer", name: "Bridal Makeup" },
        { "@type": "Offer", name: "Luxury Manicure & Pedicure" },
        { "@type": "Offer", name: "Nail Art & Gel Extensions" },
      ],
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-ivory-100 text-chocolate min-h-screen antialiased selection:bg-blush-200 selection:text-chocolate font-sans">
        {children}
      </body>
    </html>
  );
}
