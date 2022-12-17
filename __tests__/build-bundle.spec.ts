import { getErrorPromise } from 'return-style'
import {
  buildBundle
, NoTextFileError
, NoMetaFileError
, NotDirectoryError
, TooManyTextFilesError
, TooManyMetaFilesError
} from '@src/build-bundle'
import { getFixturesPath } from '@test/utils'

describe('buildBundle(path: string): Promise<IBundle>', () => {
  describe('is bundle', () => {
    describe('with assets', () => {
      it('return Promise<IBundle>', async () => {
        const path = getFixturesPath('bundle/with-assets')

        const result = await buildBundle(path)

        expect(result).toStrictEqual({
          root: path
        , meta: 'meta.json'
        , text: 'text.md'
        , assets: [
            'assets/images/image.png'
          ]
        })
      })
    })

    describe('no assets', () => {
      it('return Promise<IBundle>', async () => {
        const path = getFixturesPath('bundle/no-assets')

        const result = await buildBundle(path)

        expect(result).toStrictEqual({
          root: path
        , meta: 'meta.json'
        , text: 'text.md'
        , assets: []
        })
      })
    })
  })

  describe('not bundle', () => {
    describe('just not a bundle', () => {
      it('throw Error', async () => {
        const path = getFixturesPath('not-bundle')

        const result = await getErrorPromise(buildBundle(path))

        expect(result).toBeInstanceOf(Error)
      })
    })

    describe('not directory', () => {
      it('throw NoDirectoryError', async () => {
        const path = getFixturesPath('not-bundle/not-directory')

        const result = await getErrorPromise(buildBundle(path))

        expect(result).toBeInstanceOf(NotDirectoryError)
      })
    })

    describe('only text', () => {
      it('throw NoMetaFileError', async () => {
        const path = getFixturesPath('not-bundle/only-text')

        const result = await getErrorPromise(buildBundle(path))

        expect(result).toBeInstanceOf(NoMetaFileError)
      })
    })

    describe('only meta', () => {
      it('throw NoTextFileError', async () => {
        const path = getFixturesPath('not-bundle/only-meta')

        const result = await getErrorPromise(buildBundle(path))

        expect(result).toBeInstanceOf(NoTextFileError)
      })
    })

    describe('multiple text', () => {
      it('throw TooManyTextFilesError', async () => {
        const path = getFixturesPath('not-bundle/multiple-text')

        const result = await getErrorPromise(buildBundle(path))

        expect(result).toBeInstanceOf(TooManyTextFilesError)
      })
    })

    describe('multiple meta', () => {
      it('throw TooManyMetaFilesError', async () => {
        const path = getFixturesPath('not-bundle/multiple-meta')

        const result = await getErrorPromise(buildBundle(path))

        expect(result).toBeInstanceOf(TooManyMetaFilesError)
      })
    })
  })
})
