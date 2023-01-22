import { isBundle } from '@src/is-bundle.js'
import { getFixturesPath } from '@test/utils.js'

describe('isBundle(path: string): Promise<boolean>', () => {
  describe('is bundle', () => {
    it('return Promise<true>', async () => {
      const path = getFixturesPath('bundle/no-assets')

      const result = await isBundle(path)

      expect(result).toBe(true)
    })
  })

  describe('is not bundle', () => {
    describe('just not a bundle', () => {
      it('return Promise<false>', async () => {
        const path = getFixturesPath('not-bundle')

        const result = await isBundle(path)

        expect(result).toBe(false)
      })
    })

    describe('not directory', () => {
      it('return Promise<false>', async () => {
        const path = getFixturesPath('not-bundle/not-directory')

        const result = await isBundle(path)

        expect(result).toBe(false)
      })
    })

    describe('only text', () => {
      it('return Promise<false>', async () => {
        const path = getFixturesPath('not-bundle/only-text')

        const result = await isBundle(path)

        expect(result).toBe(false)
      })
    })

    describe('only meta', () => {
      it('return Promise<false>', async () => {
        const path = getFixturesPath('not-bundle/only-meta')

        const result = await isBundle(path)

        expect(result).toBe(false)
      })
    })

    describe('multiple text', () => {
      it('return Promise<false>', async () => {
        const path = getFixturesPath('not-bundle/multiple-text')

        const result = await isBundle(path)

        expect(result).toBe(false)
      })
    })

    describe('multiple meta', () => {
      it('return Promise<false>', async () => {
        const path = getFixturesPath('not-bundle/multiple-meta')

        const result = await isBundle(path)

        expect(result).toBe(false)
      })
    })
  })
})
