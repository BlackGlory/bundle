import { describe, test, expect } from 'vitest'
import { isBundle } from '@src/is-bundle.js'
import { getFixturesPath } from '@test/utils.js'

describe('isBundle', () => {
  describe('bundle', () => {
    test('no assets', async () => {
      const path = getFixturesPath('bundle/no-assets')

      const result = await isBundle(path)

      expect(result).toBe(true)
    })

    test('with assets', async () => {
      const path = getFixturesPath('bundle/with-assets')

      const result = await isBundle(path)

      expect(result).toBe(true)
    })

    test('with variants', async () => {
      const path = getFixturesPath('bundle/with-variants')

      const result = await isBundle(path)

      expect(result).toBe(true)
    })
  })

  describe('non-bundle', () => {
    test('just not a bundle', async () => {
      const path = getFixturesPath('non-bundle')

      const result = await isBundle(path)

      expect(result).toBe(false)
    })

    test('not directory', async () => {
      const path = getFixturesPath('non-bundle/not-directory')

      const result = await isBundle(path)

      expect(result).toBe(false)
    })

    test('only text', async () => {
      const path = getFixturesPath('non-bundle/only-text')

      const result = await isBundle(path)

      expect(result).toBe(false)
    })

    test('only meta', async () => {
      const path = getFixturesPath('non-bundle/only-meta')

      const result = await isBundle(path)

      expect(result).toBe(false)
    })

    test('only variants', async () => {
      const path = getFixturesPath('non-bundle/only-variants')

      const result = await isBundle(path)

      expect(result).toBe(false)
    })

    test('multiple text', async () => {
      const path = getFixturesPath('non-bundle/multiple-text')

      const result = await isBundle(path)

      expect(result).toBe(false)
    })

    test('multiple meta', async () => {
      const path = getFixturesPath('non-bundle/multiple-meta')

      const result = await isBundle(path)

      expect(result).toBe(false)
    })
  })
})
