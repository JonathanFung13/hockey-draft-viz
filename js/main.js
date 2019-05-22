var widthScreen = '100%';
var heightScreen = '100%';
var margin = {top: 5, right: 5, bottom: 5, left: 0}/*,
    width = 80 - margin.left - margin.right,
    height = 90 - margin.top - margin.bottom;*/
var draftsFilteredByTeamName, mouseClickDrafts;
// var clickedDict = {"gone": false, "act": false, "sus": false, "udf": false, "other_team": false, "other": false};
var clickedDict = {"active": false, "inactive": false, "other_team": false};
var years, teams;

var legendKey ={};
//needed for legend - decide how many keys should be there
legendKey['status'] = {basic: { "ACTIVE": "gray", "INACTIVE": "#FF3838", "OTHER_TEAM": "#A2AFEF"},
    class: {"ACTIVE": "active", "INACTIVE": "inactive", "OTHER_TEAM": "other_team"},
    text: {"ACTIVE": ["Active", 90], "INACTIVE": ["Inactive", 70], "OTHER_TEAM": ["Other Team", 75]} };

// legendKey['GamesStarted'] = {basic: {1: 'green', 2: 'blue', 3: "#D7D6D6", 4: "grey", 5: "#A2AFEF", "noinfo": "gold"},
//     class: {1: "one", 2: "two", 3: "three", 4: "four", 5: "five", "other": "noinfo"},
//     text: {1: ["0-15", 120], 2: ["16-31", 58],3: ["32-64", 61], 4: ["65-99", 63], 5: ["100-200", 64], "other": ["Unavailable",68]} };
//
// legendKey['ApproxValue'] = {basic: {"GONE": "#FF3838", "ACT": "grey", "SUS": "#D7D6D6", "UDF": "grey", "OTHER_TEAM": "#A2AFEF", "other": "gold"},
//     class: {1: "one", 2: "two", 3: "three", 4: "four", 5: "five", "other": "noinfo"},
//     text: {1: ["0-9", 120], 2: ["10-19", 51],3: ["20-39", 58], 4: ["40-69", 61], 5: ["70-150", 63], "other": ["Unavailable",65]} };


//DIVISIONS = {"New Jersey Devils" : "Metro", "New York Islanders" : "Metro", "New York Rangers" : "Metro", "Philadelphia Flyers" : "Metro", "Pittsburgh Penguins" : "Metro", "Boston Bruins" : "Atlantic", "Buffalo Sabres" : "Atlantic", "Montréal Canadiens" : "Atlantic", "Ottawa Senators" : "Atlantic", "Toronto Maple Leafs" : "Atlantic", "Carolina Hurricanes" : "Metro", "Florida Panthers" : "Atlantic", "Tampa Bay Lightning" : "Atlantic", "Washington Capitals" : "Metro", "Chicago Blackhawks" : "Central", "Detroit Red Wings" : "Atlantic", "Nashville Predators" : "Central", "St. Louis Blues" : "Central", "Calgary Flames" : "Pacific", "Colorado Avalanche" : "Central", "Edmonton Oilers" : "Pacific", "Vancouver Canucks" : "Pacific", "Anaheim Ducks" : "Pacific", "Dallas Stars" : "Central", "Los Angeles Kings" : "Pacific", "San Jose Sharks" : "Pacific", "Columbus Blue Jackets" : "Metro", "Minnesota Wild" : "Central", "Winnipeg Jets" : "Central", "Arizona Coyotes" : "Pacific", "Vegas Golden Knights" : "Pacific"}
//teamNames = {"NJD": "New Jersey Devils", "NYI": "New York Islanders", "NYR": "New York Rangers", "PHI": "Philadelphia Flyers", "PIT": "Pittsburgh Penguins", "BOS": "Boston Bruins", "BUF": "Buffalo Sabres", "MTL": "Montréal Canadiens", "OTT": "Ottawa Senators", "TOR": "Toronto Maple Leafs", "CAR": "Carolina Hurricanes", "FLA": "Florida Panthers", "TBL": "Tampa Bay Lightning", "WSH": "Washington Capitals", "CHI": "Chicago Blackhawks", "DET": "Detroit Red Wings", "NSH": "Nashville Predators", "STL": "St. Louis Blues", "CGY": "Calgary Flames", "COL": "Colorado Avalanche", "EDM": "Edmonton Oilers", "VAN": "Vancouver Canucks", "ANA": "Anaheim Ducks", "DAL": "Dallas Stars", "LAK": "Los Angeles Kings", "SJS": "San Jose Sharks", "CBJ": "Columbus Blue Jackets", "MIN": "Minnesota Wild", "WPG": "Winnipeg Jets", "ARI": "Arizona Coyotes", "VGK": "Vegas Golden Knights"}
//TEAMABBRS = {"New Jersey Devils": "NJD", "New York Islanders": "NYI", "New York Rangers": "NYR", "Philadelphia Flyers": "PHI", "Pittsburgh Penguins": "PIT", "Boston Bruins": "BOS", "Buffalo Sabres": "BUF", "Montréal Canadiens": "MTL", "Ottawa Senators": "OTT", "Toronto Maple Leafs": "TOR", "Carolina Hurricanes": "CAR", "Florida Panthers": "FLA", "Tampa Bay Lightning": "TBL", "Washington Capitals": "WSH", "Chicago Blackhawks": "CHI", "Detroit Red Wings": "DET", "Nashville Predators": "NSH", "St. Louis Blues": "STL", "Calgary Flames": "CGY", "Colorado Avalanche": "COL", "Edmonton Oilers": "EDM", "Vancouver Canucks": "VAN", "Anaheim Ducks": "ANA", "Dallas Stars": "DAL", "Los Angeles Kings": "LAK", "San Jose Sharks": "SJS", "Columbus Blue Jackets": "CBJ", "Minnesota Wild": "MIN", "Winnipeg Jets": "WPG", "Arizona Coyotes": "ARI", "Vegas Golden Knights": "VGK"}

