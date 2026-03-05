import fs from 'fs-extra'
import { getManifest } from '../src/manifest'
import { r, log } from './utils'

export async function writeManifest() {
  let time = new Date()

  const manifest = await getManifest()
  await fs.writeJSON(r('extension/manifest.json'), manifest, {
    spaces: 2
  })
  log(
    'PRE',
    'write manifest.json ' +
      time.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
  )
  log('DATA', manifest)
}

writeManifest()
