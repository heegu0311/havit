'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

const ClarityInitializer = () => {
  useEffect(() => {
    // 실제 Clarity 프로젝트 ID로 대체하세요.
    Clarity.init(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || '');
  }, []);
  return <></>;
};

export default ClarityInitializer;