DIVISIONS = {"Anaheim Ducks": "Pacific", "Arizona Coyotes": "Pacific", "Boston Bruins": "Atlantic", "Buffalo Sabres": "Atlantic", "Calgary Flames": "Pacific", "Carolina Hurricanes": "Metro", "Chicago Blackhawks": "Central", "Colorado Avalanche": "Central", "Columbus Blue Jackets": "Metro", "Dallas Stars": "Central", "Detroit Red Wings": "Atlantic", "Edmonton Oilers": "Pacific", "Florida Panthers": "Atlantic", "Los Angeles Kings": "Pacific", "Minnesota Wild": "Central", "Montréal Canadiens": "Atlantic", "Nashville Predators": "Central", "New Jersey Devils": "Metro", "New York Islanders": "Metro", "New York Rangers": "Metro", "Ottawa Senators": "Atlantic", "Philadelphia Flyers": "Metro", "Pittsburgh Penguins": "Metro", "San Jose Sharks": "Pacific", "St. Louis Blues": "Central", "Tampa Bay Lightning": "Atlantic", "Toronto Maple Leafs": "Atlantic", "Vancouver Canucks": "Pacific", "Vegas Golden Knights": "Pacific", "Washington Capitals": "Metro", "Winnipeg Jets": "Central"}
teamNames = {"ANA": "Anaheim Ducks", "ARI": "Arizona Coyotes", "BOS": "Boston Bruins", "BUF": "Buffalo Sabres", "CAR": "Carolina Hurricanes", "CBJ": "Columbus Blue Jackets", "CGY": "Calgary Flames", "CHI": "Chicago Blackhawks", "COL": "Colorado Avalanche", "DAL": "Dallas Stars", "DET": "Detroit Red Wings", "EDM": "Edmonton Oilers", "FLA": "Florida Panthers", "LAK": "Los Angeles Kings", "MIN": "Minnesota Wild", "MTL": "Montréal Canadiens", "NJD": "New Jersey Devils", "NSH": "Nashville Predators", "NYI": "New York Islanders", "NYR": "New York Rangers", "OTT": "Ottawa Senators", "PHI": "Philadelphia Flyers", "PIT": "Pittsburgh Penguins", "SJS": "San Jose Sharks", "STL": "St. Louis Blues", "TBL": "Tampa Bay Lightning", "TOR": "Toronto Maple Leafs", "VAN": "Vancouver Canucks", "VGK": "Vegas Golden Knights", "WPG": "Winnipeg Jets", "WSH": "Washington Capitals"}
TEAMABBRS = {"Anaheim Ducks": "ANA", "Arizona Coyotes": "ARI", "Boston Bruins": "BOS", "Buffalo Sabres": "BUF", "Calgary Flames": "CGY", "Carolina Hurricanes": "CAR", "Chicago Blackhawks": "CHI", "Colorado Avalanche": "COL", "Columbus Blue Jackets": "CBJ", "Dallas Stars": "DAL", "Detroit Red Wings": "DET", "Edmonton Oilers": "EDM", "Florida Panthers": "FLA", "Los Angeles Kings": "LAK", "Minnesota Wild": "MIN", "Montréal Canadiens": "MTL", "Nashville Predators": "NSH", "New Jersey Devils": "NJD", "New York Islanders": "NYI", "New York Rangers": "NYR", "Ottawa Senators": "OTT", "Philadelphia Flyers": "PHI", "Pittsburgh Penguins": "PIT", "San Jose Sharks": "SJS", "St. Louis Blues": "STL", "Tampa Bay Lightning": "TBL", "Toronto Maple Leafs": "TOR", "Vancouver Canucks": "VAN", "Vegas Golden Knights": "VGK", "Washington Capitals": "WSH", "Winnipeg Jets": "WPG"}

