import { getErrorPromise } from 'return-style'
import * as path from 'path'
import { findBundle, NoIndexFileError, NoMetaFileError, NotDirectoryError, TooManyIndexFilesError, TooManyMetaFilesError } from '@src/find-bundle'
import '@blackglory/jest-matchers'

describe('findBundle(path: string): Promise<IBundle>', () => {
  describe('is bundle', () => {
    describe('with assets', () => {
      it('return Promise<IBundle>', async () => {
        const path = getFixturesPath('bundle/with-assets')

        const result = findBundle(path)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toStrictEqual({
          root: path
        , meta: 'meta.json'
        , index: 'index.md'
        , assets: [
            'assets/images/image.png'
          ]
        })
      })
    })

    describe('no assets', () => {
      it('return Promise<IBundle>', async () => {
        const path = getFixturesPath('bundle/no-assets')

        const result = findBundle(path)
        const proResult = await result

        expect(result).toBePromise()
        expect(proResult).toStrictEqual({
          root: path
        , meta: 'meta.json'
        , index: 'index.md'
        , assets: []
        })
      })
    })
  })

  describe('not bundle', () => {
    describe('not directory', () => {
      it('throw NoDirectoryError', async () => {
        const path = getFixturesPath('not-bundle/not-directory')

        const result = findBundle(path)
        const proResult = await getErrorPromise(result)

        expect(result).toBePromise()
        expect(proResult).toBeInstanceOf(NotDirectoryError)
      })
    })

    describe('only index', () => {
      it('throw NoMetaFileError', async () => {
        const path = getFixturesPath('not-bundle/only-index')

        const result = findBundle(path)
        const proResult = await getErrorPromise(result)

        expect(result).toBePromise()
        expect(proResult).toBeInstanceOf(NoMetaFileError)
      })
    })

    describe('only meta', () => {
      it('throw NoIndexFileError', async () => {
        const path = getFixturesPath('not-bundle/only-meta')

        const result = findBundle(path)
        const proResult = await getErrorPromise(result)

        expect(result).toBePromise()
        expect(proResult).toBeInstanceOf(NoIndexFileError)
      })
    })

    describe('multiple index', () => {
      it('throw TooManyIndexFilesError', async () => {
        const path = getFixturesPath('not-bundle/multiple-index')

        const result = findBundle(path)
        const proResult = await getErrorPromise(result)

        expect(result).toBePromise()
        expect(proResult).toBeInstanceOf(TooManyIndexFilesError)
      })
    })

    describe('multiple meta', () => {
      it('throw TooManyMetaFilesError', async () => {
        const path = getFixturesPath('not-bundle/multiple-meta')

        const result = findBundle(path)
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
