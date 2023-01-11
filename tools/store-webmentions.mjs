// adapted from https://github.com/petergoes/petergoes.nl/blob/main/_automations/store-webmentions.mjs
// Original Copyright (c) 2021 Peter Goes
// SPDX-License-Identifier: MIT

import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const baseurl = 'https://willnorris.com'
const targetFolder = path.join(process.cwd(), 'data', 'mentions')
const apiEndpoint = 'https://webmention.io/api/mentions.jf2'
const apiOptions = [
  `token=${process.env.WEBMENTION_IO_TOKEN}`,
  'per-page=10000'
]

// IDs of mentions to skip.
const skipMentionIDs = fs.readFileSync(path.join(process.cwd(), 'tools', 'skip-mentions.txt'), 'utf-8').split(/\r?\n/).filter(n => n).map(n => parseInt(n))

fetch(`${apiEndpoint}?${apiOptions.join('&')}`)
  .then(r => r.json())
  .then(checkDataValidity)
  .then(m => m.children)
  .then(m => m.filter(skipMentions))
  .then(m => m.map(rewriteHTTPS))
  .then(m => m.map(rewriteHostname))
  .then(m => m.filter(targetIsNotHomepage))
  .then(m => m.forEach(writeMentionToFile))

function checkDataValidity(data) {
  if ("children" in data) return data

  throw new Error("Invalid webmention.io response.")
}

// skip mentions that are in the skipMentionIDs list.
function skipMentions(mention) {
  return !skipMentionIDs.includes(mention['wm-id'])
}

// rewrite http URLs to https.
function rewriteHTTPS(mention) {
  mention['wm-target'] = mention['wm-target'].replace('http://', 'https://')
  return mention
}

// rewrite wjn.me and www.willnorris.com URLs to willnorris.com.
function rewriteHostname(mention) {
  mention['wm-target'] = mention['wm-target']
    .replace('wjn.me', 'willnorris.com')
    .replace('www.willnorris.com', 'willnorris.com')
  return mention
}

// filter out mentions that are for the homepage.
function targetIsNotHomepage(mention) {
  const targetUri = mention['wm-target'].replace(baseurl, '')
  return targetUri !== '/' && targetUri !== ''
}

function writeMentionToFile(mention) {
  const id = mention['wm-id']
  // save webmention with wm-target https://willnorris.com/2020/01/foo/ to "./data/mentions/2020:foo"
  //  - strip baseurl
  //  - strip leading and trailing slashes
  //  - convert slashes to colons
  //  - remove month component from URL if present (I changed my URL structure in 2023)
  const target = mention['wm-target'].replace(baseurl, '').replace(/(^\/|\/$)/g, '').replace(/\//g, ':').replace(/(\d{4}):(\d{2}):(.+)/, "$1:$3")
  const outputFolder = path.join(targetFolder, target)

  fs.mkdirSync(outputFolder, { recursive: true })

  fs.writeFileSync(
    path.join(outputFolder, `${id}.json`),
    JSON.stringify(mention, null, 2),
    { encoding: 'utf-8' }
  )
}
