import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/8 bg-[#050b12] px-6 py-10">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.34em] text-white">JifeLog</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
            기록, 저장, 일정, 회고를 하나의 흐름으로 정리하는 개인 라이프 시스템.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm text-slate-500 md:items-end">
          <div className="flex flex-wrap gap-4">
            <button className="transition-colors hover:text-white">주요 기능</button>
            <button className="transition-colors hover:text-white">업데이트</button>
            <button className="transition-colors hover:text-white">문의하기</button>
          </div>
          <p>© 2026 JifeLog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
