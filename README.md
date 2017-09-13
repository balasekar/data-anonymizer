# myenergy-anonymizer

This is a repository to anonymize MyEnergy Data and write it in a SQL file.

## What do I do ?

I am designed to fetch production data of customizable list of customers, based on their Account numbers.
Once the production Details of the customers are fetched they are anonymized before writing them on as SQL in files.

## Configuration from Runtime args:
a: Accountnumber <br />
o: Output file name <br />
d: Delete exisiting file ? (Boolean | default false) <br />
i: Input file name (Account numbers to fetch) <br />
NODE_ENV = development | integration | production (Which db to fetch Data from) <br />

## Packages used:
* [bossy](https://www.npmjs.com/package/bossy) : To fetch command line args
* [data-anonymizer](https://www.npmjs.com/package/data-anonymizer) : To anonymize data
* [squel](https://www.npmjs.com/package/squel) : To generate SQL queries
* [pg-promise](https://www.npmjs.com/package/pg-promise) : To connect and execute queries in Postgres


## How to use me :
* NODE_ENV= \{Environment\} node index -o \{outputfile\} -i \{inputfile\} -d \{delete|append data\} -a \{accountnumber\}

#### Example:
* NODE_ENV=integration node index -o data.sql -i input.json -d true
