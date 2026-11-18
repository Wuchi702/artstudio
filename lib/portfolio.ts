export const categoryLabels = {
  apartments: 'Квартиры',
  houses: 'Частные дома',
  commercial: 'Коммерческие интерьеры',
  other: 'Другие'
} as const;

export type Category = keyof typeof categoryLabels;

export type ProjectFilter = Category | 'concept' | 'all';

export function filterProjects<T extends { category?: Category; status?: string }>(projects: readonly T[], category: ProjectFilter) {
  if (category === 'all') return projects;
  return projects.filter((project) => category === 'concept' ? project.status === 'concept' : (project.category ?? 'other') === category);
}

export function wrapIndex(index: number, length: number) {
  return length ? ((index % length) + length) % length : 0;
}