var border,colorBy='status';
max = {
    'GamesStarted':16,
    'ApproxValue':10

}

// STATIC FINAL VAR
var YLOC_SCALE = 1.4;
var CIRCLE_GAP_FACTOR = 1.6; // To have same gap between rounds

var filterByTeamName = function(data, teamName) {
    var dataFilteredByTeam = data.filter(function(d) {
        return d.Team == TEAMABBRS[teamName]
    });
    return dataFilteredByTeam;
};

// Filter by names of players in drafts
var initMouseClickDraft = function() {
    var filteredD = {"picture": "http://static.nfl.com/static/content/public/static/img/fantasy/transparent/200x200/NKE415291.png",
        "College": "Mississippi",
        "stats": [
            {
                "TCKL": "1"
            },
            {
                "SCK": "0.0"
            },
            {
                "FF": "0"
            },
            {
                "INT": "--"
            }
        ],
        "name": "Robert Nkemdiche",
        "Weight": "296",
        "Age": "22",
        "number": "#90 DT",
        "Experience": "2nd season",
        "Born": "9/19/1994 Atlanta , GA",
        "High School": "Grayson HS [Loganville, GA]",
        "team": "Arizona Cardinals",
        "Height": "6-3"};


    // var filteredD = data.filter(function(d) {
    //     var isName = false;
    //     var names = d.name.split(" ");
    //     var name = names[1] + ", " +names[0];
    //     for (var i = 0; i < draftsFilteredByTeamName.length; i++) {
    //         isName = name ==draftsFilteredByTeamName[i].name;
    //         if (isName) {
    //             break;
    //         }
    //     }
    //     return isName;
    // });
    return filteredD;
};
var initJson = function (svg) {
    // d3.json('playerProfileAll.json', function(data) {
    //     mouseClickDrafts = initMouseClickDraft(data);
    //     mouseClick(svg, mouseClickDrafts, "#clickProf");
    // });
    mouseClickDrafts = initMouseClickDraft();
    mouseClick(svg, mouseClickDrafts, "#clickProf");
};

d3.csv('data/Draft.csv').then( function(data) {
    colorBy= "status" //$("input[type='radio']").val();
    let selectOptions = {};
    // var teamNames = {};
    data.forEach(function(d) {
        selectOptions[d.Team] = 1;
        // teamNames[d.Team] = d.Team
    });

    //make a selection bar by getting the team name from the data
    for (var iAbbr in selectOptions){
        $(".teamroster").each(function(){
            var optionVal = iAbbr;
            $(this).append("<option value=" + optionVal + " data-imagesrc='images/" +teamNames[optionVal]+".png'>"+teamNames[optionVal]+"</option>");
        });
    }


    var selectedSizes = {"width": 1000 , "height": 700 - margin.top - margin.bottom, radius: 12.5};
    var svgHolder = d3.select(".content");
    svgHolder.append("div")
        .attr("id", "SvgHolder")
        .attr("height", selectedSizes.height + margin.top + margin.bottom)
        .attr("width", selectedSizes.width);
    var atlSvgHolder = d3.select("#atlantic");
    var metSvgHolder = d3.select("#metropolitan");
    var cenSvgHolder = d3.select("#central");
    var pacSvgHolder = d3.select("#pacific");
    var previewSizes = {"width": 95 - margin.left - margin.right, "height": 90 - margin.top - margin.bottom, radius: 2}


    for (var i = 0; i < Object.keys(selectOptions).length; i++) {
        var teamName = teamNames[Object.keys(selectOptions)[i]];

        var previewHolder;
        switch(DIVISIONS[teamName]) {
            case "Atlantic":
                previewHolder = atlSvgHolder.append("div")
                    .attr("class", "teamDiv teamDiv"+i);
                break;
            case "Metro":
                previewHolder = metSvgHolder.append("div")
                    .attr("class", "teamDiv teamDiv"+i);
                break;
            case "Central":
                previewHolder = cenSvgHolder.append("div")
                    .attr("class", "teamDiv teamDiv"+i);
                break;
            default: // must be in the pacific
                previewHolder = pacSvgHolder.append("div")
                    .attr("class", "teamDiv teamDiv"+i);
                break;
        }

        var previewSvg = createSvg(previewHolder, "Svg" + i, teamName, previewSizes.width, previewSizes.height)
        previewHolder.append("span")
            .html(teamName)
        onPreviewHover(previewHolder);
        previewHolder.on("click", function(d) {
            var borderParams = $(this).offset()
            d3.select("#selectedBorder > rect")
                .attr("x", borderParams.left - 8 - $(window).scrollLeft())
                .attr('y', borderParams.top - 64)
//            d3.select(this).style("border", "1px solid #ddd")
            //d3.selectAll("#SvgHolder > *").remove();
            displayFullTeamInfo(data, this.children[0].children[0].getAttribute("team-name"), svgHolder, selectedSizes)
        });

        displayPlayerCircles(data, teamName, previewSvg, previewSizes)

    }

//    var borderParams = $(".Svg1").parent().offset()
    d3.select(".content").append("svg")
        .attr("id", "selectedBorder")
        .append("rect")
        .attr("width", 75)
        .attr("height", 100)

    $(".teamDiv"+1).trigger("click");
    d3.select(".content").append("div")
        .attr("id", "clickProf")

    // Get rid of player information
    $("#SvgHolder").click(function(e) {
        if (!$(e.target).is("circle")) {
            d3.select("#clickProf > *").remove()
            if (draftsFilteredByTeamName.active !== undefined) {
                draftsFilteredByTeamName.active.clicked = false;
            }
            if (draftsFilteredByTeamName.prevCircle !== undefined) {
                d3.select(draftsFilteredByTeamName.prevCircle).style("stroke-opacity", "0");
                d3.select(draftsFilteredByTeamName.prevCircle).style("stroke-width", "2px")

            }
        }
    })
//    d3.select("#SvgHolder").on("click", function(d) {
//        d3.select("#clickProf > *").remove()
//        if (draftsFilteredByTeamName.active !== undefined) {
//            draftsFilteredByTeamName.active.clicked = false;
//        }
//        if (draftsFilteredByTeamName.prevCircle !== undefined) {
//            d3.select(draftsFilteredByTeamName.prevCircle).style("stroke-opacity", "0");
//            d3.select(draftsFilteredByTeamName.prevCircle).style("stroke-width", "2px")
//
//        }
//
//    })


    createLegend()


});

