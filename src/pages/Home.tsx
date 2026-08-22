import React from 'react';
import { motion } from 'motion/react';
import Hero from '../components/Hero';
import AppPreviewSection from '../components/AppPreviewSection';
import Stats from '../components/Stats';
import Products from '../components/Products';
import Services from '../components/Services';
import VehicleFleet from '../components/VehicleFleet';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Coverage from '../components/Coverage';
import Reviews from '../components/Reviews';
import ServiceReachMap from '../components/ServiceReachMap';
import Contact from '../components/Contact';
import FAQ from '../components/FAQ';

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

export default function Home() {
  return (
    <>
      <Hero />
      <Products />
      <FadeIn><Stats /></FadeIn>
      <FadeIn><Services /></FadeIn>
      <VehicleFleet />
      <FadeIn><Features /></FadeIn>
      <FadeIn><AppPreviewSection /></FadeIn>
      <FadeIn><HowItWorks /></FadeIn>
      <FadeIn><Coverage /></FadeIn>
      <FadeIn><ServiceReachMap /></FadeIn>
      <FadeIn><Reviews /></FadeIn>
      <FadeIn><FAQ /></FadeIn>
      <FadeIn><Contact /></FadeIn>
    </>
  );
}
