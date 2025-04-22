export const EmptyResponse = () => {
  return (
    <section className="flex flex-col gap-8">
      <svg
        className="w-90"
        viewBox="0 0 457 399"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_f_423_20301)">
          <rect
            x="247.177"
            y="44.875"
            width="178.508"
            height="261.498"
            rx="9.39514"
            transform="rotate(21.9323 247.177 44.875)"
            fill="#17181C"
          />
        </g>
        <rect
          x="250.804"
          y="62"
          width="158.935"
          height="232.53"
          rx="9.39514"
          transform="rotate(21.9323 250.804 62)"
          fill="url(#paint0_linear_423_20301)"
        />
        <rect
          x="294.058"
          y="92.9219"
          width="94.7344"
          height="25.0537"
          rx="6.26343"
          transform="rotate(21.9323 294.058 92.9219)"
          fill="#454754"
        />
        <rect
          x="198.965"
          y="224.277"
          width="100.998"
          height="18.7903"
          rx="6.26343"
          transform="rotate(21.93 198.965 224.277)"
          fill="#454754"
        />
        <rect
          x="187.269"
          y="253.328"
          width="53.4064"
          height="18.7903"
          rx="6.26343"
          transform="rotate(21.93 187.269 253.328)"
          fill="#454754"
        />
        <g filter="url(#filter2_f_423_20301)">
          <rect
            x="46.2974"
            y="79.9258"
            width="178.508"
            height="261.498"
            rx="9.39514"
            transform="rotate(-7.94475 46.2974 79.9258)"
            fill="#17181C"
          />
        </g>
        <rect
          x="57.9727"
          y="92.9688"
          width="158.935"
          height="232.53"
          rx="9.39514"
          transform="rotate(-7.94475 57.9727 92.9688)"
          fill="url(#paint1_linear_423_20301)"
        />
        <rect
          x="110.881"
          y="98.2344"
          width="94.7344"
          height="25.0537"
          rx="6.26343"
          transform="rotate(-7.94475 110.881 98.2344)"
          fill="#454754"
        />
        <rect
          x="93.8618"
          y="259.504"
          width="100.998"
          height="18.7903"
          rx="6.26343"
          transform="rotate(-7.94475 93.8618 259.504)"
          fill="#454754"
        />
        <rect
          x="98.1904"
          y="290.52"
          width="53.4064"
          height="18.7903"
          rx="6.26343"
          transform="rotate(-7.94475 98.1904 290.52)"
          fill="#454754"
        />
        <defs>
          <filter
            id="filter0_f_423_20301"
            x="71.2115"
            y="-33.4179"
            width="419.846"
            height="465.832"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="23.4879"
              result="effect1_foregroundBlur_423_20301"
            />
          </filter>
          <filter
            id="filter2_f_423_20301"
            x="-31.9955"
            y="-23.039"
            width="369.524"
            height="440.246"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="23.4879"
              result="effect1_foregroundBlur_423_20301"
            />
          </filter>
          <linearGradient
            id="paint0_linear_423_20301"
            x1="330.271"
            y1="62"
            x2="330.271"
            y2="294.53"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#2E3038" />
            <stop offset="1" stopColor="#17181C" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_423_20301"
            x1="137.44"
            y1="92.9688"
            x2="137.44"
            y2="325.499"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#2E3038" />
            <stop offset="1" stopColor="#17181C" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-gray-white text-2xl font-medium">
          Aucune avant-première disponible
        </h1>
        <p className="text-gray-500 font-light text-center">
          Vos critères actuels de recherche ne permettent pas de
          <br />
          trouver une (ou plusieurs) avant-première
        </p>
      </div>
    </section>
  )
}
