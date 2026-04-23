#!/bin/bash

# Set the SSH key for Git commands
export GIT_SSH_COMMAND="ssh -i /var/www/.ssh/id_rsa -o IdentitiesOnly=yes"

# Define the application directory and log file path
APP_DIR="/var/www/pmis-frontend"
LOG_FILE="$APP_DIR/deploy.log"

# Start deployment log
echo "Deployment started at $(date)" >> $LOG_FILE

# Change to the application directory
cd $APP_DIR
if [ $? -ne 0 ]; then
    echo "Error: Failed to change to directory $APP_DIR" >> $LOG_FILE
    exit 1
fi

# Pull the latest changes from the repository
OUTPUT=$(git pull 2>&1)
if [ $? -ne 0 ]; then
    echo "Error: git pull failed with the following output:" >> $LOG_FILE
    echo "$OUTPUT" >> $LOG_FILE
    exit 1
fi
echo "$OUTPUT" >> $LOG_FILE

# Check if there are new changes in the repository
if [[ "$OUTPUT" != *"Already up to date."* ]]; then
    echo "Changes detected. Starting build process..." >> $LOG_FILE



    npm run build:zain >> $LOG_FILE 2>&1
    if [ $? -ne 0 ]; then
        echo "Error: npm run build:zain failed" >> $LOG_FILE
        exit 1
    fi

    echo "Build process completed." >> $LOG_FILE
else
    echo "No changes detected. Skipping build process." >> $LOG_FILE
fi

# Finish deployment log
echo "Deployment finished at $(date)" >> $LOG_FILE
