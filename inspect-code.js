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
              return "TC build: " + build + "\n" + "commit: " + commit[build];
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
}


const commit = {'544503405': '16e72b5b53a01a1b03ff3f2fdc20653ed0d6f7e5', '545148899': 'ad1a2ad3e7bc4bde7ce9fdc115d8b919cbba528d', '545838283': '3171d8a4de18ca29a1c624dcffa53921965eed25', '546400570': '93e68603c018af3d12361f77e3cc273bbcbb65ee', '546649575': '161397e09499235d5311b3f4304c52169ab58a20', '546838082': 'a9e64dcf32c2b00d0a09ac9660abacdd52dca5c9', '548202545': '288952db16830497dd518f24ec2a0673b821dceb', '548778972': '8e913d2de4390096e42e40a8fb89abc52c48b11f', '549472887': 'c83987feaf9ef2d24dfab2e96c71c3a9ce7bf7df', '550221748': '8dbd2ebaeddff82264d2dc50bc8448ef6ba92061', '550396447': '759449b30425affa9e919099cfa87aa351ad9bfd', '551265680': 'ec3de2c61f8fdafcc88c7d86d4951d2f817ada08', '551911051': 'b657cabcde44226aad10f770440ccce80f4f8c89', '552556312': '09ddcf301891344b49e1088777d48727bab89169', '553033089': 'd927cf32841ec70bbfe852cb3bcacd0ef2fcdc85', '553808793': 'e3653c44642ba7b53431ac88a6158c66656b9f8c', '554021148': '55ba9282c335b6696c45cae17c6ac3605400fc36', '554208921': '15707aa76ac4a8fdabe213c3ab9b2c05060ebdc3', '554743484': '9874ce4359a7c345d82564e549e34d250d6610d6', '555537929': 'a10fcb7a674eb81b571bb8d36f00b285fd8db2a0', '556142062': '5e478a648f051064d1846852189493d0b6f5e658', '556619610': 'cd4b475fa4b802a0afdd16f84b9da87f10baa450', '557135753': '97ed9f4fa0c0fca01aa160678cce7ee205c38adc', '557329094': '085efbbd6572fe6386fd1b289dd712776b6a522e', '558073077': '83b177418bfd9aca1d7dcb1a5e99b3c288877bbe', '558689625': 'c405ae09124c49f4cb79103363b3f8d397dc41f3', '559310269': '9950ddec1d592cf9c3077b41612855f493c62063', '559903192': '682e8d65abcab32a20c2dca0c5b70f834cf1af7f', '560547199': '8db8b0253593cd6a5f14c6dfa09d23cde35eaeda', '560793553': '28ce214f8a34dd7591961f786fdfe363ad9ea571', '561070650': '46f24e93f9906d2f2b470facac2a1383b648ed4f', '561671429': '31e5c4dfb9d325bd446dac60b2a65e732c4ce262', '562337452': '429cb145273ad1bf7c61eb4799425d6da6683d1c', '562968554': '7d614b4c7973232d53729aa32b728109ec9e6d87', '563585837': '23cef10fb7615eb29b670351985b95e7ae2c9560', '564414046': '219eca685356ccf2d8bace08411b1a8463b42f81', '564677440': 'b7e0acda9ac738337672617afb35020608cc97a7', '565289495': 'fdbe6c57bdaeac39005d8787ff185195ea91880e', '570358146': '427ded49f51f10714dd5e8599818cba366a83f76', '570556302': 'd12a171505670fb80d2d728a6cab004a0ee7c225', '571372730': 'f517ffe1b4d537c891dc523691086c772630d6c3', '571915685': '542eb22d3c5d9a03c09dd8c46adff7c1ce12a88a', '572561120': 'c70d0363bf1cc139b5106573139490b66bb3b49b', '573103220': 'ff47342746a8b1864cb797df32dbed1d0e6b7bd3', '573758928': '689e360ec6e53fbfcab2182546fe122fc092eb2d', '574303932': '293e4d992b7318781d85621d550a5ad9e53017b7', '578601377': '39f2c52477b3b70a079dfb603f51606f84011b91', '578874866': 'b9c67aac6ca904086aeb804658e62335aaab2d5b', '579051810': 'd5b9242f6c9d71fcaab7c9a4269415d7230cf820', '579657382': 'c034646005cedc0ba32e6ee9ff86eb554e13801b', '580192806': '02c5c94ac247ab602cc9da876ee4d0c46f84b44d', '580863005': '836ba1a369e8add127b6f92e79998ad04c7e3775', '581359151': '338b03d686ad0155183139ff32d84fc8930dcf19', '581943154': '5af709bf0bfaa8d54fc4e668d08af79aa7c2ceca', '584370678': '87f465c556f67e1e962cad9047a62d315313951a', '584997426': '7558d9ede492e32ea15c5b3a5e3f9f98efaed8c3', '585963298': 'e5c709ecda753b177615517d1cef51debcbcab3f', '586193036': 'f091f1f8727bace1b5695af8f25991d72499cdd6', '586693883': '5612b3e57d337958b7bf13b739131297ed80ed0d', '587574044': '4ac5adf6ca8a800ebc7dc8a1f5a1fbb8813051cb', '588263594': '13670aafd4538fbe8ee5cd6b3fe22163a26d88e5', '588858722': 'de58be2a94fe6e9d7a930b4e2c756a83967cc82c', '589471035': '0afdc95b9aae399f95cd88c6afc60211b5268bef', '589835962': '9f3725e3db153987de8c19ae81ad94b5a634b8d6', '591464134': '60b6407d2ea81537b74250551e7f54d5e845c91b', '592107784': 'bf05034d4d7363b6a3c00bfd1af457a2d1202062', '592823104': '562aa3ff8d03c192426d1aa4696810701e1b1bb4', '593496011': 'c9668bb50d899d31a692186b4676c34af072b49c', '593846135': '2b01a76ad45f7d6c7073fd034b1aa485199a5803', '594788165': '8cdfd6de2346a7e8e7552c59bb620e956b4a6738', '595021453': 'dcf984e00b0c14e358fc2c7843cba581cefe83fb', '595426753': '333eef5915eba27961dd58c571f72d026cc0e438', '595758756': 'ac4728b418473f16addd1c26094df650cfe715ad', '596151745': 'a1aa4a68c6657fc360f9a9df449fbdf68ae10dda', '596413067': '49bcd1ce2afc1ccb23bf956afe8bed3ec56a80c6', '596770705': '78b8f5ba9c61db45aebd135f8ab0ad0115984e7d', '597626483': 'fd208010df4f35d02d23588796cfd2d10429fc3f', '597742146': 'f7d15f82edc5ccbcac5d2991ddf31d635a631669', '598010555': 'af9be873a3f09cad33da8df045ed0eb35a69365a', '598432282': '320c1ddea9fde8743a046c9611f69b28167d4adf', '598714316': '0bac5f007c200367adfa930f9c3c539672a23a29', '599110939': '2893fc788f338337297b86f61ce18380ae0f769e', '599397501': 'c086b08767b8525be4e06421b71f1754f4019e01', '599813902': '3ebbc09e73aac4dafe932f3f6d4c6ed3aae0bb74', '600207221': 'ab1d6e2022d5fe461194a93d9c3e4e3d6be92ecf', '600520498': '637b25b5327ba63fbbb12bb1d18bce25df5d15e5', '600796309': '17c03a2b67424e15ef92eaf6e9d5b1c4b30693b3', '601145199': '7e78bf34805c54e1e10c0ff90b8c29f1481ad49e', '601284597': '43ab3efc09d2ddca50a3d7922403c37be60af0b0', '601399602': '129447a44ff2692353394fa5e68a92a4d9e6510d', '601459516': 'ea72389af4738629ff0593b9d6058d2247d50a70', '601648634': '08ca243366b12919a637fe639b76cb5f4702eb42', '601892444': 'af338891a79a5e1d3ac9b7d79c47bc10fabc6432', '602538352': '036574c80f6f3d93b1eac95397769e40d531a4de', '602934464': '7ef7dd78b167c08da747a3c97ff49f8fc35b2aa9', '603228019': 'd750de805b19a3fd1cdff799a98ff46cc5467552', '603561297': '34f57a5a9a49ef121b80d5069f0459cf1ab83ba1', '603770046': '7c25a1ecfe8c0a1a2daa1ad4a1b85333aa307e74', '604125606': '7e0b4587c49fe7668332cdeef7289c8b4cc70472', '604389545': '101d0a82c65e6c4183b1f244561c1c0e3167fbe8', '604695787': '8f22e9609c839652eb2df9e50b526768579cb14e', '604780738': '20f29020510f3aa3af776f557e46e1016531358e', '604946072': '4307c8ae551f82e8059e09713b145b49242704dc', '605002194': '8547e87fe4459b2ca68c5a3ce4ecb2280b1f147d', '605178569': 'c1f0fe81bd04d154e73d6a9aa5de994a322df835', '605438941': 'b4d6608a6fdf000c566a5b469f003acb957faa19', '605837118': '50b96db475c02ddb4175c93e88a108c270d91d9b', '606255724': 'fd76f489c0199861a89939be074fc732ce8cc8f3', '606793780': 'd0605f3b2a4e7a2bc5012c280516cb164b3d279d', '606951186': '9729f5e37e97f43980966dad79b7e1202568ee24', '607455278': 'ae5ad21d1b7f192f34be17df1dddb8d38a471ac4', '607719210': '9e185b7c00542c37a26d0393f5beb2a7a928f9ff', '608386909': '4e378cedd0b5e81c5fdd39f80048a8cd57e273a2', '608572406': 'a9d60260f27f33c54e4e412ff7f00b984b1bb0ba', '608663057': '11abc148feed57d2557568cf724d5c433e5d5546', '608833424': 'b0f24ca22280ecbc82227999ed183bd53adeb580', '608952277': '1ffcd7e0b8526d5e72884dc980850f24c2699a01', '610321339': '218d9653aef5cf9d317f8511ba123fd1a1b718fa', '610617446': 'df898591b5eb0c4df85839a6d51eff2fb269dcce', '610944031': 'ac49bf19601355f57d02652fc9109df58c68bccf', '611278235': '514907fd1d212dea3e78f914faabc8bc79136f79', '612893019': '874ce6ff67553cb4abcfba3ee2dcc66bdff0e86f', '613525669': '177a0fb156333fe70271d4ec0ebba30e106ff32c', '614153275': '1e5edf4856908132774143cfd385020d03da0c73', '614866252': '011a4dc8af300a7aaaaf25dc477b86885db78103', '615605133': '23c04605e0268be68c90f01d2a46e705e3d8e930', '615961264': '5b8197e200c0be415d907d5e062e1339a5c5c38f', '617750507': '9688767da8395ce3a7b7b148272cb28a83a1f4f5', '621901070': 'dfa30985fcaf38831f53b10df4ea6a82b9401033', '624515634': '4556dd7e97f193a77d904fec95e5b1ee1945d8aa', '625640392': '25470140bd844f255352c690232149e76c334da9', '627535031': 'edc5e4c6e60acca2471e30b73e9799bce2111290', '636836257': '26f0890bb44038d18c572e1cdb7462e6dcea3d7f', '641503729': '60b38117cfbe5a3198a9d8b44de135a2ec09e944', '644354630': 'cde53dc8d7cd6f3fff8b0788c3c18e11365140b6', '646546008': '1ef79cc759bbb4d1397b62f91e65a04162f72f11', '647838215': '471694c62cec2c157ad0bc7d6652b9d30887f65f', '649960615': 'e5f895b4d6241fd4a15fa62e2ab764f9a4e3860a', '653993164': '95de221b9a2ecee915688b21fd599db2a394946b', '654743938': 'e222952e377d00a34760bd2074a7697cc4e6b2d9', '656200121': '70da9dc5d4addf39e3a6d5d5f0e70838cd2664ea', '658316784': 'f2142fa8049e823f26e1425bc80f2026e1d25f33', '659044296': 'b802f331e674234700fe04c9f0e5b4c87ecf4cca', '660432631': 'fb8601286f817265c9b0fc33244a2886aad5c855', '661835400': 'ab9179bb011d6e2916b25b40894a9ef225428369', '664494758': '635ff8cad8f8f7a2a394950635a7c84eea11cce6', '665273443': 'fac2657c01b310fd99e20e8653b9700b805db247', '665619201': '865d00017e348378ea44560d768792394f72ba48', '665889805': '84c0bf12e6a515ea53abe9a145bb0c5537ea7f93', '666439638': '2d0c5f750ec36b5faec4266b4506204cb326254c', '667612159': '067ea6e8c77f1df5cc2b91c5984ae2ef9a9cdcee', '676875421': 'c26465c17542f9bc0b1a04e784bed03089304e44', '677609178': '5cdb7b2eaf95adc503aeba3abd1f1f3a9873eb96', '677882822': '7590d10c1104d3f6d35a2cfeb21f2aaee16e7f3d', '678199084': 'b6bf5ee708a3ec370f03d269d2f04e231eb5dad2', '678983066': '90cbdc731ad78c839e7752ec7587232b9abcef12', '679808642': '9b04e0c4def2265652d135997737f4025386f979', '680430381': '33f709246310c45b178dd0064ca014a213cdcaf9', '682816202': 'dd40e15d05a9d62477c1a8c7c93238d1156eef17', '683643321': 'cce250836a5c738c8cfe4fbdf6ca415069392508', '684359974': 'f092bc6669686617ff4ed73fa0592344aab8e222', '685084586': '539d10dc55a5fb5e8435652346dbe19b2a24e813', '685781875': '40685dc05102477d7055f5c508a7bef71686a783', '686068195': '63890d7c0ecb921823c3d3e8eeffb5d871fefc6c', '686246867': 'd66da3569c50ee78167a4a73010e8a02a4880a6a', '686420726': '8ed0567c3b69f6b48f78dbae1333de1bc0208186', '686707341': '709674d3765046528c6e959978c018bb4fbcd4ca', '687475565': '025fcfc97fedce0ba39238e41928b452b07872f4', '688294602': '2bff500dba5be1ce9c9297723f6fb2ebe39a3f86', '689038228': 'f20c0cd58347d6bb99b965c821069fbeee222b2d', '694063335': 'd632dde49e2b69ba955255392515531cb41fe143', '694724959': 'f1d413866ee308701212aadc08abfb86bfb456c9', '697657021': '99bbb62a09db6cca3e24bf63a41313de2b626c50', '697845972': '38a6b927492c80054b8866c0b290e9b8d06ea8db', '709197643': 'e6ec3a4b94cc17e79bae92b94b83a6caae396b84', '709697201': '8447c2d67f15169df15eb2bbf8f03f4d0bbe6204', '710455374': '73a7ff9151117a8171fe926c4385f22ef97a60d8', '710725479': '50e5f9dad2dc4360ae315c409de36e5ef091e443', '711046145': '377e88566047bc1cc280b21ba4ca9f25f0fcd6b3', '711875211': 'a3779a78cf541776d9cbc5cfbec905a70db31b5e', '713022850': '943091955dfc5f6085d9bcc6e3dba0cdebe0cbeb', '713733923': '2e496c0ce786b155f79941ead23cec50491771f7', '715155759': '858903468b05dd258fd3db0ec987b69c5e1180cf', '715522561': '089c87d8c73a229fd2f31a4a9c46b21e3cda6791', '719116496': '4f3528384b01151a6ae5d05c9137c36fbeb61f11', '719491810': 'fd61d15297bb5d6bbf3b5b4c63f139f1eac4826b', '719751966': '7652ef67fa42ac192caaa22efdb0770e2e1f1542', '722868768': '6cac89f7540c71af9b038742e4966e56bf0ad437', '723630202': 'a6d2cf9a14f58ea3e6bffe5ffc70e2de26670a91', '723938253': 'a4511644a29d37f1a0e785fdc7da21e5e1755b84', '724207049': '84787991dceccc0ae571f1751a2c8fa7c6bcc75c', '726026770': 'f535f6aab16cfe60d4eefb122b025c980515b24e', '726850402': '6b962d2c0aa3eb8d9b59315e598fafd057bf286e', '727761689': '120c0e0b30695c5e4193147283b9003dbd0257b8', '728722546': '6908e65e5f7e9a97cfe8622a082a0e49ba481bb8', '729030051': 'dbb845d69aef9215c63577b316e95ff98e4b21df', '729821397': '8b68558206017503fad07a55f0e3505ba3f73da9', '730889896': '8b2fdd36e616ed8b1e7d4f54b6443dcf42f69f59', '730967331': '710883d9fc85f1b2f8cffdae0e729b0f99a0c0b2', '731793112': '0f0d51fec39b588b6e26fbad5ba21e1bde95aef9', '733585689': 'df2135c01bcdfc1b679c5925ce886102ade0b8f0', '733898123': 'a3cdceea87f3c05301317e2900eeefb4c18e699c', '734100153': 'a418b503a81e799f1c4cc9fb4513db0965ca022e', '734998269': 'bc6775a487a48aae21b4086c5017cd26b0654007', '735871737': '5cb7139a2d3b7d88fde4b3a7fb44d5e00e0c77ee', '736824700': '4437dbb81525b629aab1dbb781c9c7937b17ffc9', '737655272': '6c13d6800aec2ee999167d9bf7cf93608e8c6265', '738458346': 'a63930a41146c2365f6b44edc2669596bc6c717b', '738717620': 'b338fc73dd290e3798976346ff1ec15af485936f', '739063684': '985097fe17c6976e9b02af87a72c86352ae28597', '739968146': 'b94bea92de55e96b5f89cdb20f7a20e9d1d09293', '742501142': '9014d8ff545fefaba3a123edf91b3b0a5e2a8051', '743169372': 'ecab978d05c9bccf625e47b1c89b340002b69fa1', '743468430': '89ae80f48f32c08ea887d5469f24b69dae0a6cea', '743687848': 'a60644edf99931418185e9ae5035464bc5ecc387', '744453830': '308b01aac3664163bae0738e09cf261931cf1076', '745014694': '9dbe2fe9cd493c88ccb1770ae49e6a1ef4a9812c', '745977033': 'a4292cbc05ad6ac0f4533001ebf60c4e92e8ab94', '746732594': '6f0121cb026baef9b10693f2a4c4356d907b310b', '747442446': '8c23e683163fdeda0b177ea95f877ff957736ba1', '747709680': 'e1b1ec8a32139cba31ab5d86bc7a19b4f28cd68d', '747985938': 'c23ee3381eb5d0f340e06eea24e86c1cd2f97d9e', '748666177': 'a23171aa0b5c45e5cd8f89451298d8507a8fbbbb', '749427293': 'faf9518615875df270ee0b95ca327e614ff8a9b0', '750068174': '9d1038c521fc9a8c39e02fa885228a50463ebd2a', '750853148': '01db42a9aa780f91c550495ffab6a3eefbfd27ce', '751501635': 'ac0ebeffe3babc03e1a62361da9f050659e6c9f0', '751765530': '15891be54802cad24df228d5125add8711495ed0', '752060916': '07541c076a0a2abfce36d6f972e2ace2cbed93a8', '752864421': 'cdc1b1278e2e87c88fe485779023511e00e74957', '753553292': '1116745937361289e57a6ef55d4d20f84c257659', '754252942': '7727551919e32a89af7c8df52351c5b4dfc40b66', '755029466': 'd948e4a73112dbc33bb7999bba3e93087ac8abd6', '755806417': '69d099e95a15e0a18ba6daa13fd73b1a5d71af28', '756169512': 'd84e1d42d31f6101275722f48897dfbd48c67f94', '756462246': '5a67d6bcfbb0e14fe940028c53265d532e48f784', '757135722': '224ed0abde298103a22fc780da4b38b0ec93d451', '757924717': 'b63706bacdf18c5f50edcdc3e9c3fea32f3cb732', '758753663': '86a06a61bde6fefdadf7671635f7485f1ff3039d', '759544453': '099f65586bca489712e008e327b0b71432d83dc8', '760185517': '2ceefc61908b831e35d25bfdbc5ae8eeba9f219d', '760453350': '4cc9c854aa4024bcc3158486a676db203c3eace0', '760690723': 'f0e84830384cc3570908cb04468f9ec6bb02cae4', '761454902': '9e332372b90baf885641ecdbd3b5f7cb1efeba53', '762152570': 'ff4d7057e2dff62570c9435b9371dbe124d236b6', '764459619': '740bc4a2fe48ff1e10ef81b04b608c5d16878361', '764761162': '55d81ded710aac17121d129de4fbd1c1d26a0293', '765006044': 'f29cf7b731ad49ae892ea8e551d3026d57b843c5', '765770185': '013d2091ebe3207054c952cf4388c0803a590626', '766621818': '54485e991cd6c9b89a1d204bee7256e7167a5756', '767316276': '85b8cace9ffae38e12de6b4b37abf47e5abd3936', '767968900': '3f99a06b26deb1b17ae67b8cc208b64ad545eb5a', '768575324': '6bfd8424eeb3332d54e55aa1780c74d5cfbb2bfe', '768975969': '9d733cb953dc77571a7932683ad2433b8b31d81d', '769309108': '6c8f4df98764cba06991c89382d7e8273b3f6ad0', '770042710': 'e7515bdd342ede56522de2307220846c8fa64ff0', '770771246': '135f21d63196d63cefc5a0b5520995d8aa3c7184', '771678404': '2835238943e4bc7f643bbac3593dd51915292503', '772469188': '50803aea73f8b8a937b7ce9e31d611e147807a82', '773208562': '0482151b4ec5f38009531dc52a8c6e75b0678ff0', '773812831': '56973bc15ef1a96049f892ea072c08db8c17a29d', '774551295': 'ad5889ef8c46ee712d668aab216ce0ab85a3908f', '775509337': 'ff223500f251f11ea07f9de730e56fe569d6d5b9', '776176326': 'bd4e0dc0af4877db85dce858c92ae9cff1f6ae28', '777008313': '4f198da1fdbd42ad611f0fb7578bd0a538336625', '777677386': 'fd5b1faab60ca96044ee85c438787d069679c5d2', '778038455': '58afe647c6ea2a1027048552a1919a75e6791d9a', '778289410': 'f92e6c2250f999a50528eeca9038bd0856890635', '779073107': 'bc5df87aebe0e7cc548069600802c05c0a9147d7', '779819489': 'f525db7f255c22c95a7cec212c2647b387758fe3', '780629977': '61dccd10424c968ee0491336dbbc7fb1c771463c', '781392896': '393048b464350cd04e4556e267a8baae6063cda6', '783262822': '3f2c6ecce44457cdf55b27e116254d1b43ad85c9', '783957940': 'e4510b118566f9cf742da09e8b281000a19352ef', '784852674': '657b97095fff8cf88b2e7fb2d4742b29ad4abd98', '785598040': 'bc33a6a8f1ee06e315671a80712571925b41c538', '786205345': '838a28194942fbcdec264126ffa7799e667c28ae', '786504363': '30df6936262bbf5ede10eb07501c02eb4bb7e975', '786804099': '8dffc73586197cdecfeee60fbb1da5996ae2f998', '787580842': '4352c2daecca98b61c099d001553393adf595c31', '789213040': '97ed4947717afda15c8c0ccc165d2a4b9cf88c87', '791492648': 'b50ba78201ca7eff3cffb51eb10f1e0cc2ce0fd8', '792399666': '25bd5800cfd66ffac02c489770a5ba1d0946c282', '793261523': '148e73d73509875fd8cf55c14a5ab6498062c45c', '794829766': '6d4b5399b3a9de17fff81f252c3849636b41a872', '795668572': '7cffdee976c697e4cda209f019db396197297a36', '796137693': '5b84ca5bce58bfa853f27e10c6308a7a68aa14b7', '796554015': '7ca003d19a273ee07ddfacacb98eb4972c6d97eb', '797398455': '7ba3707d362491ddc7439fb98b3f67a172e8d8de', '798479938': '346b2e727ef4fbfc3fcf081dfb319f6c29725471', '799491427': '1c94c018c029b14514e06fb2fa2cdcdd8447f382', '800332152': '05c836cfb66374326c9eb90584be6f9f8497cc81', '801502328': '13b57216e628800a576431b2f52748dc2c7e72b9', '801999453': '14d119c7bd9596cf0db17338d4a0b616925e5b16', '802438149': 'ed759ca76e0b38088cc2351fef23484de8123952', '803348182': '9deb3d5460dadb05a1309c72776d0a11215c4872', '804467530': '87f323a7750565c4f21eeeeed8b8ce4ef06b6495', '805524704': '574c3d1fc257f694dd80c51c6b945981168d69db', '806574329': '1ffca9b102584a5628f495fa4dc685a30b392f5e', '807422385': '098c4436c5354031e791b20a8c01352a2b0278a7', '807783820': 'd192e1c6fd052196df5697675f878542535bd643', '808206727': '32d4c02ad87ba04b321812d83e133ed262651b1e', '809073893': 'b7119a6e320a36e0d842b1672edd95a10187e9e0', '809816402': 'dbd0c884f3b352b48d77a4ad6ea2ed4bb6891f8c', '810575551': 'ff2c18f8ff43eee91c23d371779a550c515c8ac6', '814364419': 'e3efc97518012189c0707c0ba758030791596590', '814928590': 'b63a50986949fb674c9dd0bfe773031085734830', '815779830': '306b135a566967b0032b24b12b91540268a3662f', '816703855': 'bbd87c72062dd9607e19a69fc18bda33794c0e48', '817771077': '8f03ec30858e11943f57730f4f742447fe143040', '818107156': '0b873094afec92584c31568766aa9913c52d47b9', '818410970': '2cdeb168a07216fbd90dfb9488808882bbed1fb0', '819164350': '5419544d85870fbeb7e819649e9870ecc542de73', '819928922': '760c95e81324fe215914f5df8b8839f621b60102', '820710021': 'd712f516b441d2f8bfabbcba80d8bc76c2b73826', '822210520': '2e33e5f727168a01eb00e1b2278a503f1fe40e1d', '822470198': '482f0559868234875f1c2b6d5a29cab17eaab553', '822843208': '2d5e1c0f16c0676a934fd0827518d51c90d150d7', '823542733': 'dd5170e1cbdded7e991f903e5eb195b438ef0d5f', '824318652': 'e2b8d7dbc20b99c666a863bb4786ec33b84b2dbc', '825068353': 'e32dd862d0663b8baf7b82926c82b0de8ec43374', '825836433': '7cd63430011a0b9b9ff62c31c44b26bc8edbd403', '828662494': '0393fcf5c010656868fab811c349046fba94fa17', '829515019': '0cb636eda8ef5deb60ff8c0d4f2afae8865a64f9', '830348431': '6eff37e489b219bf6975d01eca7ec651b6c0db80', '831171003': 'da0f6551de3904dd03e6b1574574093daf77d51b', '831473400': '258fb9e4fd04ed793d38ba5f665358ca174ce706', '831784472': '10763a9888f90494787e5521b9c7de25bd184a6a', '834300448': '535cb19d24fd702026a82cc1dd00b57c3ef5d1dd', '835113760': 'd0b483f6d0043059609e7de3a4290ff8b91345b3', '835867478': '3b1b738942ce732455c857cfed22232799413d58', '836098297': '38f7d3158a1dd30d6ca26cbef867fb88d8092279', '836364923': '36b9060230cc15dd8c77c74e475b0f6e13427ea3', '837208737': '53be30db3a5e07a2b48447d1dee6ca70330959e5', '838029747': '58c5b8459448d6ccec4ce4ba54b9c14ccca780ed', '838917856': '59f3e8f41603fe8313ec81c4b722bb79d4b039b0', '839814364': 'ccb095a6bde4272aa1bad25ef3be78475bff3bf0', '840898888': '835ce0355f0f7cee8633f7ffda33669aa77923d0', '841357969': '12804c2e9fe9463f522b1209f9190972c7271e6f', '842200903': '7006a51cb94db63a99d9311cac12a44035ae8a51', '843054886': '996d256b41876a742b65604872167df84b81960d', '843902994': 'dbaeaa02b33ac9344a4209325e4cedadd3fd4e0d', '844699108': '562f9c42b8d11e189d8189e9cfcd1642541f5d2c', '845276532': '6369a02d215cc72cd3a76e7bdb1890df85251d8d', '845604313': 'f0fa82d0e137e6a12ea60d447fce218383d7a4f6', '845921352': 'f9423e1f812bd690883e2ce0b1059b0cd2272776', '846498786': '92c729b0eaf9c64ea410260a8cdb69c7efb41a8d', '846966126': '379006d8961e058a485e81967d3e7c9e563e83c8', '847307074': '97db6b4288a123c6cd66cd2b64d540ed690fd5a1', '847561506': '7156b21d102e232f4c25ab70124f7aa5a83f5ae7', '847827947': 'a5ffa7455747cc8f0c9b90c5b1cb57343e2c5d36', '848030607': '262991681fe73a0ad46aee63fdef40a4c47d028d', '848231623': '4ca45912af15ad7cf760079ef6c9ba6452616699', '848533943': '3c6d1da975dbe625a9cd2b5b5c819556c0f01657', '848692481': 'abbf02f448c1b2589e1566a68532ddfde8deadb9', '848887659': 'eabb0027253701a43d9a99a640caec81eaa81586', '849088693': '350d9ece450e2dae0196ce2479c630170c1cb59a', '849388550': '65537797a2f522485e8333d839c91ab2ab2b778f', '849559655': '2c68d07d6488738818b4eabfbf5f5b9eb9790f4b', '849859865': '838b0aedc246cdc3908383f41dfff16985f32b5e', '850500499': '933ed1ac967a8e7691ed4e49ee28a68aced2f16f', '851060132': '05f57731790c5559117a491b065677b0740682ee', '851752719': '77b406fe2ed42590128d5811b83577e051b689c8', '852502319': '68d59197b86e48038f653b3ff2cecb2fb2a715c9', '853139388': '13e6580ca5347ca0515a250a19775c81dfdbde30', '853384204': '7bdd5338d3574a55f43c04806298bd0c1e826db6', '853689984': 'de7ec9839b851da81bffefddde67cfeda852a3ac', '854519980': 'dff493b5e5e4180961c6cda1c8b9873d99c660b8', '855305504': 'aa90e40f7d9b9189c5292c2f1d6ae44ff9cb861f', '856202093': 'd1cfd5379defce024ceba5087b61deca30ff070a', '857053277': 'e5cb0930d71f86133e0c3a4a07b6f08a4c695bbe', '857784447': '20d16d24c03eeb573629d688018a70ba5f9ecc64', '858022019': '914f11de4b91a7c4d83ca905acb9d729d99a8cae', '858340877': 'b68e6fe95f3b4950b434c3558af4a49983f45dca', '859159733': 'a8964c5a22313d015857aceccc442c7581433564', '859998023': '84927665d5b9a839ab84d9a244d54ae46ec28103', '861625665': 'e9060b503f5e5b82b9349153ab1649cc288fee87', '862374603': 'cc9b1454ee63098d5f9f49d4218465988b1fb12d', '863234228': '8b0238e5fa752aa2c70e2f39c0e04a5110d2d48d', '865058680': '4dfaf4375882be70819c87ee8ddcae30b6b08239', '865828484': 'f2a779b9c4f2af92c10fe9da810172c2e9fdb0f5', '866215140': '01ce8561648a4553f337ad0a49876d2c89a16507', '866793042': '8e11d3b3a71c30b8a8eef5a239330be704064b54', '867216247': 'b090218e7c5dcc6114623a40a207206e85915391', '868054849': '530c826c8cb078564605c13494fc9b87ae11c5f1', '868821318': 'd0da91eac78b321650fa31319ec6d4677c85f8f5', '869704999': '247054fd028e5213c06aedf635c75706268cf177', '870569213': '672eab2395d0f14d6de2b4cc7814f3985340539e', '871200223': 'bd9f05b7c17d1e1448899ee0d10d894f8ace1068', '871456414': 'd1de5ac6eae9652d7aa12b4e0d3d3edd5a24785e', '871893041': '80e3f253e33d2fa17459cef49306057cc8cfd42f', '872815257': '4be87e7e56e48eafb93739d23d2b7d8c432aa2d4', '873802330': '6e801b62afe077350a09bd2c7a811394a6cd5cc7', '874750285': '650a3fad7901b2f8ec26e0035db33847f7143fa8', '875721645': '3ee1f1f79bc2c7e9dd9e5452966372d793356b70'};

