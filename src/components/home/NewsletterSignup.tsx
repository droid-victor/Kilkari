import { useState } from 'react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) setSubmitted(true)
  }

  return (
    <section className="container-page py-10 sm:py-14">
      <div className="rounded-card bg-terracotta-50 p-6 sm:p-10 text-center flex flex-col items-center gap-3">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900">
          Stay in the Loop
        </h2>
        <p className="text-sm sm:text-base text-ink-600 max-w-md">
          Get updates on new arrivals, festive collections and exclusive offers.
        </p>
        {submitted ? (
          <p className="text-sage-600 font-medium mt-2">Thanks! You're subscribed.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2 mt-2">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 h-11 rounded-full bg-cream-50 border border-ink-900/10 px-4 text-sm focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500"
            />
            <button
              type="submit"
              className="h-11 px-5 rounded-full bg-terracotta-600 text-cream-50 text-sm font-medium hover:bg-terracotta-700 cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
