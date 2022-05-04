#!/bin/bash
echo "Reached entry point"
currentDir="$(dirname "$0")"
# extract the protocol
proto="$(echo $DATABASE_URL | grep :// | sed -e's,^\(.*://\).*,\1,g')"
isSqlite="$(echo $DATABASE_URL | grep file | sed -e's,^\(.*file\).*,\1,g')"

provider=${proto//[:\/]/}

if [ ! -z "$isSqlite" ] 
then
    provider=sqlite
fi

# remove the protocol
url="$(echo ${DATABASE_URL/$proto/})"
# extract the user (if any)
cred="$(echo $url | grep @ | cut -d@ -f1)"

user="$(echo $cred | grep : | cut -d: -f1)"
password=${cred/$user:/}


# extract the host and port
hostport="$(echo ${url/$user@/} | cut -d/ -f1)"
# by request host without port    
host="$(echo $hostport | sed -e 's,:.*,,g')"
# by request - try to extract the port
port="$(echo $hostport | sed -e 's,^.*:,:,g' -e 's,.*:\([0-9]*\).*,\1,g' -e 's,[^0-9],,g')"
# extract the path (if any)
path="$(echo $url | grep / | cut -d/ -f2-)"

echo "  Letterpad DB: $url"
# echo "  provider: $provider"
# echo "  user: $user"
# echo "  password: $password"
# echo "  host: $host"
# echo "  port: $port"
# echo "  dbname: $path"
sqliteDb=$currentDir/../../data/letterpad.sqlite

if [ "$provider" == "mysql" ]; then
    ## Seed letterpad Db
    if mysql -u$user -p"$password" -e "use $path" > /dev/null 2>&1;
    then
        echo "Database $path already exists. Exiting."
    else
        echo Create Letterpad database
        mysql -u$user -p"$password" -e "CREATE DATABASE $path"
        mysql -u$user -p"$password" $path < $currentDir/../sql/letterpad.sql
    fi

    ## Seed umami Db
    if mysql -u$user -p"$password" -e "use umami" > /dev/null 2>&1;
    then
        echo "Database umami already exists. Exiting."
    else
        echo Create Umami database
        mysql -u$user -p"$password" -e "CREATE DATABASE umami"
        mysql -u$user -p"$password" umami < $currentDir/../sql/umami.sql
    fi

elif [ "$provider" == "sqlite" ] && [ ! -f "$sqliteDb" ]; then
    # seed letterpad sqlite.
    sqlite3 $sqliteDb < $currentDir/../sql/letterpad-sqlite.sql
fi

# and add this at the end
exec "$@"