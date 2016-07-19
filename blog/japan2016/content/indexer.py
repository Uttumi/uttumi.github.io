import os
import json
from os import walk
from collections import OrderedDict

def find_occurences(s, ch):
	return [i for i, letter in enumerate(s) if letter == ch]

def get_filtered_file_list(file_list, filters, folder_path):
	return [folder_path[2:] +'/'+ file_name for file_name in file_list if any( [file_name.endswith(filter) for filter in filters] ) ]

def check_file_for_articles(file_name, articles_array): #articles_dict):

	id = ''
	title = ''
	path = file_name

	stored_lines = ''

	with open(file_name, encoding="utf8") as f:
		for lineno, line in enumerate(f, 1):
			stored_lines += line
			if '<article' in line:
				if 'id' in line:
					id_indices = find_occurences(line, '\"')
					if len(id_indices) == 2:
						id = line[id_indices[0]+1:id_indices[1]]
						#articles_dict[id] = file_name;
			if '</h1>' in line:
				#print(stored_lines)
				start_index = stored_lines.find('<h1>')
				end_index = stored_lines.find('</h1>')
				title = stored_lines[start_index+4:end_index]
				title = title.replace('\n', '').replace('\t', '')
				#All the necessary things should have been found by now
				break

	article_dict = {
		'id': id,
		'title': title,
		'path': path
	}

	articles_array.append(article_dict)


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

def read_content(folder_path, file_name):

	content = ''

	path = folder_path[2:] +'/'+ file_name

	if os.path.isfile(path):
		# Using with statement closes the file for us without needing to remember to close
		# explicitly, and closes even when exceptions occur
		with open(path, encoding='utf-8') as file:
		    #f = inf.readlines()

		#if os.path.isfile(path):
			#file = open(path, 'r')

			content = file.readline()

			#file.close()

	return content

	
def recursive_folder_check(folder_path):

	folder_content_dict = OrderedDict()
	files = []
	subfolders = []
	
	for folder_content in os.listdir(folder_path):
		if '.' in folder_content:
			files.append(folder_content)
		else:
			subfolders.append(folder_content)

	page_list = get_filtered_file_list( files,  ['.html'], folder_path )
	image_list = get_filtered_file_list( files,  ['.png', '.jpg'], folder_path )
	video_list = get_filtered_file_list( files,  ['.avi', '.mpg', '.mp4'], folder_path )

	for page in page_list:
		if page.endswith('description.html'):
			folder_content_dict['description'] = page
			page_list.remove(page)

	title = read_content(folder_path, 'title.txt')
	if len(title) > 0:
		folder_content_dict['title'] = title

	anchor = read_content(folder_path, 'anchor.txt')
	if len(anchor) > 0:
		folder_content_dict['anchor'] = anchor

	if len(page_list) > 0:
		#articles_dict = {}
		articles_array = []

		#Collect all the pages that match articles (i.e. have article tags inside)
		for page_file in page_list:
			check_file_for_articles(page_file, articles_array)

		folder_content_dict['articles'] = articles_array

	for subfolder_name in subfolders:
		if subfolder_name[0] == '-':
			if 'subpages' in folder_content_dict:
				folder_content_dict['subpages'].append( recursive_folder_check(folder_path +'/'+ subfolder_name) )
			else:
				folder_content_dict['subpages'] = [ recursive_folder_check(folder_path +'/'+ subfolder_name) ]
		else:
			folder_content_dict[subfolder_name] = recursive_folder_check(folder_path +'/'+ subfolder_name)		

	folder_content_dict = OrderedDict((k, v) for k, v in folder_content_dict.items() if len(v) > 0)

	return folder_content_dict


folder_structure_dict = recursive_folder_check('.')

# with open('index.json', 'w') as outfile:
#     json.dump(folder_structure_dict, outfile, sort_keys = True, indent = 4, ensure_ascii=False)

with open('index.json', 'w', encoding='utf-8') as outfile:
    json.dump(folder_structure_dict, outfile, indent = 4, ensure_ascii=False)