Benchmark = fetch("./inspect-code/Benchmark.json").then((response) => response.json());
Benchmark.then((data) => {
  generate_chart("Benchmark.chart", data);
});

CGAL = fetch("./inspect-code/CGAL.json").then((response) => response.json());
CGAL.then((data) => {
  generate_chart("CGAL.chart", data);
});

CLI11 = fetch("./inspect-code/CLI11.json").then((response) => response.json());
CLI11.then((data) => {
  generate_chart("CLI11.chart", data);
});

Catch2 = fetch("./inspect-code/Catch2.json").then((response) => response.json());
Catch2.then((data) => {
  generate_chart("Catch2.chart", data);
});

GLM = fetch("./inspect-code/GLM.json").then((response) => response.json());
GLM.then((data) => {
  generate_chart("GLM.chart", data);
});

HinnantDate = fetch("./inspect-code/HinnantDate.json").then((response) => response.json());
HinnantDate.then((data) => {
  generate_chart("HinnantDate.chart", data);
});

ITK = fetch("./inspect-code/ITK.json").then((response) => response.json());
ITK.then((data) => {
  generate_chart("ITK.chart", data);
});

IfcReader = fetch("./inspect-code/IfcReader.json").then((response) => response.json());
IfcReader.then((data) => {
  generate_chart("IfcReader.chart", data);
});

