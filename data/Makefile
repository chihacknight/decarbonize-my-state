
GENERATED_FILES = final/emissions/emissions.json final/buildings/buildings.json final/vehicles/vehicles.json final/power_plants/power_plants.json final/target_generation/target_generation.json

all: $(GENERATED_FILES)

clean:
	rm -rf final/*

OUT = final/emissions final/buildings final/vehicles final/power_plants final/target_generation

$(shell   mkdir -p $(OUT))

final/emissions/emissions.json : raw/us_emissions_2000_2018.csv
	python scripts/get_emissions.py $< > $@

final/buildings/buildings.json : raw/buildings_data.csv
	python scripts/get_buildings.py $< > $@
	
final/vehicles/vehicles.json : raw/vehicles_data.csv
	python scripts/get_vehicles.py $< > $@

final/power_plants/power_plants.json : raw/power_plants_and_communities.csv
	python scripts/get_power_plants.py $< > $@

final/target_generation/target_generation.json : raw/state_renewable_gen_targets.csv
	python scripts/get_target_generations.py $< > $@