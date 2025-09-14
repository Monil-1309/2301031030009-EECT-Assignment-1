@echo off
echo Setting up Elixlifestyle Database...

REM Check if npm is available
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo npm is not installed or not in PATH
    echo Please install Node.js and npm first
    pause
    exit /b 1
)

echo.
echo Please follow these steps to set up your database:
echo.
echo 1. Go to your Supabase dashboard: https://supabase.com/dashboard
echo 2. Select your project
echo 3. Go to SQL Editor
echo 4. Create a new query
echo 5. Copy and paste the contents of scripts/setup-database.sql
echo 6. Run the query
echo.
echo This will create all necessary tables:
echo - orders (for storing customer orders)
echo - products (for product catalog)
echo - contact_submissions (for contact form data)
echo.
echo After running the SQL, your admin panel should be able to:
echo - Display orders
echo - Update order status
echo - Track revenue
echo.

pause