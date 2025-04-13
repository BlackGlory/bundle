import { toArrayAsync, map, filter, uniq, toArray } from 'iterable-operator'
import * as path from 'path'
import { IBundle, IBundleVariant } from '@src/types.js'
import { findAllFilenames, isDirectory, pathExists } from 'extra-filesystem'
import { CustomError } from '@blackglory/errors'
import * as fs from 'fs/promises'
import { isntUndefined, last, pipe, fromEntries, pipeAsync } from 'extra-utils'
import { all, map as mapPromises } from 'extra-promise'
import { go } from '@blackglory/prelude'

export class NotDirectoryError extends CustomError {}
export class NoMetaFileError extends CustomError {}
export class NoTextFileError extends CustomError {}
export class TooManyMetaFilesError extends CustomError {}
export class TooManyTextFilesError extends CustomError {}

/**
 * @throws {NotDirectoryError}
 * @throws {NoMetaFileError}
 * @throws {NoTextFileError}
 * @throws {TooManyMetaFilesError}
 * @throws {TooManyTextFilesError}
 */
export async function buildBundle(pathname: string): Promise<IBundle> {
  if (!await isDirectory(pathname)) throw new NotDirectoryError()

  const { metaFilename, textFilename, assetFilenames, variantNames } = await all({
    metaFilename: findMetaFilename(pathname)
  , textFilename: findTextFilename(pathname)
  , assetFilenames: findAssetFilenames(pathname)
  , variantNames: findVariantNames(pathname)
  })

  const variants: Record<string, IBundleVariant> = await pipeAsync(
    variantNames
  , variantNames => mapPromises(
      variantNames
    , async (variantName): Promise<[string, IBundleVariant]> => {
        return [
          variantName
        , {
            meta: await go(async () => {
              try {
                return await findMetaFilename(pathname, variantName)
              } catch (e) {
                if (e instanceof NoMetaFileError) return
                if (e instanceof TooManyMetaFilesError) return
                throw e
              }
            })
          , text: await go(async () => {
              try {
                return await findTextFilename(pathname, variantName)
              } catch (e) {
                if (e instanceof NoTextFileError) return
                if (e instanceof TooManyTextFilesError) return
                throw e
              }
            })
          }
        ]
      }
    )
  , nameVariantPairs => filter(
      nameVariantPairs
    , ([_, variant]) => variant.meta || variant.text
    )
  , fromEntries
  )

  return {
    root: pathname
  , meta: metaFilename
  , text: textFilename
  , assets: assetFilenames
  , variants
  }
}

/**
 * @throws {NoMetaFileError}
 * @throws {TooManyMetaFilesError}
 */
async function findMetaFilename(rootPath: string, variantName?: string): Promise<string> {
  const filenames = await fs.readdir(rootPath)
  const metaFiles = filenames
    .map(filename => parseFilename(filename))
    .filter(file => {
      return file.variantName === variantName
          && file.basename === 'meta'
    })

  if (metaFiles.length === 1) return metaFiles[0].filename
  if (metaFiles.length > 1) throw new TooManyMetaFilesError()
  throw new NoMetaFileError()
}

/**
 * @throws {NoTextFileError}
 * @throws {TooManyTextFilesError}
 */
async function findTextFilename(rootPath: string, variantName?: string): Promise<string> {
  const filenames = await fs.readdir(rootPath)
  const textFiles = filenames
    .map(filename => parseFilename(filename))
    .filter(file => {
      return file.variantName === variantName
          && file.basename === 'text'
    })

  if (textFiles.length === 1) return textFiles[0].filename
  if (textFiles.length > 1) throw new TooManyTextFilesError()
  throw new NoTextFileError()
}

async function findVariantNames(rootPath: string): Promise<string[]> {
  const filenames = await fs.readdir(rootPath)

  return pipe(
    filenames
  , filenames => map(filenames, filename => parseFilename(filename))
  , files => filter(files, file => {
      return file.basename === 'text'
          || file.basename === 'meta'
    })
  , files => map(files, file => file.variantName)
  , variantNames => filter<string | undefined, string>(variantNames, isntUndefined)
  , uniq
  , toArray
  )
}

async function findAssetFilenames(rootPath: string): Promise<string[]> {
  const assetDirname = path.join(rootPath, 'assets')
  if (!await pathExists(assetDirname)) return []
  if (!await isDirectory(assetDirname)) return []

  const assetFilenames = await toArrayAsync(findAllFilenames(assetDirname))
  return assetFilenames.map(assetFilename => path.relative(rootPath, assetFilename))
}

function getBasename(filename: string): string {
  return path.basename(filename, path.extname(filename))
}

function parseFilename(filename: string): {
  filename: string
  basename: string
  variantName?: string
} {
  const basename = getBasename(filename)

  const basenameParts = basename.split('.')

  if (basenameParts.length > 1) {
    const variantName = last(basenameParts)
    const basename = basenameParts
      .slice(0, -1)
      .join('.')

    return {
      filename
    , basename
    , variantName
    }
  } else {
    return {
      filename
    , basename
    , variantName: undefined
    }
  }
}