function displayFullTeamInfo(data, teamName, svgHolder, selectedSizes) {
    svgHolder.append("div")
        .attr("id", "instruction")
        .attr("class", "highlighted")
        .text("Click on a circle to see detailed player information!")
    var svg = createSvg(svgHolder, "selectedSvg","", selectedSizes.width, selectedSizes.height);
    teamNameDiv = svgHolder.insert("div", ":first-child")
        .attr("class", "teamTitle")

    teamNameDiv.style("opacity", 0)
        .transition().duration(500).style("opacity", 1);

    teamNameDiv.append("img")
       .attr("id", "teamLogo")
       .attr("src", "images/" + teamName + ".png");
    teamNameDiv
        .append("div")
        .attr("id", "teamName")
        .text(teamName);
    positionFunctions = displayPlayerCircles(data, teamName, svg, selectedSizes);
    addXYLabels(svg, selectedSizes.radius);
    addPositionLabels(svg, positionFunctions);
    addHoverPreview(svg)
    d3.selectAll("#clickProf > *").remove();
    initJson(svg)
}

// For displaying all of the charts for all of the teams
function displayPlayerCircles(data, teamName, svg, sizes) {
    draftsFilteredByTeamName = filterByTeamName(data, teamName);

    return createChart(svg, sizes);
}

