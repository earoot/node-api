#! /bin/bash
ls $CODEBUILD_SRC_DIR/
npm install -g serverless
serverless deploy --stage dev --package target/dev -v -r us-east-2
