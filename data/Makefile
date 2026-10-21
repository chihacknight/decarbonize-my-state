
GENERATED_FILES = final/emissions/emissions.json final/buildings/buildings.json final/vehicles/vehicles.json final/power_plants/power_plants.json final/target_generation/target_generation.json final/power_generation/power_generation.json

all: $(GENERATED_FILES)

clean:
	rm -rf final/*

OUT = final/emissions final/buildings final/vehicles final/power_plants final/target_generation final/power_generation

$(shell   mkdir -p $(OUT))

final/emissions/emissions.json : raw/epa_state_ghg_by_econ_sector.csv
	python scripts/get_emissions.py $< > $@

# Not part of `all` - regenerates the raw CSV from a downloaded EPA state GHG
# inventory zip, e.g. `make update-emissions-raw EPA_ZIP=allstateghgdata90-22_v082924.zip`
# See UPDATE_PROCESS.md
.PHONY : update-emissions-raw
update-emissions-raw :
	@test -n "$(EPA_ZIP)" || (echo "Set EPA_ZIP to the path of the downloaded EPA zip" && exit 1)
	python scripts/convert_epa_workbook.py $(EPA_ZIP) > epa_state_ghg.csv
	mv epa_state_ghg.csv raw/epa_state_ghg_by_econ_sector.csv

final/buildings/buildings.json : raw/buildings_data.csv
	python scripts/get_buildings.py $< > $@
	
final/vehicles/vehicles.json : raw/vehicles_data.csv
	python scripts/get_vehicles.py $< > $@

final/power_plants/power_plants.json : raw/power_plants_and_communities.csv
	python scripts/get_power_plants.py $< > $@

final/power_generation/power_generation.json : raw/us_electric_generation_2001_20.csv
	python scripts/get_generation.py $< > $@

final/target_generation/target_generation.json : raw/state_renewable_gen_targets.csv
	python scripts/get_target_generations.py $< > $@