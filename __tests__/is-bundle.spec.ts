import { isBundle } from '@src/is-bundle'
import { getFixturesPath } from '@test/utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

describe('isBundle(path: string): Promise<boolean>', () => {
  describe('is bundle', () => {
    it('return Promise<true>', async () => {
      const path = getFixturesPath('bundle/no-assets')

      const result = isBundle(path)
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toBeTrue()
    })
  })

  describe('is not bundle', () => {
    describe('just not a bundle', () => {
      it('return Promise<false>', async () => {
        const path = getFixturesPath('not-bundle')

        const result = isBundle(path)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toBeFalse()
      })
    })

    describe('not directory', () => {
      it('return Promise<false>', async () => {
        const path = getFixturesPath('not-bundle/not-directory')

        const result = isBundle(path)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toBeFalse()
      })
    })

    describe('only text', () => {
      it('return Promise<false>', async () => {
        const path = getFixturesPath('not-bundle/only-text')

        const result = isBundle(path)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toBeFalse()
      })
    })

    describe('only meta', () => {
      it('return Promise<false>', async () => {
        const path = getFixturesPath('not-bundle/only-meta')

        const result = isBundle(path)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toBeFalse()
      })
    })

    describe('multiple text', () => {
      it('return Promise<false>', async () => {
        const path = getFixturesPath('not-bundle/multiple-text')

        const result = isBundle(path)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toBeFalse()
      })
    })

    describe('multiple meta', () => {
      it('return Promise<false>', async () => {
        const path = getFixturesPath('not-bundle/multiple-meta')

        const result = isBundle(path)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toBeFalse()
      })
    })
  })
})
