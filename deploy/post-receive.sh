#!/bin/bash
TARGET="/root/flittermouse"
GIT_DIR="/root/project.git"
BRANCH="master"

while read oldrev newrev ref
do
        # only checking out the master (or whatever branch you would like to deploy)
        if [ "$ref" = "refs/heads/$BRANCH" ];
        then
                echo "Ref $ref received. Deploying ${BRANCH} branch to production..."
                git --work-tree=$TARGET --git-dir=$GIT_DIR checkout -f $BRANCH
                cd $TARGET
                PATH=$PATH:/snap/bin
                make prod
        else
                echo "Ref $ref received. Doing nothing: only the ${BRANCH} branch may be deployed on this server."
        fi
done