'use client'

import { useState } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '/',            label: 'Home'         },
  { href: '/registry',    label: 'Registry'     },
  { href: '/corpus',      label: 'Corpus'       },
  { href: '/classify',    label: 'Classify'     },
  { href: '/navigator',   label: 'Navigate'     },
  { href: '/glossary',    label: 'Glossary'     },
  { href: '/constraints', label: 'Constraints'  },
  { href: '/citations',   label: 'Citations'    },
  { href: '/contribute',  label: 'Contribute'   },
  { href: '/about',       label: 'About'        },
]

export default function NavShell() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* â”€â”€ Mobile hamburger button â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 flex flex-col justify-center gap-[5px] w-7 h-7"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-expanded={open}
      >
        <span className="block w-full h-px bg-near-black" />
        <span className="block w-full h-px bg-near-black" />
        <span className="block w-full h-px bg-near-black" />
      </button>

      {/* â”€â”€ Mobile overlay â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-near-black/30 z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* â”€â”€ Mobile drawer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <nav
        className={[
          'md:hidden fixed top-0 left-0 h-full w-52 z-50',
          'bg-off-white border-r border-rule-grey',
          'transform transition-transform duration-200 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        aria-label="Mobile navigation"
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 font-sans text-xs text-mid-grey hover:text-near-black"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        >
          âœ•
        </button>

        <div className="px-6 pt-8 pb-6">
          <div className="mb-6 border-b border-rule-grey pb-4">
            <p className="font-sans text-xs text-mid-grey leading-snug uppercase tracking-widest">
              UFTAGP
            </p>
          </div>

          <ul className="space-y-0">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="font-sans text-sm text-near-black hover:text-accent block py-2 border-b border-rule-grey/40 last:border-b-0"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* â”€â”€ Desktop fixed left rail â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <nav
        className="hidden md:flex fixed top-0 left-0 h-full w-52 flex-col bg-off-white border-r border-rule-grey"
        aria-label="Primary navigation"
      >
        <div className="px-6 pt-8 pb-6 flex flex-col h-full">
          <div className="mb-6">
            <p className="font-sans text-xs text-mid-grey leading-snug">
              The Unified Field Theory of
            </p>
            <p className="font-sans text-xs text-mid-grey leading-snug">
              Autonomous Governance Project
            </p>
          </div>

          <ul className="space-y-0 flex-1">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-sans text-sm text-near-black hover:text-accent block py-1.5"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  )
}

