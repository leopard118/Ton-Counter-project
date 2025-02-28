#!/bin/bash

# Define co-authors' names and emails
COAUTHOR_1_NAME="Morning-Star213"
COAUTHOR_1_EMAIL="artem.sokolovsky.888@gmail.com"

# COAUTHOR_2_NAME="techteam"
# COAUTHOR_2_EMAIL="khomiakovandrii98@gmail.com"
COAUTHOR_2_NAME="unitop010"
COAUTHOR_2_EMAIL="techhosting619@gmail.com"

COAUTHOR_3_NAME="Rabbit"
COAUTHOR_3_EMAIL="rabbit1026hg@gmail.com"

# Loop to create and merge pull requests 10 times
for i in {1..12}
do
    # Make a change in the dev branch
    echo "NEW_ENV_VARIABLE='value'" >> .envexample

    # Step 2: Add changes to git
    git add .envexample

    # Commit with multiple co-authors using a here document
    git commit -F - <<EOF
Update .envexample for change #$i.

Co-authored-by: $COAUTHOR_1_NAME <$COAUTHOR_1_EMAIL>
Co-authored-by: $COAUTHOR_2_NAME <$COAUTHOR_2_EMAIL>
Co-authored-by: $COAUTHOR_3_NAME <$COAUTHOR_3_EMAIL>
EOF

    # Push changes to the dev branch
    git push origin dev

    # Create a pull request from dev to main using GitHub CLI
    pr_number=$(gh pr create --base main --head dev --title "Merge dev to main for change #$i" --body "Merging changes from dev to main for change #$i.")

    echo "Created pull request #$pr_number"

    # Merge the pull request
    gh pr merge $pr_number --merge
    echo "Merged pull request #$pr_number"

    # Optional: Wait for a short period to ensure timing
    sleep_duration=$((RANDOM % 3 + 1))  # Random sleep between 1 and 3 seconds
    echo "Sleeping for $sleep_duration seconds..."
    sleep $sleep_duration  # Sleep for the random duration
done