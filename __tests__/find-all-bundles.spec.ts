import * as path from 'path'
import { findAllBundles } from '@src/find-all-bundles'
import { toArrayAsync } from 'iterable-operator'
import '@test/matchers'
import 'jest-extended'

describe('findAllBundles(path: string): AsyncIterable<Bundle>', () => {
  it('return AsyncIterable<Bundle>', async () => {
    const result = findAllBundles(getFixturesPath('.'))
    const arrResult = await toArrayAsync(result)

    expect(result).toBeAsyncIterable()
    expect(arrResult).toIncludeSameMembers([
      {
        root: getFixturesPath('bundle/no-assets')
      , text: 'index.md'
      , meta: 'meta.json'
      , assets: []
      }
    , {
        root: getFixturesPath('bundle/with-assets')
      , text: 'index.md'
      , meta: 'meta.json'
      , assets: [
          'assets/images/image.png'
        ]
      }
    ])
  })
})

function getFixturesPath(relativePath: string): string {
  return path.join(__dirname, './fixtures', relativePath)
}
