# Use the official image as a parent image.
#FROM mongo:3.6
FROM ubuntu:18.04

# Update/upgrade
RUN apt-get update
RUN apt-get -y upgrade

# Install basic stuff
RUN apt-get -y install build-essential apache2 git

# Install python
RUN apt-get -y install mongodb
#RUN pip3 install unicodecsv
#RUN pip3 install xlrd

# Install node
#RUN apt-get -y install nodejs npm
#RUN npm -g install npx
#RUN apt-get -y install mongodb

