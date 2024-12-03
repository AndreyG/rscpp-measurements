import os
import sys
import toml
import json
import smtplib
from email.mime.text import MIMEText
from signal_processing_algorithms.energy_statistics import energy_statistics
from signal_processing_algorithms.determinism import deterministic_numpy_random

assert len(sys.argv) == 4
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
                time = config['all-measurements']
                time.append(config['warmup-time'])
                best = config['best-result']

            for m in time:
                if (m - best) / best > 0.01:
                    continue

                projects[project][t].append((build, m))


for build in sorted(os.listdir(input_dir)):
    if build == ".git" or build == ".github" or build == "scripts":
        continue

    process_build(build)


def find_change_points(times, builds):
    if len(times) < 3:
        return []
        
    with deterministic_numpy_random(31415):
        stat_results = sorted(energy_statistics.e_divisive(times, pvalue=0.1, permutations=100))

    filtered = []
    for cp in stat_results:
        if builds[cp] == builds[cp - 1]:
            continue # ignore "change points" from the same build

        before = times[cp - 1]
        after = times[cp]
        if abs(before - after) / min(before, after) < 0.01:
            continue # ignore "change points" when the value changed less than 1%

        filtered.append(cp)

    return filtered


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

        change_points = find_change_points(times, builds)

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


regression = 'regression'
speedup = 'speedup'

def generate_report():
    report = {regression: [], speedup: []}

    for project_name, data in projects.items():
        for t, measurements in data.items():
            builds = []
            times = []
            for build, time in measurements:
                builds.append(build)
                times.append(time)

            curr_change_points = find_change_points(times, builds)
            prev_change_points = find_change_points(times[:-1], builds[:-1])

            if len(curr_change_points) > len(prev_change_points) \
                    and set(prev_change_points).issubset(set(curr_change_points)) \
                    and not curr_change_points[len(curr_change_points) - 1] in prev_change_points:
                build_id = curr_change_points[len(curr_change_points)-1]

                kind = regression if times[build_id] > times[build_id - 1] else speedup
                report[kind].append((project_name, t, build_id))

    return report


report = generate_report()


def generate_message_body():
    result = None
    for kind in [regression, speedup]:
        changes = report[kind]
        if not changes:
            continue

        if result:
            result += "\n"
        else:
            result = ""

        result += "The following projects contain " + kind + ":\n"
        for project_name, t, build_id in changes:
            measurements = projects[project_name][t]
            builds = []
            for build, time in measurements:
                builds.append(build)

            result += f"  {project_name} in build {builds[build_id]}\n"
            result += f"  commit sequence: {commits[builds[build_id - 1]]}..{commits[builds[build_id]]}\n"
            result += f"  see https://andreyg.github.io/rscpp-measurements/{t}.html#{project_name}\n\n"

    return result

if report[regression] or report[speedup]:
    email = sys.argv[2]
    password = sys.argv[3]
    msg = MIMEText(generate_message_body())
    msg['Subject'] = "Performance Report from GH Action"
    msg['From'] = email
    msg['To'] = email
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
        smtp_server.login(email, password)
        smtp_server.sendmail(email, email, msg.as_string())

