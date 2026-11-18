import type { Category } from '@/lib/portfolio';
import { portfolioProjects } from './portfolio-projects';

export type Photo = {
  src: string;
  alt: string;
  position?: string;
  caption?: string;
  group?: string;
  widths?: readonly number[];
};

export type Project = {
  id: string;
  slug: string;
  title?: string;
  category?: Category;
  cover?: Photo;
  gallery?: Photo[];
  description?: string;
  concept?: string;
  challenge?: string;
  solution?: string;
  year?: number;
  location?: string;
  area?: number;
  status?: 'realized' | 'concept' | 'visualization';
  materials?: string[];
  palette?: string[];
  floorplan?: Photo;
  tags?: string[];
  featured?: boolean;
  layout?: 'wide' | 'portrait' | 'landscape';
  sections?: ('challenge' | 'concept' | 'solution' | 'gallery' | 'materials' | 'floorplan')[];
};

export const imagery = {
  hero: { src: '/images/hero.webp', alt: 'Льняной диван у широкого окна, на полу полосы вечернего света', position: '66% center' },
  light: { src: '/images/light.webp', alt: 'Светлая гостиная с низким ореховым столом и окном в сад', widths: [480, 800, 1120, 1536], caption: 'Гостиная и вечерний свет' },
  oak: { src: '/images/oak.webp', alt: 'Круглый дубовый стол и плетёные стулья у окна', caption: 'Дубовая столовая' },
  garden: { src: '/images/garden.webp', alt: 'Гостиная с открытым остеклением и выходом в сад', caption: 'Гостиная, открытая саду' },
  detail: { src: '/images/detail.webp', alt: 'Тёмная керамика и ветка на плите травертина', caption: 'Керамика, травертин и известковая штукатурка' },
  atelier: { src: '/images/atelier.webp', alt: 'Рабочий стол с образцами дерева, камня и ткани у окна', caption: 'Рабочее пространство · визуализация' },
  threshold: { src: '/images/threshold.webp', alt: 'Каменная скамья и сад за широким проёмом', caption: 'Свет на границе дома и сада' },
  oakDetail: { src: '/images/oak-detail.webp', alt: 'Поверхность дубового стола, плетение стула и рукотворная керамика', caption: 'Фактура дерева и керамика' }
} satisfies Record<string, Photo>;

const conceptProjects: Project[] = [
  {
    id: 'light', slug: 'dom-tihogo-sveta', title: 'Дом тихого света',
    category: 'houses', status: 'concept', featured: true, layout: 'wide',
    cover: imagery.light, gallery: [imagery.light, imagery.hero, imagery.detail],
    description: 'Гостиная, в которой вечерний свет становится частью архитектуры.',
    challenge: 'Вытянутую комнату с окном в сад хочется сохранить цельной, даже если в ней одновременно читают, разговаривают и отдыхают.',
    concept: 'Низкая мебель оставляет открытым вид в сад. Свет последовательно касается каменного пола, льняной обивки и тёмного дерева, меняя характер комнаты к вечеру.',
    materials: ['Орех', 'Известковая штукатурка', 'Лён', 'Травертин'],
    palette: ['#a28b70', '#d5c4a8', '#554535', '#302c26'],
    sections: ['concept', 'gallery', 'challenge', 'materials']
  },
  {
    id: 'oak', slug: 'ton-duba', title: 'Тон дуба',
    category: 'apartments', status: 'concept', featured: true, layout: 'portrait',
    cover: imagery.oak, gallery: [imagery.oak, imagery.oakDetail],
    description: 'Городская квартира, собранная вокруг обеденного стола.',
    concept: 'Один оттенок дуба связывает мебель и столярные детали. Матовая керамика и плетение подчёркивают рисунок древесины.',
    solution: 'Круглый стол освобождает проходы. Мягкий боковой свет раскрывает текстуры, а высокий проём удерживает связь с соседней комнатой.',
    materials: ['Морёный дуб', 'Керамика', 'Плетёное волокно'],
    sections: ['gallery', 'solution', 'concept', 'materials']
  },
  {
    id: 'garden', slug: 'v-storonu-sada', title: 'В сторону сада',
    category: 'houses', status: 'concept', featured: true, layout: 'landscape',
    cover: imagery.garden, gallery: [imagery.garden, imagery.threshold],
    description: 'Одноэтажный дом, где сад продолжает жилое пространство.',
    challenge: 'Найти баланс между открытым видом и ощущением защищённости внутри дома.',
    concept: 'Ровный каменный настил тянется к саду. Бронзовое остекление и тёмный дуб собирают вид в спокойную архитектурную раму.',
    materials: ['Травертин', 'Дуб', 'Патинированная бронза', 'Кожа'],
    sections: ['challenge', 'concept', 'materials', 'gallery']
  }
];

export const projects: Project[] = portfolioProjects;
export const allProjects: Project[] = [...projects, ...conceptProjects];

export const projectTitle = (project: Project) => project.title ?? project.slug;
export const projectPath = (project: Project) => `/projects/${project.slug}`;
export const projectStatus = (project: Project) =>
  project.status === 'realized' ? 'Реализованный объект' : project.status === 'concept' ? 'Концепция' : project.status === 'visualization' ? 'Визуализация' : undefined;
