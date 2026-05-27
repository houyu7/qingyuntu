import React, { createContext, useContext, useEffect, useState } from 'react';

export type StageStatus = 'completed' | 'active' | 'locked';

export interface Stage {
  id: number;
  name: string;
  subtitle: string;
  tag: string;
  color: string;
  status: StageStatus;
  progress: number;
  completionReqs: string[];
  currentProgress: { label: string; value: number; total: number }[];
  icon: string;
}

export interface DailyTask {
  id: string;
  type: 'apply' | 'interview' | 'resume' | 'review';
  title: string;
  description: string;
  xp: number;
  completed: boolean;
}

export interface Application {
  id: string;
  company: string;
  companyColor: string;
  position: string;
  status: 'applied' | 'viewed' | 'interview' | 'offer' | 'rejected';
  appliedDate: string;
  waitDays: number;
  stage: number;
  location: string;
  salary: string;
}

export interface InterviewRecord {
  id: string;
  company: string;
  position: string;
  date: string;
  result: 'passed' | 'failed' | 'pending';
  questions: string[];
  notes: string;
  score: number;
}

export interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  practiced: boolean;
  starTips: string;
}

export interface ResumeEntry {
  id: string;
  company: string;
  companyColor: string;
  position: string;
  period: string;
  bullets: string[];
  skills: string[];
  stage: number;
  isNew?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  xpReward: number;
  unlockedAt?: string;
}

export interface AppUser {
  name: string;
  targetJob: string;
  targetCompany: string;
  university: string;
  grade: string;
  xp: number;
  level: number;
  streak: number;
  totalApplied: number;
  totalInterviews: number;
  matchScore: number;
  hasSetup: boolean;
}

interface JourneySnapshot {
  user: AppUser;
  stages: Stage[];
  dailyTasks: DailyTask[];
  applications: Application[];
  interviewRecords: InterviewRecord[];
  questions: Question[];
  resumeEntries: ResumeEntry[];
  achievements: Achievement[];
  xiaoYunMessage: string;
  showXiaoYun: boolean;
}

interface PersistedWorkspace {
  activeAccount: string;
  accounts: Record<string, JourneySnapshot>;
}

const STORAGE_KEY = 'qingyun.workspace.v1';

function readStoredWorkspace(): PersistedWorkspace | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedWorkspace;
    if (!parsed || typeof parsed !== 'object' || !parsed.accounts) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStoredWorkspace(workspace: PersistedWorkspace) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
}

function cloneSnapshot(snapshot: JourneySnapshot): JourneySnapshot {
  return {
    user: { ...snapshot.user },
    stages: snapshot.stages.map(stage => ({
      ...stage,
      completionReqs: [...stage.completionReqs],
      currentProgress: stage.currentProgress.map(item => ({ ...item })),
    })),
    dailyTasks: snapshot.dailyTasks.map(task => ({ ...task })),
    applications: snapshot.applications.map(app => ({ ...app })),
    interviewRecords: snapshot.interviewRecords.map(record => ({
      ...record,
      questions: [...record.questions],
    })),
    questions: snapshot.questions.map(question => ({ ...question })),
    resumeEntries: snapshot.resumeEntries.map(entry => ({
      ...entry,
      bullets: [...entry.bullets],
      skills: [...entry.skills],
    })),
    achievements: snapshot.achievements.map(achievement => ({ ...achievement })),
    xiaoYunMessage: snapshot.xiaoYunMessage,
    showXiaoYun: snapshot.showXiaoYun,
  };
}

interface AppContextType {
  user: AppUser;
  stages: Stage[];
  dailyTasks: DailyTask[];
  applications: Application[];
  interviewRecords: InterviewRecord[];
  questions: Question[];
  resumeEntries: ResumeEntry[];
  achievements: Achievement[];
  xiaoYunMessage: string;
  showXiaoYun: boolean;
  completeTask: (taskId: string) => void;
  setHasSetup: (val: boolean) => void;
  setXiaoYunMessage: (msg: string) => void;
  setShowXiaoYun: (val: boolean) => void;
  addApplication: (app: Application) => void;
  updateApplicationStatus: (id: string, status: Application['status']) => void;
  toggleQuestion: (id: string) => void;
  updateUser: (updates: Partial<AppUser>) => void;
  updateStageProgress: (stageId: number, progressIndex: number, field: 'value' | 'total', newVal: number) => void;
  initializeJourney: (profile: Partial<AppUser>) => void;
  applyPlan: (plan: StagePlanItem[]) => void;
  savedAccounts: string[];
  loadAccount: (accountName: string) => boolean;
  resetCurrentAccount: () => void;
}

