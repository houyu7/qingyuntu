import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MESSAGES_BY_PAGE: Record<string, string> = {
  '/': '今天也要加油哦！你已完成45%的青云之旅 ☁️',
  '/daily': '每天一小步，青云一大步！完成今日任务吧 ✨',
  '/launch': '把你的目标告诉我，我来帮你规划青云路！🌟',
  '/inn': '别担心等待～平均3-5天就会有回音的 💌',
  '/interview': '面试不是考试，是经验的积累！加油 💪',
  '/resume': '看看你的成长，你已经比昨天更强了 📝',
};

export function XiaoYun({ pathname }: { pathname: string }) {
  const { xiaoYunMessage, showXiaoYun, setShowXiaoYun } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const pageMessage = MESSAGES_BY_PAGE[pathname] || xiaoYunMessage;
  const displayMessage = xiaoYunMessage !== '今天也要加油哦！每一步都算数 ☁️' ? xiaoYunMessage : pageMessage;

  if (dismissed) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-2 md:bottom-8">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="relative max-w-[220px] rounded-2xl p-3.5 shadow-lg"
            style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(18,184,152,0.25)',
            }}
          >
            {/* Bubble tail */}
            <div
              className="absolute -bottom-2 right-6 w-4 h-4"
              style={{
                background: 'rgba(255,255,255,0.92)',
                border: '1.5px solid rgba(18,184,152,0.25)',
                borderTop: 'none',
                borderLeft: 'none',
                transform: 'rotate(45deg)',
                clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
              }}
            />
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={12} />
            </button>
            <p className="text-xs leading-relaxed pr-4" style={{ color: '#374151' }}>
              <span className="font-semibold" style={{ color: '#12B898' }}>小云说：</span>
              <br />
              {displayMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main XiaoYun button */}
      <motion.button
        onClick={() => setExpanded(!expanded)}
        className="relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center xiao-yun-float"
        style={{
          background: 'linear-gradient(135deg, #12B898, #2AC59D)',
          boxShadow: '0 4px 20px rgba(18,184,152,0.4)',
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        {/* Cloud face SVG */}
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          {/* Cloud body */}
          <ellipse cx="18" cy="22" rx="14" ry="9" fill="rgba(255,255,255,0.95)" />
          <ellipse cx="12" cy="17" rx="8" ry="7" fill="rgba(255,255,255,0.95)" />
          <ellipse cx="24" cy="16" rx="7" ry="6.5" fill="rgba(255,255,255,0.95)" />
          <ellipse cx="18" cy="14" rx="7" ry="6" fill="rgba(255,255,255,0.95)" />
          {/* Eyes */}
          <circle cx="15" cy="19" r="1.5" fill="#12B898" />
          <circle cx="21" cy="19" r="1.5" fill="#12B898" />
          {/* Smile */}
          <path d="M14.5 22.5 Q18 25 21.5 22.5" stroke="#12B898" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          {/* Blush */}
          <ellipse cx="12.5" cy="21" rx="1.8" ry="1" fill="rgba(255,150,150,0.4)" />
          <ellipse cx="23.5" cy="21" rx="1.8" ry="1" fill="rgba(255,150,150,0.4)" />
        </svg>

        {/* Notification dot */}
        {!expanded && (
          <span
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
            style={{ background: '#F59E0B' }}
          />
        )}
      </motion.button>
    </div>
  );
}
