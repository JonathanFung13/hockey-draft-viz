// Constants
const MARGINS = {top: 5, right: 5, bottom: 5, left: 0}
const PREVIEW_SIZE = {"width": 95 - MARGINS.left - MARGINS.right, "height": 110 - MARGINS.top - MARGINS.bottom, radius: 2};
const DETAIL_SIZE = {"width": 780 , "height": 700 - MARGINS.top - MARGINS.bottom, radius: 12.5};
const YLOC_SCALE = 1.4;
const CIRCLE_GAP_FACTOR = 1.5; // To have same gap between rounds
console.log(PREVIEW_SIZE);
console.log(DETAIL_SIZE);

const TEAM_ABBRVS = {"Anaheim Ducks": "Anaheim", "Arizona Coyotes": "Arizona", "Boston Bruins": "Boston", "Buffalo Sabres": "Buffalo", "Calgary Flames": "Calgary", "Carolina Hurricanes": "Carolina", "Chicago Blackhawks": "Chicago", "Colorado Avalanche": "Colorado", "Columbus Blue Jackets": "Columbus", "Dallas Stars": "Dallas", "Detroit Red Wings": "Detroit", "Edmonton Oilers": "Edmonton", "Florida Panthers": "Florida", "Los Angeles Kings": "Los Angeles", "Minnesota Wild": "Minnesota", "Montréal Canadiens": "Montréal", "Nashville Predators": "Nashville", "New Jersey Devils": "New Jersey", "New York Islanders": "NY Islanders", "New York Rangers": "NY Rangers", "Ottawa Senators": "Ottawa", "Philadelphia Flyers": "Philadelphia", "Pittsburgh Penguins": "Pittsburgh", "San Jose Sharks": "San Jose", "St. Louis Blues": "St. Louis", "Tampa Bay Lightning": "Tampa Bay", "Toronto Maple Leafs": "Toronto", "Vancouver Canucks": "Vancouver", "Vegas Golden Knights": "Vegas", "Washington Capitals": "Washington", "Winnipeg Jets": "Winnipeg"}
const DIVISIONS = {"Anaheim Ducks": "#pacific", "Arizona Coyotes": "#pacific", "Boston Bruins": "#atlantic", "Buffalo Sabres": "#atlantic", "Calgary Flames": "#pacific", "Carolina Hurricanes": "#metropolitan", "Chicago Blackhawks": "#central", "Colorado Avalanche": "#central", "Columbus Blue Jackets": "#metropolitan", "Dallas Stars": "#central", "Detroit Red Wings": "#atlantic", "Edmonton Oilers": "#pacific", "Florida Panthers": "#atlantic", "Los Angeles Kings": "#pacific", "Minnesota Wild": "#central", "Montréal Canadiens": "#atlantic", "Nashville Predators": "#central", "New Jersey Devils": "#metropolitan", "New York Islanders": "#metropolitan", "New York Rangers": "#metropolitan", "Ottawa Senators": "#atlantic", "Philadelphia Flyers": "#metropolitan", "Pittsburgh Penguins": "#metropolitan", "San Jose Sharks": "#pacific", "St. Louis Blues": "#central", "Tampa Bay Lightning": "#atlantic", "Toronto Maple Leafs": "#atlantic", "Vancouver Canucks": "#pacific", "Vegas Golden Knights": "#pacific", "Washington Capitals": "#metropolitan", "Winnipeg Jets": "#central"}
const minDraftYear = 2003;
const maxDraftYear = 2018;
const draftRounds = [1,2,3,4,5,6,7];

const legendKey = {};
legendKey['status'] = {class: {"active": "active", "other_team": "other_team", "inactive": "inactive"},
    text: {"active": ["On roster", 90], "other_team": ["Other teams roster", 90], "inactive": ["Inactive", 120]}};
legendKey['gpClass'] = {class: {4: "four", 3: "three", 2: "two", 1: "one"},
    text: {4: [">60", 90], 3: ["40-60", 90], 2: ["20-40", 90], 1: ["0-20", 120]} };
