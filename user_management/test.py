from datetime import datetime

# Define the two timestamps
time1 = datetime.strptime("2024-12-12 11:45:58.468710", "%Y-%m-%d %H:%M:%S.%f")
time2 = datetime.strptime("2024-12-12 12:44:52.775698", "%Y-%m-%d %H:%M:%S.%f")

# Calculate the difference in minutes
difference = (time2 - time1).total_seconds() / 60
print(difference)