function createChart(svg, sizes) {
    width = sizes.width;
    height = sizes.height;

    draftsFilteredByTeamName.sort(function(a,b) {
        return d3.descending(a.Year, b.Year) || d3.ascending(a.Round, b.Round);
    });
    var positionsObject={};
    var objectLength=[];
    var radius = sizes.radius;
    draftsFilteredByTeamName.forEach(function(d) {
        d.Year =+ d.Year;
        positionsObject[d.Year]=0

    });

    var nested_data = d3.nest()
        .key(function(d) { return d.Year; })
        .key(function(d) {
            if (d.Round > 7) {
                d.Round = 7;
            }
            return d.Round;
        })
        .rollup(function(leaves) { return leaves.length; })
        .entries(draftsFilteredByTeamName);

    var prev_round = 1; // used to change the start location of the circles depending on the round
    var prev_year = 2011; //one that should be most recent year
    var draftPicks; //to locate circles depending on how many picks per round
    var posArr = nested_data.filter(function(nd) {
        return nd.key == prev_year;
    })[0].values.filter(function(nd) {
        return nd.key == prev_round;
    });

    var position = function(d){
        if (d.Round > 7) {
            d.Round = 7;
        }
        // console.log(d.Year,d.Round,d.Pick,d.Overall,d.Team,d.PlayerName, prev_year, prev_round);
        if (d.Year != prev_year) {
            //reset prev_round to 0 at the beginning of new year
            prev_round = 0;
            posArr = nested_data.filter(function(nd) {
                return nd.key == d.Year;
            })[0].values.filter(function(nd) {
                return nd.key == prev_round;
            });
            draftPicks=0;
        }
        if (d.Round != prev_round) {
            draftPicks = 1;
            while (prev_round != d.Round) {
                var sumFactor = 0;
                var limit;
                if (prev_round === "N/A") {
                    limit = 7;
                } else {
                    limit = prev_round;
                }
                for (var i = 0; i < limit; i++) {
                    sumFactor += CIRCLE_GAP_FACTOR;
                }
                positionsObject[d.Year]=radius * 3 * (sumFactor-1)+radius*1.8;
                prev_round++;
                if (prev_round > 7) {
                    prev_round = "N/A"
                }
            }
            posArr = nested_data.filter(function(nd) {
                return nd.key == d.Year;
            })[0].values.filter(function(nd) {
                return nd.key == d.Round;
            });
            positionsObject[d.Year]+=radius * 3;
            if (posArr[0].values === 1) {
                positionsObject[d.Year] += radius
            }
        } else {
            draftPicks++;
            if (draftPicks === 3) {
                if (posArr[0].values == 3 || posArr[0].values == 5) {
                    positionsObject[d.Year] -= radius*.9;
                } else {
                    positionsObject[d.Year]-=radius*1.8;
                }
            } else if (posArr[0].values == 5 && draftPicks == 4) {
                positionsObject[d.Year] -=radius*0.9;
//                if (draftPicks == 1 || draftPicks == 4) {
//                    positionsObject[d.Year] -=radius*1.5;
//                } else {
//                    positionsObject[d.Year] +=radius*2.5;
//                }
            } else {
                positionsObject[d.Year]+=radius*1.8
            }
        }
        prev_year = d.Year;
        return positionsObject[d.Year]
    };
    // Set the ranges
    //var x = d3.scale.linear().range([0, width]);

    var yLoc = d3.scaleLinear()
        .range([height/YLOC_SCALE, 0])
        .domain([d3.min(draftsFilteredByTeamName, function(d) { return d.Year; }), d3.max(draftsFilteredByTeamName, function(d) { return d.Year; })]);

    var yPosition = function(d) {
        if (d.Year != prev_year) {
            //reset prev_round to 1 at the beginning of new year
            prev_round = 1;
            posArr = nested_data.filter(function(nd) {
                return nd.key == d.Year;
            })[0].values.filter(function(nd) {
                return nd.key == prev_round;
            });
            draftPicks=0;
        }
        if (d.Round != prev_round) {
            draftPicks=0;
            posArr = nested_data.filter(function(nd) {
                return nd.key == d.Year;
            })[0].values.filter(function(nd) {
                return nd.key == d.Round;
            });
        }
        draftPicks++;
        prev_round = d.Round;
        prev_year = d.Year;
        if (posArr[0].values === 5 && draftPicks !== 3) {
            if (draftPicks < 3) {
                return yLoc(d.Year) - radius * 1.3
            } else {
                return yLoc(d.Year) + radius * 1.3
            }
        }
        if (posArr[0].values === 3 || posArr[0].values === 4) { // 3 and 4
            if (draftPicks > 2) {
                return yLoc(d.Year) + radius * 0.7
            } else {
                return yLoc(d.Year) - radius * 0.7
            }
        }
        return yLoc(d.Year)
    };

// Add the scatterplot

    draftsFilteredByTeamName.forEach(function(d) {
        d.Year =+ d.Year;
        positionsObject[d.Year]=0
    });
    var circleWrap = svg.selectAll("dot")
        .data(draftsFilteredByTeamName)
        .enter()
        .append("g")
        .attr("class", "circleWrap")
        .style("opacity", 0.8);


    prev_round = 1;
    prev_year = 2011;
    draftPicks = 0;
    circleWrap.append("circle")
        .attr("class", function(d) {
            val = d[colorBy];
            if(colorBy === 'ApproxValue'){
                val1 = parseInt(parseInt(val)/max[colorBy])+1;
                if(val1>3)
                    val1 =parseInt(parseInt(val)/(2*max[colorBy]))+2;
                if (val1===5 && parseInt(val) < 70)
                    val1= val1 - 1
                else if (val1 >= 5) {
                    val1 = 5
                }
                val=val1;
            } else if (colorBy === 'GamesStarted') {
                val1 = parseInt(parseInt(val)/max[colorBy])+1;
                if(val1>3)
                    val1 =parseInt(parseInt(val)/(2*max[colorBy]))+2;
                if (parseInt(val) == 64)
                    val1 = val1 - 1
                if (val1>=5 && parseInt(val) < 100)
                    val1=val1-1
                else if (val1 >= 5)
                    val1=5
                val=val1;
            }

            if(legendKey[colorBy].class[val] === undefined) {
                return legendKey[colorBy].class['other']
            }
            console.log(val, legendKey[colorBy].class[val])
            return legendKey[colorBy].class[val]
        })
        .attr("r", radius)
        .attr("cx", function(d,i) {
            return position(d)
//            return yPosition(d);
        })
        .attr("cy", function(d) {
            return yPosition(d);
//             return position(d)

        })
    draftsFilteredByTeamName.forEach(function(d) {
        d.Year =+ d.Year;
        positionsObject[d.Year]=0
    });


    // PROPAGATE STATUS FILTER
    for (var key in clickedDict) {
        if (clickedDict[key]) {
            d3.selectAll("."+key).classed("unselected",true);
        }
    }
    // For now
    var positionFunctions = {"position": position, "yPosition": yPosition};
    return positionFunctions
}


