import {
  buildBundle
, NotDirectoryError
, NoMetaFileError
, NoTextFileError
, TooManyMetaFilesError
, TooManyTextFilesError
} from './build-bundle.js'

export async function isBundle(path: string): Promise<boolean> {
  try {
    await buildBundle(path)
    return true
  } catch (e) {
    if (e instanceof NotDirectoryError) return false
    if (e instanceof NoMetaFileError) return false
    if (e instanceof NoTextFileError) return false
    if (e instanceof TooManyMetaFilesError) return false
    if (e instanceof TooManyTextFilesError) return false
    throw e
  }
}
