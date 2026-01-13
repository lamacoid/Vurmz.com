'use client'

export default function ServiceAreaMap() {
  // Centered on Centennial, CO with Denver metro area visible
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d196281.12937236953!2d-105.05736577812502!3d39.68420045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876c7eb5b9a7b039%3A0x6e3d1b7c8b8d7f0!2sCentennial%2C%20CO!5e0!3m2!1sen!2sus!4v1704844800000!5m2!1sen!2sus"

  return (
    <div className="relative w-full aspect-video bg-gray-200 overflow-hidden">
      <iframe
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="VURMZ Service Area - Denver Metro"
        className="absolute inset-0"
      />
      {/* Overlay with service area info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <div className="flex items-center gap-2 text-white text-sm">
          <svg className="h-5 w-5 text-vurmz-teal" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span>Based in Centennial, CO - Serving the entire Denver Metro Area</span>
        </div>
      </div>
    </div>
  )
}