function recolorPlayers(){
    d3.selectAll(".content circle")
        .attr("class", function(d) {
            val =d[colorBy];
            if(colorBy === 'ApproxValue'){
                val1 = parseInt(parseInt(val)/max[colorBy])+1;
                if(val1>3)
                    val1 =parseInt(parseInt(val)/(2*max[colorBy]))+2;
                if (val1===5 && parseInt(val) < 70)
                    val1= val1 - 1
                else if (val1 >= 5) {
                    val1 = 5
                }
                val=val1;
            } else if (colorBy === 'GamesStarted') {
                val1 = parseInt(parseInt(val)/max[colorBy])+1;
                if(val1>3)
                    val1 =parseInt(parseInt(val)/(2*max[colorBy]))+2;
                if (parseInt(val) == 64)
                    val1 = val1 - 1
                if (val1>=5 && parseInt(val) < 100)
                    val1=val1-1
                else if (val1 >= 5)
                    val1=5
                val=val1;
            }

            if(legendKey[colorBy].class[val] === undefined) {
                return legendKey[colorBy].class['other']
            }
//           console.log(val)
            return legendKey[colorBy].class[val]
        })



}

function createLegend(){

    //create legend
    d3.select("#legend svg").remove();
    var svgOrig = d3.select("#legend").append("svg")
        .attr("width", "700px") //to keep it below the svg files above
        .attr("height", "55px");
    var legend = svgOrig.append("g")
        .attr("class", "legend")
        .attr("transform","translate(45,5)");
    var count = 0;
    for (var i in legendKey[colorBy].class) {
        keys = Object.keys(legendKey[colorBy].class);
        legend.append("circle")
            .attr("cx", margin.left - 30 +count*legendKey[colorBy].text[i][1])
            .attr("cy", 30)
            .attr("r", 10)
            .attr("class", legendKey[colorBy].class[i])
            .on("click", function(d) {

                var classSelect = this.className.baseVal.split(" ")[0];
                if (!clickedDict[classSelect] ) {
                    d3.selectAll("."+classSelect).each(function(d, i) {
                        d3.select(this).classed("unselected",true);
                    });
                    clickedDict[classSelect]=true;
                } else {
                    d3.selectAll(".content ."+classSelect).each(function(d, i) {
                        d3.select(this).attr("class", function(d) {
                            val =d[colorBy];
                            if(colorBy !='status'){
                                val1 = parseInt(parseInt(val)/max[colorBy])+1;
                                if(val1>3)
                                    val1 =parseInt(parseInt(val)/(2*max[colorBy]))+2;
                                if (val1>5)
                                    val1=5
                                val=val1;
                            }

                            if(legendKey[colorBy].class[val] === undefined) {
                                return legendKey[colorBy].class['other']
                            }

                            return legendKey[colorBy].class[val]
                        })
                    });
                    clickedDict[classSelect]=false;
                    d3.select(this).classed("unselected",false);
                }
            });
        legend.append("text")
            .attr("x", margin.left-15 +count *legendKey[colorBy].text[i][1])
            .attr("y", 35)
            //            .style("font-family", "sans-serif")
            //            .style("fill", "white")
            .text(legendKey[colorBy].text[i][0]);
        count = count+1;
    }
}

