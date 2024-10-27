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

function generate_chart(name, data) {
    new Chart(name, {
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
        tooltips: {
          callbacks: {
            title: function(tooltipItem, data) {
              index = tooltipItem[0]['index']
              build = data['labels'][index]
              return "TC build: " + build + "\n" + "commit: " + commit[index];
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
              ticks: data['ticks']
            }],
        }
      },
      lineAtIndex: data['change_points']
    }
  );
}


const commit = ['16e72b5b53a01a1b03ff3f2fdc20653ed0d6f7e5', 'ad1a2ad3e7bc4bde7ce9fdc115d8b919cbba528d', '3171d8a4de18ca29a1c624dcffa53921965eed25', '93e68603c018af3d12361f77e3cc273bbcbb65ee', '161397e09499235d5311b3f4304c52169ab58a20', 'a9e64dcf32c2b00d0a09ac9660abacdd52dca5c9', '288952db16830497dd518f24ec2a0673b821dceb', '8e913d2de4390096e42e40a8fb89abc52c48b11f', 'c83987feaf9ef2d24dfab2e96c71c3a9ce7bf7df', '8dbd2ebaeddff82264d2dc50bc8448ef6ba92061', '759449b30425affa9e919099cfa87aa351ad9bfd', 'ec3de2c61f8fdafcc88c7d86d4951d2f817ada08', 'b657cabcde44226aad10f770440ccce80f4f8c89', '09ddcf301891344b49e1088777d48727bab89169', 'd927cf32841ec70bbfe852cb3bcacd0ef2fcdc85', 'e3653c44642ba7b53431ac88a6158c66656b9f8c', '55ba9282c335b6696c45cae17c6ac3605400fc36', '15707aa76ac4a8fdabe213c3ab9b2c05060ebdc3', '9874ce4359a7c345d82564e549e34d250d6610d6', 'a10fcb7a674eb81b571bb8d36f00b285fd8db2a0', '5e478a648f051064d1846852189493d0b6f5e658', 'cd4b475fa4b802a0afdd16f84b9da87f10baa450', '97ed9f4fa0c0fca01aa160678cce7ee205c38adc', '085efbbd6572fe6386fd1b289dd712776b6a522e', '83b177418bfd9aca1d7dcb1a5e99b3c288877bbe', 'c405ae09124c49f4cb79103363b3f8d397dc41f3', '9950ddec1d592cf9c3077b41612855f493c62063', '682e8d65abcab32a20c2dca0c5b70f834cf1af7f', '8db8b0253593cd6a5f14c6dfa09d23cde35eaeda', '28ce214f8a34dd7591961f786fdfe363ad9ea571', '46f24e93f9906d2f2b470facac2a1383b648ed4f', '31e5c4dfb9d325bd446dac60b2a65e732c4ce262', '429cb145273ad1bf7c61eb4799425d6da6683d1c', '7d614b4c7973232d53729aa32b728109ec9e6d87', '23cef10fb7615eb29b670351985b95e7ae2c9560', '219eca685356ccf2d8bace08411b1a8463b42f81', 'b7e0acda9ac738337672617afb35020608cc97a7', 'fdbe6c57bdaeac39005d8787ff185195ea91880e', '427ded49f51f10714dd5e8599818cba366a83f76', 'd12a171505670fb80d2d728a6cab004a0ee7c225', 'f517ffe1b4d537c891dc523691086c772630d6c3', '542eb22d3c5d9a03c09dd8c46adff7c1ce12a88a', 'c70d0363bf1cc139b5106573139490b66bb3b49b', 'ff47342746a8b1864cb797df32dbed1d0e6b7bd3', '689e360ec6e53fbfcab2182546fe122fc092eb2d', '293e4d992b7318781d85621d550a5ad9e53017b7', '39f2c52477b3b70a079dfb603f51606f84011b91', 'b9c67aac6ca904086aeb804658e62335aaab2d5b', 'd5b9242f6c9d71fcaab7c9a4269415d7230cf820', 'c034646005cedc0ba32e6ee9ff86eb554e13801b', '02c5c94ac247ab602cc9da876ee4d0c46f84b44d', '836ba1a369e8add127b6f92e79998ad04c7e3775', '338b03d686ad0155183139ff32d84fc8930dcf19', '5af709bf0bfaa8d54fc4e668d08af79aa7c2ceca', '87f465c556f67e1e962cad9047a62d315313951a', '7558d9ede492e32ea15c5b3a5e3f9f98efaed8c3', 'e5c709ecda753b177615517d1cef51debcbcab3f', 'f091f1f8727bace1b5695af8f25991d72499cdd6', '5612b3e57d337958b7bf13b739131297ed80ed0d', '4ac5adf6ca8a800ebc7dc8a1f5a1fbb8813051cb', '13670aafd4538fbe8ee5cd6b3fe22163a26d88e5', 'de58be2a94fe6e9d7a930b4e2c756a83967cc82c', '0afdc95b9aae399f95cd88c6afc60211b5268bef', '9f3725e3db153987de8c19ae81ad94b5a634b8d6', '60b6407d2ea81537b74250551e7f54d5e845c91b', 'bf05034d4d7363b6a3c00bfd1af457a2d1202062', '562aa3ff8d03c192426d1aa4696810701e1b1bb4', 'c9668bb50d899d31a692186b4676c34af072b49c', '2b01a76ad45f7d6c7073fd034b1aa485199a5803'];

