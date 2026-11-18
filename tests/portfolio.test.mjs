import { test } from 'node:test';
import assert from 'node:assert/strict';
import { projects } from '../data/projects.ts';
import { filterProjects, wrapIndex } from '../lib/portfolio.ts';

test('empty categories return no projects and all preserves ordering', () => {
  const projects = [{ id: 'a', category: 'houses' }, { id: 'b' }, { id: 'c', category: 'houses' }];
  assert.deepEqual(filterProjects(projects, 'all'), projects);
  assert.deepEqual(filterProjects(projects, 'other'), [projects[1]]);
  assert.deepEqual(filterProjects(projects, 'houses'), [projects[0], projects[2]]);
  assert.deepEqual(filterProjects(projects, 'apartments'), []);
});

test('gallery navigation wraps in both directions', () => {
  assert.equal(wrapIndex(-1, 3), 2);
  assert.equal(wrapIndex(3, 3), 0);
  assert.equal(wrapIndex(1, 0), 0);
});

test('concept is independent of property category', () => {
  const items = [{ category: 'houses', status: 'concept' }, { category: 'houses', status: 'realized' }];
  assert.deepEqual(filterProjects(items, 'concept'), [items[0]]);
  assert.deepEqual(filterProjects(items, 'houses'), items);
});

test('portfolio publishes the complete Drive gallery set and puts the selected covers first and last', () => {
  assert.deepEqual(projects.map(({ gallery }) => gallery?.length), [9, 36, 7, 33, 11, 31, 17]);
  const featured = projects.filter((project) => project.featured);
  assert.equal(featured.length, 5);
  for (const sequence of [projects, featured]) {
    assert.equal(sequence[0].slug, 'interyer-s-bordovym-akcentom');
    assert.equal(sequence.at(-1).slug, 'kuhnya-gostinaya-i-spalnya');
  }
  for (const { cover, gallery } of projects) {
    assert.equal(gallery[0].src, cover.src);
    assert.equal(new Set(gallery.map(({ src }) => src)).size, gallery.length);
  }
});