export interface StagePlanItem {
  stageId: number;
  duration: string;
  targets: { label: string; value: number; unit: string }[];
}

function createStarterDailyTasks(): DailyTask[] {
  return [
    {
      id: 't1',
      type: 'apply',
      title: '补全目标岗位信息',
      description: '先完成个人资料，再开始今天的求职节奏',
      xp: 20,
      completed: false,
    },
    {
      id: 't2',
      type: 'resume',
      title: '整理第一版简历素材',
      description: '把经历梳理清楚，方便后续做简历优化',
      xp: 15,
      completed: false,
    },
    {
      id: 't3',
      type: 'interview',
      title: '练习一道面试题',
      description: '从基础题开始，逐步建立面试手感',
      xp: 15,
      completed: false,
    },
  ];
}

function buildDailyTasksFromPlan(plan: StagePlanItem[]): DailyTask[] {
  const stage1 = plan.find(p => p.stageId === 1);
  const stage2 = plan.find(p => p.stageId === 2);
  const stage3 = plan.find(p => p.stageId === 3);

  const fallback = createStarterDailyTasks();

  const taskFromTarget = (
    id: string,
    type: DailyTask['type'],
    target: StagePlanItem['targets'][number] | undefined,
    stageLabel: string,
    fallbackTask: DailyTask,
  ): DailyTask => {
    if (!target) return fallbackTask;

    const title = `${target.label}${target.value}${target.unit}`;
    const description = `${stageLabel}阶段的重点任务：${target.label}，持续推进 ${target.value}${target.unit}`;
    return {
      ...fallbackTask,
      id,
      type,
      title,
      description,
      completed: false,
    };
  };

  return [
    taskFromTarget('t1', 'apply', stage1?.targets[0], '起步青云', fallback[0]),
    taskFromTarget('t2', 'resume', stage1?.targets[1] ?? stage2?.targets[0], '直上青云', fallback[1]),
    taskFromTarget('t3', 'review', stage2?.targets[1] ?? stage3?.targets[0], '平步青云', fallback[2]),
  ];
}

function calculateStageProgress(stage: Stage, planItem?: StagePlanItem) {
  if (!planItem || planItem.targets.length === 0) {
    return {
      progress: stage.progress,
      status: stage.status,
      currentProgress: stage.currentProgress,
    };
  }

  const currentProgress = planItem.targets.map((target, index) => ({
    label: target.label,
    value: stage.currentProgress[index]?.value ?? 0,
    total: target.value,
  }));

  const ratios = currentProgress.map(item => Math.min(1, item.total > 0 ? item.value / item.total : 0));
  const progress = Math.round((ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length) * 100);

  return {
    progress,
    status: progress >= 100 ? 'completed' : progress > 0 ? 'active' : 'locked',
    currentProgress,
  };
}

function calculateOverallMatchScore(stages: Stage[]) {
  if (stages.length === 0) return 0;
  const score = stages.reduce((sum, stage) => sum + (stage.progress || 0), 0) / stages.length;
  return Math.min(100, Math.max(0, Math.round(score)));
}

function buildDailyTasksFromProfile(profile: AppUser): DailyTask[] {
  const job = profile.targetJob || '目标岗位';
  const company = profile.targetCompany || '目标公司';

  return [
    {
      id: 't1',
      type: 'apply',
      title: `投递 ${company} 相关岗位`,
      description: `围绕 ${job} 的投递清单，优先处理与你目标公司相近的岗位`,
      xp: 20,
      completed: false,
    },
    {
      id: 't2',
      type: 'resume',
      title: `整理 ${job} 简历素材`,
      description: `补充与 ${company} 匹配的经历表达，让简历更贴近目标岗位`,
      xp: 15,
      completed: false,
    },
    {
      id: 't3',
      type: 'interview',
      title: `准备 ${job} 面试题`,
      description: `优先练习与 ${job} 相关的高频题，并补充项目复盘`,
      xp: 15,
      completed: false,
    },
  ];
}

