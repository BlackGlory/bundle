import { getErrorPromise } from 'return-style'
import * as path from 'path'
import { buildBundle, NoTextFileError, NoMetaFileError, NotDirectoryError, TooManyTextFilesError, TooManyMetaFilesError } from '@src/build-bundle'
import '@blackglory/jest-matchers'

describe('buildBundle(path: string): Promise<IBundle>', () => {
  describe('is bundle', () => {
    describe('with assets', () => {
      it('return Promise<IBundle>', async () => {
        const path = getFixturesPath('bundle/with-assets')

        const result = buildBundle(path)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toStrictEqual({
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

        const result = buildBundle(path)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toStrictEqual({
          root: path
        , meta: 'meta.json'
        , text: 'text.md'
        , assets: []
        })
      })
    })
  })

  describe('not bundle', () => {
    describe('not directory', () => {
      it('throw NoDirectoryError', async () => {
        const path = getFixturesPath('not-bundle/not-directory')

        const result = buildBundle(path)
        const proResult = await getErrorPromise(result)

        expect(result).toBePromise()
        expect(proResult).toBeInstanceOf(NotDirectoryError)
      })
    })

    describe('only text', () => {
      it('throw NoMetaFileError', async () => {
        const path = getFixturesPath('not-bundle/only-text')

        const result = buildBundle(path)
        const proResult = await getErrorPromise(result)

        expect(result).toBePromise()
        expect(proResult).toBeInstanceOf(NoMetaFileError)
      })
    })

    describe('only meta', () => {
      it('throw NoTextFileError', async () => {
        const path = getFixturesPath('not-bundle/only-meta')

        const result = buildBundle(path)
        const proResult = await getErrorPromise(result)

        expect(result).toBePromise()
        expect(proResult).toBeInstanceOf(NoTextFileError)
      })
    })

    describe('multiple text', () => {
      it('throw TooManyTextFilesError', async () => {
        const path = getFixturesPath('not-bundle/multiple-text')

        const result = buildBundle(path)
        const proResult = await getErrorPromise(result)

        expect(result).toBePromise()
        expect(proResult).toBeInstanceOf(TooManyTextFilesError)
      })
    })

    describe('multiple meta', () => {
      it('throw TooManyMetaFilesError', async () => {
        const path = getFixturesPath('not-bundle/multiple-meta')

        const result = buildBundle(path)
        const proResult = await getErrorPromise(result)

        expect(result).toBePromise()
        expect(proResult).toBeInstanceOf(TooManyMetaFilesError)
      })
    })
  })
})

function getFixturesPath(relativePath: string): string {
  return path.join(__dirname, './fixtures', relativePath)
}
