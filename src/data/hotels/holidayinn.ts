import type { Hotel } from "./types";

export const holidayinn: Hotel = {
  id: "holidayinn",
  name: "Holiday Inn Resort Ho Tram Beach",
  tagline: {
    ko: "밝고 경쾌한 바다 리조트",
    en: "A bright, fun and youthful beach resort"
  },
  description: {
    ko: "베트남 최초의 홀리데이 인 리조트로, 더 그랜드 호짬 복합 리조트 안에 자리합니다. 바다를 모티브로 한 밝고 경쾌한 객실과 탁 트인 바다 전망, 푸드 코트와 다양한 엔터테인먼트를 갖춰 가족과 친구, 커플 모두에게 편안한 휴양지가 되어 줍니다.",
    en: "Vietnam's first Holiday Inn Resort sits inside The Grand Ho Tram complex. Ocean-inspired, light-filled rooms with sea views, a gourmet food court and a wide range of entertainment make it an easy getaway for families, friends and couples."
  },
  cover: "holidayinn/1-king-2-single-2-bedroom-blue-suite-sea-view-1.jpg",
  checkIn: "16:00",
  checkOut: "12:00",
  categories: [
    {
      key: "standard",
      label: {
        ko: "스탠다드",
        en: "Standard"
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
      slug: "standard-cabana-smk-ocean-view",
      category: "standard",
      name: "Standard Cabana SMK Ocean View",
      description: {
        ko: "전용 카바나가 딸린 41㎡ 객실에서 탁 트인 바다를 감상해 보세요. 세심한 어메니티와 넓은 욕실, 50인치 TV, 금고, 무료 차·커피 시설이 갖춰져 있습니다.",
        en: "Take in the East Sea from your 41 sqm room complete with its own cabana. These rooms come with thoughtful amenities, a spacious bathroom, a 50” TV, safe and complimentary tea and coffee facilities."
      },
      size: "41 m²",
      guests: {
        en: "Up to 4",
        ko: "최대 4명"
      },
      beds: {
        ko: "킹 침대 1개 또는 싱글 침대 2개",
        en: "1 King Bed or 2 Single Beds"
      },
      view: {
        ko: "바다 전망",
        en: "Ocean View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "connecting-room",
        "cabana",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-50",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "holidayinn/standard-cabana-smk-ocean-view-1.jpg",
        "holidayinn/standard-cabana-smk-ocean-view-2.jpg",
        "holidayinn/standard-cabana-smk-ocean-view-3.jpg",
        "holidayinn/standard-cabana-smk-ocean-view-4.jpg",
        "holidayinn/standard-cabana-smk-ocean-view-5.jpg"
      ]
    },
    {
      slug: "standard-ocean-view-one-king-bed",
      category: "standard",
      name: "Standard Ocean View One King Bed",
      description: {
        ko: "바다를 테마로 꾸민 밝고 개방감 있는 41㎡ 공간에서 편안히 쉬어 보세요. 아늑한 욕실과 바다 전망이 매력이며, 객실에는 50인치 TV, 금고, 무료 차·커피 시설이 마련되어 있습니다.",
        en: "Relax in a bright, airy 41 sqm space with ocean themed decor featuring an inviting bathroom and views overlooking the East Sea. Rooms include a 50” TV, safe and complimentary tea and coffee facilities."
      },
      size: "41 m²",
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
        "connecting-room",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-50",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "holidayinn/standard-ocean-view-one-king-bed-1.jpg",
        "holidayinn/standard-ocean-view-one-king-bed-2.jpg",
        "holidayinn/standard-ocean-view-one-king-bed-3.jpg",
        "holidayinn/standard-ocean-view-one-king-bed-4.jpg"
      ]
    },
    {
      slug: "standard-ocean-view-two-single-beds",
      category: "standard",
      name: "Standard Ocean View Two Single Beds",
      description: {
        ko: "바다를 테마로 꾸민 밝고 개방감 있는 39㎡ 공간에서 편안히 쉬어 보세요. 아늑한 욕실과 바다 전망이 매력이며, 객실에는 50인치 TV, 금고, 무료 차·커피 시설이 마련되어 있습니다.",
        en: "Relax in a bright, airy 39 sqm space with ocean themed decor featuring an inviting bathroom and views overlooking the East Sea. Rooms include a 50” TV, safe and complimentary tea and coffee facilities."
      },
      size: "39 m²",
      guests: {
        en: "Up to 4",
        ko: "최대 4명"
      },
      beds: {
        ko: "싱글 침대 2개",
        en: "2 Single Beds"
      },
      view: {
        ko: "바다 전망",
        en: "Ocean View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "connecting-room",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-50",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "holidayinn/standard-ocean-view-two-single-beds-1.jpg",
        "holidayinn/standard-ocean-view-two-single-beds-2.jpg",
        "holidayinn/standard-cabana-smk-ocean-view-5.jpg"
      ]
    },
    {
      slug: "standard-cabana-forest-view",
      category: "standard",
      name: "Standard Cabana Forest View",
      description: {
        ko: "밝고 편안하며 세련되게 꾸며진 39㎡ 객실에서 여유를 즐겨 보세요. 아늑한 욕실과 전용 카바나, 숲 전망이 있으며 50인치 TV, 금고, 무료 차·커피 시설이 마련되어 있습니다.",
        en: "Unwind in a 39 sqm airy, comfortable and well appointed room featuring an inviting bathroom, a private cabana and views overlooking the forest. Rooms come with a 50” TV, safe and complimentary tea and coffee facilities."
      },
      size: "39 m²",
      guests: {
        en: "Up to 4",
        ko: "최대 4명"
      },
      beds: {
        ko: "킹 침대 1개 또는 싱글 침대 2개",
        en: "1 King Bed or 2 Single Beds"
      },
      view: {
        ko: "숲 전망",
        en: "Forest View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "connecting-room",
        "cabana",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-50",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "holidayinn/standard-cabana-forest-view-1.jpg",
        "holidayinn/standard-cabana-forest-view-2.jpg",
        "holidayinn/standard-cabana-forest-view-3.jpg",
        "holidayinn/standard-cabana-forest-view-4.jpg"
      ]
    },
    {
      slug: "standard-room",
      category: "standard",
      name: "Standard Room",
      description: {
        ko: "밝고 편안하며 세련되게 꾸며진 39㎡ 객실에서 여유를 즐겨 보세요. 아늑한 욕실과 숲 또는 바다 전망이 있으며 50인치 TV, 금고, 무료 차·커피 시설이 마련되어 있습니다.",
        en: "Unwind in a 39 sqm airy, comfortable and well appointed room featuring an inviting bathroom and views overlooking the forest or the ocean. Rooms come with a 50” TV, safe and complimentary tea and coffee facilities."
      },
      size: "39 m²",
      guests: {
        en: "Up to 3",
        ko: "최대 3명"
      },
      beds: {
        ko: "싱글 침대 2개",
        en: "2 Single Beds"
      },
      view: {
        ko: "숲 전망",
        en: "Forest View"
      },
      amenities: [
        "room-service-24h",
        "coffee-tea-supplies",
        "connecting-room",
        "buffet-breakfast",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-50",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "holidayinn/standard-room-1.jpg",
        "holidayinn/standard-ocean-view-one-king-bed-4.jpg",
        "holidayinn/standard-room-3.jpg"
      ]
    },
    {
      slug: "1-king-2-single-2-bedroom-presidential-suite",
      category: "suite",
      name: "1 King 2 Single 2 Bedroom Presidential Suite",
      description: {
        ko: "끝없이 펼쳐지는 바다 전망이 돋보이는 138㎡ 최상층 스위트입니다. 침실 2개에 발코니, 밝고 아늑한 거실과 다이닝 공간을 갖추고 있으며, 잘 갖춰진 가구와 어메니티, 3개의 욕실(샤워 2개, 욕조 1개)로 호짬에서의 휴가를 더욱 특별하게 만들어 드립니다.",
        en: "Infinite sea views define this 138 sqm top-floor suite. Two-bedroom suite includes a balcony, bright and welcoming living area, and dining area. Suite comes with well-appointed furniture and amenities with three bathrooms, two with showers and one with tub, ensuring your getaway to Ho Tram is beyond wonder."
      },
      size: "138 m²",
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
        "connecting-room",
        "cabana",
        "separate-living-room",
        "coffee-maker",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-50",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "holidayinn/1-king-2-single-2-bedroom-presidential-suite-1.jpg",
        "holidayinn/1-king-2-single-2-bedroom-presidential-suite-2.jpg",
        "holidayinn/1-king-2-single-2-bedroom-presidential-suite-3.jpg",
        "holidayinn/1-king-2-single-2-bedroom-presidential-suite-4.jpg"
      ]
    },
    {
      slug: "1-king-2-single-2-bedroom-blue-suite-sea-view",
      category: "suite",
      name: "1 King 2 Single 2 Bedroom Blue Suite Sea View",
      description: {
        ko: "자연광이 가득 들어오는 최상층 125㎡ 스위트로, 끝없는 바다 전망을 자랑합니다. 바다에서 영감을 받은 현대적인 디자인의 침실 2개 스위트이며 밝은 거실과 독립된 다이닝 공간을 갖추고 있습니다. 욕실 3개(샤워 2개, 욕조 1개)가 있어 가족이나 친구 여럿이 함께 머물기에 알맞습니다.",
        en: "Naturally-lit top floor 125 sqm suite featuring endless sea views. This two-bedroom suite features contemporary design inspired by the ocean with bright living areas and separate dining areas. Our Suite includes three bathrooms, two with showers and one with tub, perfect for families or groups of friends."
      },
      size: "125 m²",
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
        "room-service-24h",
        "coffee-tea-supplies",
        "mini-bar",
        "connecting-room",
        "separate-living-room",
        "coffee-maker",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-50",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "holidayinn/1-king-2-single-2-bedroom-blue-suite-sea-view-1.jpg",
        "holidayinn/1-king-2-single-2-bedroom-blue-suite-sea-view-2.jpg",
        "holidayinn/1-king-2-single-2-bedroom-blue-suite-sea-view-3.jpg",
        "holidayinn/1-king-2-single-2-bedroom-blue-suite-sea-view-4.jpg",
        "holidayinn/1-king-2-single-2-bedroom-blue-suite-sea-view-5.jpg"
      ]
    },
    {
      slug: "2-bedroom-suite-cabana-smk-ocean-view",
      category: "suite",
      name: "2 Bedroom Suite Cabana SMK Ocean View",
      description: {
        ko: "개방감 있는 84㎡ 2베드룸 스위트에는 전용 카바나와 바다 전망의 독립된 거실이 있습니다. 욕실은 2개(그중 1개는 욕조 포함)이며, 50인치 TV 3대, 금고, 무료 차·커피 시설과 편안함을 위한 세심한 가구가 갖춰져 있습니다.",
        en: "Airy two bedroom 84 sqm suites include a private cabana, separate living areas with ocean views. Suites come with two bathrooms, one with tub. Each suite features three 50″ TVs, safe, and complimentary tea and coffee and thoughtful furniture for your ultimate comfort."
      },
      size: "84 m²",
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
        "connecting-room",
        "cabana",
        "separate-living-room",
        "coffee-maker",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-50",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "holidayinn/2-bedroom-suite-cabana-smk-ocean-view-1.jpg",
        "holidayinn/2-bedroom-suite-cabana-smk-ocean-view-2.jpg",
        "holidayinn/2-bedroom-suite-cabana-smk-ocean-view-3.jpg",
        "holidayinn/2-bedroom-suite-cabana-smk-ocean-view-4.jpg",
        "holidayinn/2-bedroom-suite-cabana-smk-ocean-view-5.jpg"
      ]
    },
    {
      slug: "2-bedroom-suite-ocean-view",
      category: "suite",
      name: "2 Bedroom Suite Ocean View",
      description: {
        ko: "개방감 있는 84㎡ 2베드룸 스위트에는 바다 전망의 독립된 거실이 있습니다. 욕실은 2개(그중 1개는 욕조 포함)이며, 50인치 TV 3대, 금고, 무료 차·커피 시설과 편안함을 위한 세심한 가구가 갖춰져 있습니다.",
        en: "Airy two bedroom 84 sqm suites include separate living areas with ocean views. Suites come with two bathrooms, one with tub. Each suite features three 50″ TVs, safe, and complimentary tea and coffee and thoughtful furniture for your ultimate comfort."
      },
      size: "84 m²",
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
        "separate-living-room",
        "coffee-maker",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-50",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "holidayinn/2-bedroom-suite-ocean-view-1.jpg",
        "holidayinn/2-bedroom-suite-cabana-smk-ocean-view-1.jpg",
        "holidayinn/2-bedroom-suite-cabana-smk-ocean-view-2.jpg",
        "holidayinn/2-bedroom-suite-ocean-view-4.jpg",
        "holidayinn/2-bedroom-suite-ocean-view-5.jpg",
        "holidayinn/2-bedroom-suite-ocean-view-6.jpg",
        "holidayinn/2-bedroom-suite-ocean-view-7.jpg"
      ]
    },
    {
      slug: "2-bedroom-suite-marine-theme-ocean-view",
      category: "suite",
      name: "2 Bedroom Suite Marine Theme Ocean View",
      description: {
        ko: "바다를 테마로 꾸민 77㎡의 넓은 오션뷰 스위트로, 킹 침실과 트윈 침실 각 1개로 구성됩니다. 욕실은 2개(그중 1개는 욕조 포함)이며, 50인치 TV, 금고, 무료 차·커피 시설이 마련되어 있습니다.",
        en: "Spacious 77 sqm ocean-view suites with one King and one Twin room featuring ocean themed décor throughout. Suites feature two bathrooms, one with tub. Includes 50″ TV, safe and complimentary tea and coffee facilities."
      },
      size: "77 m²",
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
        "connecting-room",
        "separate-living-room",
        "coffee-maker",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-50",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "holidayinn/2-bedroom-suite-marine-theme-ocean-view-1.jpg",
        "holidayinn/2-bedroom-suite-marine-theme-ocean-view-2.jpg",
        "holidayinn/2-bedroom-suite-marine-theme-ocean-view-3.jpg",
        "holidayinn/2-bedroom-suite-marine-theme-ocean-view-4.jpg"
      ]
    },
    {
      slug: "2-bedroom-suite-marine-theme-cabana-smk",
      category: "suite",
      name: "2 Bedroom Suite Marine Theme Cabana SMK",
      description: {
        ko: "전용 카바나가 딸린 71㎡의 넓은 숲 전망 스위트로, 킹 침실과 트윈 침실 각 1개로 구성되며 전체가 바다 테마로 꾸며져 있습니다. 욕실은 2개(그중 1개는 욕조 포함)이며, 50인치 TV, 금고, 무료 차·커피 시설이 마련되어 있습니다.",
        en: "Spacious 71 sqm forest-view suites with a private cabana come with one King and one Twin room featuring ocean themed décor throughout. Suites feature two bathrooms, one with tub. Includes 50″ TV, safe and complimentary tea and coffee facilities."
      },
      size: "71 m²",
      guests: {
        en: "Up to 6",
        ko: "최대 6명"
      },
      beds: {
        ko: "킹 침대 1개, 싱글 침대 2개",
        en: "1 King Bed & 2 Single Beds"
      },
      view: {
        ko: "숲 전망",
        en: "Forest View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "mini-bar",
        "connecting-room",
        "cabana",
        "separate-living-room",
        "coffee-maker",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-50",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "holidayinn/2-bedroom-suite-marine-theme-cabana-smk-1.jpg",
        "holidayinn/2-bedroom-suite-marine-theme-cabana-smk-2.jpg",
        "holidayinn/2-bedroom-suite-marine-theme-cabana-smk-3.jpg",
        "holidayinn/2-bedroom-suite-marine-theme-cabana-smk-4.jpg"
      ]
    },
    {
      slug: "2-bedroom-suite-marine-theme-forest-view",
      category: "suite",
      name: "2 Bedroom Suite Marine Theme Forest View",
      description: {
        ko: "71㎡의 넓은 숲 전망 스위트로, 킹 침실과 트윈 침실 각 1개로 구성되며 전체가 바다 테마로 꾸며져 있습니다. 욕실은 2개(그중 1개는 욕조 포함)이며, 50인치 TV, 금고, 무료 차·커피 시설이 마련되어 있습니다.",
        en: "Spacious 71 sqm forest-view suites with one King and one Twin room featuring ocean themed décor throughout. Suites feature two bathrooms, one with tub. Includes 50″ TV, safe and complimentary tea and coffee facilities."
      },
      size: "71 m²",
      guests: {
        en: "Up to 6",
        ko: "최대 6명"
      },
      beds: {
        ko: "킹 침대 1개, 싱글 침대 2개",
        en: "1 King Bed & 2 Single Beds"
      },
      view: {
        ko: "숲 전망",
        en: "Forest View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "mini-bar",
        "coffee-maker",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-50",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "holidayinn/2-bedroom-suite-marine-theme-forest-view-1.jpg",
        "holidayinn/2-bedroom-suite-marine-theme-forest-view-2.jpg",
        "holidayinn/2-bedroom-suite-marine-theme-forest-view-3.jpg",
        "holidayinn/2-bedroom-suite-marine-theme-forest-view-4.jpg",
        "holidayinn/2-bedroom-suite-marine-theme-forest-view-5.jpg"
      ]
    },
    {
      slug: "1-king-bed-1-bedroom-suite-smk",
      category: "suite",
      name: "1 King Bed 1 Bedroom Suite SMK",
      description: {
        ko: "별도의 거실 공간을 갖춘 61㎡ 스위트에서 아늑한 정원을 즐겨 보세요. 욕조와 레인 샤워기를 갖춘 넓은 욕실, 50인치 TV, 금고, 무료 차·커피 시설이 마련되어 있습니다.",
        en: "Enjoy an inviting garden in these 61 sqm suites with separate living space. Our comfortable suite includes a spacious bathroom with tub and rain shower, 50″ TV, safe and complimentary tea and coffee facilities."
      },
      size: "61 m²",
      guests: {
        en: "Up to 4",
        ko: "최대 4명"
      },
      beds: {
        ko: "킹 침대 1개",
        en: "1 King Bed"
      },
      view: {
        ko: "숲 전망",
        en: "Forest View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "mini-bar",
        "separate-living-room",
        "coffee-maker",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-50",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "holidayinn/1-king-bed-1-bedroom-suite-smk-1.jpg",
        "holidayinn/1-king-bed-1-bedroom-suite-smk-2.jpg",
        "holidayinn/1-king-bed-1-bedroom-suite-smk-3.jpg",
        "holidayinn/1-king-bed-1-bedroom-suite-smk-4.jpg",
        "holidayinn/1-king-bed-1-bedroom-suite-smk-5.jpg",
        "holidayinn/1-king-bed-1-bedroom-suite-smk-6.jpg",
        "holidayinn/1-king-bed-1-bedroom-suite-smk-7.jpg",
        "holidayinn/1-king-bed-1-bedroom-suite-smk-8.jpg",
        "holidayinn/1-king-bed-1-bedroom-suite-smk-9.jpg"
      ]
    },
    {
      slug: "1-king-bed-suite-cabana-smk",
      category: "suite",
      name: "1 King Bed Suite Cabana SMK",
      description: {
        ko: "48㎡ 스위트의 전용 카바나나 밝은 거실에서 호짬의 열대 햇살을 만끽해 보세요. 온수 욕조와 레인 샤워기를 갖춘 넓은 욕실이 있으며, 바다를 테마로 한 모든 스위트에는 50인치 TV, 금고, 무료 차·커피 시설이 마련되어 있습니다.",
        en: "Soak in the tropical sun of Ho Tram in your private cabana or in the bright living room from this 48 sqm suite. Including a spacious bathroom with hot tub and rain shower, all of our ocean themed suites offer a 50″ TV, safe and complimentary tea and coffee facilities."
      },
      size: "48 m²",
      guests: {
        en: "Up to 4",
        ko: "최대 4명"
      },
      beds: {
        ko: "킹 침대 1개",
        en: "1 King Bed"
      },
      view: {
        ko: "숲 전망",
        en: "Forest View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "mini-bar",
        "cabana",
        "separate-living-room",
        "coffee-maker",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-50",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "holidayinn/1-king-bed-suite-cabana-smk-1.jpg",
        "holidayinn/1-king-bed-suite-cabana-smk-2.jpg",
        "holidayinn/1-king-bed-suite-cabana-smk-3.jpg",
        "holidayinn/1-king-bed-suite-cabana-smk-4.jpg",
        "holidayinn/1-king-bed-suite-cabana-smk-5.jpg",
        "holidayinn/1-king-bed-suite-cabana-smk-6.jpg",
        "holidayinn/1-king-bed-suite-cabana-smk-7.jpg"
      ]
    },
    {
      slug: "1-king-bed-suite",
      category: "suite",
      name: "1 King Bed Suite",
      description: {
        ko: "48㎡ 스위트의 밝고 아늑한 거실을 즐겨 보세요. 온수 욕조와 레인 샤워기를 갖춘 넓은 욕실이 있으며, 편안한 휴가를 위해 세심하게 고른 가구가 마련되어 있습니다. 모든 스위트에는 50인치 TV, 금고, 무료 차·커피 시설이 갖춰져 있습니다.",
        en: "Enjoy our bright and welcoming living room of this 48 sqm suite. Includes a spacious bathroom with hot tub and rain shower, our Suite offers thoughtful furniture for your perfect getaway. All suites include a 50″ TV, safe and complimentary tea and coffee facilities."
      },
      size: "48 m²",
      guests: {
        en: "Up to 4",
        ko: "최대 4명"
      },
      beds: {
        ko: "킹 침대 1개",
        en: "1 King Bed"
      },
      view: {
        ko: "숲 전망",
        en: "Forest View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "mini-bar",
        "separate-living-room",
        "coffee-maker",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-50",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "holidayinn/1-king-bed-suite-1.jpg",
        "holidayinn/1-king-bed-suite-2.jpg",
        "holidayinn/1-king-bed-suite-cabana-smk-1.jpg",
        "holidayinn/1-king-bed-suite-cabana-smk-2.jpg"
      ]
    },
    {
      slug: "1-king-1-bunk-family-suite-forest-view",
      category: "suite",
      name: "1 King 1 Bunk Family Suite Forest View",
      description: {
        ko: "온 가족을 위한 48㎡ 규모의 침실 2개 스위트로, 숲 전망과 밝은 거실, 욕조와 샤워 시설을 갖춘 넓은 욕실이 있습니다. 킹 침대와 12세 미만 어린이 2명을 위한 2층 침대가 마련되어 있으며, 50인치 TV, 금고, 무료 차·커피 시설이 갖춰져 있습니다.",
        en: "Two-bedroom 48 sqm suites overlooking the forest view for the whole family featuring bright living areas and spacious tub and shower bathroom. It comes with a King bed and bunks for 2 children under 12. Suite includes a 50″ TV, safe and complimentary tea and coffee facilities."
      },
      size: "48 m²",
      guests: {
        en: "Up to 4",
        ko: "최대 4명"
      },
      beds: {
        ko: "킹 침대 1개, 2층 침대 1개",
        en: "1 King Bed & 1 Bunk Bed"
      },
      view: {
        ko: "숲 전망",
        en: "Forest View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "coffee-tea-supplies",
        "mini-bar",
        "separate-living-room",
        "coffee-maker",
        "wifi",
        "ironing-board",
        "docking-station",
        "direct-dial-phone",
        "air-conditioning",
        "tv-50",
        "in-room-safe",
        "alarm-clock"
      ],
      images: [
        "holidayinn/1-king-1-bunk-family-suite-forest-view-1.jpg",
        "holidayinn/1-king-1-bunk-family-suite-forest-view-2.jpg",
        "holidayinn/1-king-1-bunk-family-suite-forest-view-3.jpg",
        "holidayinn/1-king-1-bunk-family-suite-forest-view-4.jpg",
        "holidayinn/1-king-1-bunk-family-suite-forest-view-5.jpg",
        "holidayinn/1-king-1-bunk-family-suite-forest-view-6.jpg",
        "holidayinn/1-king-1-bunk-family-suite-forest-view-7.jpg",
        "holidayinn/1-king-1-bunk-family-suite-forest-view-8.jpg",
        "holidayinn/1-king-1-bunk-family-suite-forest-view-9.jpg"
      ]
    }
  ]
};
