import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, Plus, ChevronDown, Star, Sparkles,
  TrendingUp, Award, Tag, Calendar, CheckCircle2,
  Eye, Download, Edit3, GitBranch
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ResumeLib() {
  const { resumeEntries, stages, user } = useApp();
  const navigate = useNavigate();
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [activeVersion, setActiveVersion] = useState('v1');
  const [activeTab, setActiveTab] = useState<'entries' | 'versions' | 'growth'>('entries');

  const activeStage = stages.find(stage => stage.status === 'active') ?? stages[0];
  const versions = resumeEntries.length > 0
    ? resumeEntries.map((entry, index) => ({
      id: `v${index + 1}`,
      label: `v${index + 1}.0 ${entry.position}`,
      date: entry.period,
      stage: entry.stage,
      description: `${entry.company}素材版 · ${entry.skills.slice(0, 2).join(' / ')}`,
    }))
    : [{
      id: 'v1',
      label: 'v1.0 待生成版本',
      date: '待填写资料',
      stage: 1,
      description: '先完成资料填写，青云简牍会自动生成第一版内容',
    }];

  const growthItems = [
    { label: '简历经历数', before: Math.max(resumeEntries.length - 1, 0), after: resumeEntries.length, unit: '条', color: '#12B898' },
    { label: '当前阶段', before: Math.max(activeStage?.id ?? 1 - 1, 0), after: activeStage?.id ?? 1, unit: '阶段', color: '#8B5CF6' },
    { label: '目标岗位', before: user.hasSetup ? 0 : 1, after: user.targetJob ? 1 : 0, unit: '个', color: '#F59E0B' },
  ];

  const xiaoYunMessage = resumeEntries.length === 0
    ? '先完成一次 AI 分析，简牍会生成你的 v1.0 初始简历。'
    : `当前已有 ${resumeEntries.length} 条简历版本，青云驿馆的新经历会继续同步进来。`;

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
            style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)' }}>
            <FileText size={16} color="white" />
          </div>
          <h1 className="text-gray-800">青云简牍</h1>
        </div>
        <p className="text-sm text-gray-500 ml-10">简历素材库与成长可视化</p>
      </motion.div>

      {/* Growth banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, type: 'spring', stiffness: 300, damping: 28 }}
        className="rounded-2xl p-5 mb-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)' }}
      >
        {/* Decorative */}
        <div className="absolute -top-6 -right-6 opacity-10">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" fill="white" />
          </svg>
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} color="white" />
            <span className="text-white font-semibold">简历成长轨迹</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {growthItems.map(item => (
              <div key={item.label} className="text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-xs text-white/60">{item.before}</span>
                  <span className="text-white/60 text-xs">→</span>
                  <span className="text-xl font-bold text-white">{item.after}</span>
                  <span className="text-xs text-white/80">{item.unit}</span>
                </div>
                <div className="text-xs text-white/70 mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Encouragement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl p-3 mb-5 flex items-start gap-2.5"
        style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}
      >
        <span className="text-base">☁️</span>
        <p className="text-xs" style={{ color: '#6B7280' }}>
          <span className="font-medium" style={{ color: '#F59E0B' }}>小云说：</span>
          {xiaoYunMessage}
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-4"
        style={{ background: 'rgba(226,232,240,0.4)' }}>
        {[
          { key: 'entries', label: '经历素材', icon: FileText },
          { key: 'versions', label: '多版简历', icon: GitBranch },
          { key: 'growth', label: '成长可见', icon: TrendingUp },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: activeTab === tab.key ? 'white' : 'transparent',
              color: activeTab === tab.key ? '#F59E0B' : '#6B7280',
              boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            <tab.icon size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ENTRIES TAB */}
        {activeTab === 'entries' && (
          <motion.div
            key="entries"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
          >
            {resumeEntries.length === 0 ? (
              <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(245,158,11,0.06)', border: '1px dashed rgba(245,158,11,0.2)' }}>
                <div className="text-2xl mb-2">📄</div>
                <div className="text-sm font-medium text-gray-800 mb-1">当前还没有简牍内容</div>
                <div className="text-xs text-gray-500">完成一次完整建档后，这里会开始记录你的经历素材与简历版本。</div>
              </div>
            ) : (
              <div className="space-y-4">
                {resumeEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 28 }}
                    className="glass-card rounded-2xl overflow-hidden"
                    style={{
                      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                      border: entry.isNew ? '1.5px solid rgba(245,158,11,0.25)' : '1px solid rgba(255,255,255,0.6)',
                    }}
                    onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                  >
                    <div className="p-4 cursor-pointer">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${entry.companyColor}, ${entry.companyColor}88)` }}
                          >
                            {entry.company[0]}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm text-gray-800">{entry.company}</span>
                              {entry.isNew && (
                                <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}>
                                  新增
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">{entry.position}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                          <Calendar size={10} /> {entry.period}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {entry.skills.map(skill => (
                          <span key={skill} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(18,184,152,0.08)', color: '#12B898' }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedEntry === entry.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4" style={{ borderTop: '1px solid rgba(226,232,240,0.5)' }}>
                            <div className="mt-3 space-y-2">
                              {entry.bullets.map((bullet, bulletIndex) => (
                                <div key={bulletIndex} className="flex items-start gap-2.5 text-xs text-gray-700">
                                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: '#12B898' }} />
                                  <span className="leading-relaxed">{bullet}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2 mt-3">
                              <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs" style={{ background: 'rgba(18,184,152,0.08)', color: '#12B898' }}>
                                <Edit3 size={11} /> 优化文案
                              </button>
                              <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs" style={{ background: 'rgba(139,92,246,0.08)', color: '#8B5CF6' }}>
                                <Sparkles size={11} /> AI提炼
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}

                <motion.button
                  onClick={() => navigate('/inn')}
                  className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-sm"
                  style={{
                    border: '1.5px dashed rgba(226,232,240,0.8)',
                    background: 'rgba(248,250,252,0.5)',
                    color: '#9CA3AF',
                  }}
                  whileHover={{ borderColor: 'rgba(18,184,152,0.4)', color: '#12B898', background: 'rgba(18,184,152,0.04)' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <Plus size={15} /> 录入新经历
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        {/* VERSIONS TAB */}
        {activeTab === 'versions' && (
          <motion.div
            key="versions"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
          >
            <div className="space-y-3">
              {versions.map((ver, i) => (
                <motion.div
                  key={ver.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 28 }}
                  className="glass-card rounded-2xl p-4 cursor-pointer"
                  style={{
                    border: activeVersion === ver.id
                      ? '1.5px solid rgba(245,158,11,0.35)'
                      : '1px solid rgba(255,255,255,0.6)',
                    background: activeVersion === ver.id
                      ? 'rgba(255,250,240,0.85)'
                      : 'rgba(255,255,255,0.75)',
                    boxShadow: activeVersion === ver.id
                      ? '0 4px 20px rgba(245,158,11,0.12)'
                      : '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  onClick={() => setActiveVersion(ver.id)}
                  whileHover={{ y: -1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: activeVersion === ver.id
                            ? 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(252,211,77,0.2))'
                            : 'rgba(226,232,240,0.4)',
                        }}
                      >
                        <FileText size={16} style={{ color: activeVersion === ver.id ? '#F59E0B' : '#9CA3AF' }} />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-gray-800">{ver.label}</div>
                        <div className="text-xs text-gray-400">{ver.description}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(18,184,152,0.08)', color: '#12B898' }}>
                        阶段{ver.stage}
                      </span>
                      <span className="text-xs text-gray-400">{ver.date}</span>
                    </div>
                  </div>

                  {activeVersion === ver.id && (
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium"
                        style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', color: 'white' }}>
                        <Eye size={12} /> 预览简历
                      </button>
                      <button className="px-4 py-2 rounded-xl text-xs font-medium"
                        style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
                        <Download size={12} />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Create new version */}
              <motion.button
                className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm"
                style={{
                  border: '1.5px dashed rgba(245,158,11,0.3)',
                  background: 'rgba(255,250,240,0.5)',
                  color: '#F59E0B',
                }}
                whileHover={{ background: 'rgba(255,250,240,0.8)' }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={15} /> 生成新版本简历
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* GROWTH TAB */}
        {activeTab === 'growth' && (
          <motion.div
            key="growth"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
          >
            <div className="space-y-4">
              {/* Growth metrics */}
              {growthItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 28 }}
                  className="glass-card rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-gray-400">{item.before}{item.unit}</span>
                      <span className="text-xs text-gray-400 mx-1">→</span>
                      <span className="font-bold" style={{ color: item.color }}>
                        {item.after}{item.unit}
                      </span>
                      <span className="text-xs ml-1 px-1.5 py-0.5 rounded-full"
                        style={{ background: `${item.color}18`, color: item.color }}>
                        +{item.after - item.before}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    {/* Before bar */}
                    <div className="text-xs text-gray-400 w-8 flex-shrink-0">前</div>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(226,232,240,0.5)' }}>
                      <div className="h-full rounded-full" style={{ width: `${(item.before / item.after) * 100}%`, background: '#E2E8F0' }} />
                    </div>
                  </div>
                  <div className="flex gap-2 items-center mt-1.5">
                    <div className="text-xs text-gray-400 w-8 flex-shrink-0">现</div>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(226,232,240,0.3)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${item.color}, ${item.color}88)` }}
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.15 + 0.3 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Skills evolution */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, type: 'spring', stiffness: 300, damping: 28 }}
                className="glass-card rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={14} style={{ color: '#12B898' }} />
                  <span className="text-sm font-medium text-gray-700">技能标签演变</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1.5">起步阶段（4个）</div>
                    <div className="flex flex-wrap gap-1.5">
                      {['Office', 'PPT', '数据整理', '沟通协调'].map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(226,232,240,0.6)', color: '#9CA3AF' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px" style={{ background: 'rgba(226,232,240,0.6)' }} />
                    <TrendingUp size={12} style={{ color: '#12B898' }} />
                    <div className="flex-1 h-px" style={{ background: 'rgba(226,232,240,0.6)' }} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1.5">现在阶段（11个）</div>
                    <div className="flex flex-wrap gap-1.5">
                      {['需求分析', '数据分析', '跨部门协作', 'PRD文档', '竞品分析', '用户调研', '原型设计', 'Office', 'PPT', '数据整理', '沟通协调'].map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(18,184,152,0.08)', color: '#12B898' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Encouragement card */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="rounded-2xl p-4 text-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(18,184,152,0.06), rgba(112,218,170,0.1))',
                  border: '1.5px solid rgba(18,184,152,0.2)',
                }}
              >
                <div className="text-3xl mb-2">🌟</div>
                <div className="font-semibold text-gray-800 mb-1">你真的在变强！</div>
                <div className="text-sm text-gray-500">继续完成直上青云阶段，简牍将再次蜕变</div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
