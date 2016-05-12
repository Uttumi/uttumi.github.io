import os
import json
from os import walk
from collections import OrderedDict

def get_filtered_file_list(file_list, filters, folder_path):
	return [folder_path[2:] +'/'+ file_name for file_name in file_list if any( [file_name.endswith(filter) for filter in filters] ) ]

# def walk_folder_check(folder_path):
	
	# folder_content_dict = {}
	
	# for (dirpath, subfolders, files) in walk(folder_path):
		# folder_content_dict['web_pages'] = get_filtered_file_list( files,  ['.html'], folder_path )
		# folder_content_dict['images'] = get_filtered_file_list( files,  ['.png', '.jpg'], folder_path )
		# folder_content_dict['videos'] = get_filtered_file_list( files,  ['.avi', '.mpg', '.mp4'], folder_path )
		
		# #print dirpath +' -> '+ str(subfolders)
		
		# #for subfolder in subfolders:
		# #	folder_content_dict[dirpath +'/'+ subfolder] = recursive_folder_check(dirpath +'/'+ subfolder)

	# #folder_content_dict = dict((k, v) for k, v in folder_content_dict.iteritems() if len(v) > 0)

# #	files = [content_name for content_name in folder_contents if '.' in content_name ]
# #	subfolders = [content_name for content_name in folder_contents if '.' not in content_name ]
			
	# return folder_content_dict

def is_number(s):
    try:
        int(s)
        return True
    except ValueError:
        return False

def recursive_folder_check(folder_path):
	
	folder_content_dict = OrderedDict()
	files = []
	subfolders = []
	
	for folder_content in os.listdir(folder_path):
		if '.' in folder_content:
			files.append(folder_content)
		else:
			subfolders.append(folder_content)

	folder_content_dict['pages'] = get_filtered_file_list( files,  ['.html'], folder_path )
	folder_content_dict['images'] = get_filtered_file_list( files,  ['.png', '.jpg'], folder_path )
	folder_content_dict['videos'] = get_filtered_file_list( files,  ['.avi', '.mpg', '.mp4'], folder_path )

	for page in folder_content_dict['pages']:
		if page.endswith('description.html'):
			folder_content_dict['description'] = [page]
			folder_content_dict['pages'].remove(page)

	if( len(folder_content_dict['pages']) == 0 ):
		for subfolder in subfolders:
			folder_name = subfolder
			if folder_name[0] == '-':
				folder_name = folder_name[1:]
				if 'subpages' in folder_content_dict:
					folder_content_dict['subpages'].append( { folder_name: recursive_folder_check(folder_path +'/'+ subfolder) } )
				else:
					folder_content_dict['subpages'] = [ { folder_name: recursive_folder_check(folder_path +'/'+ subfolder) } ]
			else:
				name_start = folder_name[0:folder_name.find('_')]

				if is_number(name_start):
					folder_name = folder_name[folder_name.find('_')+1:]
					#print(name_start)
					
				folder_content_dict[folder_name] = recursive_folder_check(folder_path +'/'+ subfolder)

	#folder_content_dict = dict((k, v) for k, v in folder_content_dict.items() if len(v) > 0)
	folder_content_dict = OrderedDict((k, v) for k, v in folder_content_dict.items() if len(v) > 0)

	return folder_content_dict

	
folder_structure_dict = recursive_folder_check('.')

with open('index.json', 'w') as outfile:
    json.dump(folder_structure_dict, outfile, indent = 4, ensure_ascii=False)

