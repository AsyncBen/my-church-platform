import { Star, Quote } from 'lucide-react'
import { FC } from 'react'

// Types
interface Testimonial {
  name: string
  role: string
  church: string
  avatar: string
  color: string
  bg: string
  quote: string
  stars: number
}

interface StarsProps {
  count: number
}

// Constants
const CHURCH_GOLD = '#C8962C'

const testimonials: Testimonial[] = [
  {
    name: 'Pastor David Okafor',
    role: 'Senior Pastor',
    church: 'Covenant Life Church, Atlanta GA',
    avatar: 'DO',
    color: 'var(--church-blue)',
    bg: 'rgba(27,58,122,0.1)',
    quote:
      'My Church transformed the way our congregation engages during service. The scripture synchronization alone has changed how our people connect with the Word. I can see on the dashboard in real time that people are engaged — not just physically present.',
    stars: 5,
  },
  {
    name: 'Sarah Mitchell',
    role: 'Media Director',
    church: 'Hillcrest Community Church, Dallas TX',
    avatar: 'SM',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.1)',
    quote:
      "Running the media team used to feel like controlled chaos. With My Church's dashboard, I have one screen that tells me everything — who's connected, what's queued, what's been broadcast. The team's stress levels dropped noticeably on Sundays.",
    stars: 5,
  },
  {
    name: 'James & Rachel Thompson',
    role: 'Church Members',
    church: 'Grace Point Church, Charlotte NC',
    avatar: 'JR',
    color: '#059669',
    bg: 'rgba(5,150,105,0.1)',
    quote:
      "We travel for work a lot and being able to stay connected to our church through the app means everything to us. The sermon archive, prayer group, and giving feature — all in one place. It genuinely feels like we're still part of the community even when we're away.",
    stars: 5,
  },
  {
    name: 'Minister Angela Brooks',
    role: 'Youth Director',
    church: 'New Life Assembly, Chicago IL',
    avatar: 'AB',
    color: CHURCH_GOLD,
    bg: 'rgba(200,150,44,0.1)',
    quote:
      'The ministry communities feature is incredible for our youth group. They stay connected all week, not just on Sundays. Parents love that announcements actually get read. The kids are more engaged than ever.',
    stars: 5,
  },
  {
    name: 'Elder Robert Simmons',
    role: 'Board Elder',
    church: 'Redemption Church, Houston TX',
    avatar: 'RS',
    color: '#0891B2',
    bg: 'rgba(8,145,178,0.1)',
    quote:
      'From a leadership perspective, the giving dashboard and fund transparency tools have improved trust within our congregation. People can see exactly how their gifts are being allocated. That kind of accountability strengthens the church.',
    stars: 5,
  },
  {
    name: 'Worship Leader Naomi Evans',
    role: 'Worship Team Lead',
    church: 'Cornerstone Fellowship, Nashville TN',
    avatar: 'NE',
    color: '#DC2626',
    bg: 'rgba(220,38,38,0.1)',
    quote:
      'Coordinating the worship team through My Church is seamless. Setlists, scheduling, and communication all in one ministry space. It\'s cut our prep time in half and brought the team closer together between rehearsals.',
    stars: 5,
  },
]

// Stars Component
const Stars: FC<StarsProps> = ({ count }) => {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i: number) => (
        <Star
          key={i}
          size={14}
          fill={CHURCH_GOLD}
          style={{ color: CHURCH_GOLD }}
        />
      ))}
    </div>
  )
}

// Testimonial Card Component
interface TestimonialCardProps {
  testimonial: Testimonial
}

const TestimonialCard: FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div
      className="relative rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Quote icon */}
      <Quote
        size={32}
        className="absolute top-5 right-5 opacity-10"
        style={{ color: testimonial.color }}
      />

      {/* Stars */}
      <Stars count={testimonial.stars} />

      {/* Quote */}
      <p
        className="mt-4 text-sm leading-relaxed flex-1"
        style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }}
      >
        "{testimonial.quote}"
      </p>

      {/* Author */}
      <div className="mt-5 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{
            background: testimonial.bg,
            color: testimonial.color,
            border: `1.5px solid ${testimonial.color}30`,
          }}
        >
          {testimonial.avatar}
        </div>
        <div>
          <div
            className="text-sm font-semibold"
            style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}
          >
            {testimonial.name}
          </div>
          <div className="text-xs" style={{ color: testimonial.color, fontWeight: 500 }}>
            {testimonial.role}
          </div>
          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {testimonial.church}
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Testimonials Section Component
export const TestimonialsSection: FC = () => {
  return (
    <section
      className="py-24 lg:py-32"
      style={{ background: 'linear-gradient(180deg, #F8F9FC 0%, #EEF2FB 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium"
            style={{
              background: 'rgba(200,150,44,0.1)',
              border: '1px solid rgba(200,150,44,0.25)',
              color: CHURCH_GOLD,
            }}
          >
            From Real Churches
          </div>
          <h2
            className="mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              color: 'var(--foreground)',
              lineHeight: 1.2,
            }}
          >
            Trusted by Pastors,
            <br />
            <em style={{ color: 'var(--church-blue)', fontStyle: 'italic' }}>Loved by Congregations</em>
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            Hear from the pastors, media teams, and members who use My Church every Sunday.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial: Testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
