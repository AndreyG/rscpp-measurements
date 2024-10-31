import os
import sys
import toml
import json
from signal_processing_algorithms.energy_statistics import energy_statistics
from signal_processing_algorithms.determinism import deterministic_numpy_random

assert len(sys.argv) == 2
input_dir = sys.argv[1]

projects = {}
commits = {}

def process_build(build):
    build_dir = os.path.join(input_dir, build)
    for t in sorted(os.listdir(build_dir)):
        path = os.path.join(build_dir, t)
        if t == "rs-commit-id.txt":
            with open(path, 'r') as f:
                commits[build] = f.read()

            continue

        for config in sorted(os.listdir(path)):
            project = config.removesuffix('.toml')
            if not project in projects:
                projects[project] = {}

            if not t in projects[project]:
                projects[project][t] = []

            
            with open(os.path.join(path, config), 'r') as f:
                config = toml.load(f)
                time = config['best-result']

            projects[project][t].append((build, time))                


for build in sorted(os.listdir(input_dir)):
    if build == ".git" or build == ".github" or build == "scripts":
        continue

    process_build(build)

def generate(projects, t):
    generated_canvases = ""
    generated_script = ""
    for project_name, data in projects.items():
        if not t in data:
            continue

        results = data[t]
        canvas_id = project_name + ".chart"

        generated_canvases += f"<h1 class=\"report-title\" id={project_name}><a href=\"#{project_name}\">{project_name}</a></h1>\n"
        generated_canvases += "<div class=\"report-graphs\">\n"
        generated_canvases += f"<canvas id=\"{canvas_id}\" style=\"width:100%;max-width:1500px\"/>\n"
        generated_canvases += "</div>\n\n"

        builds = []
        times = []
        for build, time in results:
            builds.append(build)
            times.append(time)

        with deterministic_numpy_random(31415):
            change_points = sorted(energy_statistics.e_divisive(times, pvalue=0.01, permutations=100))

        min_value = min(times)
        max_value = max(times)
        range = max_value - min_value
        delta = range / 5.

        data = {
            'labels': builds,
            'times': times,
            'change_points': change_points,
            'ticks': {
                'min': min_value - delta,
                'max': max_value + delta
            }
        }

        project_name = project_name.replace('-', '_')

        with open(f"./{t}/{project_name}.json", 'w') as f:
            json.dump(data, f, indent=4)

        generated_script += f"{project_name} = fetch(\"./{t}/{project_name}.json\").then((response) => response.json());\n"
        generated_script += f"{project_name}.then((data) => {{\n"
        generated_script += f"  generate_chart(\"{canvas_id}\", data);\n"
        generated_script += f"}});\n\n"

    return (generated_canvases, generated_script)


with open('template.html', 'r') as f:
    html_template = f.read()

with open('template.js', 'r') as f:
    js_template = f.read()

for t in ["indexing", "inspect-code"]:
    os.makedirs(t)
    generated_canvases, generated_script = generate(projects, t)

    with open(t + ".html", 'w') as f:
        f.write(html_template.replace("PLACE YOUR SHIT HERE", generated_canvases + f"<script src=\"{t}.js\"></script>"))

    with open(t + ".js", 'w') as f:
        f.write(js_template)
        f.write("\nconst commit = " + str(commits) + ";\n\n")
        f.write(generated_script)

