import React from 'react';
import { ArrowRight, Bot, Calendar, HardDrive, Layout } from 'lucide-react';

const features = [
    {
        title: "아름답게 기록하는 당신의 일상",
        description: "소중한 순간들을 사진과 글로 남기세요. 당신만의 감성이 담긴 피드가 완성됩니다.",
        image: "/feed_mockup.png",
        icon: <Layout className="w-6 h-6" />,
        color: "text-teal-400",
        bgColor: "bg-teal-500/10",
        align: "left"
    },
    {
        title: "안전하고 스마트한 클라우드",
        description: "모든 사진과 파일을 안전하게 보관하세요. 언제 어디서나 쉽게 접근할 수 있습니다.",
        image: "/drive_mockup.png",
        icon: <HardDrive className="w-6 h-6" />,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        align: "right"
    },
    {
        title: "체계적인 일정 관리",
        description: "복잡한 일상도 깔끔하게 정리하세요. 중요한 약속을 놓치지 않도록 도와줍니다.",
        image: "/schedule_mockup.png",
        icon: <Calendar className="w-6 h-6" />,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        align: "left"
    },
    {
        title: "AI 데일리 어시스턴트",
        description: "당신의 하루를 이해하는 똑똑한 AI 친구. 대화를 나누며 감정을 정리하고 조언을 얻으세요.",
        image: "/ai_mockup.png",
        icon: <Bot className="w-6 h-6" />,
        color: "text-rose-400",
        bgColor: "bg-rose-500/10",
        align: "right",
        isNew: true
    }
];

const FeatureShowcase: React.FC = () => {
    return (
        <div className="py-20 space-y-32">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
                    더 스마트한 라이프스타일
                </h2>
                <p className="text-slate-500 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
                    JifeLog만의 특별한 기능들로 당신의 삶을 더 풍요롭게 만들어보세요
                </p>
            </div>

            {features.map((feature, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center gap-12 md:gap-20 ${feature.align === 'right' ? 'md:flex-row-reverse' : ''}`}>

                    {/* Image Side */}
                    <div className="flex-1 w-full relative group">
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.align === 'left' ? 'from-teal-500/20 to-blue-500/20' : 'from-purple-500/20 to-rose-500/20'} blur-3xl rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-200 dark:border-slate-800/50 transform transition-transform duration-500 hover:scale-[1.02] hover:-rotate-1">
                            <img src={feature.image} alt={feature.title} className="w-full h-auto object-cover" />
                        </div>
                    </div>

                    {/* Text Side */}
                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${feature.bgColor} ${feature.color} mb-2`}>
                            {feature.icon}
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-3">
                                {feature.title}
                                {feature.isNew && (
                                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full uppercase tracking-wider animate-pulse">
                                        NEW
                                    </span>
                                )}
                            </h3>
                            <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-lg">
                                {feature.description}
                            </p>
                        </div>

                        <button className={`group flex items-center gap-2 mx-auto md:mx-0 font-bold ${feature.color} hover:opacity-80 transition-opacity`}>
                            자세히 보기 <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeatureShowcase;
