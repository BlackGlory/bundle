import { test, expect } from 'vitest'
import { findAllBundles } from '@src/find-all-bundles.js'
import { toArrayAsync } from 'iterable-operator'
import { getFixturesPath } from '@test/utils.js'

test('findAllBundles', async () => {
  const iter = findAllBundles(getFixturesPath('.'))
  const result = await toArrayAsync(iter)

  expect(result).toStrictEqual([
    {
      root: getFixturesPath('bundle/no-assets')
    , text: 'text.md'
    , meta: 'meta.json'
    , assets: []
    , variants: {}
    }
  , {
      root: getFixturesPath('bundle/with-assets')
    , text: 'text.md'
    , meta: 'meta.json'
    , assets: [
        'assets/images/image.png'
      ]
    , variants: {}
    }
  , {
      root: getFixturesPath('bundle/with-variants')
    , text: 'text.md'
    , meta: 'meta.json'
    , assets: []
    , variants: {
        foo: {
          meta: 'meta.foo.json'
        , text: undefined
        }
      , bar: {
          meta: undefined
        , text: 'text.bar.md'
        }
      }
    }
  ])
})
