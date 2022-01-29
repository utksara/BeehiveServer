import os

if not os.path.isdir('./inputoutput'):
    os.mkdir('./inputoutput')
    if not os.path.exists('./inputoutput/input_data.json.js'):
        with open('./inputoutput/input_data.json', 'w'):
            pass
    if not os.path.exists('./inputoutput/output_data.json'):
        with open('./inputoutput/output_data.json', 'w'):
            pass

if not os.path.isdir('./cpp_bins'):
    os.mkdir('./cpp_bins')

if not os.path.exists('./simulations/livebeehive.js'):
    with open('./simulations/livebeehive.js', 'w'):
        pass