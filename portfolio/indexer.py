import os
import json
from os import walk

def get_filtered_file_list(file_list, filters, folder_path):
	return [folder_path[2:] +'/'+ file_name for file_name in file_list if any( [file_name.endswith(filter) for filter in filters] ) ]

def walk_folder_check(folder_path):
	
	folder_content_dict = {}
	
	for (dirpath, subfolders, files) in walk(folder_path):
		folder_content_dict['web_pages'] = get_filtered_file_list( files,  ['.html'], folder_path )
		folder_content_dict['images'] = get_filtered_file_list( files,  ['.png', '.jpg'], folder_path )
		folder_content_dict['videos'] = get_filtered_file_list( files,  ['.avi', '.mpg'], folder_path )
		
		#print dirpath +' -> '+ str(subfolders)
		
		#for subfolder in subfolders:
		#	folder_content_dict[dirpath +'/'+ subfolder] = recursive_folder_check(dirpath +'/'+ subfolder)

	#folder_content_dict = dict((k, v) for k, v in folder_content_dict.iteritems() if len(v) > 0)

#	files = [content_name for content_name in folder_contents if '.' in content_name ]
#	subfolders = [content_name for content_name in folder_contents if '.' not in content_name ]
			
	return folder_content_dict

	
def recursive_folder_check(folder_path):
	
	folder_content_dict = {}
	files = []
	subfolders = []
	
	for folder_content in os.listdir(folder_path):
		if '.' in folder_content:
			files.append(folder_content)
		else:
			subfolders.append(folder_content)

	folder_content_dict['web_pages'] = get_filtered_file_list( files,  ['.html'], folder_path )
	folder_content_dict['images'] = get_filtered_file_list( files,  ['.png', '.jpg'], folder_path )
	folder_content_dict['videos'] = get_filtered_file_list( files,  ['.avi', '.mpg'], folder_path )
	
	for subfolder in subfolders:
		folder_content_dict[subfolder] = recursive_folder_check(folder_path +'/'+ subfolder)

	folder_content_dict = dict((k, v) for k, v in folder_content_dict.items() if len(v) > 0)

	return folder_content_dict

	
folder_structure_dict = recursive_folder_check('.')

with open('index.json', 'w') as outfile:
    json.dump(folder_structure_dict, outfile, sort_keys = True, indent = 4, ensure_ascii=False)

