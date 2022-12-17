import { findAllBundles } from '@src/find-all-bundles'
import { toArrayAsync } from 'iterable-operator'
import { getFixturesPath } from '@test/utils'

test('findAllBundles(path: string): AsyncIterable<IBundle>', async () => {
  const iter = findAllBundles(getFixturesPath('.'))
  const result = await toArrayAsync(iter)

  expect(result).toMatchObject([
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
