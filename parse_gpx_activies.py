import gpxpy
import gzip
import fitdecode
import pandas as pd

from os import listdir
from os.path import isfile, join

def parse_fit_file(file):
	gz = gzip.open('./export_55357022/'+file)
	f = fitdecode.FitReader(gz)
	for frame in f:
		if isinstance(frame, fitdecode.records.FitDataMessage):
			for field in frame.fields:
				# print(field.name)
				if frame.has_field('position_lat') and frame.has_field('position_long'):
					# print('latitude:', frame.get_value('position_lat'))
					# print('longitude:', frame.get_value('position_long'))
					# convert latitude and longitude from integers to degrees
					return frame.get_value('position_lat')/((2**32)/360), frame.get_value('position_long')/((2**32)/360)



def parse_gpx_activities(file):
	f = open('./export_11620080/'+file)
	g = gpxpy.parse(f)
	data = g.tracks[0].segments[0].points
	return data


def get_activity_coordinates():
	df = pd.DataFrame(columns=['latitude', 'longitude', 'elevation', 'activity_name'])
	a = pd.read_pickle('./activities.pkl')
	for r in list(a.itertuples(index=False, name=None)):
		n = str(r[1])
		if '.gpx' in n:
			d = parse_gpx_activities(n)
			p = d[0]
			df.loc[len(df.index)] = [p.latitude, p.longitude, p.elevation, str(r[0])]
		elif '.fit.gz' in n:
			latitude, longitude = parse_fit_file(n)
			df.loc[len(df.index)] = [latitude, longitude, 0, str(r[0])]
		df.to_pickle('./activities/activity_location_data_'+str(r[0])+'.pkl')
	

def concat_dfs():
	df = pd.DataFrame(columns=['latitude', 'longitude', 'elevation', 'activity_name'])
	for f in listdir('./activities'):
		if isfile(join('./activities', f)):
			# sometimes .DS_Store is throwing an error
			# try:
			t = pd.read_pickle(join('./activities', f))
			# except Exception:
			# 	print(f)

			df = pd.concat([df, t], axis=0)
	df.to_pickle('locations.pkl')



if __name__ == '__main__':
	concat_dfs()
