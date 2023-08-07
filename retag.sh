# Expects one argument: the tag to retag
# Example: ./retag.sh ch12
# It removes the tag from the origin, replaces it with the current HEAD, and pushes it back to origin

# Check that the tag exists
git rev-parse $1 >/dev/null 2>&1 || { echo "Tag '$1 does not exist" >&2; exit 1; }

# Remove the tag from origin
git push --delete origin $1

# Add the current HEAD as the tag
git tag -fa $1

# Push the tag to origin
git push origin main --tags