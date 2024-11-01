#!/bin/bash

# Define the base URL
baseUrl="http://localhost:3000/"

# Define headers
headers="Content-Type: application/json"

# Define collection name
collectionName="myCollection"

# Construct the full URL by appending the action
mongoApiUrl="${baseUrl}find/${collectionName}"

# Debug: print the constructed URL
echo "Constructed URL: $mongoApiUrl"

# Send GET request to find documents and store the response
response=$(curl -s -H "$headers" "$mongoApiUrl")

# Debug: print the response from the server
echo "Response from server: $response"

# Define the output JSON file path
outputFile="./foundDocuments.json"

# Save the JSON data to a file
echo "$response" > "$outputFile"

# Output a message indicating success
echo "Documents saved to $outputFile"
