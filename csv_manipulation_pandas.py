"""
README
"""

####################
# Import libraries #
####################
# import csv
# import unicodecsv
import os

# import codecs
# import shutil

# import sys
# import json

import numpy as np
import pandas as pd

#############
# Variables #
#############
this_dir = os.path.dirname(__file__)

############
# settings #
############
source_directory = os.path.join(this_dir, "Raw data/IMF")

#################
# File settings #
#################
SOURCE_NAME_FILE = "WEOApr2020all.xls"
USE_DELIMITER = "	"
SOURCE_ENCODING = "latin-1"

CUT_OFF = 1552

######################
# Set up destination #
######################
destination_path = os.path.join(this_dir, "data/csv/corrected.csv")
destination_dir = os.path.dirname(destination_path)

############
# Load CSV #
############
source_file_path = os.path.join(source_directory, SOURCE_NAME_FILE)
df = pd.read_csv(source_file_path, delimiter=USE_DELIMITER, encoding=SOURCE_ENCODING)
print(df.columns)

# print(df.head)
# print(df["1980"])
# awda
#########
# Clean #
#########

####
# Drop extra rows (bottom row in raw)
####
df = df.iloc[:CUT_OFF]

####
# Drop unwanted columns
####
# Notes
# df = df.drop('Subject Notes', axis=1)
# df = df.drop('Country/Series-specific Notes', axis=1)

# Extra country stuff
# df = df.drop('WEO Country Code', axis=1)
# df = df.drop('ISO', axis=1)

# Subject stuff
# df = df.drop('WEO Subject Code', axis=1)

####
# Melt
####
df["original_order"] = range(len(df))

non_year_columns = [x for x in df.columns if x[0] not in ["1", "2"]]
df = pd.melt(df, var_name="Year", value_name="Value", id_vars=non_year_columns)

print(df)

####
# Clean the scales
####

df["Value"] = np.where(df["Value"] == "--", np.nan, df["Value"])

df["Value"] = df["Value"].str.replace(",", "")
df["Value"] = pd.to_numeric(df["Value"], errors="raise")
df["Value"] = np.where(df["Scale"] == "Millions", df["Value"] * 1000000, df["Value"])
df["Value"] = np.where(df["Scale"] == "Billions", df["Value"] * 1000000000, df["Value"])

"""
    "scale": {
	"Millions": 1000000,
	"Billions": 1000000000,
	"Units": 1,
	"": 1
    },
"""

####
# Remove the forecasts
####

print("HI?")
print(df)


df["Year"] = "*json*data." + df["Year"]

# df.to_csv("temp.csv", index=False)
df = df.pivot(
    index=[
        "original_order",
        "WEO Country Code",
        "ISO",
        "WEO Subject Code",
        "Country",
        "Subject Descriptor",
        "Subject Notes",
        "Units",
        "Scale",
        "Country/Series-specific Notes",
        "Estimates Start After",
    ],
    columns="Year",
    values="Value",
).reset_index()
df = df.sort_values(by="original_order").drop(columns="original_order")
# print(df.head)
# awdaw

# Optional: Rename the columns if needed to make them more readable
df.columns.name = None  # Remove the column index name
# df = df.drop("Estimates Start After", axis=1)


############
# New cols #
############

df["*json*note.Release"] = "October 2016"
df["*json*note.Dataset"] = "World Economic Outlook"
df["*json*filter.Source Name"] = "IMF"
df["*json*filter.Dependent Units"] = "Year"
df["*json*filter.Type"] = "Time Series"
df["*json*note.Web link"] = (
    "https://www.imf.org/external/pubs/ft/weo/2016/02/weodata/download.aspx"
)

#########
# Label #
#########

df["label"] = df["Country"] + ": " + df["Subject Descriptor"] + " (" + df["Units"] + ")"

###############
# Subject add #
###############
my_dict = {
    "Gross domestic product, constant prices": "Output",
    "Gross domestic product, current prices": "Output",
    "Gross domestic product, deflator": "Inflation",
    "Gross domestic product per capita, constant prices": "Output",
    "Gross domestic product per capita, current prices": "Output",
    "Output gap in percent of potential GDP": "Output",
    "Gross domestic product based on purchasing-power-parity (PPP) valuation of country GDP": "Output",
    "Gross domestic product based on purchasing-power-parity (PPP) per capita GDP": "Output",
    "Gross domestic product based on purchasing-power-parity (PPP) share of world total": "Output",
    "Implied PPP conversion rate": "Trade",
    "Total investment": "Investment & Savings",
    "Gross national savings": "Investment & Savings",
    "Inflation, average consumer prices": "Inflation",
    "Inflation, end of period consumer prices": "Inflation",
    "Six-month London interbank offered rate (LIBOR)": "Finance",
    "Volume of imports of goods and services": "Trade",
    "Volume of Imports of goods": "Trade",
    "Volume of exports of goods and services": "Trade",
    "Volume of exports of goods": "Trade",
    "Unemployment rate": "Labour",
    "Employment": "Labour",
    "Population": "Labour",
    "General government revenue": "Government",
    "General government total expenditure": "Government",
    "General government net lending/borrowing": "Government",
    "General government structural balance": "Government",
    "General government primary net lending/borrowing": "Government",
    "General government net debt": "Government",
    "General government gross debt": "Government",
    "Gross domestic product corresponding to fiscal year, current prices": "Output",
    "Current account balance": "Government",
}

df["*json*filter.Subject"] = df["Subject Descriptor"].map(my_dict)

##################
# Move estimates #
##################
cols = list(df.columns)
cols.remove("Estimates Start After")

# Find the position of the reference column and insert the column to move
reference_index = cols.index("*json*note.Release")
cols.insert(reference_index, "Estimates Start After")
df = df[cols]
##########
# Rename #
##########
note_array = [
    "ISO",
    "WEO Country Code",
    "Estimates Start After",
    "Country/Series-specific Notes",
    "Subject Notes",
    "Subject Descriptor",
    "WEO Subject Code",
]
for col_name in note_array:
    df = df.rename(columns={col_name: f"*json*note.{col_name}"})

filter_array = ["Units", "Country"]
for col_name in filter_array:
    df = df.rename(columns={col_name: f"*json*filter.{col_name}"})

#############
# Favourite #
#############
fav_array = [314, 200, 8003]

df["Favourite"] = df.index.isin(fav_array).astype(int)


########
# Save #
########
df.to_csv(destination_path, index=False)
print("done at end?")
