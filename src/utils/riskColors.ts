import { RiskLevel } from '../types';

/**
 * STRICT 3-COLOR RULE FOR CRIME PULSE ATM RISK INTELLIGENCE:
 * 🔴 RED — HIGH (75%–100%)
 * 🔵 BLUE — MEDIUM (45%–74%)
 * 🟢 GREEN — LOW (0%–44%)
 * 
 * NO ORANGE, NO YELLOW, NO PURPLE.
 */

export interface RiskColorMeta {
  level: RiskLevel;
  colorName: 'RED' | 'BLUE' | 'GREEN';
  emoji: '🔴' | '🔵' | '🟢';
  text: string;
  bg: string;
  border: string;
  badge: string;
  hexStroke: string;
  hexFill: string;
  heatFill: string;
  ringColor: string;
  pillClass: string;
  label: string;
  range: string;
}

export function getRiskColorInfo(score: number, explicitLevel?: RiskLevel): RiskColorMeta {
  const numericScore = Math.max(0, Math.min(100, Math.round(score)));
  const level: RiskLevel = explicitLevel || (numericScore >= 75 ? 'HIGH' : numericScore >= 45 ? 'MEDIUM' : 'LOW');

  if (level === 'HIGH' || numericScore >= 75) {
    return {
      level: 'HIGH',
      colorName: 'RED',
      emoji: '🔴',
      text: 'text-red-400',
      bg: 'bg-red-500/20',
      border: 'border-red-500/50',
      badge: 'bg-red-950/80 text-red-300 border border-red-700 shadow-sm shadow-red-950/50',
      hexStroke: '#ef4444',
      hexFill: '#dc2626',
      heatFill: '#ef4444',
      ringColor: '#ef4444',
      pillClass: 'bg-red-500/20 text-red-400 border border-red-500/50 font-bold',
      label: 'HIGH RISK',
      range: '75%–100%'
    };
  }

  if (level === 'MEDIUM' || numericScore >= 45) {
    return {
      level: 'MEDIUM',
      colorName: 'BLUE',
      emoji: '🔵',
      text: 'text-blue-400',
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/50',
      badge: 'bg-blue-950/80 text-blue-300 border border-blue-700 shadow-sm shadow-blue-950/50',
      hexStroke: '#3b82f6',
      hexFill: '#2563eb',
      heatFill: '#3b82f6',
      ringColor: '#3b82f6',
      pillClass: 'bg-blue-500/20 text-blue-400 border border-blue-500/50 font-bold',
      label: 'MEDIUM RISK',
      range: '45%–74%'
    };
  }

  return {
    level: 'LOW',
    colorName: 'GREEN',
    emoji: '🟢',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/50',
    badge: 'bg-emerald-950/80 text-emerald-300 border border-emerald-700 shadow-sm shadow-emerald-950/50',
    hexStroke: '#10b981',
    hexFill: '#059669',
    heatFill: '#10b981',
    ringColor: '#10b981',
    pillClass: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 font-bold',
    label: 'LOW RISK',
    range: '0%–44%'
  };
}
