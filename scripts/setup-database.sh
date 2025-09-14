#!/bin/bash

echo "Setting up Elixlifestyle Database..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if project is linked
if [ ! -f ".supabase/config.toml" ]; then
    echo "Please link your Supabase project first:"
    echo "supabase link --project-ref YOUR_PROJECT_REF"
    exit 1
fi

# Run the database setup
echo "Running database setup..."
supabase db push

echo "Database setup completed!"
echo ""
echo "Next steps:"
echo "1. Go to your Supabase dashboard"
echo "2. Navigate to the SQL editor"
echo "3. Run the script from scripts/setup-database.sql"
echo "4. Verify that the tables are created in the Table Editor"