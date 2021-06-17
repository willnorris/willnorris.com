import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import filter from 'lodash/fp/filter.js'
import get from 'lodash/fp/get.js'
import forEach from 'lodash/fp/forEach.js'
import mkdirp from 'mkdirp'
import dotenv from 'dotenv'

dotenv.config()


const domain = 'https://willnorris.com'
const targetFolder = path.join(process.cwd(), 'data', 'mentions')
const apiEndpoint = 'https://webmention.io/api/mentions.jf2'
const apiOptions = [
  `token=${process.env.WEBMENTION_IO_TOKEN}`,
  'per-page=10000'
]

fetch(`${apiEndpoint}?${apiOptions.join('&')}`)
  .then(convertResponseToJson)
  .then(checkDataValidity)
  .then(get('children'))
  .then(m => m.map(rewriteHTTPS))
  .then(filter(targetIsNotHomepage))
  .then(forEach(writeMentionToFile))

function convertResponseToJson(response) {
  return response.json()
}

function checkDataValidity(data) {
  if ("children" in data) return data

  throw new Error("Invalid webmention.io response.")
}

function rewriteHTTPS(mention) {
  mention['wm-target'] = mention['wm-target'].replace('http://', 'https://')
  return mention
}

function targetIsNotHomepage(mention) {
  const targetUri = mention['wm-target'].replace(domain, '')
  return targetUri !== '/' && targetUri !== ''
}

function writeMentionToFile(mention) {
  const id = mention['wm-id']
  const target = mention['wm-target'].replace(domain, '').replace(/(^\/|\/$)/g, '').replace(/\//g, ':')
  const outputFolder = path.join(targetFolder, target)

  mkdirp.sync(outputFolder)

  fs.writeFileSync(
    path.join(outputFolder, `${id}.json`),
    JSON.stringify(mention, null, 2),
    { encoding: 'utf-8' }
  )
}
