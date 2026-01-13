'use client'

import { useEffect, useRef, useState } from 'react'

interface AddressAutocompleteProps {
  value: string
  onChange: (address: string) => void
  placeholder?: string
  required?: boolean
  className?: string
}

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder = 'Start typing your address...',
  required = false,
  className = '',
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      console.warn('Google Maps API key not configured')
      return
    }

    // Check if already loaded
    if (typeof google !== 'undefined' && google.maps?.places) {
      setIsLoaded(true)
      return
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const checkLoaded = setInterval(() => {
        if (typeof google !== 'undefined' && google.maps?.places) {
          setIsLoaded(true)
          clearInterval(checkLoaded)
        }
      }, 100)
      return () => clearInterval(checkLoaded)
    }

    // Load the script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => {
      setIsLoaded(true)
    }
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return

    // Initialize autocomplete
    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'us' },
      fields: ['formatted_address', 'geometry'],
      types: ['address'],
    })

    // Bias results to Denver metro area
    const denverBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(39.5, -105.2), // SW corner
      new google.maps.LatLng(39.95, -104.7) // NE corner
    )
    autocompleteRef.current.setBounds(denverBounds)

    // Handle place selection
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace()
      if (place?.formatted_address) {
        onChange(place.formatted_address)
      }
    })
  }, [isLoaded, onChange])

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className={`w-full border border-gray-300 px-4 py-3 focus:border-vurmz-teal focus:ring-1 focus:ring-vurmz-teal outline-none ${className}`}
    />
  )
}
