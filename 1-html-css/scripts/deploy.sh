#!/bin/bash
# Deploy static app to Netfliy

# Build the site name based on the repository URL 
# Using `git config` as env variables are not supported in github classrooms autograding
GITHUB_REPOSITORY_URL=$(git config --get remote.origin.url)
SITE_NAME=$(echo $GITHUB_REPOSITORY_URL | sed 's|https:\/\/github.com\/\(.*\)|\1|' | sed 's|[\/.]|-|g')

echo "Github repository url: $GITHUB_REPOSITORY_URL"
echo "Site name: $SITE_NAME"

# Find site id by name
function get_site_id() {
  SITE_ID=$(netlify sites:list --json | jq -r --arg SITE_NAME "$SITE_NAME" '.[] | select(.name == $SITE_NAME) | .site_id')
}

get_site_id
if [ -z "$SITE_ID" ]
then
 echo "Site not found. Initializing a new project..."
 netlify sites:create --name $SITE_NAME --account-slug paulnta
 get_site_id
fi

echo "Deploying site $SITE_ID..."
netlify deploy --site $SITE_ID --prod --dir $1