function buildApplicationsFromProfile(profile: AppUser): Application[] {
  void profile;
  return [];
}

function buildResumeEntriesFromProfile(profile: AppUser): ResumeEntry[] {
  void profile;
  return [];
}

const initialUser: AppUser = {
  name: '',
  targetJob: '',
  targetCompany: '',
  university: '',
  grade: '',
  xp: 0,
  level: 1,
  streak: 0,
  totalApplied: 0,
  totalInterviews: 0,
  matchScore: 0,
  hasSetup: false,
};

const initialStages: Stage[] = [
  {
    id: 1,
    name: '起步青云',
    subtitle: '入门实习，补空白、建节奏',
    tag: '阶段一',
    color: '#12B898',
    status: 'locked',
    progress: 0,
    completionReqs: ['投递≥5家', '完成1次面试复盘'],
    icon: '✓',
    currentProgress: [
      { label: '投递数', value: 0, total: 5 },
      { label: '复盘次数', value: 0, total: 1 },
    ],
  },
  {
    id: 2,
    name: '直上青云',
    subtitle: '进阶实习，练能力、贴目标',
    tag: '阶段二',
    color: '#2AC59D',
    status: 'locked',
    progress: 0,
    completionReqs: ['简历更新≥2条经历', '投递≥5家'],
    icon: '↑',
    currentProgress: [
      { label: '经历更新', value: 0, total: 2 },
      { label: '投递数', value: 0, total: 5 },
    ],
  },
  {
    id: 3,
    name: '平步青云',
    subtitle: '冲刺实习，高含金量、冲秋招',
    tag: '阶段三',
    color: '#70DAAA',
    status: 'locked',
    progress: 0,
    completionReqs: ['完成阶段二', 'JD匹配度≥70%'],
    icon: '⚡',
    currentProgress: [],
  },
  {
    id: 4,
    name: '青云上岸',
    subtitle: '秋招正式投递，平步青云',
    tag: '终局',
    color: '#F59E0B',
    status: 'locked',
    progress: 0,
    completionReqs: ['完成阶段三', '简历最终版确认'],
    icon: '🏆',
    currentProgress: [],
  },
];

const initialDailyTasks: DailyTask[] = createStarterDailyTasks();

const initialApplications: Application[] = [
  {
    id: 'a1',
    company: '腾讯',
    companyColor: '#1DB954',
    position: '产品实习生',
    status: 'interview',
    appliedDate: '2025-04-22',
    waitDays: 3,
    stage: 2,
    location: '深圳',
    salary: '200元/天',
  },
  {
    id: 'a2',
    company: '字节跳动',
    companyColor: '#FF6B35',
    position: '产品经理实习',
    status: 'viewed',
    appliedDate: '2025-04-25',
    waitDays: 5,
    stage: 2,
    location: '北京',
    salary: '250元/天',
  },
  {
    id: 'a3',
    company: '阿里巴巴',
    companyColor: '#FF6900',
    position: 'B端产品实习',
    status: 'applied',
    appliedDate: '2025-04-28',
    waitDays: 2,
    stage: 2,
    location: '杭州',
    salary: '220元/天',
  },
  {
    id: 'a4',
    company: '网易',
    companyColor: '#CC0000',
    position: '游戏产品实习',
    status: 'rejected',
    appliedDate: '2025-04-15',
    waitDays: 0,
    stage: 1,
    location: '广州',
    salary: '180元/天',
  },
  {
    id: 'a5',
    company: '美团',
    companyColor: '#FFD700',
    position: '运营产品实习',
    status: 'offer',
    appliedDate: '2025-04-05',
    waitDays: 0,
    stage: 1,
    location: '北京',
    salary: '200元/天',
  },
];

const initialInterviewRecords: InterviewRecord[] = [
  {
    id: 'i1',
    company: '美团',
    position: '运营产品实习',
    date: '2025-04-12',
    result: 'passed',
    questions: ['自我介绍', '描述一个你主导的产品功能', '如何做用户调研'],
    notes: '面试官很和蔼，重点考察用户思维。下次准备更多数据支撑。',
    score: 85,
  },
  {
    id: 'i2',
    company: '网易',
    position: '游戏产品实习',
    date: '2025-04-18',
    result: 'failed',
    questions: ['竞品分析框架', '设计一个游戏社交功能', '用数据驱动决策的案例'],
    notes: '对游戏行业了解不深，竞品分析不够具体。需要补充行业知识。',
    score: 58,
  },
];