legendKey['ppgClass'] = {class: {1: "one", 2: "two", 3: "three", 4: "four", 5: "five"},
    text: {1: ["0.0-0.25", 120], 2: ["0.25-0.50", 90],3: ["0.50-0.75", 90], 4: ["0.75-1.0", 90], 5: [">1.0", 90]} };

// Variables
let clickedDict = {"active": false, "inactive": false, "other_team": false};
let colorBy = $('#filters option:selected').val();
let playerProfile = {"active": undefined, "prevCircle": undefined};

// Start visualization
displayTeams();


async function displayTeams() {
    let data = await d3.csv('data/draft_data.csv');

    let svgHolder = d3.select("section");
    svgHolder.append("div")
        .attr("id", "SvgHolder")
        .attr("height", DETAIL_SIZE.height + MARGINS.top + MARGINS.bottom)
        .attr("width", DETAIL_SIZE.width);

    // Plot preview for each team.
    for (let i = 0; i < Object.keys(TEAM_ABBRVS).length; i++) {
        let teamName = Object.keys(TEAM_ABBRVS)[i];
        let picksByTeam = filterByTeamName(data, teamName);

        let previewHolder = d3.select(DIVISIONS[teamName])
            .append("div")
            .attr("class", "teamDiv teamDiv"+i);
        let previewSvg = createSvg(previewHolder, "Svg" + i, PREVIEW_SIZE);
        previewHolder.append("span")
            .html(TEAM_ABBRVS[teamName]);
        onPreviewHover(previewHolder); // change opacity of preview when you mouse over
        previewHolder.on("click", function(d) { // do stuff when you click a teams preview
            let borderParams = $(this).offset();
            d3.select("#selectedBorder > rect")
                .attr("x", borderParams.left - 8)
                .attr('y', borderParams.top - 64);
            displayTeamDetail(picksByTeam, teamName, svgHolder)
        });
        plotDraftPicks(picksByTeam, previewSvg, PREVIEW_SIZE)
    }

    // Draw border around selected team and choose team on top left.
    d3.select("section").append("svg")
        .attr("id", "selectedBorder")
        .append("rect")
        .attr("width", 75)
        .attr("height", 100);
    $(".teamDiv"+2).trigger("click");
    d3.select("section").append("div")
        .attr("id", "clickProf");

    // Get rid of player profile
    $("#SvgHolder").click(function(e) {
        if (!$(e.target).is("circle")) {
            d3.select("#clickProf > *").remove();
            if (playerProfile.active !== undefined) {
                playerProfile.active.clicked = false;
            }
            if (playerProfile.prevCircle !== undefined) {
                d3.select(playerProfile.prevCircle).style("stroke-opacity", "0");
                d3.select(playerProfile.prevCircle).style("stroke-width", "2px");
            }
        }
    });
    createLegend()
}

function filterByTeamName(data, teamName) {
    let dataFilteredByTeam = data.filter(function(d) {
        return d["team.name"] == teamName && d.year >= minDraftYear && d.year <= maxDraftYear
    });
    return dataFilteredByTeam;
}

function createSvg(svgHolder, className, sizes) {
    let radius = Math.ceil(sizes.width * 0.02);
    let g = svgHolder.append("svg")
        .attr("class", className) //+" preview-svg")
        .attr("width", sizes.width)//width + MARGINS.left + MARGINS.right)
        .attr("height", (sizes.height + MARGINS.top + MARGINS.bottom))
        .append("g")
        .attr("class", "circleGroup")
        .attr("transform", "translate(" + radius * 3 + "," + radius * 3 + ")");
    g.style("opacity", 0)
        .transition().duration(500).style("opacity", 1);
    return g;
}

