import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Launch } from './pages/Launch';
import { Daily } from './pages/Daily';
import { Inn } from './pages/Inn';
import { ResumeLib } from './pages/ResumeLib';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'launch', Component: Launch },
      { path: 'daily', Component: Daily },
      { path: 'inn', Component: Inn },
      { path: 'resume', Component: ResumeLib },
    ],
  },
]);
