"""
README
"""

import csv
import os
import json

# import shutil

this_dir = os.path.dirname(__file__)


read_rows = []
with open(
    os.path.join(this_dir, "../data/csv/corrected.csv"), "r", encoding="latin-1"
) as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        read_rows.append(row)

# FILE_NAME = os.path.join("data/json/0.json")
# filename_dir = os.path.dirname(FILE_NAME)
# if os.path.exists(filename_dir):
#    shutil.rmtree(filename_dir)
# os.makedirs(filename_dir)
# print("made directory")
JSON_STR = "*json*"
JSON_SEP = "."
JSON_STR_LEN = len(JSON_STR)
# rownum = 0
print("start read")
with open(
    os.path.join(this_dir, "../data/json/0.json"), "w+", encoding="utf-8"
) as jsonfile:
    for rownum, row in enumerate(read_rows):
        newRow = {}
        if rownum == 0:
            i = 0
        else:
            for cell in row:
                key = cell
                if cell[:JSON_STR_LEN] == JSON_STR:
                    # print "!!!!"
                    subString = cell[JSON_STR_LEN:]
                    dotIndex = subString.index(JSON_SEP)
                    key = subString[:dotIndex]
                    nestKey = subString[dotIndex + 1 :]
                    if key not in newRow:
                        newRow[key] = {}
                    newRow[key][nestKey] = row[cell]
                else:
                    newRow[key] = row[cell]
                    # print newRow
            json.dump(newRow, jsonfile)
            jsonfile.write("\r\n")
        # rownum = rownum + 1