function plotDraftPicks(draftsFilteredByTeamName, svg, sizes) {
    //let width = sizes.width;
    let height = sizes.height;
    let radius = sizes.radius;
    let positionsObject={};

    draftsFilteredByTeamName.forEach(function(d) {
        d.year =+ d.year;
        positionsObject[d.year]=0
    });

    let nested_data = d3.nest()
        .key(y => y.year)
        .key(function(d) {
            if (d.round > 7) {
                d.round = 7;
            }
            return d.round;
        })
        .rollup(leaves => leaves.length)
        .entries(draftsFilteredByTeamName);

    let prev_round = 1; // used to change the start location of the circles depending on the round
    let prev_year = maxDraftYear; //one that should be most recent year
    let draftPicks; //to locate circles depending on how many picks per round
    let posArr = nested_data.filter(function(nd) {
        return nd.key == prev_year;
    })[0].values.filter(function(nd) {
        return nd.key == prev_round;
    });

    let xPosition = function(d){
        // console.log(d.year,d.round,d.Pick,d.Overall,d["team.name"],d["prospect.fullName"], prev_year, prev_round);
        if (d.year != prev_year) {
            //reset prev_round to 0 at the beginning of new year
            prev_round = 0;
            posArr = nested_data.filter(function(nd) {
                return nd.key == d.year;
            })[0].values.filter(function(nd) {
                return nd.key == prev_round;
            });
            draftPicks=0;
        }
        if (d.round != prev_round) {
            draftPicks = 1;
            while (prev_round != d.round) {
                let sumFactor = 0;
                let limit;
                if (prev_round === "N/A") {
                    limit = 7;
                } else {
                    limit = prev_round;
                }
                for (let i = 0; i < limit; i++) {
                    sumFactor += CIRCLE_GAP_FACTOR;
                }
                positionsObject[d.year]=radius * 3 * (sumFactor-1)+radius*1.8;
                prev_round++;
                if (prev_round > 7) {
                    prev_round = "N/A"
                }
            }
            posArr = nested_data.filter(function(nd) {
                return nd.key == d.year;
            })[0].values.filter(function(nd) {
                return nd.key == d.round;
            });
            positionsObject[d.year]+=radius * 3;
            if (posArr[0].values === 1) {
                positionsObject[d.year] += radius
            }
        } else {
            draftPicks++;
            if (draftPicks === 3) {
                if (posArr[0].value == 3 || posArr[0].value == 5) {
                    positionsObject[d.year] -= radius*.9;
                } else {
                    positionsObject[d.year]-=radius*1.8;
                }
            } else if (posArr[0].value == 5 && draftPicks == 4) {
                positionsObject[d.year] -= radius*0.9;
            } else {
                positionsObject[d.year]+=radius*1.8
            }
        }
        prev_year = d.year;
        return positionsObject[d.year]
    };

    // Set the ranges
    let yLoc = d3.scaleLinear()
        .range([height/YLOC_SCALE, 0])
        .domain([minDraftYear, maxDraftYear]);

    let yPosition = function(d) {
        if (d.year != prev_year) {
            //reset prev_round to 1 at the beginning of new year
            prev_round = 1;
            posArr = nested_data.filter(nd => nd.key == d.year)[0]
                .values.filter(nd => nd.key == prev_round);
            draftPicks=0;
            //console.log(posArr);
        }
        if (d.round != prev_round) {
            draftPicks=0;
            posArr = nested_data.filter(nd => nd.key == d.year)[0]
                .values.filter(nd => nd.key == d.round);
        }
        draftPicks++;
        prev_round = d.round;
        prev_year = d.year;
        if (posArr[0].value === 5 && draftPicks !== 3) {
            if (draftPicks < 3) {
                return yLoc(d.year) - radius * 0.7
            } else {
                return yLoc(d.year) + radius * 0.7
            }
        }
        if (posArr[0].value === 3 || posArr[0].value === 4) { // 3 and 4
            if (draftPicks > 2) {
                return yLoc(d.year) + radius * 0.7
            } else {
                return yLoc(d.year) - radius * 0.7
            }
        }
        return yLoc(d.year)
    };

    // Add the scatterplot
    draftsFilteredByTeamName.forEach(function(d) {
        d.year =+ d.year;
        positionsObject[d.year] = 0
    });
    let circleWrap = svg.selectAll("dot")
        .data(draftsFilteredByTeamName)
        .enter()
        .append("g")
        .attr("class", "circleWrap")
        .style("opacity", 0.8);


    prev_round = 1;
    prev_year = maxDraftYear;
    draftPicks = 0;
    circleWrap.append("circle")
        .attr("class", function(d) {
            let val = d[colorBy];

            if (legendKey[colorBy].class[val] === undefined) {
                return legendKey[colorBy].class['unknown']
            }
            return legendKey[colorBy].class[val]
        })
        .attr("r", radius)
        .attr("cx", x => xPosition(x))
        .attr("cy", y => yPosition(y)
        );

    draftsFilteredByTeamName.forEach(function(d) {
        d.year =+ d.year;
        positionsObject[d.year]=0
    });


    // PROPAGATE STATUS FILTER
    for (let key in clickedDict) {
        if (clickedDict[key]) {
            d3.selectAll("."+key).classed("unselected",true);
        }
    }
    // For now
    let positionFunctions = {"xPosition": xPosition, "yPosition": yPosition};
    return positionFunctions
}

