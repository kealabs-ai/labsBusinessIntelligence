@echo off
set TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzY0OTQ4MzI5LCJpc19hY3RpdmUiOnRydWUsInJvbGUiOiJhZG1pbiJ9.OqJIF6_SJhQQRkOUG-lQlAUHYNZNj5jdE2i3KJwuQZ4
set BASE_URL=http://72.60.140.128:6002/api/v1/resources

echo Testing GET /resources
curl -X GET "%BASE_URL%/" -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json"
echo.
echo.

echo Testing POST /resources
curl -X POST "%BASE_URL%/" -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\"name\":\"Test Resource\",\"type\":\"professional\",\"specialty\":\"Testing\",\"email\":\"test@example.com\",\"phone\":\"123456789\",\"notes\":\"Test notes\"}"
echo.
echo.

pause