const dayjs = require('dayjs')
const fs = require('fs')
const md5 = require('md5')
const path = require('path')

const comments_file = "data/wordpress_comments.json"

try {
  var comments = JSON.parse(fs.readFileSync(comments_file, 'utf8'))
} catch (err) {
  console.error(err)
  process.exit(1);
}

comments.forEach(comment => {
  let d = dayjs(comment.post_date_gmt)
  const year = d.year().toString().padStart(4, '0')
  const month = (d.month()+1).toString().padStart(2, '0')
  const slug = comment.post_name
  const base = path.join(__dirname, `../content/posts/${year}/${slug}`)
  const permalink = `https://willnorris.com/${year}/${month}/${slug}/`

  const mention = {
    type: "entry",
    author: {
      type: "card",
      name: comment.comment_author,
      url: comment.comment_author_url,
    },
    url: comment.comment_author_url,
    published: dayjs(comment.comment_date_gmt).format("YYYY-MM-DDTHH:mm:ssZ"),
    content: {
      html: comment.comment_content,
      text: "",
    },
    "wm-id": comment.comment_ID,
    "wm-property": comment.comment_type == "pingback" ? "mention-of" : "in-reply-to",
  }
  mention[mention["wm-property"]] = permalink
  if (comment.comment_author_email) {
    mention.author.photo = `https://www.gravatar.com/avatar/${md5(comment.comment_author_email)}?s=256&d=404`
  }

  const mentionsDir = path.join(__dirname, `../data/mentions/${year}:${month}:${slug}`)
  fs.mkdirSync(mentionsDir, {recursive:true})
  const mentionFile = `${mentionsDir}/wp${comment.comment_ID}.json`
  fs.writeFileSync(mentionFile, JSON.stringify(mention, false, "  "))
})
