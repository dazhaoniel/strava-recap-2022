# Strava Year of 2022 Recap

Strava removed the yearly recap feature from free accounts, and I think it's a shame that we are now asked to pay a subscription fee to simply view the data we created. So I requested a data dump of my own account activities and decided to make my own "2022 Year in Sports"

## Development

Start Jupyter Notebook
```
jupyter notebook
```

Run script to convert .gpx (Strava) and .fit (Garmin) activties to dataframe
```python
# Start python virtual environment
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# generate requirement file
pip freeze > requirements.txt

# Leave virtual environment
deactivate

# Run script
python parse_gpx_activities.py
```

### Resources

[US States Cartographic Boundary](https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html)

[Parsing fitness tracker data with Python](https://towardsdatascience.com/parsing-fitness-tracker-data-with-python-a59e7dc17418)