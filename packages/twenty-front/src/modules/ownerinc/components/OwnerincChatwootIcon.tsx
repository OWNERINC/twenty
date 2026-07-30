import { type IconComponent } from 'twenty-ui/icon';

// Exact geometry and color sampled from Chatwoot's served 96 px favicon.
export const OwnerincChatwootIcon: IconComponent = ({
  className,
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
    viewBox="0 0 16 16"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
      fill="#47A7F6"
    />
    <path
      d="M11.4172 11.4172H7.70831C5.66383 11.4172 4 9.75328 4 7.70828C4 5.66394 5.66383 4 7.70835 4C9.75339 4 11.4172 5.66394 11.4172 7.70828V11.4172Z"
      fill="white"
      stroke="white"
      strokeWidth="0.1875"
    />
  </svg>
);
