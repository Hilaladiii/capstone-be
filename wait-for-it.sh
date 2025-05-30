host=$1
port=$2

echo "Waiting MySQL $host:$port..."
while ! nc -z $host $port; do
  sleep 1
done
echo "Mysql Ready!"