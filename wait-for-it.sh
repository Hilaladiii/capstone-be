set -e

TIMEOUT=15
QUIET=0
HOST=""
PORT=""

echoerr() {
  if [ "$QUIET" -ne 1 ]; then echo "$@" 1>&2; fi
}

usage() {
  cat << USAGE >&2
Usage:
  $0 host:port [--timeout=15] [--quiet] [-- command args]
  - host:port      Host and port to test
  --timeout=15     Timeout in seconds, zero for no timeout
  --quiet          Don't output any status messages
  --               Execute command after successful test
USAGE
  exit 1
}

wait_for() {
  for i in $(seq $TIMEOUT); do
    nc -z "$HOST" "$PORT" >/dev/null 2>&1 && return 0
    sleep 1
  done
  echo "Operation timed out" >&2
  exit 1
}

while [ $# -gt 0 ]
do
  case "$1" in
    *:* )
    HOST=$(printf "%s\n" "$1"| cut -d : -f 1)
    PORT=$(printf "%s\n" "$1"| cut -d : -f 2)
    shift 1
    ;;
    --timeout=* )
    TIMEOUT="${1#*=}"
    shift 1
    ;;
    --quiet)
    QUIET=1
    shift 1
    ;;
    --)
    shift
    break
    ;;
    *)
    echoerr "Unknown argument: $1"
    usage
    ;;
  esac
done

if [ "$HOST" = "" ] || [ "$PORT" = "" ]; then
  echoerr "Error: you need to provide a host and port to test."
  usage
fi

wait_for

if [ $# -gt 0 ]; then
  exec "$@"
fi

exit 0
