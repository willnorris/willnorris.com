---
title: "Tweet Archive"
# Tweet data is pulled from data/tweets.json.
# This file is generated from my personal Twitter archive by running:
#
#   cat twitter-archive/data/tweets.js | sed -E "s/^window.YTD.tweets.part0 = //" | \
#     jq '.[] | .tweet | {id, created_at, full_text, in_reply_to_status_id}' | jq -s '.' > data/tweets.json
#
# If and when I make use of more fields, the above query will need to be re-run.
---