function mouseClick(svg, mcDraft, clickProf) {
    // On mouse click on any of the circles, show player profile
    svg.selectAll("g > g").each(function(d) {
        d3.select(this)
            .on("click", function(d) {
                d3.select("#instruction").classed("highlighted",false)
                var profile = mcDraft.filter(function(dClick) {
                    var names = dClick.name.split(" ");
                    var name = names[1]+", "+names[0];
                    return name === d.name;
                });
                if (profile.length > 0) {
                    if (d.clicked === undefined || !d.clicked) {
                        if (draftsFilteredByTeamName.active !== undefined) {
                            draftsFilteredByTeamName.active.clicked = false;
                        }
                        if (draftsFilteredByTeamName.prevCircle !== undefined) {
                            //Unhighlight the previously selected circle
//                        d3.select(draftsFilteredByTeamName.prevCircle).style("stroke", function() {
//                            return legendKey[colorBy].basic[draftsFilteredByTeamName.prevCircle.className.baseVal.toUpperCase()];
//                        });

                            d3.select(draftsFilteredByTeamName.prevCircle).style("stroke-opacity", "0");
                            d3.select(draftsFilteredByTeamName.prevCircle).style("stroke-width", "2px")

                        }
                        size = parseInt(window.innerWidth) * 0.2;
                        draftsFilteredByTeamName.active = d;
                        d3.selectAll(clickProf+" > *").remove();
                        d3.select(clickProf).append("table").append("caption")
                            .attr("class", "nameCap")
                            .text(profile[0].name)
                        var tbody = d3.select(clickProf).select("table")
                            .append("tbody");
                        tbody.append("tr").append("td")
                            .attr("colspan", "2")
                            .attr("style", "text-align:center")
                            .append("img")
                            .attr("id", profile[0].name)
                            .attr("src", profile[0].picture)
//                        .style("width", size + "px")
//                        .style("height", size + "px");
                        tbody.append("tr").append("th")
                            .attr("colspan", "2")
                            .attr("class", "heading")
                            .text(function() {
                                if (profile[0].team === undefined) {
                                    return "Not Active"
                                }
                                return profile[0].number + " " + profile[0].team
                            });
                        tbody.append("tr").append("th")
                            .attr("colspan", "2")
                            .attr("class", "heading")
                            .text("Personal Information");
                        tbody.append("tr")
                            .attr("id", "bornTr")
                            .append("th")
                            .attr("scope", "row")
                            .attr("class", "infoHeading")
                            .append("span")
                            .text("Born: ");
                        d3.select("#bornTr")
                            .append("td").text(function() {
                            return checkUndefinedPlayer(profile[0].Born)
                        });
                        tbody.append("tr")
                            .attr("id", "ageTr")
                            .append("th")
                            .attr("scope", "row")
                            .attr("class", "infoHeading")
                            .append("span").text("Age: ");
                        d3.select("#ageTr").append("td")
                            .text(function() {
                                return checkUndefinedPlayer(profile[0].Age)
                            });
                        tbody.append("tr")
                            .attr("id", "heightTr")
                            .append("th")
                            .attr("class", "infoHeading")
                            .attr("scope", "row")
                            .text("Height: ");
                        d3.select("#heightTr").append("td")
                            .text(function() {
                                return checkUndefinedPlayer(profile[0].Height)
                            });
                        tbody.append("tr")
                            .attr("id", "weightTr")
                            .append("th")
                            .attr("class", "infoHeading")
                            .attr("scope", "row")
                            .text("Weight: ");
                        d3.select("#weightTr").append("td")
                            .text(function() {
                                return checkUndefinedPlayer(profile[0].Weight)
                            });
                        tbody.append("tr").append("th")
                            .attr("class", "heading")
                            .attr("colspan", "2")
                            .text("Career Information");
                        tbody.append("tr")
                            .attr("id", 'hsTr')
                            .append("td")
                            .attr("scope", "row")
                            .attr("class", "infoHeading")
                            .text("High School: ");
                        d3.select("#hsTr").append("td")
                            .text(function() {
                                    return checkUndefinedPlayer(profile[0]["High School"])
                                }
                            );
                        tbody.append("tr")
                            .attr("id", 'collegeTr')
                            .append("td")
                            .attr("scope", "row")
                            .attr("class", "infoHeading")
                            .text("College: ");
                        d3.select("#collegeTr").append("td")
                            .text(function() {
                                return checkUndefinedPlayer(profile[0].College)
                            });
                        tbody.append("tr").append("th")
                            .attr("class", "heading")
                            .attr("colspan", "2")
                            .text("Career History");
                        tbody.append("tr")
                            .attr("id", "expTr")
                            .append("td")
                            .attr("scope", "row")
                            .attr("class", "infoHeading")
                            .text("Experience: ");
                        d3.select("#expTr").append("td")
                            .text(function() {
                                return checkUndefinedPlayer(profile[0].Experience)
                            });
                        tbody.append("tr").append("th")
                            .attr("class", "heading")
                            .attr("colspan", "2")
                            .text("2016 NFL Statistics");
                        for (var k = 0; k < profile[0].stats.length; k++) {
                            var stat = profile[0].stats[k];
                            var statKeys = Object.keys(stat);
                            tbody.append("tr")
                                .attr("id", statKeys[0]+"Tr")
                                .append("td")
                                .attr("scope", "row")
                                .attr("class", "infoHeading")
                                .text(statKeys[0] + ": ");
                            d3.select("#"+statKeys[0]+"Tr").append("td")
                                .text(stat[statKeys[0]]);
                        }
                        d.clicked = true;
                        //TODO: work for both sides
                        // highlights the circle when clicked
                        var childCircle = this.childNodes[0];
                        d3.select(childCircle).style("stroke", "#ffeb00");
                        d3.select(childCircle).style("stroke-opacity", ".5");
                        d3.select(childCircle).style("stroke-width", "6px");
                        draftsFilteredByTeamName.prevCircle = childCircle
                    } else {
                        d3.selectAll(clickProf+" > *").remove();
                        d.clicked =false;

                        //Unhighlight the circle and go back to normal styling
                        var childCircle = this.childNodes[0];

                        d3.select(childCircle).style("stroke-opacity", "0");
                        d3.select(childCircle).style("stroke-width", "2px")

                    }
                }
            })
    })
}

