import { test } from 'node:test';
import assert from 'node:assert/strict';
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
