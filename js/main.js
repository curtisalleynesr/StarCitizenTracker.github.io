//Defaults
(function($, List, _, moment) {
  // List.js classes to use for search elements
  var listOptions = {
    valueNames: [
      'js-promise-text',
      'js-promise-category',
      'js-promise-status'
    ]
  };

  // tooltip
  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

  // tabs
  $('#myTabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

  // Find any within a facet
  function foundAny(facets, compareItem) {
    // No facets selected, show all for this facet
    if (_.isEmpty(facets)) {
      return true;
    }
    // Otherwise, show this item if it contains any of the selected facets
    return facets.reduce(function(found, facet) {
      if (found) {
        return found;
      }
      return compareItem[facet['facet']] === facet['value'];
    }, false);
  }
  
  //Startup + Misc
  $(function() {
    // Dates
    var today = moment();
    var kickstarterended = moment('2012-11-19');
		$('#days-since-kickstarter').html(today.diff(kickstarterended, 'days') > 0 ? today.diff(kickstarterended, 'days') : 0);
		$('#years-since-kickstarter').html(today.diff(kickstarterended, 'years') > 0 ? today.diff(kickstarterended, 'years') : 0);

    //Always show tooltip on confidence-btn
    //$('#confidence-btn').tooltip('show');
    
    // Select and replace maintained by name
    var maintainers = ["SomethingAwful Goons", "Celestial Body Construction Team 09", "CryTek Legal Beagles", "Coutts & Co.", "10% for the Cayman", "Bitter EvE Goons", "Salty Asshats", "Goons stuck in checkmate", "T-posed Goons", "MY GIRLFRIEND", "The Fourth Stimpire", "WaffleImages", "COBOL Greybeards", "Blocked Buddies", "Thanks notepad", "Archive-Priests™", "Ryan Archer"]
    var maintainer = maintainers[Math.floor(Math.random() * maintainers.length)];
    $('.maintainer-name').html(maintainer);

    // List.js object that we can filter upon
    var promiseList = new List('promises', listOptions).on('updated', function(list) {
      $('#count').html(list.visibleItems.length);
    });

    var $search = $('#search');
    var $facets = $('[data-list-facet]'); // All buttons that can filter

    // Clear all
    function resetFilter(e) {
      e.preventDefault();
      // Visually reset buttons
      $facets.removeClass('active');
      // Clear out text field
      $search.val('');
      // Wipe all filters
      promiseList.search();
      promiseList.filter();
      // Wipe graph to default
      Build_and_fill_Chart();
    }

    // Hard reset all the buttons
    $('.promises__category--reset').on('click', resetFilter);

    var anchorhash = window.location.hash.substr(1);
    if (anchorhash) {
      anchorhash = _.replace(anchorhash, new RegExp("_","g")," ");
      $search.val(anchorhash.toString());
      promiseList.search(anchorhash);
      // promiseList.filter();
      // promiseList.update();
      // promiseList = new List('promises', listOptions).on('updated', function(list) {
      //   $('#count').html(list.visibleItems.length);
      // });
    }

    // Any facet filter button
    $facets.on('click', function(e) {

      var facet = $(this).data('list-facet'); // ie 'js-promise-category'
      var value = $(this).data('facet-value'); // ie 'Culture'
      var isSingle = !!$(this).data('select-single'); // ie true/false for if there can only be one of this filter

      // Single-select categories should have their active state wiped
      if (isSingle) {
        $facets
          .filter(function() { return $(this).data('list-facet') === facet; })
          .removeClass('active');
      }

      // Flag as active
      $(this).toggleClass('active');

      // Array of active
      var facets = $facets.filter('.active').map(function() {
        // return object instead with facet/value
        return {
          facet: $(this).data('list-facet'),
          value: $(this).data('facet-value'),
          isSingle: !!$(this).data('select-single')
        };
      }).get();
      
      // console.log(facets);
      //Update graph on "js-promise-status" changes
      if (facets[0].facet == "js-promise-status") {
        Build_and_fill_Chart(facets[0].value);
      }
      
      // When deselecting last, clear all filters
      if (facets.length === 0) {
        promiseList.filter();
        return; // Eject now
      }

      // Otherwise, filter on the array
      promiseList.filter(function(item) {

        var itemValues = item.values();

        // Single selects, eg "Not started"
        var single = _.filter(facets, ['isSingle', true]);
        var foundSingle = foundAny(single, itemValues);
        // Single-selection items hide if false no matter what, so eject if not found here
        if (!foundSingle) {
          return false;
        }

        // Full categories can have multiples show, list out here
        var multis = _.filter(facets, ['isSingle', false]);
        return foundAny(multis, itemValues);

      }); // promiseList.filter()

    });
  });

})(jQuery, List, _, moment);


//Chart
function Build_and_fill_Chart(para_Type) {
    if (para_Type === void 0) { para_Type = "all"; }
    var History = [
      {"Not_implemented":0,"Completed":0,"date":"2012-10-01T07:00:00.000Z"},
      {"In_alpha":2,"Not_implemented":13,"Completed":2,"date":"2012-11-01T07:00:00.000Z"},{"Not_implemented":43,"Compromised":1,"Completed":8,"In_alpha":3,"date":"2012-12-01T08:00:00.000Z"},{"Not_implemented":43,"Compromised":1,"Completed":8,"In_alpha":3,"date":"2013-01-01T08:00:00.000Z"},{"Completed":9,"Not_implemented":44,"Compromised":1,"In_alpha":3,"date":"2013-02-01T08:00:00.000Z"},{"Completed":10,"Not_implemented":45,"Compromised":1,"In_alpha":3,"date":"2013-03-01T08:00:00.000Z"},{"In_alpha":4,"Not_implemented":46,"Completed":10,"Compromised":1,"date":"2013-04-01T07:00:00.000Z"},{"Not_implemented":53,"In_alpha":4,"Completed":10,"Compromised":1,"date":"2013-05-01T07:00:00.000Z"},{"Completed":12,"Not_implemented":55,"In_alpha":4,"Compromised":1,"date":"2013-06-01T07:00:00.000Z"},{"Not_implemented":66,"In_alpha":5,"Completed":12,"Compromised":1,"date":"2013-07-01T07:00:00.000Z"},{"Not_implemented":68,"In_alpha":5,"Completed":12,"Compromised":1,"date":"2013-08-01T07:00:00.000Z"},{"Not_implemented":70,"In_alpha":5,"Completed":12,"Compromised":1,"date":"2013-09-01T07:00:00.000Z"},{"Not_implemented":73,"Completed":13,"In_alpha":5,"Compromised":1,"date":"2013-10-01T07:00:00.000Z"},{"In_alpha":6,"Not_implemented":74,"Completed":13,"Compromised":1,"date":"2013-11-01T07:00:00.000Z"},{"Not_implemented":82,"In_alpha":6,"Completed":13,"Compromised":1,"date":"2013-12-01T08:00:00.000Z"},{"Completed":18,"Not_implemented":89,"In_alpha":8,"Compromised":1,"date":"2014-01-01T08:00:00.000Z"},{"Not_implemented":112,"Completed":30,"In_alpha":12,"Compromised":2,"Broken":1,"date":"2014-02-01T08:00:00.000Z"},{"Not_implemented":132,"In_alpha":14,"Completed":33,"Compromised":2,"Broken":1,"date":"2014-03-01T08:00:00.000Z"},{"Not_implemented":162,"In_alpha":18,"Completed":35,"Compromised":2,"Broken":1,"date":"2014-04-01T07:00:00.000Z"},{"Not_implemented":186,"Completed":38,"In_alpha":23,"Compromised":2,"Broken":1,"date":"2014-05-01T07:00:00.000Z"},{"Not_implemented":212,"Compromised":3,"In_alpha":25,"Completed":38,"Broken":1,"date":"2014-06-01T07:00:00.000Z"},{"Not_implemented":244,"Completed":41,"Compromised":3,"In_alpha":25,"Broken":2,"date":"2014-07-01T07:00:00.000Z"},{"In_alpha":26,"Not_implemented":254,"Completed":42,"Compromised":3,"Broken":2,"date":"2014-08-01T07:00:00.000Z"},{"Not_implemented":272,"Completed":45,"In_alpha":27,"Compromised":3,"Broken":2,"date":"2014-09-01T07:00:00.000Z"},{"Not_implemented":274,"In_alpha":28,"Completed":46,"Compromised":3,"Broken":2,"date":"2014-10-01T07:00:00.000Z"},{"Not_implemented":276,"In_alpha":28,"Completed":46,"Compromised":3,"Broken":2,"date":"2014-11-01T07:00:00.000Z"},{"Not_implemented":289,"In_alpha":30,"Completed":47,"Compromised":4,"Broken":2,"date":"2014-12-01T08:00:00.000Z"},{"Completed":48,"Not_implemented":291,"In_alpha":30,"Compromised":4,"Broken":2,"date":"2015-01-01T08:00:00.000Z"},{"Completed":55,"Not_implemented":284,"In_alpha":30,"Compromised":4,"Broken":8,"date":"2015-02-01T08:00:00.000Z"},{"In_alpha":32,"Completed":55,"Not_implemented":284,"Compromised":4,"Broken":8,"date":"2015-03-01T08:00:00.000Z"},{"Not_implemented":287,"In_alpha":32,"Completed":55,"Compromised":4,"Broken":8,"date":"2015-04-01T07:00:00.000Z"},{"Not_implemented":288,"In_alpha":32,"Completed":55,"Compromised":4,"Broken":8,"date":"2015-05-01T07:00:00.000Z"},{"Compromised":5,"Not_implemented":288,"In_alpha":32,"Completed":55,"Broken":9,"date":"2015-06-01T07:00:00.000Z"},{"Not_implemented":292,"Compromised":5,"In_alpha":32,"Completed":55,"Broken":10,"date":"2015-07-01T07:00:00.000Z"},{"Not_implemented":291,"Compromised":5,"In_alpha":32,"Completed":55,"Broken":11,"date":"2015-08-01T07:00:00.000Z"},{"In_alpha":34,"Not_implemented":296,"Compromised":5,"Completed":55,"Broken":11,"date":"2015-09-01T07:00:00.000Z"},{"Not_implemented":316,"In_alpha":35,"Compromised":5,"Completed":55,"Broken":12,"date":"2015-10-01T07:00:00.000Z"},{"Not_implemented":321,"In_alpha":35,"Compromised":5,"Completed":55,"Broken":12,"date":"2015-11-01T07:00:00.000Z"},{"Not_implemented":324,"In_alpha":35,"Compromised":5,"Completed":55,"Broken":12,"date":"2015-12-01T08:00:00.000Z"},{"Not_implemented":326,"In_alpha":35,"Compromised":5,"Completed":55,"Broken":13,"date":"2016-01-01T08:00:00.000Z"},{"Not_implemented":325,"Completed":56,"In_alpha":35,"Compromised":5,"Broken":19,"date":"2016-02-01T08:00:00.000Z"},{"Not_implemented":333,"In_alpha":36,"Completed":56,"Compromised":5,"Broken":19,"date":"2016-03-01T08:00:00.000Z"},{"Not_implemented":343,"In_alpha":37,"Completed":56,"Compromised":5,"Broken":19,"date":"2016-04-01T07:00:00.000Z"},{"Not_implemented":345,"In_alpha":37,"Completed":56,"Compromised":5,"Broken":19,"date":"2016-05-01T07:00:00.000Z"},{"Completed":58,"Not_implemented":343,"In_alpha":37,"Compromised":5,"Broken":20,"date":"2016-06-01T07:00:00.000Z"},{"Completed":59,"Not_implemented":342,"In_alpha":37,"Compromised":5,"Broken":20,"date":"2016-07-01T07:00:00.000Z"},{"Not_implemented":343,"Completed":59,"In_alpha":37,"Compromised":5,"Broken":20,"date":"2016-08-01T07:00:00.000Z"},{"Not_implemented":360,"In_alpha":41,"Compromised":6,"Completed":59,"Broken":20,"date":"2016-09-01T07:00:00.000Z"},{"In_alpha":42,"Not_implemented":361,"Compromised":6,"Completed":59,"Broken":20,"date":"2016-10-01T07:00:00.000Z"},{"Not_implemented":363,"In_alpha":42,"Compromised":6,"Completed":59,"Broken":20,"Stagnant":3,"date":"2016-11-01T07:00:00.000Z"},{"Not_implemented":347,"In_alpha":42,"Compromised":6,"Completed":59,"Broken":21,"Stagnant":19,"date":"2016-12-01T08:00:00.000Z"},{"Not_implemented":335,"In_alpha":42,"Compromised":6,"Completed":59,"Broken":21,"Stagnant":31,"date":"2017-01-01T08:00:00.000Z"},{"Not_implemented":327,"In_alpha":42,"Compromised":6,"Completed":61,"Broken":27,"Stagnant":32,"date":"2017-02-01T08:00:00.000Z"},{"Not_implemented":329,"In_alpha":42,"Compromised":6,"Completed":61,"Broken":27,"Stagnant":32,"date":"2017-03-01T08:00:00.000Z"},{"Not_implemented":327,"In_alpha":42,"Compromised":6,"Completed":61,"Broken":28,"Stagnant":33,"date":"2017-04-01T07:00:00.000Z"},{"Not_implemented":323,"Broken":30,"In_alpha":42,"Compromised":6,"Completed":61,"Stagnant":35,"date":"2017-05-01T07:00:00.000Z"},{"Not_implemented":317,"Broken":30,"In_alpha":42,"Compromised":6,"Completed":61,"Stagnant":41,"date":"2017-06-01T07:00:00.000Z"},{"Not_implemented":307,"Broken":30,"In_alpha":42,"Compromised":6,"Completed":61,"Stagnant":51,"date":"2017-07-01T07:00:00.000Z"},{"In_alpha":43,"Broken":31,"Not_implemented":304,"Compromised":6,"Completed":62,"Stagnant":52,"date":"2017-08-01T07:00:00.000Z"},{"Not_implemented":304,"In_alpha":43,"Broken":31,"Compromised":6,"Completed":62,"Stagnant":54,"date":"2017-09-01T07:00:00.000Z"},{"Not_implemented":302,"In_alpha":43,"Broken":31,"Compromised":6,"Completed":62,"Stagnant":56,"date":"2017-10-01T07:00:00.000Z"},{"Not_implemented":295,"In_alpha":43,"Broken":32,"Completed":68,"Compromised":6,"Stagnant":58,"date":"2017-11-01T07:00:00.000Z"},{"Not_implemented":295,"In_alpha":43,"Broken":32,"Completed":69,"Compromised":6,"Stagnant":58,"date":"2017-12-01T08:00:00.000Z"},{"Not_implemented":287,"In_alpha":44,"Broken":35,"Completed":69,"Compromised":6,"Stagnant":65,"date":"2018-01-01T08:00:00.000Z"},{"Not_implemented":281,"In_alpha":44,"Broken":35,"Completed":69,"Compromised":6,"Stagnant":72,"date":"2018-02-01T08:00:00.000Z"},{"Not_implemented":257,"In_alpha":44,"Broken":38,"Completed":69,"Compromised":6,"Stagnant":94,"date":"2018-03-01T08:00:00.000Z"},{"Not_implemented":245,"In_alpha":44,"Broken":38,"Completed":69,"Compromised":6,"Stagnant":114,"date":"2018-04-01T07:00:00.000Z"},{"Not_implemented":221,"In_alpha":44,"Broken":38,"Completed":69,"Compromised":6,"Stagnant":141,"date":"2018-05-01T07:00:00.000Z"},{"Not_implemented":198,"In_alpha":44,"Broken":38,"Completed":69,"Compromised":6,"Stagnant":164,"date":"2018-06-01T07:00:00.000Z"},{"Not_implemented":174,"In_alpha":44,"Broken":38,"Completed":69,"Compromised":6,"Stagnant":188,"date":"2018-07-01T07:00:00.000Z"},{"Not_implemented":144,"In_alpha":44,"Broken":39,"Completed":69,"Compromised":6,"Stagnant":218,"date":"2018-08-01T07:00:00.000Z"},{"In_alpha":45,"Not_implemented":138,"Broken":39,"Completed":69,"Compromised":6,"Stagnant":226,"date":"2018-09-01T07:00:00.000Z"},{"In_alpha":46,"Not_implemented":120,"Broken":39,"Completed":69,"Compromised":6,"Stagnant":244,"date":"2018-10-01T07:00:00.000Z"},{"Not_implemented":124,"In_alpha":46,"Broken":39,"Completed":69,"Compromised":6,"Stagnant":245,"date":"2018-11-01T07:00:00.000Z"},{"Not_implemented":120,"Completed":70,"In_alpha":46,"Broken":39,"Compromised":6,"Stagnant":249,"date":"2018-12-01T08:00:00.000Z"},{"Not_implemented":114,"Completed":70,"In_alpha":46,"Broken":39,"Compromised":6,"Stagnant":257,"date":"2019-01-01T08:00:00.000Z"},{"Not_implemented":113,"Completed":70,"In_alpha":46,"Broken":39,"Compromised":6,"Stagnant":259,"date":"2019-02-01T08:00:00.000Z"}
    ]; 
    var brokenArray = [], stagnantArray = [], notimplementedArray = [], inalphaArray = [], compromisedArray = [], completedArray = [], labels = [];
    //build data arrays
    for (var _i = 0, History_1 = History; _i < History_1.length; _i++) {
        var month = History_1[_i];
        switch (para_Type) {
            default:
                brokenArray.push(month.Broken);
                stagnantArray.push(month.Stagnant);
                notimplementedArray.push(month.Not_implemented);
                inalphaArray.push(month.In_alpha);
                compromisedArray.push(month.Compromised);
                completedArray.push(month.Completed);
                break;
            case "Broken":
                brokenArray.push(month.Broken);
                break;
            case "Stagnant":
                stagnantArray.push(month.Stagnant);
                break;
            case "Not implemented":
                notimplementedArray.push(month.Not_implemented);
                break;
            case "In alpha":
                inalphaArray.push(month.In_alpha);
                break;
            case "Compromised":
                compromisedArray.push(month.Compromised);
                break;
            case "Completed":
                completedArray.push(month.Completed);
                break;
        }
        //Labels always needed to mark each tick on the graph
        labels.push(month.date);
    }
    //Charts Data
    var ctx = document.getElementById("timechart");
    var data = {
        labels: labels,
        datasets: [{
                label: "Broken",
                backgroundColor: "#f2dede",
                borderColor: "#c56d6d",
                borderWidth: 1,
                data: brokenArray,
                spanGaps: true,
            }, {
                label: "Stagnant",
                backgroundColor: "#fcddc4",
                borderColor: "#f5903d",
                data: stagnantArray
            }, {
                label: "Not implemented",
                backgroundColor: "#fcf8e3",
                borderColor: "#ecd046",
                data: notimplementedArray
            }, {
                label: "In alpha",
                backgroundColor: "#d9edf7",
                borderColor: "#57afdb",
                data: inalphaArray
            }, {
                label: "Compromised",
                backgroundColor: "#ccdde8",
                borderColor: "#72a1c0",
                data: compromisedArray
            }, {
                label: "Completed",
                backgroundColor: "#dff0d8",
                borderColor: "#86c66c",
                data: completedArray
            }]
    };
    //add any shared elements to all datasets
    for (var i = 0; i < data.datasets.length; i++) {
        data.datasets[i].borderWidth = 1;
        data.datasets[i].pointRadius = 1;
        data.datasets[i].pointHitRadius = 10;
        data.datasets[i].pointHoverRadius = 6;
        data.datasets[i].pointHoverBorderWidth = 3;
    }
    //update chart data if already created
    if (typeof (AllChart) == "object") {
        AllChart.config.data = data;
        AllChart.update();
    }
    else {
        // console.log("Created empty chart");
        Chart.defaults.global.legend.display = false;
        AllChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                tooltips: {
                    mode: "label",
                    position: "nearest",
                    callbacks: {
                        title: function(data) {
                            return moment(data["0"].xLabel).format("MMMM YYYY");
                        }
                    }
                },
                scales: {
                    xAxes: [{   stacked: true, 
                                ticks: {autoSkip: false},
                                type: 'time',
                                time: {
                                    displayFormats: {
                                        'millisecond': 'MMM YYYY',
                                        'second': 'MMM YYYY',
                                        'minute': 'MMM YYYY',
                                        'hour': 'MMM YYYY',
                                        'day': 'MMM YYYY',
                                        'week': 'MMM YYYY',
                                        'month': 'MMM YYYY',
                                        'quarter': 'MMM YYYY',
                                        'year': 'MMM YYYY',
                                    }
                                }
                           }],
                    yAxes: [{stacked: true}]
                }
            }
        });
    }
}
//Build AllChart with default input
Build_and_fill_Chart();
