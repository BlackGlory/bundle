import { describe, test, expect } from 'vitest'
import { getErrorPromise } from 'return-style'
import {
  buildBundle
, NoTextFileError
, NoMetaFileError
, NotDirectoryError
, TooManyTextFilesError
, TooManyMetaFilesError
} from '@src/build-bundle.js'
import { getFixturesPath } from '@test/utils.js'
import { assert } from '@blackglory/errors'

describe('buildBundle', () => {
  describe('is bundle', () => {
    test('no assets', async () => {
      const path = getFixturesPath('bundle/no-assets')

      const result = await buildBundle(path)

      expect(result).toStrictEqual({
        root: path
      , meta: 'meta.json'
      , text: 'text.md'
      , assets: []
      , variants: {}
      })
    })

    test('with assets', async () => {
      const path = getFixturesPath('bundle/with-assets')

      const result = await buildBundle(path)

      expect(result).toStrictEqual({
        root: path
      , meta: 'meta.json'
      , text: 'text.md'
      , assets: [
          'assets/images/image.png'
        ]
      , variants: {}
      })
    })

    test('with variants', async () => {
      const path = getFixturesPath('bundle/with-variants')

      const result = await buildBundle(path)

      expect(result).toStrictEqual({
        root: path
      , meta: 'meta.json'
      , text: 'text.md'
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
      })
    })
  })

  describe('non-bundle', () => {
    test('just not a bundle', async () => {
      const path = getFixturesPath('non-bundle')

      const result = await getErrorPromise(buildBundle(path))

      expect(result).toBeInstanceOf(Error)
    })

    test('not directory', async () => {
      const path = getFixturesPath('non-bundle/not-directory')

      const result = await getErrorPromise(buildBundle(path))

      expect(result).toBeInstanceOf(NotDirectoryError)
    })

    test('only text', async () => {
      const path = getFixturesPath('non-bundle/only-text')

      const result = await getErrorPromise(buildBundle(path))

      expect(result).toBeInstanceOf(NoMetaFileError)
    })

    test('only meta', async () => {
      const path = getFixturesPath('non-bundle/only-meta')

      const result = await getErrorPromise(buildBundle(path))

      expect(result).toBeInstanceOf(NoTextFileError)
    })

    test('only variants', async () => {
      const path = getFixturesPath('non-bundle/only-variants')

      const result = await getErrorPromise(buildBundle(path))

      assert(
        result instanceof NoMetaFileError ||
        result instanceof NoTextFileError
      )
    })

    test('multiple text', async () => {
      const path = getFixturesPath('non-bundle/multiple-text')

      const result = await getErrorPromise(buildBundle(path))

      expect(result).toBeInstanceOf(TooManyTextFilesError)
    })

    test('multiple meta', async () => {
      const path = getFixturesPath('non-bundle/multiple-meta')

      const result = await getErrorPromise(buildBundle(path))

      expect(result).toBeInstanceOf(TooManyMetaFilesError)
    })
  })
})
