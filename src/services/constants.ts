import { AIModel, TTSModel, Project } from '../types';

// Primary & Secondary OpenRouter API keys read dynamically from .env or fallback
export const OPENROUTER_API_KEYS = [
  import.meta.env.VITE_OPENROUTER_API_KEY_1 || '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',
  import.meta.env.VITE_OPENROUTER_API_KEY_2 || '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'
];

export const AI_MODELS: AIModel[] = [
  {
    id: 'google/gemma-4-31b-it:free',
    displayName: 'Gemma',
    description: 'Multimodal Vizuallik & Tezgakor O\'zbekcha Tahlil (Boshlang\'ich)',
    supportsVision: true,
    tag: 'Vision & Chat'
  },
  {
    id: 'cohere/north-mini-code:free',
    displayName: 'Mini Coder',
    description: 'Dasturlash va mantiqiy algoritmlarni shakllantirish',
    supportsVision: false,
    tag: 'Coding'
  },
  {
    id: 'openai/gpt-oss-20b:free',
    displayName: 'GPT OSS',
    description: 'Keng qamrovli umumiy intellekt modeli',
    supportsVision: false,
    tag: 'General AI'
  },
  {
    id: 'liquid/lfm-2.5-2.6b:free',
    displayName: 'Liquid AI',
    description: 'Judam ham tezkor javob qaytaruvchi neyron tarmoq',
    supportsVision: false,
    tag: 'Fast Inference'
  },
  {
    id: 'nvidia/nemotron-3-super-120b-a12b:free',
    displayName: 'Neon 3',
    description: 'Murojaatlarni chuqur va mukammal tahlil qiluvchi neyron model',
    supportsVision: false,
    tag: 'Heavyweight'
  }
];

export const DEFAULT_AI_MODEL = AI_MODELS[0];

export const TTS_MODELS: TTSModel[] = [
  {
    id: 'fish-audio/s2.1-pro-free:free',
    displayName: 'Fish Audio S2.1 Pro',
    provider: 'Fish Audio Neural Studio',
    sampleRate: '48kHz'
  },
  {
    id: 'deepgram/flux-tts:free',
    displayName: 'Deepgram Flux TTS',
    provider: 'Deepgram Ultra-Low Latency Engine',
    sampleRate: '44.1kHz'
  }
];

export const DEFAULT_TTS_MODEL = TTS_MODELS[0];

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Aura Spatial OS',
    category: 'Spatial UI & 3D Web',
    year: '2026',
    description: 'Immersive human-computer interface exploring multi-layered glass physics and spatial auditory cues.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    tags: ['WebGL', 'Spatial UI', 'Three.js', 'Design System']
  },
  {
    id: 'proj-2',
    title: 'Kinesis Kinetic Typography',
    category: 'Generative Motion',
    year: '2026',
    description: 'Real-time procedural variable font rendering driven by sound frequencies and user interaction vectors.',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop',
    tags: ['Kinetic Art', 'Typography', 'Audio Reactive', 'GLSL']
  },
  {
    id: 'proj-3',
    title: 'Neural Synthetics',
    category: 'AI Brand Identity',
    year: '2025',
    description: 'Autonomous multi-modal brand architecture generating adaptive visual guidelines for quantum computing.',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1200&auto=format&fit=crop',
    tags: ['Generative AI', 'Brand Design', 'Creative Direction']
  },
  {
    id: 'proj-4',
    title: 'Voxel Flow Pavilion',
    category: 'Architectural Speculation',
    year: '2025',
    description: 'Parametric virtual architecture pavilion created for international digital design triennale.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    tags: ['3D Motion', 'Virtual Space', 'Architectural']
  }
];
