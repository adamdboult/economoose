# Download files

```bash
https://www.imf.org/external/pubs/ft/weo/2016/02/weodata/WEOOct2016all.xls /home/adam/Projects/economoose/rawData/IMF/
```

# Docker instructions

```bash
sudo docker-compose build --no-cache
sudo docker-compose up --detach
```

# Structure

3 programs:

- python csvtojson converts csv files to json
- python csv-converter gets files to this position
- both called from gulp

gulpfile describes the creation of the public docs. you can run "gulp" for all