LLVM = fetch("./inspect-code/LLVM.json").then((response) => response.json());
LLVM.then((data) => {
  generate_chart("LLVM.chart", data);
});

Range_V3 = fetch("./inspect-code/Range_V3.json").then((response) => response.json());
Range_V3.then((data) => {
  generate_chart("Range-V3.chart", data);
});

RapidJSON = fetch("./inspect-code/RapidJSON.json").then((response) => response.json());
RapidJSON.then((data) => {
  generate_chart("RapidJSON.chart", data);
});

RecastNavigation = fetch("./inspect-code/RecastNavigation.json").then((response) => response.json());
RecastNavigation.then((data) => {
  generate_chart("RecastNavigation.chart", data);
});

RigelEngine = fetch("./inspect-code/RigelEngine.json").then((response) => response.json());
RigelEngine.then((data) => {
  generate_chart("RigelEngine.chart", data);
});

SEAL = fetch("./inspect-code/SEAL.json").then((response) => response.json());
SEAL.then((data) => {
  generate_chart("SEAL.chart", data);
});

Sprout = fetch("./inspect-code/Sprout.json").then((response) => response.json());
Sprout.then((data) => {
  generate_chart("Sprout.chart", data);
});

UnitTestCpp = fetch("./inspect-code/UnitTestCpp.json").then((response) => response.json());
UnitTestCpp.then((data) => {
  generate_chart("UnitTestCpp.chart", data);
});

