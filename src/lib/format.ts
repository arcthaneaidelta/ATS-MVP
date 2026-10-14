import type { OutcomeType, PlatformType } from '../types';

export function getOutcomeBadge(outcome: OutcomeType) {
  if (outcome === 'Recorded') {
    return {
      bg: 'bg-[#E1EEE6]',
      text: 'text-[#3F7D5B]',
      border: 'border-[#C8E1D2]',
      dot: '#3F7D5B',
      label: 'Recorded'
    };
  }
  return {
    bg: 'bg-[#F5DEDA]',
    text: 'text-[#A8433A]',
    border: 'border-[#EBC2BC]',
    dot: '#A8433A',
    label: 'Missed'
  };
}

export function getPlatformBadge(platform: PlatformType) {
  switch (platform) {
    case 'Zoom':
      return {
        bg: 'bg-[#E3EDEB]',
        text: 'text-[#1F4B4A]',
        border: 'border-[#C4DAD7]'
      };
    case 'Google Meet':
      return {
        bg: 'bg-[#DEE9F1]',
        text: 'text-[#3E6A8A]',
        border: 'border-[#C3D7E5]'
      };
    default:
      return {
        bg: 'bg-[#F4EAD0]',
        text: 'text-[#8A6A1E]',
        border: 'border-[#E4D4AD]'
      };
  }
}

export function getSeverityBadge(severity: 'High' | 'Medium' | 'Low') {
  switch (severity) {
    case 'High':
      return {
        bg: 'bg-[#F5DEDA]',
        text: 'text-[#A8433A]',
        border: 'border-[#EBC2BC]'
      };
    case 'Medium':
      return {
        bg: 'bg-[#F3E3D8]',
        text: 'text-[#B4643C]',
        border: 'border-[#E4C5B3]'
      };
    case 'Low':
      return {
        bg: 'bg-[#E3EDEB]',
        text: 'text-[#1F4B4A]',
        border: 'border-[#C4DAD7]'
      };
  }
}

export function downloadMarkdownFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