const initialQuestions: Question[] = [
  {
    id: 'q1',
    text: '请介绍一个你主导或深度参与的产品功能，从需求到上线的完整过程',
    category: '产品经验',
    difficulty: 'medium',
    practiced: false,
    starTips: 'S: 描述背景和用户痛点 | T: 你的目标和职责 | A: 具体行动和方法论 | R: 量化结果（DAU/转化率/NPS）',
  },
  {
    id: 'q2',
    text: '如何做用户调研？说说你的方法论和实际经验',
    category: '用户研究',
    difficulty: 'easy',
    practiced: false,
    starTips: 'S: 说明调研的背景场景 | T: 调研目标是什么 | A: 用了哪些调研方法 | R: 调研结果如何影响决策',
  },
  {
    id: 'q3',
    text: '请对微信朋友圈进行竞品分析，并提出一个改进建议',
    category: '竞品分析',
    difficulty: 'hard',
    practiced: false,
    starTips: '分析维度：用户群体/核心功能/商业模式/体验对比 | 改进需基于数据和用户痛点',
  },
  {
    id: 'q4',
    text: '你如何用数据驱动产品决策？举一个具体案例',
    category: '数据思维',
    difficulty: 'medium',
    practiced: false,
    starTips: 'S: 面临的问题是什么 | T: 需要做什么决策 | A: 收集了哪些数据，如何分析 | R: 基于数据的决策结果',
  },
  {
    id: 'q5',
    text: '如果用户留存率下降了20%，你会怎么排查原因？',
    category: '数据思维',
    difficulty: 'hard',
    practiced: false,
    starTips: '思路：拆分漏斗→定位问题层→假设验证→行动建议 | 记得分维度（渠道/功能/时间）',
  },
  {
    id: 'q6',
    text: '说说你对产品经理核心职责的理解',
    category: '职业认知',
    difficulty: 'easy',
    practiced: false,
    starTips: '核心：发现用户需求→定义问题→协作解决→度量价值 | 强调沟通、判断力和商业意识',
  },
];

const initialResumeEntries: ResumeEntry[] = [];

