import os
import sys
import toml
from signal_processing_algorithms.energy_statistics import energy_statistics

assert len(sys.argv) == 3
input_dir = sys.argv[1]
output = sys.argv[2]

projects = {}
commits = []

def process_build(build):
    build_dir = os.path.join(input_dir, build)
    for t in sorted(os.listdir(build_dir)):
        path = os.path.join(build_dir, t)
        if t == "rs-commit-id.txt":
            with open(path, 'r') as f:
                commits.append(f.read())

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
    if build == ".git" or build == ".github" or build == "docs":
        continue

    process_build(build)


def generate(projects):
    generated_canvases = ""
    generated_script = ""
    for project_name, data in projects.items():
        generated_canvases += f"<h1 class=\"report-title\" id=\"{project_name}\"><a href=\"#{project_name}\">{project_name}</a></h1>\n"
        generated_canvases += "<div class=\"report-graphs\">\n"
        for t, results in data.items():
            canvas_id = f"{project_name}.{t}"
            builds = []
            times = []
            for build, time in results:
                builds.append(build)
                times.append(time)

            change_points = sorted(energy_statistics.e_divisive(times, pvalue=0.01, permutations=100))

            generated_canvases += f"<canvas id=\"{canvas_id}\" style=\"width:100%;max-width:1000px\"></canvas>\n"
            generated_script += "new Chart(\"" + canvas_id + "\", {\n"

            generated_script += """
  type: "line",
  data: {
"""
            generated_script += "labels: " + str(builds) + ",\n"
            generated_script += """
    datasets: [{
      fill: false,
      lineTension: 0,
      backgroundColor: "rgba(0,0,255,1)",
      borderColor: "rgba(0,0,0,0)",
"""
            generated_script += f"data: {times}\n"
            generated_script += """
    }]
  },
  options: {
    legend: {display: false},
    title: {
      display: true,
"""
            generated_script += f"text: \"{t}\"\n"
            generated_script += """
    },
    tooltips: {
      callbacks: {
        title: function(tooltipItem, data) {
          index = tooltipItem[0]['index']
          build = data['labels'][index]
          return "TC build: " + build + "\\n" + "commit: " + commit[index];
        }
      }
    },
    scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'TC build'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'seconds'
          },
"""
            min_value = min(times)
            max_value = max(times)
            range = max_value - min_value
            delta = range / 5.
            generated_script += f"ticks: {{min: {min_value - delta}, max: {max_value + delta}}}\n"
            generated_script += """
        }],
    }
  },
"""
            generated_script += f"lineAtIndex: {change_points}"
            generated_script += """
});
"""    
        generated_canvases += "</div>\n\n"

    return (generated_canvases, generated_script)

generated_canvases, generated_script = generate(projects)

prolog = """
<!DOCTYPE html>
<html>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"></script>
<body>

<style>
  .report-title {
    font-size: 3rem;
    font-weight: 600;
    word-break: break-word;
    text-align: center;
  }
  .report-graphs {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
  }
</style>
"""

epilog = """
</body>
</html>
"""

verticalLinePlugin = """
const verticalLinePlugin = {
  getLinePosition: function (chart, pointIndex) {
      const meta = chart.getDatasetMeta(0); // first dataset is used to discover X coordinate of a point
      const data = meta.data;
      return data[pointIndex]._model.x;
  },
  renderVerticalLine: function (chartInstance, pointIndex) {
      const lineLeftOffset = 0.5 * (this.getLinePosition(chartInstance, pointIndex - 1) + this.getLinePosition(chartInstance, pointIndex));
      const scale = chartInstance.scales['y-axis-0'];
      const context = chartInstance.chart.ctx;

      // render vertical line
      context.beginPath();
      context.strokeStyle = '#ff0000';
      context.moveTo(lineLeftOffset, scale.top);
      context.lineTo(lineLeftOffset, scale.bottom);
      context.stroke();
  },

  afterDatasetsDraw: function (chart, easing) {
      if (chart.config.lineAtIndex) {
          chart.config.lineAtIndex.forEach(pointIndex => this.renderVerticalLine(chart, pointIndex));
      }
  }
};

Chart.plugins.register(verticalLinePlugin);
"""

html = prolog + generated_canvases + "<script>\n" + verticalLinePlugin + "\nconst commit = " + str(commits) + ";\n" + generated_script + "\n</script>" + epilog

with open(output, 'w') as f:
    f.write(html)
