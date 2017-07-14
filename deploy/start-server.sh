#!/bin/bash
isExistApp=`ps -eaf |grep cp-organisations-service |grep -v grep| awk '{ print $2; }'`
if [[ -n $isExistApp ]]; then
    service cp-organisations-service stop
fi

service cp-organisations-service start