const initialAchievements: Achievement[] = [
  { id: 'ac1', title: '初出茅庐', description: '完成第一次投递', emoji: '🚀', unlocked: false, xpReward: 50 },
  { id: 'ac2', title: '投递达人', description: '累计投递10家', emoji: '📮', unlocked: false, xpReward: 100 },
  { id: 'ac3', title: '复盘能手', description: '完成5次面试复盘', emoji: '📝', unlocked: false, xpReward: 80 },
  { id: 'ac4', title: '阶段通关', description: '完成起步青云阶段', emoji: '⭐', unlocked: false, xpReward: 200 },
  { id: 'ac5', title: '连胜之星', description: '连续打卡7天', emoji: '🔥', unlocked: false, xpReward: 150 },
  { id: 'ac6', title: '面试老手', description: '完成10次面试练习', emoji: '🎯', unlocked: false, xpReward: 120 },
  { id: 'ac7', title: '简历达人', description: '简历更新达到5条经历', emoji: '📄', unlocked: false, xpReward: 100 },
  { id: 'ac8', title: '青云之路', description: '完成所有三个阶段', emoji: '🌟', unlocked: false, xpReward: 500 },
];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const storedWorkspace = readStoredWorkspace();
  const storedSnapshot = storedWorkspace?.activeAccount ? storedWorkspace.accounts[storedWorkspace.activeAccount] : null;

  const [user, setUser] = useState<AppUser>(storedSnapshot?.user ?? initialUser);
  const [stages, setStages] = useState<Stage[]>(storedSnapshot?.stages ?? initialStages);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(storedSnapshot?.dailyTasks ?? initialDailyTasks);
  const [applications, setApplications] = useState<Application[]>(storedSnapshot?.applications ?? initialApplications);
  const [interviewRecords] = useState<InterviewRecord[]>(storedSnapshot?.interviewRecords ?? initialInterviewRecords);
  const [questions, setQuestions] = useState<Question[]>(storedSnapshot?.questions ?? initialQuestions);
  const [resumeEntries, setResumeEntries] = useState<ResumeEntry[]>(storedSnapshot?.resumeEntries ?? initialResumeEntries);
  const [achievements] = useState<Achievement[]>(storedSnapshot?.achievements ?? initialAchievements);
  const [xiaoYunMessage, setXiaoYunMessage] = useState(storedSnapshot?.xiaoYunMessage ?? '今天也要加油哦！每一步都算数 ☁️');
  const [showXiaoYun, setShowXiaoYun] = useState(storedSnapshot?.showXiaoYun ?? true);
  const [savedAccounts, setSavedAccounts] = useState<string[]>(() => Object.keys(storedWorkspace?.accounts ?? {}));

  const persistCurrentSnapshot = (accountName: string, snapshot: JourneySnapshot) => {
    if (!accountName.trim()) return;

    const workspace = readStoredWorkspace() ?? { activeAccount: accountName, accounts: {} };
    workspace.activeAccount = accountName;
    workspace.accounts[accountName] = cloneSnapshot(snapshot);
    writeStoredWorkspace(workspace);
    setSavedAccounts(Object.keys(workspace.accounts));
  };

  const loadAccount = (accountName: string) => {
    const workspace = readStoredWorkspace();
    const snapshot = workspace?.accounts[accountName];
    if (!workspace || !snapshot) return false;

    setUser(snapshot.user);
    setStages(snapshot.stages);
    setDailyTasks(snapshot.dailyTasks);
    setApplications(snapshot.applications);
    setQuestions(snapshot.questions);
    setResumeEntries(snapshot.resumeEntries);
    setXiaoYunMessage(snapshot.xiaoYunMessage);
    setShowXiaoYun(snapshot.showXiaoYun);
    setSavedAccounts(Object.keys(workspace.accounts));
    writeStoredWorkspace({ activeAccount: accountName, accounts: workspace.accounts });
    return true;
  };

  const resetCurrentAccount = () => {
    const accountName = user.name.trim();
    if (!accountName) return;

    const workspace = readStoredWorkspace();
    if (!workspace) {
      setUser(initialUser);
      setStages(initialStages);
      setDailyTasks(initialDailyTasks);
      setApplications(initialApplications);
      setQuestions(initialQuestions);
      setResumeEntries(initialResumeEntries);
      setXiaoYunMessage('今天也要加油哦！每一步都算数 ☁️');
      setShowXiaoYun(true);
      return;
    }

    delete workspace.accounts[accountName];
    const remainingAccounts = Object.keys(workspace.accounts);
    workspace.activeAccount = remainingAccounts[0] ?? '';
    writeStoredWorkspace(workspace);
    setSavedAccounts(remainingAccounts);

    if (workspace.activeAccount) {
      loadAccount(workspace.activeAccount);
      return;
    }

    setUser(initialUser);
    setStages(initialStages);
    setDailyTasks(initialDailyTasks);
    setApplications(initialApplications);
    setQuestions(initialQuestions);
    setResumeEntries(initialResumeEntries);
    setXiaoYunMessage('今天也要加油哦！每一步都算数 ☁️');
    setShowXiaoYun(true);
  };

  useEffect(() => {
    if (!user.hasSetup) return;
    const accountName = user.name.trim();
    if (!accountName) return;

    persistCurrentSnapshot(accountName, {
      user,
      stages,
      dailyTasks,
      applications,
      interviewRecords,
      questions,
      resumeEntries,
      achievements,
      xiaoYunMessage,
      showXiaoYun,
    });
  }, [user, stages, dailyTasks, applications, interviewRecords, questions, resumeEntries, achievements, xiaoYunMessage, showXiaoYun]);

  const completeTask = (taskId: string) => {
    setDailyTasks(prev => prev.map(t => {
      if (t.id === taskId && !t.completed) {
        setUser(u => ({ ...u, xp: u.xp + t.xp }));
        setXiaoYunMessage('太棒了！又完成一个任务，离青云更近一步！✨');
        return { ...t, completed: true };
      }
      return t;
    }));
  };

  const setHasSetup = (val: boolean) => setUser(u => ({ ...u, hasSetup: val }));

  const addApplication = (app: Application) => {
    setApplications(prev => [app, ...prev]);
    setUser(u => ({ ...u, totalApplied: u.totalApplied + 1 }));
  };

  const updateApplicationStatus = (id: string, status: Application['status']) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const toggleQuestion = (id: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, practiced: !q.practiced } : q));
  };

  const updateUser = (updates: Partial<AppUser>) => setUser(u => ({ ...u, ...updates }));

  const initializeJourney = (profile: Partial<AppUser>) => {
    const nextUser: AppUser = {
      ...initialUser,
      ...profile,
      hasSetup: true,
      xp: profile.xp ?? 0,
      level: profile.level ?? 1,
      streak: profile.streak ?? 0,
      totalApplied: profile.totalApplied ?? 0,
      totalInterviews: profile.totalInterviews ?? 0,
      matchScore: profile.matchScore ?? 0,
    };

    setUser(nextUser);
    setStages(initialStages.map(stage => ({
      ...stage,
      status: 'locked',
      progress: 0,
      currentProgress: stage.currentProgress.map(item => ({ ...item, value: 0 })),
    })));
    setDailyTasks(buildDailyTasksFromProfile(nextUser));
    setApplications(buildApplicationsFromProfile(nextUser));
    setResumeEntries(buildResumeEntriesFromProfile(nextUser));

    persistCurrentSnapshot(nextUser.name.trim(), {
      user: nextUser,
      stages: initialStages.map(stage => ({
        ...stage,
        status: 'locked',
        progress: 0,
        currentProgress: stage.currentProgress.map(item => ({ ...item, value: 0 })),
      })),
      dailyTasks: buildDailyTasksFromProfile(nextUser),
      applications: buildApplicationsFromProfile(nextUser),
      interviewRecords: initialInterviewRecords,
      questions: initialQuestions,
      resumeEntries: buildResumeEntriesFromProfile(nextUser),
      achievements: initialAchievements,
      xiaoYunMessage,
      showXiaoYun,
    });
  };

  const updateStageProgress = (stageId: number, progressIndex: number, field: 'value' | 'total', newVal: number) => {
    setStages(prev => prev.map(s => {
      if (s.id !== stageId) return s;
      const updated = [...s.currentProgress];
      updated[progressIndex] = { ...updated[progressIndex], [field]: Math.max(0, newVal) };
      return { ...s, currentProgress: updated };
    }));
  };

  const applyPlan = (plan: StagePlanItem[]) => {
    setStages(prev => {
      const nextStages = prev.map(stage => {
        const planItem = plan.find(p => p.stageId === stage.id);
        const next = calculateStageProgress(stage, planItem);
        return {
          ...stage,
          progress: next.progress,
          status: next.status,
          currentProgress: next.currentProgress,
        };
      });

      setUser(u => ({
        ...u,
        matchScore: calculateOverallMatchScore(nextStages),
        hasSetup: true,
      }));

      setDailyTasks(buildDailyTasksFromPlan(plan));
      setApplications(prev => prev.map((app, index) => {
        const stage1 = nextStages[0]?.progress ?? 0;
        const stage2 = nextStages[1]?.progress ?? 0;
        const stage3 = nextStages[2]?.progress ?? 0;
        const stage4 = nextStages[3]?.progress ?? 0;

        if (index === 0 && stage1 >= 100) return { ...app, status: 'interview', stage: 2, waitDays: 1 };
        if (index === 1 && stage2 >= 60) return { ...app, status: 'viewed', stage: 2, waitDays: 2 };
        if (index === 2 && stage3 >= 70) return { ...app, status: 'offer', stage: 3, waitDays: 0 };
        if (index === 3 && stage4 >= 80) return { ...app, status: 'offer', stage: 4, waitDays: 0 };
        return app;
      }));
      setResumeEntries(prev => prev.map(entry => ({
        ...entry,
        stage: nextStages.find(stage => stage.id === entry.stage)?.progress ? entry.stage : entry.stage,
        period: nextStages[entry.stage - 1]?.status === 'completed' ? '已沉淀' : entry.period,
      })));

      return nextStages;
    });
  };

  return (
    <AppContext.Provider value={{
      user, stages, dailyTasks, applications, interviewRecords, questions,
      resumeEntries, achievements, xiaoYunMessage, showXiaoYun,
      completeTask, setHasSetup, setXiaoYunMessage, setShowXiaoYun,
      addApplication, updateApplicationStatus, toggleQuestion, updateUser, initializeJourney,
      updateStageProgress, applyPlan,
      savedAccounts, loadAccount, resetCurrentAccount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
