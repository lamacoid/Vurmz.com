'use client'

import { useEffect } from 'react'

/**
 * Marks the document while the reserve room is open so the fixed header,
 * which lives in the shop layout above this page, takes light ink on the
 * teal. The styles live in globals.css under html[data-room].
 */
export default function RoomTheme() {
  useEffect(() => {
    document.documentElement.setAttribute('data-room', 'reserve')
    return () => {
      document.documentElement.removeAttribute('data-room')
    }
  }, [])
  return null
}
