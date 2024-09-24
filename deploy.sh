#!/usr/bin/env bash

server_user="root"
server_ip="172.24.2.97"
server_folder="/JYKJCLOUD/JY-MCSP-GEO/mcsp-dz-front/"
remote_zip_file="dist.zip"

npm run build
echo "Build completed."

zip -r $remote_zip_file dist
echo "Zip completed."

scp $remote_zip_file $server_user@$server_ip:$server_folder
echo 'Upload file completed.'

ssh $server_user@$server_ip << EOF
cd $server_folder
rm -rf dist
unzip $remote_zip_file
rm -rf $remote_zip_file
EOF
echo 'Deploy completed.'

rm -rf $remote_zip_file