function displayTeamDetail(picksByTeam, teamName, svgHolder) {
    d3.selectAll("#SvgHolder > *").remove();

    svgHolder.select("#SvgHolder")
        .append("div")
        .attr("class", "teamTitle")
        .style("opacity", 0)
        .transition().duration(500).style("opacity", 1);

    svgHolder.select(".teamTitle")
        .append("div")
        .attr("id", "teamName")
        .text(teamName + " Draft Record");

    svgHolder.select("#SvgHolder")
        .append("div")
        .attr("id", "instruction")
        .attr("class", "highlighted")
        .text("Click on a circle to see detailed player information!");

    let svg = createSvg(svgHolder.select("#SvgHolder"), "selectedSvg", DETAIL_SIZE);
    let positionFunctions = plotDraftPicks(picksByTeam, svg, DETAIL_SIZE);
    addXYLabels(svg, DETAIL_SIZE.height, DETAIL_SIZE.radius);
    addPositionLabels(svg, positionFunctions);
    addHoverPreview(svg);
    d3.selectAll("#clickProf > *").remove();
    displayPlayerProfile(picksByTeam, svg, "#clickProf");
}


function recolorPlayers(){
    d3.selectAll("section circle")
        .attr("class", function(d) {
            let val = d[colorBy];

            if(legendKey[colorBy].class[val] === undefined) {
                return legendKey[colorBy].class['unknown']
            }
            return legendKey[colorBy].class[val]
        })
}

function createLegend(){
    d3.select("#legend svg").remove();
    let svgOrig = d3.select("#legend").append("svg")
        .attr("width", "700px") //to keep it below the svg files above
        .attr("height", "55px");
    let legend = svgOrig.append("g")
        .attr("class", "legend")
        .attr("transform","translate(45,5)");
    let count = 0;
    for (let i in legendKey[colorBy].class) {
        // let keys = Object.keys(legendKey[colorBy].class);
        legend.append("circle")
            .attr("cx", MARGINS.left - 30 + count*legendKey[colorBy].text[i][1])
            .attr("cy", 30)
            .attr("r", 10)
            .attr("class", legendKey[colorBy].class[i])
            .on("click", function(d) {

                let classSelect = this.className.baseVal.split(" ")[0];
                if (!clickedDict[classSelect] ) {
                    d3.selectAll("."+classSelect).each(function(d, i) {
                        d3.select(this).classed("unselected",true);
                    });
                    clickedDict[classSelect]=true;
                } else {
                    d3.selectAll("section ."+classSelect).each(function(d, i) {
                        d3.select(this).attr("class", function(d) {
                            let val =d[colorBy];
                            if(legendKey[colorBy].class[val] === undefined) {
                                return legendKey[colorBy].class['unknown']
                            }
                            return legendKey[colorBy].class[val]
                        })
                    });
                    clickedDict[classSelect]=false;
                    d3.select(this).classed("unselected",false);
                }
            });
        legend.append("text")
            .attr("x", MARGINS.left-15 +count *legendKey[colorBy].text[i][1])
            .attr("y", 35)
            .text(legendKey[colorBy].text[i][0]);
        count = count+1;
    }
}

