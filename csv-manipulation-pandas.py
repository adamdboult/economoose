#!/usr/bin/env python3

####################
# Import libraries #
####################
#import csv
#import unicodecsv
import os
#import codecs
#import shutil
#import sys
import json

import numpy as np
import pandas as pd

#############
# Variables #
#############
dir = os.path.dirname(__file__)
"""
jsonStr = "*json*"
jsonSep = "."
jsonStrLen = len(jsonStr)
"""
######################
# Load config object #
######################
"""
configPath = os.path.join(dir, "data_config.json")

with open(configPath) as data_file:
    configObj = json.load(data_file)

source_directory = configObj["data"]["folder"]
source_directory = os.path.join(dir, source_directory)
source_file_name = configObj["data"]["name"]

source_file_path = os.path.join(source_directory, source_file_name)
"""
########################
# Load settings object #
########################
source_directory = os.path.join(dir, "Raw data/IMF")
source_settings_path = os.path.join(source_directory, 'settings.json')

source_settings_file = open(source_settings_path)
source_settings = source_settings_file.read()

source_settings_object = json.loads(source_settings)
#json_data=json.loads(jsonstring, object_hook=_decode_dict)

source_file_name = source_settings_object["name"]
csvdelimiter	 = source_settings_object["delimiter"]
source_encoding	 = source_settings_object["encoding"]
#cutOff		 = source_settings_object["cutOff"]
#scaleObject	 = source_settings_object["scale"]
#noteArray	 = source_settings_object["noteArray"]
#filterArray	 = source_settings_object["filterArray"]
#subjectArray	 = source_settings_object["subjectArray"]
#favArray	 = source_settings_object["favArray"]
#headerAppend	 = source_settings_object["headerAppend"]
#scaleRow	 = source_settings_object["scaleRow"]
#rowAppend	 = source_settings_object["rowAppend"]

####
# Interpret CSV delimiter settings
####

if csvdelimiter == 'tab':
	useDelimiter = '	'
else:
	useDelimiter = ','


#source_file_name = configObj["data"]["name"]

source_file_path = os.path.join(source_directory, source_file_name)


######################
# Set up destination #
######################
"""
destination_path = os.path.join(dir, 'data/csv/corrected.csv')
destination_dir = os.path.dirname(destination_path)
if os.path.exists(destination_dir):
	shutil.rmtree(destination_dir)
os.makedirs(destination_dir)
destination_file = open(destination_path, 'w', encoding = 'utf-8')
destination_writer = csv.writer(destination_file, delimiter = ',')
"""
############
# Load CSV #
############
#imported_data = pd.read_html(source_file_path)
#imported_data = pd.read_excel(source_file_path)
df = pd.read_csv(source_file_path, delimiter=useDelimiter, encoding=source_encoding)
print(df)

#########
# Clean #
#########
####
# Drop extra rows (bottom row in raw)
####

####
# Melt
####

df = pd.melt(df, var_name='Year', value_name='Value', id_vars=["WEO Country Code", "ISO", "WEO Subject Code", "Country", "Subject Descriptor", "Subject Notes", "Units", "Scale", "Country/Series-specific Notes", "Estimates Start After"])

print(df)

####
# Drop unwanted columns
####
# Notes
#df = df.drop('Subject Notes', 1)
#df = df.drop('Country/Series-specific Notes', 1)

# Extra country stuff
#df = df.drop('WEO Country Code', 1)
#df = df.drop('ISO', 1)

# Subject stuff
#df = df.drop('WEO Subject Code', 1)

print(df)

####
# Clean the scales
####


df["Value"] = np.where(df["Value"] == "--", np.nan, df["Value"])

#df = df.assign(Value = [Value * 1000000 if Scale == "Millions" else Value for Value in df["Value"]])

#df['Value'] = [ if a > 0 else 'neg' for a in df['a']]
print("HI?")
print(df["Value"])
print(df["Value"].astype(float) * 2)
print(df["Value"].astype(float) * 2)

df['Value'] = np.where(df['Scale'] == 'Millions', df['Value'] * 1000000, df['Value'])
print("HI?")
df['Value'] = np.where(df['Scale'] == 'Billions', df['Value'] * 1000000000, df['Value'])

#df["Value"] = df["Value"] * -1
"""
    "scale": {
	"Millions": 1000000,
	"Billions": 1000000000,
	"Units": 1,
	"": 1
    },
"""
#df = df.drop('Scale', 1)

print("HI?")

print(df)
print("HI?")
####
# Remove the forecasts
####

df = df.drop('Estimates Start After', 1)
print("HI?")
print(df)

print("HI?")
"""
#with open(source_directory + csvFileName, 'r', encoding = source_encoding) as csvfile:
with open(source_directory + source_file_name, 'r') as csvfile:

	reader = unicodecsv.reader(csvfile, delimiter = useDelimiter, encoding = source_encoding)
	
	origin = []
	target = []

	for entry in subjectArray:
		origin.append(entry[0])
		target.append(entry[1])

	rownum = 0
	print(reader)
	for row in reader:
		print(row)
		writeBin = 1
		cellnum = 0
		for cell in row:
			#print()
			#print(row[cellnum])
			#row[cellnum] = cell.encode('utf-8')
			#print(str(row[cellnum]) + "test")
			#row[cellnum]=cell.decode(encoding).encode('utf-8')
			cellnum = cellnum + 1
		if rownum == 0:
			cellnum = 0
			for cell in row:
				print()
				print(cell)
				print(row[cellnum])
				print(row[cellnum].encode('utf-8'))
				print(type(row[cellnum]))
				print(type(row[cellnum].encode('utf-8')))
				print("*json*filter." + row[cellnum])
				#print("*json*filter." + row[cellnum].encode('utf-8'))
				if cell.isdigit():
					print("routeA")
					row[cellnum] = "*json*data." + row[cellnum]
				if cell in noteArray:
					print("routeB")
					row[cellnum] = "*json*note." + row[cellnum]
				if cell in filterArray:
					print("routeC")
					row[cellnum] = "*json*filter." + row[cellnum]
				cellnum = cellnum + 1
			for header in headerAppend:
				row.append(header)
			headers = row
		elif rownum < cutOff:
			for cell in rowAppend:
				#print("here?")
				val = ""
				for part in cell:
					#print(type(part))
					if type(part) is str:
						val += part
					else:
						val += row[part]
				row.append(val)
			row.append(target[origin.index(row[4])])
			for index, cell in enumerate(row):
				if  headers[index][:jsonStrLen]==jsonStr:
					subString=headers[index][jsonStrLen:]
					dotIndex=subString.index(jsonSep)
					key=subString[:dotIndex]
					if key == "data":
						rowScale = row[scaleRow]
						if isFloat(cell.replace(',', '')) == 1:
							row[index]=float(cell.replace(',', '')) * scaleObject[rowScale]
			if rownum in favArray:
				row.append(1)
			elif rownum < cutOff:
				row.append(0) 
		else:
			writeBin = 0
		print()
		print(row)
		print(len(row))
		#print(sys.getdefaultencoding())
		if writeBin == 1:
			destination_writer.writerow(row)
		rownum = rownum + 1
	destination_file.close()
print("Done?")
exec(open('csvtojson.py').read())
"""

print("done?")
