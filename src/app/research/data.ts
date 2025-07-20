// app/research/data.ts
export interface Project {
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
}

export const researchData: Record<string, Project[]> = {
  Current: [
    {
      title: "LUSEM",
      subtitle: "Lunar Space Environment Monitor",
      description:
        "달 표면 및 지구에서 달까지 운반되는 고에너지 입자 관측 연구를 수행합니다.",
      image: "/images/lusem.png",
    },
  ],
  Completed: [
    {
      title: "CINEMA",
      subtitle: "CubeSat for Ionospheric Neutron and Electron Monitoring",
      description:
        "이온층 중성자 및 전자를 관측하는 CubeSat 기반 미션으로, 우주환경 변화를 탐구했습니다.",
      image: "/images/cinema.png",
    },
    {
      title: "MEPD",
      subtitle: "Medium Energy Particle Detector",
      description:
        "지오-컴프샛‑2A에 탑재된 중에너지 입자 검출기로, 지자기권 입자 분포를 분석했습니다.",
      image: "/images/mepd.png",
    },
    {
      title: "KSEM",
      subtitle: "Korea Space Environment Monitor",
      description:
        "NEXTSat‑1에 탑재되어 한국형 우주 환경 모니터링을 수행하는 핵심 장비입니다.",
      image: "/images/ksem.png",
    },
  ],
};