function displayPlayerProfile(picksByTeam, svg, clickProf) {
    // On mouse click on any of the circles, show player profile
    svg.selectAll("g > g").each(function(d) {
        d3.select(this)
            .on("click", function(d) {
                d3.select("#instruction").classed("highlighted",false);
                if (d.clicked === undefined || !d.clicked) {
                    if (playerProfile.active !== undefined) {
                        playerProfile.active.clicked = false;
                    }
                    if (playerProfile.prevCircle !== undefined) {
                        d3.select(playerProfile.prevCircle).style("stroke-opacity", "0");
                        d3.select(playerProfile.prevCircle).style("stroke-width", "2px")
                    }
                    size = parseInt(window.innerWidth) * 0.2;
                    playerProfile.active = d;
                    d3.selectAll(clickProf+" > *").remove();
                    d3.select(clickProf).append("table").append("caption")
                        .attr("class", "nameCap")
                        .text(d["prospect.fullName"])
                    let tbody = d3.select(clickProf).select("table");
                    tbody.append("tr").append("th")
                        .attr("colspan", "4")
                        .attr("class", "heading")
                        .text(function() {
                            if (d.status === "inactive") {
                                return "Not Active"
                            } else {
                                return "#" + d.jerseyNumber + ", " + d.position + ", " + d.teamName
                            }
                        });
                    tbody.append("tr")
                        .attr("id", "expTr")
                        .append("td")
                        .attr("scope", "row")
                        .attr("class", "infoHeading")
                        .text("GP: ");
                    d3.select("#expTr").append("td")
                        .text("G: ");
                    d3.select("#expTr").append("td")
                        .text("A: ");
                    d3.select("#expTr").append("td")
                        .text("Pts: ");
                    tbody.append("tr")
                        .attr("id", "statTr")
                        .append("td")
                        .attr("scope", "row")
                        .attr("class", "infoHeading")
                        .text(d.gamesPlayed);
                    d3.select("#statTr").append("td")
                        .text(d.goals);
                    d3.select("#statTr").append("td")
                        .text(d.assists);
                    d3.select("#statTr").append("td")
                        .text(d.points);
                    tbody.append("tr").append("th")
                        .attr("colspan", "4")
                        .attr("class", "heading")
                        .text("Personal Information");
                    tbody.append("tr")
                        .attr("id", "ageTr")
                        .append("th")
                        .attr("colspan", "2")
                        .attr("scope", "row")
                        .attr("class", "infoHeading")
                        .append("span").text("Birth Date: ");
                    d3.select("#ageTr").append("td")
                        .attr("colspan", "2")
                        .text(d.birthDate);
                    tbody.append("tr")
                        .attr("id", "heightTr")
                        .append("th")
                        .attr("colspan", "2")
                        .attr("class", "infoHeading")
                        .attr("scope", "row")
                        .text("Height: ");
                    d3.select("#heightTr").append("td")
                        .attr("colspan", "2")
                        .text(d.height);
                    tbody.append("tr")
                        .attr("id", "weightTr")
                        .append("th")
                        .attr("colspan", "2")
                        .attr("class", "infoHeading")
                        .attr("scope", "row")
                        .text("Weight: ");
                    d3.select("#weightTr").append("td")
                        .attr("colspan", "2")
                        .text(d.weight);
                    tbody.append("tr")
                        .attr("id", "bornTr")
                        .append("th")
                        .attr("colspan", "2")
                        .attr("scope", "row")
                        .attr("class", "infoHeading")
                        .append("span")
                        .text("Nationality: ");
                    d3.select("#bornTr")
                        .attr("colspan", "2")
                        .append("td").text(d.nationality);
                    tbody.append("tr").append("th")
                        .attr("class", "heading")
                        .attr("colspan", "4")
                        .text("Amateur History");
                    tbody.append("tr")
                        .attr("id", 'hsTr')
                        .append("td")
                        .attr("colspan", "4")
                        .attr("class", "infoHeading")
                        .text(d['amateurTeam.name'] + " (" + d['amateurLeague.name'] + ")");

                    d.clicked = true;
                    //TODO: work for both sides
                    // highlights the circle when clicked
                    let childCircle = this.childNodes[0];
                    d3.select(childCircle).style("stroke", "#ffeb00");
                    d3.select(childCircle).style("stroke-opacity", ".5");
                    d3.select(childCircle).style("stroke-width", "6px");
                    playerProfile.prevCircle = childCircle
                } else {
                    d3.selectAll(clickProf+" > *").remove();
                    d.clicked =false;

                    //Unhighlight the circle and go back to normal styling
                    let childCircle = this.childNodes[0];

                    d3.select(childCircle).style("stroke-opacity", "0");
                    d3.select(childCircle).style("stroke-width", "2px")

                }
            })
    })
}


