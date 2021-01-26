# Image Updater

This is a small application that i use for my home k3s cluster. It gets calld from tekton with is triggered by a docker hub webhook.   
It checks out the main repo updates the docker image verisons in the helm chart and then pushes the changes.

## Arguments
    '--callback-url <value>'
    '--repo-url <value>'
    '--image-name <value>'
    '--tag <value>'
    '--name <value>'
    '--namespace <value>'
    '--owner <value>'
    '--workspace-path <value>'
    '--git-email <value>'
    '--git-name <value>'
