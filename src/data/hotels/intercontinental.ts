import type { Hotel } from "./types";

export const intercontinental: Hotel = {
  id: "intercontinental",
  name: "InterContinental Grand Ho Tram",
  tagline: {
    ko: "베트남 청정 해안 위의 럭셔리",
    en: "Luxury on Vietnam's untouched coastline"
  },
  description: {
    ko: "호치민시에서 약 2시간 거리, 2.2km에 이르는 청정 해안선 위에 자리한 인터컨티넨탈 그랜드 호짬은 더 그랜드 호짬 복합 리조트의 중심 호텔입니다. 모든 객실에서 바다 또는 더 블러프스 골프 코스의 사구 풍경을 감상할 수 있으며, 단지 내 다이닝과 엔터테인먼트, 나이트라이프도 함께 즐기실 수 있습니다.",
    en: "Set on 2.2 km of untouched coastline about two hours from Ho Chi Minh City, the InterContinental Grand Ho Tram is a centrepiece of The Grand Ho Tram complex. Every room looks out over the ocean or the dunes of The Bluffs golf course, and guests can enjoy the complex's dining, entertainment and nightlife."
  },
  cover: "intercontinental/1-king-junior-suite-ocean-view-1.jpg",
  checkIn: "16:00",
  checkOut: "12:00",
  categories: [
    {
      key: "classic",
      label: {
        ko: "클래식",
        en: "Classic"
      }
    },
    {
      key: "grand",
      label: {
        ko: "그랜드",
        en: "Grand"
      }
    },
    {
      key: "suite",
      label: {
        ko: "스위트",
        en: "Suite"
      }
    }
  ],
  rooms: [
    {
      slug: "2-twin-beds-classic-ocean-view",
      category: "classic",
      name: "2 Twin Beds Classic Ocean View",
      description: {
        ko: "우아하게 꾸며진 47㎡ 객실에서 반짝이는 바다를 탁 트인 전망으로 즐겨 보세요. 넓은 욕실에는 대리석 바닥, 레인 샤워기, 깊은 독립형 욕조가 갖춰져 있습니다.",
        en: "Indulge in the sweeping view of sparkling ocean from this elegantly-appointed 47 sqm room. Spacious bathrooms feature marble flooring. Rain showers and deep standalone bathtubs."
      },
      size: "47 m²",
      guests: {
        en: "Up to 4",
        ko: "최대 4명"
      },
      beds: {
        ko: "트윈 침대 2개",
        en: "2 Twin Beds"
      },
      view: {
        ko: "바다 전망",
        en: "Ocean View"
      },
      amenities: [
        "in-room-safe",
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "mini-bar",
        "connecting-room",
        "bathtub-shower",
        "bathroom-accessories",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "alarm-clock",
        "tv-46"
      ],
      images: [
        "intercontinental/2-twin-beds-classic-ocean-view-1.jpg",
        "intercontinental/2-twin-beds-classic-ocean-view-2.jpg",
        "intercontinental/2-twin-beds-classic-ocean-view-3.jpg"
      ]
    },
    {
      slug: "2-twin-beds-classic",
      category: "classic",
      name: "2 Twin Beds Classic",
      description: {
        ko: "모던하고 활기찬 인테리어에 세심한 배려가 더해진 47㎡ 트윈 베드 클래식 객실입니다. 넓은 욕실에는 대리석 바닥, 레인 샤워기, 깊은 독립형 욕조가 갖춰져 있습니다.",
        en: "The 47 sqm Two Twin Beds Classic Rooms feature modern and vibrant décor, lavishly appointed with thoughtful touches. Spacious bathrooms feature marble flooring, rain showers, and deep standalone bathtubs."
      },
      size: "47 m²",
      guests: {
        en: "Up to 4",
        ko: "최대 4명"
      },
      beds: {
        ko: "트윈 침대 2개",
        en: "2 Twin Beds"
      },
      view: {
        ko: "정원 전망",
        en: "Garden View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "mini-bar",
        "connecting-room",
        "bathtub-shower",
        "bathroom-accessories",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-46",
        "alarm-clock",
        "in-room-safe"
      ],
      images: [
        "intercontinental/2-twin-beds-classic-ocean-view-3.jpg",
        "intercontinental/2-twin-beds-classic-2.jpg"
      ]
    },
    {
      slug: "1-king-bed-classic-ocean-view",
      category: "classic",
      name: "1 King Bed Classic Ocean View",
      description: {
        ko: "우아하게 꾸며진 47㎡ 객실에서 반짝이는 바다를 탁 트인 전망으로 즐겨 보세요. 넓은 욕실에는 대리석 바닥, 레인 샤워기, 깊은 독립형 욕조가 갖춰져 있습니다.",
        en: "Indulge in the sweeping view of sparkling ocean from this elegantly-appointed 47 sqm room. Spacious bathrooms feature marble flooring. Rain showers and deep standalone bathtubs."
      },
      size: "47 m²",
      guests: {
        en: "Up to 4",
        ko: "최대 4명"
      },
      beds: {
        ko: "킹 침대 1개",
        en: "1 King Bed"
      },
      view: {
        ko: "바다 전망",
        en: "Ocean View"
      },
      amenities: [
        "room-service-24h",
        "coffee-tea-supplies",
        "buffet-breakfast",
        "mini-bar",
        "bathtub-shower",
        "connecting-room",
        "bathroom-accessories",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-46",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "intercontinental/1-king-bed-classic-ocean-view-1.jpg",
        "intercontinental/1-king-bed-classic-ocean-view-2.jpg"
      ]
    },
    {
      slug: "1-king-bed-classic",
      category: "classic",
      name: "1 King Bed Classic",
      description: {
        ko: "모던하고 활기찬 인테리어에 세심한 배려가 더해진 47㎡ 킹 베드 객실입니다. 넓은 욕실에는 대리석 바닥, 레인 샤워기, 깊은 독립형 욕조가 갖춰져 있습니다.",
        en: "The 47 sqm One King Bed Rooms feature modern and vibrant décor, lavishly appointed with thoughtful touches. Spacious bathrooms feature marble flooring, rain showers, and deep standalone bathtubs."
      },
      size: "47 m²",
      guests: {
        en: "Up to 4",
        ko: "최대 4명"
      },
      beds: {
        ko: "킹 침대 1개",
        en: "1 King Bed"
      },
      view: {
        ko: "정원 전망",
        en: "Garden View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "mini-bar",
        "connecting-room",
        "bathtub-shower",
        "bathroom-accessories",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-46",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "intercontinental/1-king-bed-classic-1.jpg",
        "intercontinental/1-king-bed-classic-ocean-view-2.jpg",
        "intercontinental/1-king-bed-classic-3.jpg"
      ]
    },
    {
      slug: "2-twin-beds-classic-grand-ocean-view",
      category: "grand",
      name: "2 Twin Beds Classic Grand Ocean View",
      description: {
        ko: "푹신하고 편안한 트윈 침실과 47㎡의 넉넉한 공간, 대리석 더블 세면대, 바닥부터 천장까지 이어지는 통창을 갖춘 객실입니다. 높은 층에서 펼쳐지는 아름다운 바다 파노라마 전망과 다양한 객실 내 편의시설을 누려 보세요.",
        en: "Features a plush and comfortable Twin bedroom with 47 sqm living space plus double marble vanities and floor to ceiling windows. Enjoy beautiful panoramic views of the ocean on higher floors together with a wide variety of in-room amenities."
      },
      size: "47 m²",
      guests: {
        en: "Up to 4",
        ko: "최대 4명"
      },
      beds: {
        ko: "트윈 침대 2개",
        en: "2 Twin Beds"
      },
      view: {
        ko: "바다 전망",
        en: "Ocean View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "mini-bar",
        "connecting-room",
        "bathtub-shower",
        "bathroom-accessories",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-46",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "intercontinental/2-twin-beds-classic-grand-ocean-view-1.jpg",
        "intercontinental/2-twin-beds-classic-grand-ocean-view-2.jpg",
        "intercontinental/2-twin-beds-classic-grand-ocean-view-3.jpg",
        "intercontinental/2-twin-beds-classic-grand-ocean-view-4.jpg"
      ]
    },
    {
      slug: "1-king-bed-classic-grand-ocean-view",
      category: "grand",
      name: "1 King Bed Classic Grand Ocean View",
      description: {
        ko: "푹신하고 편안한 킹 침실과 47㎡의 넉넉한 공간, 대리석 더블 세면대, 바닥부터 천장까지 이어지는 통창을 갖춘 객실입니다. 높은 층에서 펼쳐지는 아름다운 바다 파노라마 전망과 다양한 객실 내 편의시설을 누려 보세요.",
        en: "Features plush and comfortable King bedroom with 47 sqm living space plus double marble vanities and floor to ceiling windows. Enjoy beautiful panoramic views of the ocean on higher floors together with a wide variety of in-room amenities."
      },
      size: "47 m²",
      guests: {
        en: "Up to 4",
        ko: "최대 4명"
      },
      beds: {
        ko: "킹 침대 1개",
        en: "1 King Bed"
      },
      view: {
        ko: "바다 전망",
        en: "Ocean View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "mini-bar",
        "connecting-room",
        "bathtub-shower",
        "bathroom-accessories",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-46",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "intercontinental/1-king-bed-classic-grand-ocean-view-1.jpg",
        "intercontinental/1-king-bed-classic-grand-ocean-view-2.jpg",
        "intercontinental/1-king-bed-classic-grand-ocean-view-3.jpg",
        "intercontinental/1-king-bed-classic-grand-ocean-view-4.jpg"
      ]
    },
    {
      slug: "2-twin-beds-classic-grand-golf-view",
      category: "grand",
      name: "2 Twin Beds Classic Grand Golf View",
      description: {
        ko: "푹신하고 편안한 트윈 침실과 47㎡의 넉넉한 공간, 대리석 더블 세면대, 바닥부터 천장까지 이어지는 통창을 갖춘 객실입니다. 높은 층에서 펼쳐지는 더 블러프스 골프 코스의 아름다운 파노라마 전망과 다양한 객실 내 편의시설을 누려 보세요.",
        en: "Features plush and comfortable Twin bedroom with 47 sqm living space plus double marble vanities and floor to ceiling windows. Enjoy beautiful panoramic views of The Bluffs golf course on higher floors together with a wide variety of in-room amenities."
      },
      size: "47 m²",
      guests: {
        en: "Up to 4",
        ko: "최대 4명"
      },
      beds: {
        ko: "트윈 침대 2개",
        en: "2 Twin Beds"
      },
      view: {
        ko: "골프 코스 전망",
        en: "Golf Course View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "mini-bar",
        "connecting-room",
        "bathtub-shower",
        "bathroom-accessories",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-46",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "intercontinental/2-twin-beds-classic-grand-golf-view-1.jpg",
        "intercontinental/2-twin-beds-classic-grand-golf-view-2.jpg"
      ]
    },
    {
      slug: "1-king-bed-classic-grand-golf-view",
      category: "grand",
      name: "1 King Bed Classic Grand Golf View",
      description: {
        ko: "푹신하고 편안한 킹 침실과 47㎡의 넉넉한 공간, 대리석 더블 세면대, 바닥부터 천장까지 이어지는 통창을 갖춘 객실입니다. 높은 층에서 펼쳐지는 더 블러프스 골프 코스의 아름다운 파노라마 전망과 다양한 객실 내 편의시설을 누려 보세요.",
        en: "Features plush and comfortable King bedroom with 47 sqm living space plus double marble vanities and floor to ceiling windows. Enjoy beautiful panoramic views of The Bluffs golf course on higher floors together with a wide variety of in-room amenities."
      },
      size: "47 m²",
      guests: {
        en: "Up to 4",
        ko: "최대 4명"
      },
      beds: {
        ko: "킹 침대 1개",
        en: "1 King Bed"
      },
      view: {
        ko: "골프 코스 전망",
        en: "Golf Course View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "mini-bar",
        "bathtub-shower",
        "connecting-room",
        "bathroom-accessories",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "in-room-safe",
        "alarm-clock",
        "tv-46"
      ],
      images: [
        "intercontinental/1-king-bed-classic-grand-golf-view-1.jpg",
        "intercontinental/1-king-bed-classic-grand-golf-view-2.jpg",
        "intercontinental/1-king-bed-classic-grand-golf-view-3.jpg"
      ]
    },
    {
      slug: "1-king-2-single-2-bedroom-royal-suite",
      category: "suite",
      name: "1 King 2 Single 2 Bedroom Royal Suite",
      description: {
        ko: "럭셔리와 편안함이 우아하게 어우러진 로열 스위트는 프라이버시와 특별함을 원하는 가족이나 소규모 그룹에게 잘 어울립니다. 186㎡, 침실 2개로 구성되며 킹 침실과 트윈 침실 각 1개, 화려한 거실, 바다가 한눈에 내려다보이는 통창을 갖추고 있습니다. 로열 스위트 투숙객은 전용 VIP 체크인과 더 그랜드 라운지 특별 이용 혜택을 누릴 수 있습니다.",
        en: "An elegant blend of luxury and comfort, the Royal Suite is perfect for families or small groups seeking privacy and exclusivity. This 2-bedroom 186 sqm suite comes with one king and one twin bedroom, an opulent living room and floor-to-ceiling windows offering spectacular views over the ocean. The Royal Suite guests are also entitled with a private VIP check-in and receive special access to The Grand Lounge."
      },
      size: "186 m²",
      guests: {
        en: "Up to 6",
        ko: "최대 6명"
      },
      beds: {
        ko: "킹 침대 1개, 싱글 침대 2개",
        en: "1 King Bed & 2 Single Beds"
      },
      view: {
        ko: "바다 전망",
        en: "Ocean View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "mini-bar",
        "bathtub-shower",
        "bathroom-accessories",
        "coffee-maker",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-46",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "intercontinental/1-king-2-single-2-bedroom-royal-suite-1.jpg",
        "intercontinental/1-king-2-single-2-bedroom-royal-suite-2.jpg",
        "intercontinental/1-king-2-single-2-bedroom-royal-suite-3.jpg"
      ]
    },
    {
      slug: "1-king-1-bedroom-suite-grand-ocean-view",
      category: "suite",
      name: "1 King 1 Bedroom Suite Grand Ocean View",
      description: {
        ko: "반짝이는 바다의 파노라마 전망이 펼쳐지는 통창을 갖춘 143㎡ 규모의 스위트입니다. 특별한 어메니티와 넓은 침실, 중앙 거실, 다이닝 룸, 바 카운터가 마련되어 있으며, 욕실은 대리석 바닥에 레인 샤워기와 깊은 독립형 욕조를 갖추고 있습니다.",
        en: "Features 143 sqm of living space including floor to ceiling windows overlooking the panoramic view of the sparkling ocean. Special amenities plus a spacious bedroom. A central living room. A dining room. A bar counter and a marble flooring bathroom with rain shower with deep standalone bathtubs."
      },
      size: "143 m²",
      guests: {
        en: "Up to 4",
        ko: "최대 4명"
      },
      beds: {
        ko: "킹 침대 1개",
        en: "1 King Bed"
      },
      view: {
        ko: "바다 전망",
        en: "Ocean View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "mini-bar",
        "bathtub-shower",
        "bathroom-accessories",
        "coffee-maker",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-46",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "intercontinental/1-king-1-bedroom-suite-grand-ocean-view-1.jpg",
        "intercontinental/1-king-1-bedroom-suite-grand-ocean-view-2.jpg",
        "intercontinental/1-king-1-bedroom-suite-grand-ocean-view-3.jpg",
        "intercontinental/1-king-1-bedroom-suite-grand-ocean-view-4.jpg",
        "intercontinental/1-king-1-bedroom-suite-grand-ocean-view-5.jpg"
      ]
    },
    {
      slug: "1-king-1-bedroom-suite-grand-golf-view",
      category: "suite",
      name: "1 King 1 Bedroom Suite Grand Golf View",
      description: {
        ko: "더 블러프스 골프 코스의 파노라마 전망이 펼쳐지는 통창을 갖춘 143㎡ 규모의 스위트입니다. 특별한 어메니티와 넓은 침실, 거실, 다이닝 룸, 바 카운터가 마련되어 있습니다.",
        en: "Features 143 sqm of living space including floor to ceiling windows overlooking the panoramic view of The Bluffs golf course. Special amenities plus a spacious bedroom. A living room. A dining room. A bar counter."
      },
      size: "143 m²",
      guests: {
        en: "Up to 4",
        ko: "최대 4명"
      },
      beds: {
        ko: "킹 침대 1개",
        en: "1 King Bed"
      },
      view: {
        ko: "골프 코스 전망",
        en: "Golf Course View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "mini-bar",
        "bathtub-shower",
        "bathroom-accessories",
        "coffee-maker",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-46",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "intercontinental/1-king-1-bedroom-suite-grand-golf-view-1.jpg",
        "intercontinental/1-king-1-bedroom-suite-grand-golf-view-2.jpg"
      ]
    },
    {
      slug: "1-king-1-bedroom-suite-ocean-view",
      category: "suite",
      name: "1 King 1 Bedroom Suite Ocean View",
      description: {
        ko: "바다의 멋진 파노라마 전망이 펼쳐지는 통창을 갖춘 99㎡ 규모의 스위트입니다. 특별한 어메니티와 넓은 침실, 거실, 대리석 바닥 욕실이 있으며 욕실에는 레인 샤워기와 깊은 독립형 욕조가 있습니다.",
        en: "Features 99 sqm of living space including floor to ceiling windows overlooking the stunning panoramic view of the ocean. Special amenities plus a spacious bedroom with a living room and a bathroom with marble flooring. Rainshower and deep standalone bathtubs."
      },
      size: "99 m²",
      guests: {
        en: "Up to 4",
        ko: "최대 4명"
      },
      beds: {
        ko: "킹 침대 1개",
        en: "1 King Bed"
      },
      view: {
        ko: "바다 전망",
        en: "Ocean View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "mini-bar",
        "bathtub-shower",
        "bathroom-accessories",
        "coffee-maker",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-46",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "intercontinental/1-king-1-bedroom-suite-ocean-view-1.jpg",
        "intercontinental/1-king-1-bedroom-suite-ocean-view-2.jpg"
      ]
    },
    {
      slug: "1-king-1-bedroom-suite-golf-view",
      category: "suite",
      name: "1 King 1 Bedroom Suite Golf View",
      description: {
        ko: "더 블러프스 골프 코스가 내려다보이는 통창을 갖춘 99㎡ 규모의 스위트입니다. 특별한 어메니티와 넓은 침실, 거실, 대리석 바닥 욕실이 있으며 욕실에는 레인 샤워기와 깊은 독립형 욕조가 있습니다.",
        en: "Features 99 sqm of living space including floor to ceiling windows overlooking the view of The Bluffs golf course. Special amenities plus a spacious bedroom. A living room and a bathroom with marble flooring. Rainshower and deep standalone bathtubs."
      },
      size: "99 m²",
      guests: {
        en: "Up to 4",
        ko: "최대 4명"
      },
      beds: {
        ko: "킹 침대 1개",
        en: "1 King Bed"
      },
      view: {
        ko: "골프 코스 전망",
        en: "Golf Course View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "mini-bar",
        "bathtub-shower",
        "bathroom-accessories",
        "coffee-maker",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-46",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "intercontinental/1-king-1-bedroom-suite-golf-view-1.jpg",
        "intercontinental/1-king-1-bedroom-suite-golf-view-2.jpg"
      ]
    },
    {
      slug: "1-king-junior-suite-ocean-view",
      category: "suite",
      name: "1 King Junior Suite Ocean View",
      description: {
        ko: "호화로운 공간과 아름다운 전망을 갖춘 주니어 스위트는 여유로운 편안함과 넓은 공간을 원하는 가족이나 커플에게 잘 어울립니다. 바다가 내려다보이는 통창이 있는 독립된 거실 공간이 마련되어 있으며, 욕실은 대리석 바닥, 2개의 세면대, 레인 샤워기, 깊은 독립형 욕조를 갖추고 있습니다.",
        en: "With its lavish setting and gorgeous views, the junior suite is perfect for families or couples who value that extra level of comfort and space. The suite features a separate living space with floor-to-ceiling windows overlooking the ocean. The bathroom is equipped with marble flooring, two separate vanities, rain shower and a deep standalone bathtub."
      },
      size: "67 m²",
      guests: {
        en: "Up to 4",
        ko: "최대 4명"
      },
      beds: {
        ko: "킹 침대 1개",
        en: "1 King Bed"
      },
      view: {
        ko: "바다 전망",
        en: "Ocean View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "mini-bar",
        "bathtub-shower",
        "bathroom-accessories",
        "coffee-maker",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-46",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "intercontinental/1-king-junior-suite-ocean-view-1.jpg",
        "intercontinental/1-king-junior-suite-ocean-view-2.jpg",
        "intercontinental/1-king-bed-classic-grand-ocean-view-4.jpg"
      ]
    }
  ]
};
