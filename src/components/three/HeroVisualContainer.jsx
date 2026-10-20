import React, { useState, useEffect, Suspense } from 'react';
import HologramLoader from './HologramLoader.jsx';
import portfolioService from '../../services/portfolio.service.js';

// Lazy-load the 3 3D visual variants for zero-lag code splitting
const TechGadgetHologram = React.lazy(() => import('./TechGadgetHologram.jsx'));
const HeroHologram = React.lazy(() => import('./HeroHologram.jsx'));
const TechGlobeHologram = React.lazy(() => import('./TechGlobeHologram.jsx'));

export const HeroVisualContainer = ({ initialVisualType }) => {
  const [activeVisual, setActiveVisual] = useState(initialVisualType || 'globe');

  // Dynamically load active 3D showcase setting managed exclusively from dashboard
  useEffect(() => {
    let isMounted = true;
    const loadVisualSetting = async () => {
      try {
        const profile = await portfolioService.getProfileInfo();
        if (profile?.hero_visual_type && isMounted) {
          setActiveVisual(profile.hero_visual_type);
        }
      } catch (err) {
        // Fallback to local state
      }
    };

    loadVisualSetting();

    // Listen to local storage or profile updates from dashboard in same session
    const handleStorageChange = () => {
      const syncProfile = portfolioService.getProfileInfoSync();
      if (syncProfile?.hero_visual_type) {
        setActiveVisual(syncProfile.hero_visual_type);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="relative w-full flex items-center justify-center">
      <Suspense fallback={<HologramLoader />}>
        {activeVisual === 'laptop' && <TechGadgetHologram />}
        {activeVisual === 'brain' && <HeroHologram />}
        {(activeVisual === 'globe' || activeVisual === 'sphere' || activeVisual === 'mobile') && <TechGlobeHologram />}
      </Suspense>
    </div>
  );
};

export default HeroVisualContainer;
