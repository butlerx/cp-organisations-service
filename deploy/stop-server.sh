#!/bin/bash
isExistApp=`pgrep cp-organisations-service`
if [[ -n $isExistApp ]]; then
  service cp-organisations-service stop
fi
