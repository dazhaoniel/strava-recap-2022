import gpxpy
import pandas as pd


def parse_activities(file):
	f = open('./export_11620080/'+file)
	g = gpxpy.parse(f)
	data = g.tracks[0].segments[0].points
	return data

def get_activity_coordinates():
	df = pd.DataFrame(columns=['latitude', 'longitude', 'elevation', 'activity_name'])
	a = pd.read_pickle('./activities.pkl')
	# print(len(list(a.itertuples(index=False, name=None))))
	for r in list(a.itertuples(index=False, name=None)):
		n = str(r[1])
		d = parse_activities(n)
		for p in d:
			df.loc[len(df.index)] = [p.latitude, p.longitude, p.elevation, str(r[0])]

		df.to_pickle('./activities/activity_location_data_'+str(r[0])+'.pkl')


if __name__ == '__main__':
	get_activity_coordinates()