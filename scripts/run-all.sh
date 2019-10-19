PACKAGE_JSON=./package.json
if [ ! -f "$PACKAGE_JSON" ]; then
    echo "Not in webapp; moving folders..."
    cd webapp
fi

echo "Executing webpack:"
# webpack
npm run build

# code to move build files
cp -r ./build/. ../src/main/resources/static

echo "Moving out of webapp..."
cd ../
echo "Executing Spring Boot / MVC:"
# Use ./mvnw so you don't need maven installed, else use mvn
./mvnw spring-boot:run