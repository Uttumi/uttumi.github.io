from distutils.core import setup
import py2exe, sys, os

# setup(console=['indexer.py'])

sys.argv.append('py2exe')

setup(
	options = {'py2exe': {'bundle_files': 1}},
	windows = [{'script': "indexer.py"}],
	zipfile = None,
)
