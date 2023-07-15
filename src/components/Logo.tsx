import type {FC} from 'preact/compat'

import './Logo.scss'

interface LogoProps {
  size?: 'large' | 'medium' | 'small'
}
export const Logo: FC<LogoProps> = ({size = 'large'}) => {
  const buildedClass = `Logo ${size}`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      class={buildedClass}
      width="27.68"
      height="32"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 256 296"
    >
      <defs>
        <linearGradient id="grad" gradientTransform="rotate(30)">
          <stop offset="0%" stop-color="#3290ec" />
          <stop offset="100%" stop-color="#2270bc" />
        </linearGradient>
      </defs>
      <path
        class="Logo_background"
        // fill="#673AB8"
        fill="url(#grad)"
        d="m128 0l128 73.9v147.8l-128 73.9L0 221.7V73.9z"
      ></path>
      <path
        fill="#FFF"
        d="M34.865 220.478c17.016 21.78 71.095 5.185 122.15-34.704c51.055-39.888 80.24-88.345 63.224-110.126c-17.017-21.78-71.095-5.184-122.15 34.704c-51.055 39.89-80.24 88.346-63.224 110.126Zm7.27-5.68c-5.644-7.222-3.178-21.402 7.573-39.253c11.322-18.797 30.541-39.548 54.06-57.923c23.52-18.375 48.303-32.004 69.281-38.442c19.922-6.113 34.277-5.075 39.92 2.148c5.644 7.223 3.178 21.403-7.573 39.254c-11.322 18.797-30.541 39.547-54.06 57.923c-23.52 18.375-48.304 32.004-69.281 38.441c-19.922 6.114-34.277 5.076-39.92-2.147Z"
      ></path>
      <path
        fill="#FFF"
        d="M220.239 220.478c17.017-21.78-12.169-70.237-63.224-110.126C105.96 70.464 51.88 53.868 34.865 75.648c-17.017 21.78 12.169 70.238 63.224 110.126c51.055 39.889 105.133 56.485 122.15 34.704Zm-7.27-5.68c-5.643 7.224-19.998 8.262-39.92 2.148c-20.978-6.437-45.761-20.066-69.28-38.441c-23.52-18.376-42.74-39.126-54.06-57.923c-10.752-17.851-13.218-32.03-7.575-39.254c5.644-7.223 19.999-8.261 39.92-2.148c20.978 6.438 45.762 20.067 69.281 38.442c23.52 18.375 42.739 39.126 54.06 57.923c10.752 17.85 13.218 32.03 7.574 39.254Z"
      ></path>
      <path
        fill="#FFF"
        d="M127.552 167.667c10.827 0 19.603-8.777 19.603-19.604c0-10.826-8.776-19.603-19.603-19.603c-10.827 0-19.604 8.777-19.604 19.603c0 10.827 8.777 19.604 19.604 19.604Z"
      ></path>
    </svg>
  )
}