VTK = fetch("./inspect-code/VTK.json").then((response) => response.json());
VTK.then((data) => {
  generate_chart("VTK.chart", data);
});

baseline_project = fetch("./inspect-code/baseline_project.json").then((response) => response.json());
baseline_project.then((data) => {
  generate_chart("baseline-project.chart", data);
});

fmtlib = fetch("./inspect-code/fmtlib.json").then((response) => response.json());
fmtlib.then((data) => {
  generate_chart("fmtlib.chart", data);
});

glslang = fetch("./inspect-code/glslang.json").then((response) => response.json());
glslang.then((data) => {
  generate_chart("glslang.chart", data);
});

ninja = fetch("./inspect-code/ninja.json").then((response) => response.json());
ninja.then((data) => {
  generate_chart("ninja.chart", data);
});

rocksdb = fetch("./inspect-code/rocksdb.json").then((response) => response.json());
rocksdb.then((data) => {
  generate_chart("rocksdb.chart", data);
});

spdlog = fetch("./inspect-code/spdlog.json").then((response) => response.json());
spdlog.then((data) => {
  generate_chart("spdlog.chart", data);
});

xgboost = fetch("./inspect-code/xgboost.json").then((response) => response.json());
xgboost.then((data) => {
  generate_chart("xgboost.chart", data);
});

