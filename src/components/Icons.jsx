// Small inline SVG icon set (stroke icons inherit currentColor).
const base = (size) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
})

export const PlayIcon = ({ size = 22 }) => (
  <svg {...base(size)} fill="currentColor" stroke="none">
    <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
  </svg>
)
export const InfoIcon = ({ size = 22 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-5M12 8h.01" />
  </svg>
)
export const PlusIcon = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)
export const CheckIcon = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="m5 12 5 5 9-10" />
  </svg>
)
export const ChevronDown = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)
export const ChevronLeft = ({ size = 28 }) => (
  <svg {...base(size)}>
    <path d="m15 18-6-6 6-6" />
  </svg>
)
export const ChevronRight = ({ size = 28 }) => (
  <svg {...base(size)}>
    <path d="m9 18 6-6-6-6" />
  </svg>
)
export const CloseIcon = ({ size = 22 }) => (
  <svg {...base(size)}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)
export const SearchIcon = ({ size = 22 }) => (
  <svg {...base(size)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)
export const BellIcon = ({ size = 22 }) => (
  <svg {...base(size)}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
)
export const ArrowLeft = ({ size = 28 }) => (
  <svg {...base(size)}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)
export const PencilIcon = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
)
