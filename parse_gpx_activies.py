import gpxpy
import pandas as pd

from os import listdir
from os.path import isfile, join


def parse_activities(file):
	f = open('./export_11620080/'+file)
	g = gpxpy.parse(f)
	data = g.tracks[0].segments[0].points
	return data

def get_activity_coordinates():
	df = pd.DataFrame(columns=['latitude', 'longitude', 'elevation', 'activity_name'])
	a = pd.read_pickle('./activities.pkl')
	for r in list(a.itertuples(index=False, name=None)):
		n = str(r[1])
		d = parse_activities(n)
		for p in d[:1]:
			df.loc[len(df.index)] = [p.latitude, p.longitude, p.elevation, str(r[0])]

		df.to_pickle('./activities/activity_location_data_'+str(r[0])+'.pkl')

def concat_dfs():
	df = pd.DataFrame(columns=['latitude', 'longitude', 'elevation', 'activity_name'])
	for f in listdir('./activities'):
		if isfile(join('./activities', f)):
			t = pd.read_pickle(join('./activities', f))
			df = pd.concat([df, t], axis=0)
	df.to_pickle('locations.pkl')



if __name__ == '__main__':
	concat_dfs()