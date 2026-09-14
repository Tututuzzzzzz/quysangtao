import React, { useState, useEffect } from 'react';
import api from '../services/api';
import HeroSection from './landing/HeroSection';
import CoreValuesSection from './landing/CoreValuesSection';
import LeaderboardBanner from './landing/LeaderboardBanner';
import IdeaBuilderWizard from './landing/IdeaBuilderWizard';
import FaqSection from './landing/FaqSection';

export default function LandingPage() {
  const [stats, setStats] = useState({
    totalIdeas: 0,
    totalImplementedSavings: 0,
    implementedCount: 0
  });
  const [leaderboardItems, setLeaderboardItems] = useState([]);
  const [activeCarouselDot, setActiveCarouselDot] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  useEffect(() => {
    api.get('/analytics/dashboard')
      .then((res) => {
        if (res.data) setStats(res.data);
      })
      .catch((err) => console.warn('Không thể tải thống kê dashboard:', err));

    api.get('/analytics/leaderboard')
      .then((res) => {
        if (res.data && Array.isArray(res.data)) setLeaderboardItems(res.data);
      })
      .catch((err) => console.warn('Không thể tải bảng xếp hạng:', err));
  }, []);

  // Auto-advance Leaderboard Hero Banner effect (mỗi 4 giây lướt 1 lần)
  useEffect(() => {
    if (isCarouselHovered || !Array.isArray(leaderboardItems) || leaderboardItems.length <= 1) return;
    const interval = setInterval(() => {
      setActiveCarouselDot((prevDot) => {
        const maxIndex = leaderboardItems.length - 1;
        return prevDot >= maxIndex ? 0 : prevDot + 1;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isCarouselHovered, leaderboardItems]);

  const handleSelectIndex = (index) => {
    setActiveCarouselDot(index);
  };

  return (
    <div className="w-full relative bg-slate-50 text-slate-900">
      <HeroSection stats={stats} />
      <CoreValuesSection />
      <LeaderboardBanner
        leaderboardItems={leaderboardItems}
        activeCarouselDot={activeCarouselDot}
        onSelectIndex={handleSelectIndex}
        onMouseEnter={() => setIsCarouselHovered(true)}
        onMouseLeave={() => setIsCarouselHovered(false)}
      />
      <IdeaBuilderWizard />
      <FaqSection />
    </div>
  );
}