rpp = fetch("./inspect-code/rpp.json").then((response) => response.json());
rpp.then((data) => {
  generate_chart("rpp.chart", data);
});

ReactivePlusPlus = fetch("./inspect-code/ReactivePlusPlus.json").then((response) => response.json());
ReactivePlusPlus.then((data) => {
  generate_chart("ReactivePlusPlus.chart", data);
});

slang = fetch("./inspect-code/slang.json").then((response) => response.json());
slang.then((data) => {
  generate_chart("slang.chart", data);
});

YourWorkbenchLib = fetch("./inspect-code/YourWorkbenchLib.json").then((response) => response.json());
YourWorkbenchLib.then((data) => {
  generate_chart("YourWorkbenchLib.chart", data);
});

PhantomCoroutines = fetch("./inspect-code/PhantomCoroutines.json").then((response) => response.json());
PhantomCoroutines.then((data) => {
  generate_chart("PhantomCoroutines.chart", data);
});

nlohmann_json = fetch("./inspect-code/nlohmann_json.json").then((response) => response.json());
nlohmann_json.then((data) => {
  generate_chart("nlohmann-json.chart", data);
});

Eigen = fetch("./inspect-code/Eigen.json").then((response) => response.json());
Eigen.then((data) => {
  generate_chart("Eigen.chart", data);
});

