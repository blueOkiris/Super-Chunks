#!/bin/bash

# Save all changes
git add *

# Get commit message and commit changes
echo "Enter commit message: "
read msg
git commit -m "$msg"

# Update github
git push -f origin master

