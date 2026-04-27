// app/page.jsx or app/home/page.jsx
import { Suspense, lazy } from 'react';

// Lazy load heavy below-fold components
const About = lazy(() => import('./components/About'));
const Experience = lazy(() => import('./components/Experience'));
const Journal = lazy(() => import('./components/Journal'));
const Reviews = lazy(() => import('./components/Reviews'));

// Critical above-fold component loaded immediately
import Hero from './components/Hero';
import Products from './components/Products';

// Loading skeletons
const SectionSkeleton = () => (
  <div style={{ minHeight: '60vh', background: 'var(--bg-soft)' }} />
);

export default function Home() {
  return (
    <div>
      <Hero />
      <Products />
      
      <Suspense fallback={<SectionSkeleton />}>
        <About />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <Experience />
      </Suspense>
      

      
      {/*
      <Suspense fallback={<SectionSkeleton />}>
        <Journal />
      </Suspense>
      */}
      
      <Suspense fallback={<SectionSkeleton />}>
        <Reviews />
      </Suspense>
    </div>
  );
}