function checkUndefinedPlayer(playerInfo) {
    if (playerInfo == undefined) {
        return "-"
    }
    return playerInfo
}

function createSvg(svgHolder, className,teamName, width, height) {
    var radius = Math.ceil(width * 0.02);
    var g =svgHolder.append("svg")
        .attr("class", className+" preview-svg")
        .attr("width", width)//width + margin.left + margin.right)
        .attr("height", (height + margin.top + margin.bottom))

        .append("g")
        .attr("class", "circleGroup")
        .attr("team-name", teamName)
        .attr("transform",
            "translate(" + radius * 2.5 + "," + radius * 5 + ")")
    g.style("opacity", 0)
        .transition().duration(500).style("opacity", 1);
    return g;


}

function addHoverPreview(svg) {
    svg.selectAll("g")
        .on("mouseover", function(d) {
            d3.select(this).style("opacity", 1);
            var divText = d3.selectAll("body")
                .append("div")
                .attr("class", "previewWrap")
                .attr("width", "200px");
            divText
                .append("div")
                .text("Name: " + d.PlayerName);
            divText
                .append("div")
                .text("School: " + d.AmateurTeam);
            divText
                .append("div")
                .text("Round: " + d.Round)

            divText
                .append("div")
                .text("Status: " + legendKey['status'].text[d['Status']][0])

            divText
                .append("div")
                .text("Games Played: " + d['GamesPlayed'])

            divText
                .append("div")
                .text("Approximate Value: " + d.Points)
        })
        .on("mousemove", function() {
            d3.select(this).style("opacity", 1);
            d3.selectAll(".previewWrap")
                .style("top",(d3.mouse(document.body)[1] + 40) + "px")
                .style("left",(d3.mouse(document.body)[0] + 20) + "px");
        })
        .on("mouseout", function(d) {
            d3.selectAll(".previewWrap").remove();
            d3.select(this).style("opacity", .8)
        })
}

function addXYLabels(svg, radius) {
    // Add the Y Axis
    var y = d3.scaleTime()
        .range([height/YLOC_SCALE, 0]);
    // var yAxis = d3.svg.axis().scale(y)
    //     .orient("left");
    var yAxis = d3.axisLeft(y);
    y.domain([new Date(d3.min(draftsFilteredByTeamName, function(d) { return d.Year; }),0,1), new Date(d3.max(draftsFilteredByTeamName, function(d) { return d.Year; }),0,1)]);

    svg.append("g")
        .attr("class", "yAxis")
        .call(yAxis)
        .style("fill", "aliceblue")
        .style("font-size", radius * 1.3);

    //ADD label for X-axis
    var arr = [1,2,3,4,5,6,7];
    var xTicks = svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(-6,-35)")
        .style("font-size", radius * 1.3);

    for (var i = 0; i < arr.length; i++) {
        xTicks.append("text")
            .text('R' + arr[i])
            .attr("x", function() {
                var sumFactor = 0;
                for (var j = 0; j < i; j++) {
                    sumFactor += (CIRCLE_GAP_FACTOR - 0.01);
                }
                return radius * 3 * (sumFactor)+radius*2.5;
            })
    }
}

function addPositionLabels(svg, positionFunctions) {

    prev_round = 0;
    prev_year = 2016;
    draftPicks = 0;
    svg.selectAll(".circleWrap")
        .append("text")
        .attr("class", "positionLabel")
        .attr("text-anchor", "middle")
        .text(function(d) {
            return d.Pos;
        })
        .attr("x", function(d,i) {
//           return positionFunctions.yPosition(d);
            return positionFunctions.position(d)
        })
        .attr("y", function(d) {
//            return positionFunctions.Pos(d) +5
            return positionFunctions.yPosition(d)+5;
        })
}

function onPreviewHover(holder) {
    holder.on("mouseover", function(d) {
        d3.select(this).style("opacity", 0.5)
    });
    holder.on("mouseout", function(d) {
        d3.select(this).style("opacity", 1.0)
    })
}


$(function(){
    $("input[type='radio']").on("click",function(){
        colorBy =this.value;
        clickedDict ={}
        createLegend();
        recolorPlayers();
    })

})


//function onPreviewClick(svgClass, svgDisplay, sizes, data, ) {
//    svgClicked = d3.select("." + svgClass)
//    svgClicked.on("click", function() {
//                  displayFullTeamInfo(data, teamName, svg, selectedSizes)
//           })
//}

// TRYING TO FIGURE OUT WHATS GOING UP WITH v5 of d3.js
// d3.csv("data/Draft.csv").then(function(draft) {
//     let teams = d3.json("data/teams.json").then(function (teams) {
//         return teams.teams;
//     });
//     console.log(teams);
//     for (let key in draft) {
//         teamNames[key] = key;
//         console.log(key);
//     }
// });
// https://statsapi.web.nhl.com/api/v1/teams
// https://statsapi.web.nhl.com/api/v1/divisions