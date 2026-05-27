import { Outlet, NavLink, useLocation, Navigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Map, Zap, Building2, FileText, Rocket,
} from 'lucide-react';
import { CloudBackground } from './CloudBackground';
import { XiaoYun } from './XiaoYun';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/', icon: Map, label: '青云路径', exact: true },
  { to: '/daily', icon: Zap, label: '每日任务' },
  { to: '/inn', icon: Building2, label: '驿馆' },
  { to: '/resume', icon: FileText, label: '简牍' },
];

const sideNavItems = [
  { to: '/', icon: Map, label: '青云路径', desc: '成长地图' },
  { to: '/daily', icon: Zap, label: '青云每日', desc: '每日挑战' },
  { to: '/inn', icon: Building2, label: '青云驿馆', desc: '实习管理' },
  { to: '/resume', icon: FileText, label: '青云简牍', desc: '简历库' },
  { to: '/launch', icon: Rocket, label: '青云启航', desc: '重新分析' },
];

export function Layout() {
  const location = useLocation();
  const { user } = useApp();

  if (!user.hasSetup && location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }

  const isSetupMode = !user.hasSetup;

  return (
    <div className="min-h-screen relative" style={{ background: '#F7FFFC' }}>
      <CloudBackground />

      {/* Desktop Sidebar */}
      {!isSetupMode && (
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col z-20"
        style={{
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(16px)',
          borderRight: '1px solid rgba(18,184,152,0.12)',
        }}>
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: 'rgba(18,184,152,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #12B898, #2AC59D)' }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <ellipse cx="11" cy="14" rx="9" ry="5.5" fill="rgba(255,255,255,0.9)" />
                <ellipse cx="7" cy="10.5" rx="5" ry="4.5" fill="rgba(255,255,255,0.9)" />
                <ellipse cx="15" cy="10" rx="4.5" ry="4" fill="rgba(255,255,255,0.9)" />
                <ellipse cx="11" cy="9" rx="4.5" ry="4" fill="rgba(255,255,255,0.9)" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-gray-800">青云途</div>
              <div className="text-xs text-gray-400">一步一进阶</div>
            </div>
          </div>
        </div>

        {/* User mini card */}
        <div className="mx-4 mt-4 p-3 rounded-xl"
          style={{ background: 'linear-gradient(135deg, rgba(18,184,152,0.08), rgba(112,218,170,0.12))' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #12B898, #2AC59D)' }}>
              {user.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800 truncate">{user.name}</div>
              <div className="text-xs text-gray-500">Lv.{user.level} · {user.xp} XP</div>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
              🔥{user.streak}
            </div>
          </div>
          {/* XP bar */}
          <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(18,184,152,0.15)' }}>
            <div className="h-full rounded-full xp-bar" style={{ width: `${(user.xp % 100)}%` }} />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sideNavItems.map(item => {
            const isActive = item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to);
            return (
              <NavLink key={item.to} to={item.to}>
                <motion.div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                  style={{
                    background: isActive ? 'linear-gradient(135deg, rgba(18,184,152,0.12), rgba(42,197,157,0.15))' : 'transparent',
                    color: isActive ? '#12B898' : '#6B7280',
                  }}
                  whileHover={{ x: 2, background: 'rgba(18,184,152,0.06)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  <item.icon size={18} style={{ color: isActive ? '#12B898' : '#9CA3AF' }} />
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs" style={{ color: '#9CA3AF' }}>{item.desc}</div>
                  </div>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-6 rounded-full"
                      style={{ background: 'linear-gradient(180deg, #12B898, #2AC59D)' }} />
                  )}
                </motion.div>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom badge */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(18,184,152,0.1)' }}>
          <div className="text-xs text-center" style={{ color: '#9CA3AF' }}>平步上青云 ☁️</div>
        </div>
      </aside>
      )}

      {/* Main content */}
      <main className={`relative z-10 min-h-screen pb-24 md:pb-8 ${isSetupMode ? '' : 'md:ml-64'}`}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 35 }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Mobile bottom nav */}
      {!isSetupMode && (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 px-2 pb-safe"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(18,184,152,0.12)',
        }}>
        <div className="flex items-center justify-around py-2">
          {navItems.map(item => {
            const isActive = item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to);
            return (
              <NavLink key={item.to} to={item.to} className="flex-1">
                <motion.div
                  className="flex flex-col items-center gap-0.5 py-1"
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <div className="relative">
                    <item.icon
                      size={22}
                      style={{ color: isActive ? '#12B898' : '#9CA3AF' }}
                    />
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ background: '#12B898' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </div>
                  <span className="text-[10px]" style={{ color: isActive ? '#12B898' : '#9CA3AF' }}>
                    {item.label}
                  </span>
                </motion.div>
              </NavLink>
            );
          })}
        </div>
      </nav>
      )}

      {/* XiaoYun companion */}
      {!isSetupMode && <XiaoYun pathname={location.pathname} />}
    </div>
  );
}
