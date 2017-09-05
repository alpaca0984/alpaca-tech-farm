---
title: Remove old docker images from ECR and docker-build-server
date: 2017-09-05 21:22:37
tags:
  - Docker
  - AWS
  - ECR
---

## 1. Remove old images from ECR

Amazon ECR registries is limited to numbers of images we can save in it.
We have to delete old images and I wrote a script to realize it from command-line.

I use aws-cli.
Here is official document of `$ aws ecr desribe-images` command.
http://docs.aws.amazon.com/cli/latest/reference/ecr/describe-images.html

```sh
KEEP_IMAGES=2 # number of images you want to remain

aws ecr describe-images --repository-name <your-repository-name> --query 'imageDetails[]' \
    | jq --raw-output 'sort_by(.imagePushedAt) | reverse | .[].imageDigest' \
    | awk "NR > ${KEEP_IMAGES}" \
    | xargs -I{} aws ecr batch-delete-image --repository-name <your-repository-name> --image-ids imageDigest={}
```

## 2. Remove old images from docker building server

### Remove old deployed images

This page teaches us how to use format options of `$ docker image ls` command
https://docs.docker.com/engine/reference/commandline/images/#format-the-output

```sh
KEEP_IMAGES=1 # number of images you want to remain

# Before you remove images, you have to remove tags from it.
docker image ls --filter 'reference=<tag-pattern>' --format '{{.Repository}}:{{.Tag}}' \
    | awk "NR > ${KEEP_IMAGES}" \
    | xargs docker image rm

# Remove images.
docker image ls --quiet --filter 'reference=<pattern>' \
    | awk "NR > ${KEEP_IMAGES}" \
    | xargs docker image rm
```

### Delete images which are created when you fail to build image

When we failed to build image, `<none>:<none>` image might be created.
We can pick them up from `$ docker image ls` command with filtering `'dangling=true'`.

```sh
# Before you remove image, you have to remove active containers.
docker image ls --quiet --filter 'dangling=true' \
    | xargs -I{} docker container ls --all --quiet --filter 'ancestor={}' \
    | xargs docker container rm

# Remove images.
docker image ls --quiet --filter "dangling=true" \
    | xargs docker image rm
```

