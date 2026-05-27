import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic2, CheckCircle2, Circle, ChevronDown, ChevronUp,
  Star, TrendingUp, Award, BookOpen, Play, Lightbulb,
  BarChart3, Clock, ThumbsUp, ThumbsDown, Minus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const DIFFICULTY_CONFIG = {
  easy: { label: '基础', color: '#12B898', bg: 'rgba(18,184,152,0.1)' },
  medium: { label: '进阶', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  hard: { label: '挑战', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

const CATEGORIES = ['全部', '产品经验', '用户研究', '竞品分析', '数据思维', '职业认知'];

const RESULT_CONFIG = {
  passed: { label: '通过', color: '#12B898', icon: ThumbsUp, bg: 'rgba(18,184,152,0.1)' },
  failed: { label: '未通过', color: '#EF4444', icon: ThumbsDown, bg: 'rgba(239,68,68,0.1)' },
  pending: { label: '待定', color: '#F59E0B', icon: Minus, bg: 'rgba(245,158,11,0.1)' },
};

export function Interview() {
  const { questions, interviewRecords, toggleQuestion } = useApp();
  const [activeTab, setActiveTab] = useState<'practice' | 'records'>('practice');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  const filteredQuestions = selectedCategory === '全部'
    ? questions
    : questions.filter(q => q.category === selectedCategory);

  const practicedCount = questions.filter(q => q.practiced).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' }}>
            <Mic2 size={16} color="white" />
          </div>
          <h1 className="text-gray-800">青云面斋</h1>
        </div>
        <p className="text-sm text-gray-500 ml-10">面试辅助与AI复盘</p>
      </motion.div>

      {/* Stats banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, type: 'spring', stiffness: 300, damping: 28 }}
        className="grid grid-cols-3 gap-3 mb-5"
      >
        {[
          { icon: BookOpen, label: '题目练习', value: `${practicedCount}/${questions.length}`, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
          { icon: BarChart3, label: '面试场次', value: `${interviewRecords.length}次`, color: '#12B898', bg: 'rgba(18,184,152,0.1)' },
          { icon: Award, label: '通过率', value: `${Math.round((interviewRecords.filter(r => r.result === 'passed').length / Math.max(interviewRecords.length, 1)) * 100)}%`, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <motion.div
            key={label}
            className="glass-card rounded-2xl p-3 text-center"
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2"
              style={{ background: bg }}>
              <Icon size={15} style={{ color }} />
            </div>
            <div className="font-semibold text-sm text-gray-800">{value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Motivational tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl p-3 mb-5 flex items-start gap-2.5"
        style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}
      >
        <Lightbulb size={15} style={{ color: '#8B5CF6', flexShrink: 0, marginTop: 1 }} />
        <p className="text-xs" style={{ color: '#6B7280' }}>
          <span className="font-medium" style={{ color: '#8B5CF6' }}>小云提示：</span>
          面试失败不是能力否定，每道题都是一份经验收集。用STAR框架回答，让面试官看见你的思维！
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-4"
        style={{ background: 'rgba(226,232,240,0.4)' }}>
        {[
          { key: 'practice', label: '面试备战', icon: Play },
          { key: 'records', label: '复盘留痕', icon: TrendingUp },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'practice' | 'records')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeTab === tab.key ? 'white' : 'transparent',
              color: activeTab === tab.key ? '#8B5CF6' : '#6B7280',
              boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'practice' ? (
          <motion.div
            key="practice"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
          >
            {/* Category filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
                  style={{
                    background: selectedCategory === cat ? 'rgba(139,92,246,0.1)' : 'rgba(226,232,240,0.5)',
                    color: selectedCategory === cat ? '#8B5CF6' : '#6B7280',
                    border: selectedCategory === cat ? '1px solid rgba(139,92,246,0.2)' : '1px solid transparent',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Practice progress */}
            <div className="glass-card rounded-xl p-3 mb-4 flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: '#6B7280' }}>练习进度</span>
                  <span style={{ color: '#8B5CF6' }}>{practicedCount}/{questions.length}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(139,92,246,0.1)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #8B5CF6, #A78BFA)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(practicedCount / questions.length) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
              <div className="text-2xl font-bold" style={{ color: '#8B5CF6' }}>
                {Math.round((practicedCount / questions.length) * 100)}%
              </div>
            </div>

            {/* Question cards */}
            <div className="space-y-2.5">
              {filteredQuestions.map((q, i) => {
                const diffCfg = DIFFICULTY_CONFIG[q.difficulty];
                const isExpanded = expandedQuestion === q.id;

                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 28 }}
                    className="glass-card rounded-2xl overflow-hidden"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                  >
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={e => { e.stopPropagation(); toggleQuestion(q.id); }}
                          className="flex-shrink-0 mt-0.5"
                        >
                          {q.practiced ? (
                            <CheckCircle2 size={20} style={{ color: '#8B5CF6' }} />
                          ) : (
                            <Circle size={20} style={{ color: '#D1D5DB' }} />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="text-xs px-2 py-0.5 rounded-full"
                              style={{ background: 'rgba(107,114,128,0.1)', color: '#6B7280' }}>
                              {q.category}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ background: diffCfg.bg, color: diffCfg.color }}>
                              {diffCfg.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800 leading-relaxed"
                            style={{ textDecoration: q.practiced ? 'line-through' : 'none', color: q.practiced ? '#9CA3AF' : '#1F2937' }}>
                            {q.text}
                          </p>
                        </div>

                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          className="flex-shrink-0"
                        >
                          <ChevronDown size={16} style={{ color: '#9CA3AF' }} />
                        </motion.div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4"
                            style={{ borderTop: '1px solid rgba(139,92,246,0.1)' }}>
                            <div className="mt-3 p-3 rounded-xl"
                              style={{ background: 'rgba(139,92,246,0.06)' }}>
                              <div className="flex items-center gap-1.5 mb-2">
                                <Star size={13} style={{ color: '#8B5CF6' }} />
                                <span className="text-xs font-semibold" style={{ color: '#8B5CF6' }}>STAR 框架提示</span>
                              </div>
                              <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
                                {q.starTips}
                              </p>
                            </div>

                            <button
                              onClick={() => toggleQuestion(q.id)}
                              className="mt-3 w-full py-2 rounded-xl text-sm font-medium transition-all"
                              style={{
                                background: q.practiced
                                  ? 'rgba(226,232,240,0.6)'
                                  : 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
                                color: q.practiced ? '#6B7280' : 'white',
                              }}
                            >
                              {q.practiced ? '标记为未练习' : '✓ 标记已练习'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="records"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
          >
            {interviewRecords.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Mic2 size={32} className="mx-auto mb-3 opacity-30" />
                <div className="text-sm">还没有面试记录</div>
                <div className="text-xs mt-1">完成面试后在这里复盘吧</div>
              </div>
            ) : (
              <div className="space-y-3">
                {interviewRecords.map((record, i) => {
                  const resCfg = RESULT_CONFIG[record.result];
                  const ResIcon = resCfg.icon;
                  const isExpanded = expandedRecord === record.id;

                  return (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 28 }}
                      className="glass-card rounded-2xl overflow-hidden"
                      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                    >
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => setExpandedRecord(isExpanded ? null : record.id)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-800">{record.company}</span>
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{ background: resCfg.bg, color: resCfg.color }}>
                                <ResIcon size={10} /> {resCfg.label}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">{record.position}</div>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                              <Clock size={10} /> {record.date}
                            </div>
                          </div>

                          {/* Score circle */}
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm"
                              style={{
                                background: `conic-gradient(${resCfg.color} ${record.score * 3.6}deg, rgba(226,232,240,0.4) 0)`,
                              }}
                            >
                              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold"
                                style={{ color: resCfg.color }}>
                                {record.score}
                              </div>
                            </div>
                            <span className="text-[10px] text-gray-400 mt-0.5">评分</span>
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-3"
                              style={{ borderTop: '1px solid rgba(226,232,240,0.6)' }}>
                              <div className="mt-3">
                                <div className="text-xs font-semibold text-gray-600 mb-2">被问到的��题</div>
                                <div className="space-y-1">
                                  {record.questions.map((q, qi) => (
                                    <div key={qi}
                                      className="flex items-start gap-2 text-xs text-gray-600 py-1.5 px-3 rounded-lg"
                                      style={{ background: 'rgba(248,250,252,0.8)' }}>
                                      <span className="font-medium" style={{ color: '#12B898', flexShrink: 0 }}>
                                        Q{qi + 1}
                                      </span>
                                      {q}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <div className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                                  <Lightbulb size={12} style={{ color: '#F59E0B' }} /> 复盘笔记
                                </div>
                                <div className="p-3 rounded-xl text-xs leading-relaxed"
                                  style={{ background: 'rgba(245,158,11,0.06)', color: '#6B7280', border: '1px solid rgba(245,158,11,0.15)' }}>
                                  {record.notes}
                                </div>
                              </div>

                              {record.result === 'failed' && (
                                <div className="p-3 rounded-xl flex items-start gap-2"
                                  style={{ background: 'rgba(18,184,152,0.06)', border: '1px solid rgba(18,184,152,0.15)' }}>
                                  <span className="text-base">☁️</span>
                                  <p className="text-xs" style={{ color: '#12B898' }}>
                                    <span className="font-medium">小云说：</span> 又多一份经验，下次更稳！失败是经验的积累，不是能力的否定 💪
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
