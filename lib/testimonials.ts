export interface Testimonial {
  quote: string
  name: string
  role?: string
  location?: string
  category?: string
}

// Add real testimonials here as you collect them from customers.
// The TestimonialCarousel component won't render if this array is empty.
//
// AUDIT NOTE (2026-04-26): adding 3+ testimonials is the #1 cross-role
// consensus finding (PM, UX, Brand, Content, E-comm, Photo all flagged).
// Email last 5 happy customers, ask for a one-line quote.
// Ideal mix: one gift-buyer, one B2B/branded, one trade pro.
//
// Example shape:
//   {
//     quote: "Zach made a custom branded tumbler for our Q4 client kit. Three days, exactly what we asked for, hand-delivered.",
//     name: "Sarah M.",
//     role: "Owner",
//     location: "Centennial, CO",
//     category: "services",
//   },
export const testimonials: Testimonial[] = []

export const shopTestimonials = testimonials.filter(t => t.category !== 'services')
export const servicesTestimonials = testimonials.filter(t => t.category === 'services' || t.category === 'knives')
