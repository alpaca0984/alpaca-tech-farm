---
title: Put CloudWatch alarm from cli
date: 2017-09-22 17:44:10
tags:
  - AWS
---

I'm using AWS and managing some EC2 instances.
When some of them have got wrong and status check failed, I used to reboot them by myself.

I wanted my instances to be rebooted automatically when it happens, so I put reboot action to CloudWatch alarm.

First, described my StatusCheckFailed-alarm-settings for checking current configuration.
```console
$ aws --profile <my-profile> --region <my-region> cloudwatch describe-alarms \
    | jq -C '.MetricAlarms | map(select(.MetricName == "StatusCheckFailed"))' \
    | less -R
```

Then, I listed EC2 instances with their instance-id and hostname.
I registered a tag to instance that's key is "Name" and value is instance's hostname.
```console
$ aws --profile <my-profile> --region <my-region> ec2 describe-instances \
  | jq '.Reservations[].Instances | map(.InstanceId, [.Tags[] | select(.Key == "Name") | .Value])'
```
I wanted to make a list of under format but I'm not familiar with `jq` command, so I had to process after it.
```
  "<instance-id-a> <hostname-a>"
  "<instance-id-b> <hostname-b>"
  "<instance-id-c> <hostname-c>"
```
If you're good at `jq`, please tell me your practice;)

I got a mappings of instance-id and hostname.
Then, I wrote a shell script to register CloudWatch alarms.
I set action of the alarm not only rebooting the instance but also notifying with email.
```sh
#!/bin/bash -ex
INSTANCES=(
  "<instance-id-a> <hostname-a>"
  "<instance-id-b> <hostname-b>"
  "<instance-id-c> <hostname-c>"
)

for i in "${INSTANCES[@]}"; do
  INSTANCE_ID=$(echo $i | cut -d " " -f 1)
  EC2_HOSTNAME=$(echo $i | cut -d " " -f 2)

  aws --profile <my-profile> --region <my-region> cloudwatch put-metric-alarm \
    --alarm-name "[${EC2_HOSTNAME}] Instance is down." \
    --actions-enabled \
    --alarm-actions arn:aws:swf:<my-region>:<my-customer-id>:action/actions/AWS_EC2.InstanceId.Reboot/1.0 \
        <my-sns-topic-arn> \
    --metric-name StatusCheckFailed \
    --namespace AWS/EC2 \
    --statistic Maximum \
    --dimensions Name=InstanceId,Value=${INSTANCE_ID} \
    --period 60 \
    --evaluation-periods 2 \
    --threshold 1 \
    --comparison-operator GreaterThanOrEqualToThreshold
done
```

Finally, I fired it and all alarms are registered successfully;)