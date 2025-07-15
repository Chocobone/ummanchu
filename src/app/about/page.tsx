import Header from "@/components/Header";
import { Card,CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Mic, Video, TrendingUp, Briefcase } from "lucide-react";

const Material = () => {
  const materials = [
    {
      category: "Business English",
      icon: Briefcase,
      color: "bg-blue-500",
      courses: [
        "비즈니스 미팅 영어",
        "프레젠테이션 스킬",
        "이메일 작성법",
        "네트워킹 영어"
      ],
      level: "중급-고급",
      duration: "4주 과정"
    },
    {
      category: "Current Affairs",
      icon: TrendingUp,
      color: "bg-green-500", 
      courses: [
        "경제 뉴스 토론",
        "시사 이슈 분석",
        "정치 토론",
        "사회 문제 논의"
      ],
      level: "중급-고급",
      duration: "8주 과정"
    },
    {
      category: "Interview Prep",
      icon: Mic,
      color: "bg-purple-500",
      courses: [
        "면접 영어 완전정복",
        "자기소개 마스터",
        "상황별 질문 대응",
        "모의 면접 실전"
      ],
      level: "초급-고급",
      duration: "2주 과정"
    },
    {
      category: "Academic English", 
      icon: BookOpen,
      color: "bg-red-500",
      courses: [
        "학술 논문 작성",
        "프레젠테이션 기법",
        "토론 및 발표",
        "리서치 스킬"
      ],
      level: "중급-고급",
      duration: "6주 과정"
    },
    {
      category: "Conversation",
      icon: Video,
      color: "bg-yellow-500",
      courses: [
        "일상 회화 마스터",
        "여행 영어",
        "문화 교류",
        "프리토킹 클래스"
      ],
      level: "초급-중급",
      duration: "4주 과정"
    },
    {
      category: "Writing Skills",
      icon: FileText,
      color: "bg-indigo-500",
      courses: [
        "에세이 라이팅",
        "창작 글쓰기",
        "보고서 작성",
        "논리적 글쓰기"
      ],
      level: "중급-고급",
      duration: "5주 과정"
    }
  ];

  const features = [
    "개인 맞춤형 커리큘럼",
    "실시간 피드백",
    "수업 녹화 파일 제공",
    "과제 및 복습 자료",
    "진도 추적 리포트",
    "무제한 질문 가능"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-primary">맞춤형</span> 교재 & 커리큘럼
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              개인의 목표와 수준에 맞는 체계적인 교재로 
              효율적이고 재미있게 영어 실력을 향상시키세요
            </p>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-sm font-medium text-primary">{feature}</div>
              </div>
            ))}
          </div>

          {/* Materials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {materials.map((material, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className={`h-2 ${material.color}`}></div>
                
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${material.color} rounded-lg flex items-center justify-center`}>
                      <material.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{material.category}</h3>
                      <div className="flex space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {material.level}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {material.duration}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">주요 과정</h4>
                    <ul className="space-y-1">
                      {material.courses.map((course, i) => (
                        <li key={i} className="text-sm text-foreground/70 flex items-center">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                          {course}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button className="w-full group-hover:bg-gradient-primary transition-all">
                    수업 시작하기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Custom Curriculum Section */}
          <Card className="bg-gradient-primary text-white p-8">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">
                나만의 맞춤 커리큘럼이 필요하다면?
              </h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                개인의 특별한 목표나 요구사항이 있다면 
                전문 상담을 통해 맞춤형 커리큘럼을 제공해드립니다
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90"
                >
                  맞춤 커리큘럼 상담받기
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  샘플 교재 다운로드
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Material;