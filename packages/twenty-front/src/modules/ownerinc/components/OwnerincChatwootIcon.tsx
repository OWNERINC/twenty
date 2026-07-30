import { type IconComponent } from 'twenty-ui/icon';

// Official Chatwoot bubble mark, sourced from chatwoot/chatwoot.
export const OwnerincChatwootIcon: IconComponent = ({
  className,
  color = 'currentColor',
  size = 20,
  style,
  'aria-hidden': ariaHidden,
}) => (
  <svg
    aria-hidden={ariaHidden}
    className={className}
    fill="none"
    height={size}
    style={style}
    viewBox="0 0 66 66"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M63 63H32.9976C16.4591 63 2.99996 49.5399 2.99996 32.9973C2.99996 16.4601 16.4591 3 32.9979 3C49.5408 3 63 16.4601 63 32.9973V63Z"
      fill={color}
      stroke={color}
      strokeWidth="6"
    />
  </svg>
);
