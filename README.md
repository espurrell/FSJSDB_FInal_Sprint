# FSJSDB_FInal_Sprint
Full Stack JS and DataBase - FInal Sprint

<!-- Database set up -->

# Search Engine Project

## Database Setup

1. **Create the Database Schema**:
    - Run the `create_tables.sql` script located in the `sql` folder to create the necessary tables.
    ```bash
    psql -U your_username -d your_database -f sql/create_tables.sql
    ```

2. **Populate the Tables**:
    - Run the `populate_tables.sql` script located in the `sql` folder to populate the tables with data from the CSV files.
    ```bash
    psql -U your_username -d your_database -f sql/populate_tables.sql
    ```

Make sure to replace `/path/to/Driver.csv`, `/path/to/Vehicle.csv`, and `/path/to/Registration.csv` with the actual paths to your CSV files if they are not in the `csv` folder.
