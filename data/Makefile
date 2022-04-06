
GENERATED_FILES = final/emissions/emissions.json final/buildings/buildings.json final/vehicles/vehicles.json

all: $(GENERATED_FILES)

clean:
	rm -rf final/*

OUT = final/emissions final/buildings final/vehicles

$(shell   mkdir -p $(OUT))

final/emissions/emissions.json : raw/us_emissions_2000_2018.csv
	python scripts/get_emissions.py $< > $@

final/buildings/buildings.json : raw/buildings_data.csv
	python scripts/get_buildings.py $< > $@
	
final/vehicles/vehicles.json : raw/vehicles_data.csv
	python scripts/get_vehicles.py $< > $@