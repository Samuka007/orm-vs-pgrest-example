import Link from 'next/link'

interface FeatureCardProps {
  title: string
  subtitle: string
  color: 'blue' | 'purple'
  features: string[]
  linkHref: string
  linkText: string
}

export function FeatureCard({
  title,
  subtitle,
  color,
  features,
  linkHref,
  linkText,
}: FeatureCardProps) {
  const colorClasses = {
    blue: {
      border: 'border-blue-200 dark:border-blue-800',
      bg: 'bg-blue-50 dark:bg-blue-950',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      title: 'text-blue-900 dark:text-blue-100',
      subtitle: 'text-blue-700 dark:text-blue-300',
      feature: 'text-blue-800 dark:text-blue-200',
      checkColor: 'text-blue-500',
      button: 'bg-blue-500 hover:bg-blue-600 text-white',
    },
    purple: {
      border: 'border-purple-200 dark:border-purple-800',
      bg: 'bg-purple-50 dark:bg-purple-950',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
      title: 'text-purple-900 dark:text-purple-100',
      subtitle: 'text-purple-700 dark:text-purple-300',
      feature: 'text-purple-800 dark:text-purple-200',
      checkColor: 'text-purple-500',
      button: 'bg-purple-500 hover:bg-purple-600 text-white',
    },
  }

  const classes = colorClasses[color]

  return (
    <div className={`rounded-2xl border ${classes.border} ${classes.bg} p-6`}>
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${classes.iconBg}`}>
          {color === 'blue' ? (
            <svg className={`h-6 w-6 ${classes.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          ) : (
            <svg className={`h-6 w-6 ${classes.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          )}
        </div>
        <div>
          <h3 className={`text-xl font-bold ${classes.title}`}>{title}</h3>
          <p className={`mt-1 text-sm ${classes.subtitle}`}>{subtitle}</p>
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {features.map((feature) => (
          <li key={feature} className={`flex items-start gap-2 ${classes.feature}`}>
            <svg className={`mt-1 h-4 w-4 flex-shrink-0 ${classes.checkColor}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Link
          href={linkHref}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${classes.button}`}
        >
          {linkText}
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}