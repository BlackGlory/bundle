import { findAllBundles } from '@src/find-all-bundles'
import { toArrayAsync } from 'iterable-operator'
import { getFixturesPath } from '@test/utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

test('findAllBundles(path: string): AsyncIterable<IBundle>', async () => {
  const result = findAllBundles(getFixturesPath('.'))
  const arrResult = await toArrayAsync(result)

  expect(result).toBeAsyncIterable()
  expect(arrResult).toIncludeSameMembers([
    {
      root: getFixturesPath('bundle/no-assets')
    , text: 'text.md'
    , meta: 'meta.json'
    , assets: []
    }
  , {
      root: getFixturesPath('bundle/with-assets')
    , text: 'text.md'
    , meta: 'meta.json'
    , assets: [
        'assets/images/image.png'
      ]
    }
  ])
})
