npm start & cd ../SavewiseAPI/
dotnet run
if [ "$1" "-all" ] then
cd ../docker-db-pg/ & ./up.sh -u
fi