#!/usr/bin/env sh
set -eu

PROFILE="${AWS_PROFILE:-blee}"
REGION="us-west-1"
APP_ID="d5dbgzk4ramsj"
API_URL="https://re-d82ff4b94ca14655a4b37fc6084604d2.ecs.us-west-1.on.aws/api"

aws amplify update-app \
  --app-id "$APP_ID" \
  --name restaurant-intelligence-web \
  --description "Restaurant intelligence Next.js SSR prototype" \
  --platform WEB_COMPUTE \
  --enable-branch-auto-build \
  --enable-branch-auto-deletion \
  --environment-variables \
    AMPLIFY_MONOREPO_APP_ROOT=apps/web,API_BASE_URL="$API_URL",NEXT_PUBLIC_API_BASE_URL="$API_URL" \
  --custom-rules '[]' \
  --profile "$PROFILE" \
  --region "$REGION"

aws amplify update-branch \
  --app-id "$APP_ID" \
  --branch-name main \
  --stage PRODUCTION \
  --framework "Next.js - SSR" \
  --enable-auto-build \
  --profile "$PROFILE" \
  --region "$REGION"
