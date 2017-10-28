#!/usr/local/bin sh

while true; do
  echo "working"

  curl -n -X DELETE https://api.heroku.com/apps/trellogram-skyboys/dynos/web \
    -H "Accept: application/vnd.heroku+json; version=3" \
    -H "Authorization: Bearer fdcf7439-3281-4c98-a17c-01d1cd946605"

  sleep 10000
done
