export const categoryLabels = {
  apartments: 'Квартиры',
  houses: 'Дома',
  commercial: 'Коммерческие',
  other: 'Другие'
} as const;

export type Category = keyof typeof categoryLabels;

export function filterProjects<T extends { category?: Category }>(projects: readonly T[], category: Category | 'all') {
  return category === 'all' ? projects : projects.filter((project) => (project.category ?? 'other') === category);
}

export function wrapIndex(index: number, length: number) {
  return length ? ((index % length) + length) % length : 0;
}
