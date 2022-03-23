
GENERATED_FILES = final/emissions.json

all: $(GENERATED_FILES)

clean:
	rm -f final/*

final/emissions.json : raw/us_emissions_2000_2018.csv
	python scripts/get_emissions.py $< > $@

final/buildings.json : raw/buildings_data.csv
	python scripts/get_buildings.py $< > $@