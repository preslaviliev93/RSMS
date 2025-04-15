import React from 'react'

export default function LoadingSpinner() {
  return (
    <>
        <img src="/loading.svg" alt="Loading..." className="w-5 h-5 animate-spin" />
        Logging in...
    </>
)
}