const commit = {str(commits)};

const date = {str(build_date)};

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

let activeChart = null;

function generate_chart(name, data) {
    if (activeChart) {
      activeChart.destroy();
    }
    var checkBox = document.getElementById("yscale");
    ticks = checkBox.checked ? { 'beginAtZero': true } : data['ticks'];
    const chart = new Chart(name, {
      type: "line",
      data: {
        labels: data['labels'],
        datasets: [{
          fill: false,
          lineTension: 0,
          backgroundColor: "rgba(0,0,255,1)",
          borderColor: "rgba(0,0,0,0)",
          data: data['times']
        }]
      },
      options: {
        legend: {display: false},
        interaction: {
          mode: 'nearest',
        },            
        onClick: (e) => {
          const canvasPosition = Chart.helpers.getRelativePosition(e, chart);
          const index = chart.scales['x-axis-0'].getValueForPixel(canvasPosition.x);
          build = data['labels'][index]
          var text = "TC build: " + build + "\n" + "commit: " + commit[build];
          console.log(text);
          navigator.clipboard.writeText(text);
        },        
        tooltips: {
          callbacks: {
            title: function(tooltipItem, data) {
              index = tooltipItem[0]['index']
              build = data['labels'][index]
              message = "TC build: " + build + "\n" + "commit: " + commit[build];
              if (build in date) {
                message += "\n" + "date: " + date[build]
              }
              return message;
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
              ticks: ticks
            }],
        }
      },
      lineAtIndex: data['change_points']
    }
  );
  activeChart = chart;
}

// Groups consecutive equal labels into per-build index ranges, since each
// build can have multiple data points (repeated runs).
function computeBuildRanges(labels) {
  const ranges = [];
  for (let i = 0; i < labels.length; i++) {
    if (ranges.length === 0 || ranges[ranges.length - 1].label !== labels[i]) {
      ranges.push({ label: labels[i], start: i, end: i });
    } else {
      ranges[ranges.length - 1].end = i;
    }
  }
  return ranges;
}

function sliceData(fullData, buildRanges, fromBuildIndex, toBuildIndex) {
  const startIndex = buildRanges[fromBuildIndex].start;
  const endIndex = buildRanges[toBuildIndex].end;

  const times = fullData['times'].slice(startIndex, endIndex + 1);
  const min = Math.min(...times);
  const max = Math.max(...times);
  const padding = (max - min) * 0.1 || 1;

  return {
    labels: fullData['labels'].slice(startIndex, endIndex + 1),
    times: times,
    change_points: fullData['change_points']
      .filter((cp) => cp >= startIndex && cp <= endIndex)
      .map((cp) => cp - startIndex),
    ticks: { min: min - padding, max: max + padding }
  };
}

function updateSliderFill() {
  const rangeMin = document.getElementById('rangeMin');
  const rangeMax = document.getElementById('rangeMax');
  const fill = document.getElementById('rangeFill');

  const sliderMax = parseInt(rangeMin.max, 10);
  const lo = Math.min(parseInt(rangeMin.value, 10), parseInt(rangeMax.value, 10));
  const hi = Math.max(parseInt(rangeMin.value, 10), parseInt(rangeMax.value, 10));

  fill.style.left = (sliderMax === 0 ? 0 : (lo / sliderMax) * 100) + '%';
  fill.style.right = (sliderMax === 0 ? 0 : 100 - (hi / sliderMax) * 100) + '%';
}

// Reads the "range" URL param (format: "<fromBuild>-<toBuild>") and resolves
// it to build indices. Falls back to the full range when absent or invalid.
function readRangeFromUrl() {
  const rangeParam = new URLSearchParams(window.location.search).get('range');
  if (rangeParam) {
    const parts = rangeParam.split('-');
    if (parts.length === 2) {
      const fromIndex = buildRanges.findIndex((r) => r.label === parts[0]);
      const toIndex = buildRanges.findIndex((r) => r.label === parts[1]);
      if (fromIndex !== -1 && toIndex !== -1) {
        return [Math.min(fromIndex, toIndex), Math.max(fromIndex, toIndex)];
      }
    }
  }
  return [0, buildRanges.length - 1];
}

// Absence of the "range" param means "all builds", so a full-range selection
// is represented by removing the param rather than writing it out explicitly.
function writeRangeToUrl(fromBuildIndex, toBuildIndex) {
  const url = new URL(window.location.href);
  if (fromBuildIndex === 0 && toBuildIndex === buildRanges.length - 1) {
    url.searchParams.delete('range');
  } else {
    url.searchParams.set('range', buildRanges[fromBuildIndex].label + '-' + buildRanges[toBuildIndex].label);
  }
  window.history.replaceState(null, '', url.toString());
}

function onRangeChange() {
  const rangeMin = document.getElementById('rangeMin');
  const rangeMax = document.getElementById('rangeMax');

  let fromBuildIndex = parseInt(rangeMin.value, 10);
  let toBuildIndex = parseInt(rangeMax.value, 10);
  if (fromBuildIndex > toBuildIndex) {
    [fromBuildIndex, toBuildIndex] = [toBuildIndex, fromBuildIndex];
  }

  document.getElementById('rangeMinLabel').textContent = buildRanges[fromBuildIndex].label;
  document.getElementById('rangeMaxLabel').textContent = buildRanges[toBuildIndex].label;

  updateSliderFill();
  writeRangeToUrl(fromBuildIndex, toBuildIndex);
  generate_chart('chart', sliceData(fullData, buildRanges, fromBuildIndex, toBuildIndex));
}

// Keep whichever thumb the user is dragging above the other one, since the
// two range inputs are stacked on top of each other to look like one slider.
document.getElementById('rangeMin').addEventListener('pointerdown', () => {
  document.getElementById('rangeMin').style.zIndex = 3;
  document.getElementById('rangeMax').style.zIndex = 2;
});
document.getElementById('rangeMax').addEventListener('pointerdown', () => {
  document.getElementById('rangeMax').style.zIndex = 3;
  document.getElementById('rangeMin').style.zIndex = 2;
});

let fullData = null;
let buildRanges = null;

raw_data = fetch("CLI11.json").then((response) => response.json());


raw_data.then((data) => {
  fullData = data;
  buildRanges = computeBuildRanges(data['labels']);

  const rangeMin = document.getElementById('rangeMin');
  const rangeMax = document.getElementById('rangeMax');
  rangeMin.min = rangeMax.min = 0;
  rangeMin.max = rangeMax.max = buildRanges.length - 1;

  const [fromBuildIndex, toBuildIndex] = readRangeFromUrl();
  rangeMin.value = fromBuildIndex;
  rangeMax.value = toBuildIndex;
  document.getElementById('rangeMinLabel').textContent = buildRanges[fromBuildIndex].label;
  document.getElementById('rangeMaxLabel').textContent = buildRanges[toBuildIndex].label;
  updateSliderFill();

  generate_chart('chart', sliceData(fullData, buildRanges, fromBuildIndex, toBuildIndex));
});
