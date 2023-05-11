import os
import requests
import json
from slugify import slugify

# Define the data structure
data_dir = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),".."
        )

with open(os.path.join(data_dir,'final/power_plants/power_plants.json') ) as f:
    json_str = f.read()
    data = json.loads(json_str)


    # Loop through each power plant
    for state in data:
        for plant in state["power_plants"]:
          plant_name = plant["plant_name"]
          lat = plant["Latitude"]
          lng = plant["Longitude"]
          print("saving image for powerplant", plant_name)

          image_url = (f"https://maps.googleapis.com/maps/api/staticmap?"
                        f"markers=size:mid|{lat},{lng}"
                        "&scale=2"
                        "&zoom=16"
                        "&size=400x400"
                        "&maptype=satellite"
                        "&key=AIzaSyChJYejLT7Vxh_UZhJkccsy0xqZTHX8fzU")

          
          # Save the image to a file
          filename = f"power-plant-maps/{state['state']}-{slugify(plant_name)}.png"
          os.makedirs(os.path.dirname(filename), exist_ok=True)
          with open(filename, "wb") as f:
              f.write(requests.get(image_url).content)