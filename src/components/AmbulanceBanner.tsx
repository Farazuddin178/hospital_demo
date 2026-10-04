import { Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-data";
import { locations } from "@/lib/home-content";

const tel = (value: string) => `tel:${value.replace(/[\s-]/g, "")}`;

/**
 * Emergency band on the homepage: who to call, with an illustration of an
 * Oxygen Hospital ambulance. The illustration is drawn here (not a photo) so it
 * can carry the hospital's own logo (no phone number on the vehicle, at the
 * hospital's request); swap in a real photograph of
 * the hospital's ambulance when one is available.
 *
 * Only claims the hospital has made are used: a 24/7 emergency line and the
 * two branch numbers. No response times or vehicle types until confirmed.
 */
export default function AmbulanceBanner() {
  return (
    <section aria-labelledby="ambulance-heading" className="bg-emergency-band relative overflow-hidden text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-20">
        <div className="lg:col-span-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-[#c2410c] px-4 py-1.5 text-sm font-semibold">
            <span className="siren-dot h-2 w-2 rounded-full bg-white" aria-hidden="true" />
            Emergency line open 24/7
          </p>
          <h2 id="ambulance-heading" className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.1] !text-white sm:text-5xl">
            24/7 Emergency and Ambulance Service in Hyderabad
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-100">
            Call the branch nearest you. Our team will guide you over the phone and send help
            on the way.
          </p>

          <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {locations.map((location) => (
              <li key={location.slug}>
                <a
                  href={tel(location.phone)}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 text-brand-900 shadow-soft transition duration-300 ease-calm hover:bg-brand-50 active:scale-[0.98] sm:w-auto"
                >
                  <Phone className="h-5 w-5 text-[#c2410c]" strokeWidth={2} aria-hidden="true" />
                  <span className="text-left leading-tight">
                    <span className="block text-xs font-medium text-ink-muted">{location.area}</span>
                    <span className="block font-semibold">{location.phone}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6">
          <AmbulanceIllustration />
        </div>
      </div>
    </section>
  );
}

function AmbulanceIllustration() {
  const ink = "#142c3c";
  const red = "#c62828";
  return (
    <svg
      viewBox="0 0 640 320"
      role="img"
      aria-label={`${siteConfig.name} ambulance`}
      className="ambulance mx-auto w-full max-w-xl drop-shadow-2xl"
    >
      {/* Ground shadow */}
      <ellipse cx="330" cy="292" rx="290" ry="12" fill="#000" opacity="0.28" />

      <g className="ambulance-body">
        {/* Rear box */}
        <rect x="200" y="58" width="410" height="200" rx="16" fill="#fbfcfd" />
        {/* Cab */}
        <path d="M206 100 H128 Q108 100 99 117 L66 180 Q44 186 44 208 V246 Q44 258 56 258 H206 Z" fill="#f1f4f7" />
        {/* Windscreen / side window */}
        <path d="M196 114 H134 Q124 114 118 124 L92 172 H196 Z" fill="#9fc3dc" />
        <path d="M196 114 H170 L150 172 H196 Z" fill="#c4dcec" opacity="0.7" />
        {/* Cab door seam and handle */}
        <path d="M150 182 V252" stroke="#c9d3dc" strokeWidth="2" />
        <rect x="166" y="190" width="18" height="5" rx="2.5" fill="#8a99a6" />

        {/* Red stripe along the vehicle */}
        <path d="M44 214 H610 V232 H44 Z" fill={red} />
        <path d="M44 236 H610 V241 H44 Z" fill={red} opacity="0.55" />

        {/* Headlight and bumper */}
        <rect x="44" y="196" width="16" height="12" rx="3" fill="#ffd27a" />
        <rect x="40" y="246" width="40" height="12" rx="4" fill="#9aa7b2" />
        <rect x="596" y="246" width="20" height="12" rx="4" fill="#9aa7b2" />

        {/* Roof light bar on the cab, and warning lights on the box */}
        <rect x="118" y="86" width="74" height="14" rx="6" fill="#2b3640" />
        <rect className="siren siren-red" x="121" y="88" width="34" height="10" rx="4" fill="#ff3b3b" />
        <rect className="siren siren-blue" x="155" y="88" width="34" height="10" rx="4" fill="#3b82ff" />
        <rect className="siren siren-red" x="214" y="48" width="26" height="12" rx="4" fill="#ff3b3b" />
        <rect className="siren siren-blue" x="572" y="48" width="26" height="12" rx="4" fill="#3b82ff" />

        {/* Rear door line */}
        <path d="M586 70 V250" stroke="#d5dde4" strokeWidth="2" />

        {/* Branding: the hospital's own logo and name */}
        <image href={siteConfig.logo} x="222" y="76" width="64" height="75" />
        <text x="300" y="108" fill={ink} fontFamily="Inter, system-ui, sans-serif" fontSize="27" fontWeight="800" letterSpacing="0.5">
          OXYGEN HOSPITAL
        </text>
        <text x="301" y="134" fill="#4a5a67" fontFamily="Inter, system-ui, sans-serif" fontSize="14" fontWeight="600" letterSpacing="2.5">
          MULTI SPECIALTY
        </text>
        <text x="300" y="196" fill={red} fontFamily="Inter, system-ui, sans-serif" fontSize="34" fontWeight="900" letterSpacing="4">
          AMBULANCE
        </text>

        {/* Star of life, on the cab door */}
        <g transform="translate(106 194) scale(0.75)" fill="#1d6fd8">
          <rect x="-6" y="-24" width="12" height="48" rx="2" />
          <rect x="-6" y="-24" width="12" height="48" rx="2" transform="rotate(60)" />
          <rect x="-6" y="-24" width="12" height="48" rx="2" transform="rotate(-60)" />
          <path d="M0 -15 V15" stroke="#fff" strokeWidth="2.5" />
        </g>

      </g>

      {/* Wheels */}
      {[148, 488].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="262" r="40" fill="#1b2630" />
          <circle cx={cx} cy="262" r="32" fill="#2c3944" />
          <circle cx={cx} cy="262" r="14" fill="#a7b4bf" />
          <circle cx={cx} cy="262" r="5" fill="#5b6a76" />
        </g>
      ))}
    </svg>
  );
}
