export interface Testimonial {
  quote: string
  name: string
  role?: string
  location?: string
  category?: string
}

// Add real testimonials here as you collect them from customers.
// The TestimonialCarousel component won't render if this array is empty.
export const testimonials: Testimonial[] = []

export const shopTestimonials = testimonials.filter(t => t.category !== 'services')
export const servicesTestimonials = testimonials.filter(t => t.category === 'services' || t.category === 'knives')
