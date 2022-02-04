
GENERATED_FILES = final/totals.json final/occupations.json

all: $(GENERATED_FILES)

clean:
	rm -f final/*

final/occupations.json : raw/occupations.csv
	python scripts/get_occupations.py $< > $@

final/totals.json : raw/occupations.csv
	python scripts/get_totals.py $< > $@
