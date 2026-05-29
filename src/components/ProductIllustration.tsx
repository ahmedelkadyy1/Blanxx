import React from 'react';

interface ProductIllustrationProps {
  id: string;
  className?: string;
  accentClass?: string;
}

export const ProductIllustration: React.FC<ProductIllustrationProps> = ({
  id,
  className = '',
  accentClass = 'text-stone-700'
}) => {
  // Base SVG rendering depending on product ID
  switch (id) {
    case 'ves-01': // Ceramic Brewing Vessel
      return (
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          {/* Subtle grounding glowing ring */}
          <circle cx="100" cy="115" r="45" fill="white" fillOpacity="0.4" />
          <circle cx="100" cy="115" r="30" fill="white" fillOpacity="0.6" />
          
          {/* Teapot Spout */}
          <path
            d="M55 105C40 105 32 98 28 85C32 82 40 85 46 92L55 101"
            className={accentClass}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Teapot Body */}
          <path
            d="M60 120C60 90 140 90 140 120C140 135 125 145 100 145C75 145 60 135 60 120Z"
            fill="currentColor"
            fillOpacity="0.08"
            className={accentClass}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Lid & Lid Knob */}
          <path
            d="M80 94C84 91 92 89 100 89C108 89 116 91 120 94"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="100" cy="85" r="4" fill="currentColor" className={accentClass} />
          
          {/* Grounding Base Shadow */}
          <ellipse cx="100" cy="145" rx="35" ry="4" fill="currentColor" fillOpacity="0.12" />
          
          {/* Side Handle (Traditional Kyusu style) */}
          <path
            d="M135 110C155 105 168 100 178 102"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* Subtle tea rising steam */}
          <path
            d="M50 70Q45 60 50 50"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.3"
            strokeLinecap="round"
          />
          <path
            d="M56 68Q52 58 58 48"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'rit-02': // Basalt Aroma Diffuser Set
      return (
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          {/* Backdrop circles */}
          <circle cx="100" cy="110" r="50" fill="white" fillOpacity="0.4" />
          
          {/* Basalt plates stacked */}
          {/* Bottom Plate */}
          <path
            d="M45 135C45 120 155 120 155 135C155 145 130 150 100 150C70 150 45 145 45 135Z"
            fill="currentColor"
            fillOpacity="0.08"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            className={accentClass}
          />
          <path d="M45 135V140C45 146 70 152 100 152C130 152 155 146 155 140V135" stroke="currentColor" strokeWidth="1.5" />
          
          {/* Top Plate */}
          <path
            d="M60 115C60 105 140 105 140 115C140 123 120 128 100 128C80 128 60 123 60 115Z"
            fill="currentColor"
            fillOpacity="0.15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            className={accentClass}
          />
          <path d="M60 115V119C60 124 80 129 100 129C120 129 140 124 140 119V115" stroke="currentColor" strokeWidth="2" />
          
          {/* Essential Oil Dropper bottle on the side */}
          <rect
            x="125"
            y="65"
            width="22"
            height="40"
            rx="3"
            fill="currentColor"
            fillOpacity="0.05"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <rect x="131" y="58" width="10" height="7" rx="1" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5" />
          
          {/* Gravity essence droplet */}
          <path
            d="M100 68C100 68 95 75 95 80C95 83 97.2 85 100 85C102.8 85 105 83 105 80C105 75 100 68 100 68Z"
            fill="currentColor"
            className={accentClass}
          />
          
          {/* Concentric ripples on the rock */}
          <ellipse cx="100" cy="115" rx="20" ry="6" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" strokeOpacity="0.5" />
          <ellipse cx="100" cy="115" rx="10" ry="3" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5" />
          
          {/* Ground shadow */}
          <ellipse cx="100" cy="152" rx="55" ry="3" fill="currentColor" fillOpacity="0.1" />
        </svg>
      );

    case 'tex-03': // Undyed Linen Meditation Journal
      return (
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          {/* Ambient white halo */}
          <circle cx="100" cy="100" r="50" fill="white" fillOpacity="0.5" />
          
          {/* Soft shadow */}
          <path
            d="M60 148L140 148H145"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeOpacity="0.1"
          />
          
          {/* Journal Cover */}
          <rect
            x="65"
            y="50"
            width="74"
            height="94"
            rx="4"
            fill="currentColor"
            fillOpacity="0.06"
            stroke="currentColor"
            strokeWidth="2"
            className={accentClass}
          />
          
          {/* Spine Detail */}
          <path
            d="M72 50V144"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="2 3"
          />
          <path
            d="M65 50V144"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          
          {/* Linen Texture Minimal Lines */}
          <path d="M85 70H120M85 82H120M85 94H110" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" strokeLinecap="round" />
          
          {/* Hanging bookmark ribbon */}
          <path
            d="M102 144C102 153 96 156 98 166"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className={accentClass}
          />
          
          {/* Botanical leaf stamp representing nature grounding */}
          <path
            d="M102 108C108 108 112 112 112 118C108 118 102 114 102 108Z"
            fill="currentColor"
            fillOpacity="0.15"
            className={accentClass}
          />
          <path
            d="M102 108C96 108 92 112 92 118C96 118 102 114 102 108Z"
            fill="currentColor"
            fillOpacity="0.15"
            className={accentClass}
          />
          <path d="M102 108V119" stroke="currentColor" strokeWidth="1" className={accentClass} />
        </svg>
      );

    case 'obj-04': // Volcanic Sand Timer
      return (
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          <circle cx="100" cy="100" r="45" fill="white" fillOpacity="0.5" />
          
          {/* Wooden Top and Bottom Caps */}
          <rect x="70" y="44" width="60" height="6" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
          <rect x="70" y="150" width="60" height="6" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" />
          
          {/* Glass pillars */}
          <line x1="74" y1="50" x2="74" y2="150" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="126" y1="50" x2="126" y2="150" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
          
          {/* Hourglass Bulb */}
          <path
            d="M80 50C80 85 96 95 96 100C96 105 80 115 80 150"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path
            d="M120 50C120 85 104 95 104 100C104 105 120 115 120 150"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          
          {/* Running sand stream */}
          <line
            x1="100"
            y1="96"
            x2="100"
            y2="148"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className={accentClass}
          />
          
          {/* Falling / Settled Sand in Lower Bulb */}
          <path
            d="M85 149C90 132 110 132 115 149"
            fill="currentColor"
            fillOpacity="0.3"
            className={accentClass}
          />
          <path
            d="M93 149C95 140 105 140 107 149"
            fill="currentColor"
            fillOpacity="0.5"
            className={accentClass}
          />
          
          {/* Remaining Sand in Upper Bulb */}
          <path
            d="M83 51C85 70 115 70 117 51"
            fill="currentColor"
            fillOpacity="0.25"
            className={accentClass}
          />
          
          {/* Bottom shadow */}
          <ellipse cx="100" cy="158" rx="35" ry="3" fill="currentColor" fillOpacity="0.12" />
        </svg>
      );

    case 'ves-05': // Terracotta Bud Vase
      return (
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          {/* Halo backdrop */}
          <circle cx="106" cy="116" r="40" fill="white" fillOpacity="0.5" />
          
          {/* Single wild flower branch sprouting up */}
          <path
            d="M100 110C100 80 110 50 115 35"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className={accentClass}
          />
          
          {/* Small delicate leaf outlines */}
          <path d="M104 74C112 70 116 71 120 75" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className={accentClass} />
          <path d="M106 58C98 52 95 54 92 58" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className={accentClass} />
          
          {/* Small blossom buds at the tip */}
          <circle cx="115" cy="35" r="3" fill="currentColor" className={accentClass} />
          <circle cx="118" cy="31" r="1.5" fill="currentColor" className={accentClass} opacity="0.8" />
          <circle cx="111" cy="36" r="1.5" fill="currentColor" className={accentClass} opacity="0.8" />
          
          {/* Ceramic Vase Body */}
          <path
            d="M93 110C93 100 97 90 97 80C97 78 103 78 103 80C103 90 107 100 107 110C117 114 121 126 121 138C121 146 112 150 100 150C88 150 79 146 79 138C79 126 83 114 93 110Z"
            fill="currentColor"
            fillOpacity="0.08"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            className={accentClass}
          />
          
          {/* Subtle potter's rings */}
          <path d="M83 133C92 136 108 136 117 133" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
          <path d="M88 123C95 125 105 125 112 123" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
          
          {/* Ground drop-shadow */}
          <ellipse cx="100" cy="150" rx="25" ry="3" fill="currentColor" fillOpacity="0.1" />
        </svg>
      );

    case 'tex-06': // Waffle Organic Cotton Throw
      return (
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          <circle cx="100" cy="100" r="48" fill="white" fillOpacity="0.5" />
          
          {/* Dynamic draped throw blanket curves */}
          <path
            d="M50 120C65 75 110 70 120 110C130 150 150 120 160 135"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className={accentClass}
          />
          
          <path
            d="M57 127C72 87 114 82 123 119C131 155 147 132 153 141"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.5"
          />
          
          {/* Waffle pattern lines cross waves */}
          <line x1="72" y1="90" x2="84" y2="108" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4" />
          <line x1="84" y1="84" x2="96" y2="102" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4" />
          <line x1="96" y1="80" x2="108" y2="98" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4" />
          <line x1="108" y1="82" x2="120" y2="100" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4" />
          
          <line x1="84" y1="108" x2="96" y2="90" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4" />
          <line x1="96" y1="102" x2="108" y2="84" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4" />
          
          {/* Fringes dangling at the end */}
          <path d="M47 123l-3 6M50 125l-2 7M53 126l-1 7M56 128l1 6" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
          
          {/* Soft grounding plate ellipse */}
          <ellipse cx="105" cy="142" rx="45" ry="4" fill="currentColor" fillOpacity="0.08" />
        </svg>
      );

    case 'rit-07': // Wild Cypress Incense Brick
      return (
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          <circle cx="100" cy="110" r="45" fill="white" fillOpacity="0.5" />
          
          {/* Little coin stone stand */}
          <ellipse cx="100" cy="130" rx="32" ry="7" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="1.5" className={accentClass} />
          <ellipse cx="100" cy="128" rx="14" ry="4" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" />
          
          {/* Burning incense cuboid/brick */}
          <path
            d="M93 103 L100 95 L107 103 L100 111 Z"
            fill="currentColor"
            fillOpacity="0.4"
            className={accentClass}
          />
          <path
            d="M93 103 L93 124 L100 132 L100 111 Z"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M100 111 L100 132 L107 124 L107 103 Z"
            fill="currentColor"
            fillOpacity="0.3"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M93 103 L100 95 L107 103 L100 111 Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          
          {/* Glowing continuous ember tip */}
          <circle cx="100" cy="101" r="2.5" fill="#C07F5F" />
          
          {/* Gentle twisting thin smoke trail rising */}
          <path
            d="M100 95 C98 80 110 70 102 52 C96 38 106 30 100 18"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="1 2"
            strokeOpacity="0.4"
            className={accentClass}
          />
          
          <ellipse cx="100" cy="133" rx="35" ry="3" fill="currentColor" fillOpacity="0.08" />
        </svg>
      );

    case 'obj-08': // Raw Brass Presentation Tray
      return (
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          <circle cx="100" cy="105" r="45" fill="white" fillOpacity="0.4" />
          
          {/* Beautiful metallic angled presentation plate */}
          <path
            d="M40 120 C35 110 40 102 60 100 L140 90 C160 88 165 96 160 106 L140 126 C135 131 125 134 105 136 L55 138 C42 138 38 130 40 120 Z"
            fill="currentColor"
            fillOpacity="0.08"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
            className={accentClass}
          />
          
          {/* Inner bezel outline for brass lip */}
          <path
            d="M46 118 C43 111 48 106 62 104 L136 94 C150 92 154 98 150 106 L134 122 C130 127 122 129 104 131 L58 132 C47 132 44 125 46 118 Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
          
          {/* Minimal personal key relic resting on the tray */}
          <path
            d="M75 116 C71 118 69 114 70 110 C72 107 76 105 81 106 L95 102 L96 106 M89 104 L89 108"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            className={accentClass}
          />
          
          {/* Solitary leaf token resting alongside keys */}
          <path
            d="M110 115 C115 110 128 114 122 120 C116 126 112 120 110 115"
            fill="currentColor"
            fillOpacity="0.16"
            className={accentClass}
          />
          <path d="M110 115l6 3" stroke="currentColor" strokeWidth="0.75" className={accentClass} />
          
          {/* Reflection gloss streaks */}
          <line x1="85" y1="112" x2="115" y2="108" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" strokeLinecap="round" />
          <line x1="90" y1="120" x2="125" y2="115" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.15" strokeLinecap="round" />
          
          <ellipse cx="100" cy="140" rx="60" ry="3" fill="currentColor" fillOpacity="0.06" />
        </svg>
      );

    default:
      return (
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          <circle cx="100" cy="100" r="40" fill="currentColor" fillOpacity="0.1" />
          <rect x="70" y="70" width="60" height="60" rx="4" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      );
  }
};
