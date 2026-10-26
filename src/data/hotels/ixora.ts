import type { Hotel } from "./types";

export const ixora: Hotel = {
  id: "ixora",
  name: "Ixora Ho Tram by Fusion",
  tagline: {
    ko: "해변과 정원을 품은 레지던스 & 프라이빗 빌라",
    en: "Residences and private villas by the beach and gardens"
  },
  description: {
    ko: "더 그랜드 호짬 복합 리조트 안, 인터컨티넨탈과 홀리데이 인 바로 옆에 위치한 리조트입니다. 해변 또는 정원 전망의 레지던스와 프라이빗 풀을 갖춘 빌라에서 프라이버시와 여유를 누려 보세요. 호치민에서 고속도로로 약 2시간 30분이면 도착합니다.",
    en: "Next door to the InterContinental and Holiday Inn inside The Grand Ho Tram complex, Ixora offers residences and private-pool villas with beach or garden views, about two and a half hours from Ho Chi Minh City by expressway."
  },
  cover: "ixora/oceanfront-villa-1.jpg",
  categories: [
    {
      key: "residences",
      label: {
        ko: "레지던스",
        en: "Residences"
      }
    },
    {
      key: "villas",
      label: {
        ko: "빌라",
        en: "Villas"
      }
    }
  ],
  rooms: [
    {
      slug: "residences-balcony-garden-view",
      category: "residences",
      name: "Residences Balcony Garden View",
      description: {
        ko: "레지던스 발코니 가든 뷰는 익소라의 푸르른 자연을 마주한 객실입니다. 침실 1~2개, 43~80㎡ 규모로 호텔 메인 타워에 위치하며, 발코니와 워크인 레인 샤워기, 대형 TV를 갖추고 있습니다. 침실 2개짜리 코너 객실에는 발코니에 프라이빗 자쿠지가 마련되어 있습니다.",
        en: "The Residence Balcony Garden View overlooks Ixora’s verdant surroundings. Available with 1 or 2 bedrooms between 43-80 sqm, these rooms are conveniently located in one of the hotel’s main towers. Each contains a balcony, walk-in rain shower and large-screen TV. The 2-bedroom corner rooms feature a private jacuzzi on the balcony."
      },
      size: "43–80 m²",
      guests: {
        ko: "침실 1개 기준 성인 2명 + 어린이 2명 (만 11세 이하)",
        en: "2 adults in 1 bedroom + 2 children (up to 11 years old)"
      },
      bedrooms: {
        ko: "침실 1~2개",
        en: "1 or 2 bedrooms"
      },
      view: {
        ko: "정원 전망",
        en: "Garden View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "mini-bar",
        "tv-43-50",
        "wifi-high-speed",
        "walk-in-rain-shower",
        "ironing-board",
        "alarm-clock",
        "direct-dial-phone",
        "air-conditioning-individual",
        "coffee-tea-supplies",
        "in-room-safe",
        "kitchenette",
        "balcony",
        "coffee-maker",
        "private-jacuzzi"
      ],
      images: [
        "ixora/residences-balcony-garden-view-1.jpg",
        "ixora/residences-balcony-garden-view-2.jpg",
        "ixora/residences-balcony-garden-view-3.jpg",
        "ixora/residences-balcony-garden-view-4.jpg"
      ]
    },
    {
      slug: "residences-ocean-view",
      category: "residences",
      name: "Residences Ocean View",
      description: {
        ko: "레지던스 오션 뷰는 익소라의 프라이빗 비치를 마주한 객실입니다. 침실 1~2개, 43~80㎡ 규모로 호텔 메인 타워에 위치하며, 발코니와 워크인 레인 샤워기, 대형 TV를 갖추고 있습니다. 침실 2개짜리 코너 객실에는 발코니에 프라이빗 자쿠지가 마련되어 있습니다.",
        en: "The Residence Ocean View overlooks Ixora’s private beach. Available with 1 or 2 bedrooms between 43-80 sqm, these rooms are conveniently located in one of the hotel’s main towers. Each contains a balcony, walk-in rain shower and large-screen TV. The 2-bedroom corner rooms feature a private jacuzzi on the balcony."
      },
      size: "43–80 m²",
      guests: {
        ko: "침실 1개 기준 성인 2명 + 어린이 2명 (만 11세 이하)",
        en: "2 adults in 1 bedroom + 2 children (up to 11 years old)"
      },
      bedrooms: {
        ko: "침실 1~2개",
        en: "1 or 2 bedrooms"
      },
      view: {
        ko: "바다 전망",
        en: "Ocean View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "mini-bar",
        "tv-43-50",
        "wifi-high-speed",
        "walk-in-rain-shower",
        "ironing-board",
        "alarm-clock",
        "direct-dial-phone",
        "air-conditioning-individual",
        "coffee-tea-supplies",
        "in-room-safe",
        "kitchenette",
        "balcony",
        "coffee-maker",
        "private-jacuzzi"
      ],
      images: [
        "ixora/residences-ocean-view-1.jpg",
        "ixora/residences-ocean-view-2.jpg",
        "ixora/residences-ocean-view-3.jpg"
      ]
    },
    {
      slug: "residences-garden-pool",
      category: "residences",
      name: "Residences Garden Pool",
      description: {
        ko: "레지던스 가든 풀은 익소라의 푸르른 자연을 마주하며, 침실에서 바로 이어지는 프라이빗 풀이 있습니다. 침실 1~2개, 73~143㎡ 규모로 호텔 메인 타워에 위치하며, 발코니와 워크인 레인 샤워기, 대형 TV를 갖추고 있습니다.",
        en: "The Residence Garden Pool overlooks Ixora’s verdant surroundings and has a private pool accessible from its bedroom(s). Available with 1 or 2 bedrooms between 73-143 sqm, these rooms are conveniently located in one of the hotel’s main towers. Each contains a balcony, walk-in rain shower and large-screen TV."
      },
      size: "73–143 m²",
      guests: {
        ko: "침실 1개 기준 성인 2명 + 어린이 2명 (만 11세 이하)",
        en: "2 adults in 1 bedroom + 2 children (up to 11 years old)"
      },
      bedrooms: {
        ko: "침실 1~2개",
        en: "1 or 2 bedrooms"
      },
      view: {
        ko: "정원 전망",
        en: "Garden View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "mini-bar",
        "tv-43-50",
        "wifi-high-speed",
        "walk-in-rain-shower",
        "ironing-board",
        "alarm-clock",
        "direct-dial-phone",
        "air-conditioning-individual",
        "coffee-tea-supplies",
        "in-room-safe",
        "kitchenette",
        "balcony",
        "coffee-maker",
        "private-pool"
      ],
      images: [
        "ixora/residences-garden-pool-1.jpg",
        "ixora/residences-garden-pool-2.jpg",
        "ixora/residences-garden-pool-3.jpg",
        "ixora/residences-garden-pool-4.jpg"
      ]
    },
    {
      slug: "skypool-penthouse-ocean-view",
      category: "residences",
      name: "Skypool Penthouse Ocean View",
      description: {
        ko: "스카이풀 펜트하우스 오션 뷰는 익소라의 프라이빗 비치를 마주하며, 침실에서 바로 이어지는 프라이빗 스카이풀이 있습니다. 135㎡ 규모로 호텔 메인 타워 상층부에 위치하며, 발코니와 워크인 레인 샤워기, 대형 TV를 갖추고 있습니다.",
        en: "The Skypool Penthouse Ocean View overlooks Ixora’s private beach and has a private sky pool accessible from its bedrooms. At 135 sqm, these rooms are conveniently perched on the upper floors of one of the hotel’s main towers. Each contains a balcony, walk-in rain shower and large-screen TV."
      },
      size: "135 m²",
      guests: {
        ko: "침실 1개 기준 성인 2명 + 어린이 2명 (만 11세 이하)",
        en: "2 adults in 1 bedroom + 2 children (up to 11 years old)"
      },
      bedrooms: {
        ko: "침실 2개",
        en: "2 bedrooms"
      },
      view: {
        ko: "바다 전망",
        en: "Ocean View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "mini-bar",
        "tv-43-50",
        "wifi-high-speed",
        "walk-in-rain-shower",
        "ironing-board",
        "alarm-clock",
        "direct-dial-phone",
        "air-conditioning-individual",
        "coffee-tea-supplies",
        "in-room-safe",
        "kitchenette",
        "balcony",
        "coffee-maker",
        "sky-pool"
      ],
      images: [
        "ixora/skypool-penthouse-ocean-view-1.jpg",
        "ixora/skypool-penthouse-ocean-view-2.jpg",
        "ixora/skypool-penthouse-ocean-view-3.jpg",
        "ixora/skypool-penthouse-ocean-view-4.jpg",
        "ixora/skypool-penthouse-ocean-view-5.jpg",
        "ixora/skypool-penthouse-ocean-view-6.jpg",
        "ixora/skypool-penthouse-ocean-view-7.jpg"
      ]
    },
    {
      slug: "panorama-penthouse",
      category: "residences",
      name: "Panorama Penthouse",
      description: {
        ko: "파노라마 펜트하우스 오션 뷰는 익소라의 프라이빗 비치를 마주하며, 침실에서 바로 이어지는 프라이빗 스카이풀이 있습니다. 165㎡로 익소라 메인 타워에서 가장 넓은 객실이며 상층부에 위치합니다. 발코니와 워크인 레인 샤워기, 대형 TV를 갖추고 있습니다.",
        en: "The Panorama Penthouse Ocean View overlooks Ixora’s private beach and has a private sky pool accessible from its bedrooms. At 165 sqm this is the largest room type offered by Ixora in its main towers and are conveniently perched on their upper floors. Each contains a balcony, walk-in rain shower and large-screen TV."
      },
      size: "165 m²",
      guests: {
        ko: "침실 1개 기준 성인 2명 + 어린이 2명 (만 11세 이하)",
        en: "2 adults in 1 bedroom + 2 children (up to 11 years old)"
      },
      bedrooms: {
        ko: "침실 2개",
        en: "2 bedrooms"
      },
      view: {
        ko: "바다 전망",
        en: "Ocean View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "mini-bar",
        "tv-43-50",
        "wifi-high-speed",
        "walk-in-rain-shower",
        "ironing-board",
        "alarm-clock",
        "direct-dial-phone",
        "air-conditioning-individual",
        "coffee-tea-supplies",
        "in-room-safe",
        "kitchenette",
        "balcony",
        "coffee-maker",
        "sky-pool"
      ],
      images: [
        "ixora/panorama-penthouse-1.jpg",
        "ixora/panorama-penthouse-2.jpg",
        "ixora/panorama-penthouse-3.jpg",
        "ixora/panorama-penthouse-4.jpg",
        "ixora/panorama-penthouse-5.jpg",
        "ixora/panorama-penthouse-6.jpg",
        "ixora/panorama-penthouse-7.jpg"
      ]
    },
    {
      slug: "villa-garden-pool",
      category: "villas",
      name: "Villa Garden Pool",
      description: {
        ko: "빌라 가든 풀은 익소라의 푸르른 자연을 마주합니다. 230㎡, 침실 2개의 빌라로, 프라이버시는 물론 필요한 편의시설을 모두 갖추었고, 선베드가 놓인 프라이빗 풀도 있습니다.",
        en: "The Villa Garden Pool overlooks Ixora’s verdant surroundings. The 230 sqm, 2-bedroom villa not only offers privacy and all the amenities you’d expect but also features a private pool with sunbeds."
      },
      size: "230 m²",
      guests: {
        ko: "침실 1개 기준 성인 2명 + 어린이 2명 (만 11세 이하)",
        en: "2 adults in 1 bedroom + 2 children (up to 11 years old)"
      },
      bedrooms: {
        ko: "침실 2개",
        en: "2 bedrooms"
      },
      view: {
        ko: "정원 전망",
        en: "Garden View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "mini-bar",
        "tv-43-50",
        "wifi-high-speed",
        "walk-in-rain-shower",
        "ironing-board",
        "alarm-clock",
        "direct-dial-phone",
        "air-conditioning-individual",
        "coffee-tea-supplies",
        "in-room-safe",
        "kitchenette",
        "balcony",
        "coffee-maker",
        "private-pool"
      ],
      images: [
        "ixora/villa-garden-pool-1.jpg",
        "ixora/villa-garden-pool-2.jpg",
        "ixora/villa-garden-pool-3.jpg",
        "ixora/villa-garden-pool-4.jpg",
        "ixora/villa-garden-pool-5.jpg",
        "ixora/villa-garden-pool-6.jpg"
      ]
    },
    {
      slug: "duplex-villa-garden-pool",
      category: "villas",
      name: "Duplex Villa Garden Pool",
      description: {
        ko: "듀플렉스 빌라 가든 풀은 익소라의 푸르른 자연을 마주합니다. 340㎡, 침실 3개의 빌라로, 프라이버시는 물론 필요한 편의시설을 모두 갖추었고, 선베드가 놓인 프라이빗 풀도 있습니다.",
        en: "The Duplex Villa Garden Pool overlooks Ixora’s verdant surroundings. The 340 sqm, 3-bedroom villa not only offers privacy and all the amenities you’d expect but also features a private pool with sunbeds."
      },
      size: "340 m²",
      guests: {
        ko: "침실 1개 기준 성인 2명 + 어린이 2명 (만 11세 이하)",
        en: "2 adults in 1 bedroom + 2 children (up to 11 years old)"
      },
      bedrooms: {
        ko: "침실 3개",
        en: "3 bedrooms"
      },
      view: {
        ko: "정원 전망",
        en: "Garden View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "mini-bar",
        "tv-43-50",
        "wifi-high-speed",
        "standard-bathtub",
        "walk-in-rain-shower",
        "ironing-board",
        "alarm-clock",
        "direct-dial-phone",
        "air-conditioning-individual",
        "coffee-tea-supplies",
        "in-room-safe",
        "kitchenette",
        "balcony",
        "coffee-maker",
        "private-pool"
      ],
      images: [
        "ixora/duplex-villa-garden-pool-1.jpg",
        "ixora/duplex-villa-garden-pool-2.jpg",
        "ixora/duplex-villa-garden-pool-3.jpg",
        "ixora/duplex-villa-garden-pool-4.jpg",
        "ixora/duplex-villa-garden-pool-5.jpg",
        "ixora/duplex-villa-garden-pool-6.jpg",
        "ixora/duplex-villa-garden-pool-7.jpg",
        "ixora/duplex-villa-garden-pool-8.jpg"
      ]
    },
    {
      slug: "beach-pool-villa",
      category: "villas",
      name: "Beach Pool Villa",
      description: {
        ko: "비치 풀 빌라는 익소라의 프라이빗 풀을 마주합니다. 340㎡, 침실 3개의 빌라로, 프라이버시는 물론 필요한 편의시설을 모두 갖추었고, 선베드가 놓인 프라이빗 풀도 있습니다.",
        en: "The Beach Pool Villa overlooks Ixora’s private pool. The 340 sqm, 3-bedroom villa not only offers privacy and all the amenities you’d expect, but also features a private pool with sunbeds."
      },
      size: "340 m²",
      guests: {
        ko: "침실 1개 기준 성인 2명 + 어린이 2명 (만 11세 이하)",
        en: "2 adults in 1 bedroom + 2 children (up to 11 years old)"
      },
      bedrooms: {
        ko: "침실 3개",
        en: "3 bedrooms"
      },
      view: {
        ko: "풀 전망",
        en: "Pool View"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "mini-bar",
        "tv-43-50",
        "wifi-high-speed",
        "standard-bathtub",
        "walk-in-rain-shower",
        "ironing-board",
        "alarm-clock",
        "direct-dial-phone",
        "air-conditioning-individual",
        "coffee-tea-supplies",
        "in-room-safe",
        "kitchenette",
        "balcony",
        "coffee-maker",
        "private-pool"
      ],
      images: [
        "ixora/beach-pool-villa-1.jpg",
        "ixora/beach-pool-villa-2.jpg",
        "ixora/beach-pool-villa-3.jpg",
        "ixora/beach-pool-villa-4.jpg",
        "ixora/beach-pool-villa-5.jpg",
        "ixora/beach-pool-villa-6.jpg",
        "ixora/beach-pool-villa-7.jpg",
        "ixora/beach-pool-villa-8.jpg",
        "ixora/beach-pool-villa-9.jpg",
        "ixora/beach-pool-villa-10.jpg"
      ]
    },
    {
      slug: "oceanfront-villa",
      category: "villas",
      name: "Oceanfront Villa",
      description: {
        ko: "오션프런트 빌라는 익소라의 프라이빗 비치를 마주합니다. 365㎡, 침실 3개의 빌라로, 프라이버시는 물론 필요한 편의시설을 모두 갖추었고, 선베드가 놓인 프라이빗 풀도 있습니다.",
        en: "The Oceanfront Villa overlooks Ixora’s private beach. The 365 sqm, 3-bedroom villa not only offers privacy and all the amenities you’d expect, but also features a private pool with sunbeds."
      },
      size: "365 m²",
      guests: {
        ko: "침실 1개 기준 성인 2명 + 어린이 2명 (만 11세 이하)",
        en: "2 adults in 1 bedroom + 2 children (up to 11 years old)"
      },
      bedrooms: {
        ko: "침실 3개",
        en: "3 bedrooms"
      },
      view: {
        ko: "비치 프런트",
        en: "Beachfront"
      },
      amenities: [
        "buffet-breakfast",
        "room-service-24h",
        "mini-bar",
        "tv-43-50",
        "wifi-high-speed",
        "standard-bathtub",
        "walk-in-rain-shower",
        "ironing-board",
        "alarm-clock",
        "direct-dial-phone",
        "air-conditioning-individual",
        "coffee-tea-supplies",
        "in-room-safe",
        "kitchenette",
        "balcony",
        "coffee-maker",
        "private-pool"
      ],
      images: [
        "ixora/oceanfront-villa-1.jpg",
        "ixora/oceanfront-villa-2.jpg",
        "ixora/oceanfront-villa-3.jpg",
        "ixora/oceanfront-villa-4.jpg",
        "ixora/oceanfront-villa-5.jpg",
        "ixora/oceanfront-villa-6.jpg",
        "ixora/oceanfront-villa-7.jpg",
        "ixora/oceanfront-villa-8.jpg",
        "ixora/oceanfront-villa-9.jpg",
        "ixora/oceanfront-villa-10.jpg"
      ]
    }
  ]
};