function addHoverPreview(svg) {
    svg.selectAll("g")
        .on("mouseover", function(d) {
            d3.select(this).style("opacity", 1);
            let divText = d3.selectAll("body")
                .append("div")
                .attr("class", "previewWrap")
                .attr("width", "200px");
            divText
                .append("div")
                .text("Name: " + d["prospect.fullName"]);
            divText
                .append("div")
                .text("Draft Year: " + d.year);
            divText
                .append("div")
                .text("Round: " + d.round);
            divText
                .append("div")
                .text("Pick: " + d.pickOverall);

            divText
                .append("div")
                .text("Status: " + legendKey['status'].text[d.status][0]);

            divText
                .append("div")
                .text("Games Played: " + d.gamesPlayed);

            divText
                .append("div")
                .text("Points: " + d.points);

            divText
                .append("div")
                .text("Points per game: " + (+d.pointsPerGame).toFixed(3));
        })
        .on("mousemove", function() {
            d3.select(this).style("opacity", 1);
            d3.selectAll(".previewWrap")
                .style("top", (d3.mouse(document.body)[1] + 40) + "px")
                .style("left", (d3.mouse(document.body)[0] + 20) + "px");
        })
        .on("mouseout", function(d) {
            d3.selectAll(".previewWrap").remove();
            d3.select(this).style("opacity", .8)
        })
}

function addXYLabels(svg, height, radius) {
    // Add the draft year labels to the Y Axis
    let y = d3.scaleTime()
        .domain([new Date(minDraftYear,0,1), new Date(maxDraftYear,0,1)])
        .range([height/YLOC_SCALE, 0]);
    let yAxis = d3.axisLeft(y)
        .ticks(d3.timeYear);

    svg.append("g")
        .attr("class", "yAxis")
        .call(yAxis)
        .style("fill", "aliceblue")
        .style("font-size", String(radius * 1.3) + "px");

    // Add the draft round labels to the X Axis
    let xTicks = svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(-6,-35)");
        //.style("font-size", radius * 1.3);

    for (let i = 0; i < draftRounds.length; i++) {
        xTicks.append("text")
            .text('R' + draftRounds[i])
            .attr("x", function() {
                let sumFactor = 0;
                for (let j = 0; j < i; j++) {
                    sumFactor += (CIRCLE_GAP_FACTOR - 0.01);
                }
                return radius * 3 * (sumFactor)+radius*2.5;
            })
    }
}

function addPositionLabels(svg, positionFunctions) {
    svg.selectAll(".circleWrap")
        .append("text")
        .attr("class", "positionLabel")
        .attr("text-anchor", "middle")
        .text(pos => pos.position)
        .attr("x", x => positionFunctions.xPosition(x))
        .attr("y", y => positionFunctions.yPosition(y)+5)
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
    $("#filters").on("click",function(){ //$("#yourdropdownid option:selected").text();
        colorBy =this.value;
        clickedDict ={};
        createLegend();
        recolorPlayers();
    })

});