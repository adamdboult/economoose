####################
# Import libraries #
####################
import csv

# import unicodecsv
import os
import codecs
import shutil
import sys
import json

#############
# Variables #
#############
dir = os.path.dirname(__file__)

jsonStr = "*json*"
jsonSep = "."
jsonStrLen = len(jsonStr)

#############
# Functions #
#############


####
# Can a variable be converted to float?
####
def isFloat(value):
    try:
        float(value)
        return True
    except ValueError:
        return False


####
# Decode
####
def _decode_list(input_list):
    rv = []
    for item in input_list:
        if isinstance(item, unicode):
            item = item.encode("utf-8")
        elif isinstance(item, list):
            item = _decode_list(item)
        elif isinstance(item, dict):
            item = _decode_dict(item)
        rv.append(item)
    return rv


def _decode_dict(input_dict):
    rv = {}
    for key, value in input_dict.iteritems():
        if isinstance(key, unicode):
            key = key.encode("utf-8")
        if isinstance(value, unicode):
            value = value.encode("utf-8")
        elif isinstance(value, list):
            value = _decode_list(value)
        elif isinstance(value, dict):
            value = _decode_dict(value)
        rv[key] = value
    return rv


######################
# Load config object #
######################
# configPath = os.path.join(dir, "data_config.json")

# with open(configPath) as data_file:
#    configObj = json.load(data_file)

# source_directory = configObj["data"]["folder"]
source_directory = os.path.join(dir, "Raw data/IMF")

########################
# Load settings object #
########################
source_settings = open(os.path.join(source_directory, "settings.json"))
jsonstring = source_settings.read()

json_data = json.loads(jsonstring)
# json_data=json.loads(jsonstring, object_hook=_decode_dict)

csvFileName = json_data["name"]
csvdelimiter = json_data["delimiter"]
source_encoding = json_data["encoding"]
cutOff = json_data["cutOff"]
scaleObject = json_data["scale"]
noteArray = json_data["noteArray"]
filterArray = json_data["filterArray"]
subjectArray = json_data["subjectArray"]
favArray = json_data["favArray"]
headerAppend = json_data["headerAppend"]
scaleRow = json_data["scaleRow"]
rowAppend = json_data["rowAppend"]

####
# Interpret CSV delimiter settings
####
if csvdelimiter == "tab":
    useDelimiter = "	"
else:
    useDelimiter = ","

######################
# Set up destination #
######################
destination_path = os.path.join(dir, "data/csv/corrected.csv")
destination_dir = os.path.dirname(destination_path)
if os.path.exists(destination_dir):
    shutil.rmtree(destination_dir)
os.makedirs(destination_dir)
destination_file = open(destination_path, "w", encoding=source_encoding)
destination_writer = csv.writer(destination_file, delimiter=",")

############
# Load CSV #
############
# csvFileName = configObj["data"]["name"]

# with open(source_directory + csvFileName, 'r', encoding = source_encoding) as csvfile:
with open(
    os.path.join(source_directory, csvFileName), "r", encoding=source_encoding
) as csvfile:

    reader = csv.reader(csvfile, delimiter=useDelimiter)

    origin = []
    target = []

    for entry in subjectArray:
        origin.append(entry[0])
        target.append(entry[1])

    rownum = 0
    for row in reader:

        writeBin = 1
        ####
        # Do stuff for first row
        ####
        if rownum == 0:
            cellnum = 0
            for cell in row:
                if cell.isdigit():
                    row[cellnum] = "*json*data." + row[cellnum]
                if cell in noteArray:
                    row[cellnum] = "*json*note." + row[cellnum]
                if cell in filterArray:
                    row[cellnum] = "*json*filter." + row[cellnum]
                cellnum = cellnum + 1

            ####
            # Add manual metadata (eg source, favourite)
            ####
            for header in headerAppend:
                row.append(header)
            headers = row
        ####
        # Do stuff for other rows
        ####
        # elif rownum < cutOff:
        elif row[1] != "":
            ####
            # Add manual metadata (eg source, favourite)
            ####
            for cell in rowAppend:
                val = ""
                for part in cell:
                    # print(type(part))
                    if type(part) is str:
                        val += part
                    else:
                        val += row[part]
                row.append(val)
            ####
            # Add the subject type (eg finacne, output)
            ####
            row.append(target[origin.index(row[4])])

            ####
            # Carry on
            ####
            for index, cell in enumerate(row):
                if headers[index][:jsonStrLen] == jsonStr:
                    subString = headers[index][jsonStrLen:]
                    dotIndex = subString.index(jsonSep)
                    key = subString[:dotIndex]
                    if key == "data":
                        rowScale = row[scaleRow]
                        if isFloat(cell.replace(",", "")) == 1:
                            row[index] = (
                                float(cell.replace(",", "")) * scaleObject[rowScale]
                            )

            ####
            # Add favourite
            ####
            if rownum in favArray:
                row.append(1)
            elif rownum < cutOff:
                row.append(0)
        else:
            writeBin = 0
        if writeBin == 1:
            destination_writer.writerow(row)
        rownum = rownum + 1
        # print(rownum)
    destination_file.close()


print("Done?")