Benchmark = fetch("./indexing/Benchmark.json").then((response) => response.json());
Benchmark.then((data) => {
  generate_chart("Benchmark.chart", data);
});

CGAL = fetch("./indexing/CGAL.json").then((response) => response.json());
CGAL.then((data) => {
  generate_chart("CGAL.chart", data);
});

CLI11 = fetch("./indexing/CLI11.json").then((response) => response.json());
CLI11.then((data) => {
  generate_chart("CLI11.chart", data);
});

Catch2 = fetch("./indexing/Catch2.json").then((response) => response.json());
Catch2.then((data) => {
  generate_chart("Catch2.chart", data);
});

GLM = fetch("./indexing/GLM.json").then((response) => response.json());
GLM.then((data) => {
  generate_chart("GLM.chart", data);
});

HinnantDate = fetch("./indexing/HinnantDate.json").then((response) => response.json());
HinnantDate.then((data) => {
  generate_chart("HinnantDate.chart", data);
});

ITK = fetch("./indexing/ITK.json").then((response) => response.json());
ITK.then((data) => {
  generate_chart("ITK.chart", data);
});

IfcReader = fetch("./indexing/IfcReader.json").then((response) => response.json());
IfcReader.then((data) => {
  generate_chart("IfcReader.chart", data);
});

LLVM = fetch("./indexing/LLVM.json").then((response) => response.json());
LLVM.then((data) => {
  generate_chart("LLVM.chart", data);
});

Range_V3 = fetch("./indexing/Range_V3.json").then((response) => response.json());
Range_V3.then((data) => {
  generate_chart("Range-V3.chart", data);
});

RapidJSON = fetch("./indexing/RapidJSON.json").then((response) => response.json());
RapidJSON.then((data) => {
  generate_chart("RapidJSON.chart", data);
});

RecastNavigation = fetch("./indexing/RecastNavigation.json").then((response) => response.json());
RecastNavigation.then((data) => {
  generate_chart("RecastNavigation.chart", data);
});

RigelEngine = fetch("./indexing/RigelEngine.json").then((response) => response.json());
RigelEngine.then((data) => {
  generate_chart("RigelEngine.chart", data);
});

SEAL = fetch("./indexing/SEAL.json").then((response) => response.json());
SEAL.then((data) => {
  generate_chart("SEAL.chart", data);
});

Sprout = fetch("./indexing/Sprout.json").then((response) => response.json());
Sprout.then((data) => {
  generate_chart("Sprout.chart", data);
});

UnitTestCpp = fetch("./indexing/UnitTestCpp.json").then((response) => response.json());
UnitTestCpp.then((data) => {
  generate_chart("UnitTestCpp.chart", data);
});

UnrealEngine = fetch("./indexing/UnrealEngine.json").then((response) => response.json());
UnrealEngine.then((data) => {
  generate_chart("UnrealEngine.chart", data);
});

VTK = fetch("./indexing/VTK.json").then((response) => response.json());
VTK.then((data) => {
  generate_chart("VTK.chart", data);
});

baseline_project = fetch("./indexing/baseline_project.json").then((response) => response.json());
baseline_project.then((data) => {
  generate_chart("baseline-project.chart", data);
});

fmtlib = fetch("./indexing/fmtlib.json").then((response) => response.json());
fmtlib.then((data) => {
  generate_chart("fmtlib.chart", data);
});

glslang = fetch("./indexing/glslang.json").then((response) => response.json());
glslang.then((data) => {
  generate_chart("glslang.chart", data);
});

ninja = fetch("./indexing/ninja.json").then((response) => response.json());
ninja.then((data) => {
  generate_chart("ninja.chart", data);
});

rocksdb = fetch("./indexing/rocksdb.json").then((response) => response.json());
rocksdb.then((data) => {
  generate_chart("rocksdb.chart", data);
});

spdlog = fetch("./indexing/spdlog.json").then((response) => response.json());
spdlog.then((data) => {
  generate_chart("spdlog.chart", data);
});

xgboost = fetch("./indexing/xgboost.json").then((response) => response.json());
xgboost.then((data) => {
  generate_chart("xgboost.chart", data);
});

rpp = fetch("./indexing/rpp.json").then((response) => response.json());
rpp.then((data) => {
  generate_chart("rpp.chart", data);
});

ReactivePlusPlus = fetch("./indexing/ReactivePlusPlus.json").then((response) => response.json());
ReactivePlusPlus.then((data) => {
  generate_chart("ReactivePlusPlus.chart", data);
});

