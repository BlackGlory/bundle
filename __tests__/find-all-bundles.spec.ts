import * as path from 'path'
import { findAllBundles } from '@src/find-all-bundles'
import { toArrayAsync } from 'iterable-operator'
import '@blackglory/jest-matchers'
import 'jest-extended'

test('findAllBundles(path: string): AsyncIterable<IBundle>', async () => {
  const result = findAllBundles(getFixturesPath('.'))
  const arrResult = await toArrayAsync(result)

  expect(result).toBeAsyncIterable()
  expect(arrResult).toIncludeSameMembers([
    {
      root: getFixturesPath('bundle/no-assets')
    , index: 'index.md'
    , meta: 'meta.json'
    , assets: []
    }
  , {
      root: getFixturesPath('bundle/with-assets')
    , index: 'index.md'
    , meta: 'meta.json'
    , assets: [
        'assets/images/image.png'
      ]
    }
  ])
})

function getFixturesPath(relativePath: string): string {
  return path.join(__dirname, './fixtures', relativePath)
}
