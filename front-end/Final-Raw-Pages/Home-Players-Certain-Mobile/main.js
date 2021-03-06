"use strict";
angular
    .module("myApp", [
        "ngRoute",
        "ngAnimate",
        "myApp.filters",
        "myApp.leagueView",
        "myApp.playerView",
        "myApp.compareView",
        "myApp.reports",
        "myApp.shotChart",
        "myApp.lineChart",
        "myApp.signature",
        "myApp.services",
        "myApp.rangeSlider-directive",
        "myApp.ranks",
        "myApp.playerSelector",
        "myApp.gameSelector",
        "myApp.chartUtil"
    ])
    .config([
        "$routeProvider",
        function (a) {
            a.otherwise({redirectTo: "/playerView/"})
        }
    ])
    .run([
        "$rootScope",
        "Team",
        function (a, b) {
            a.teams = b.teamsList()
        }
    ])
    .controller("NavCtrl", [
        "$scope",
        "$location",
        "Url",
        function (a, b, c) {
            a.isActive = function (a) {
                return a === b
                    .path()
                    .substr(0, a.length)
            },
            a.getUrl = function (a) {
                return "#" + c.getUrl(a)
            }
        }
    ]),
angular.module(
    "myApp.services",
    ["myApp.services.data", "myApp.services.util"]
);
var services = angular.module("myApp.services.data", ["ngResource"]);
services.factory("Player", [
    "$resource",
    function (a) {
        return a("./api/players.php?player=:playerId", {}, {
            query: {
                cache: !0,
                method: "GET",
                params: {
                    playerId: void 0,
                    season: void 0
                },
                isArray: !0
            }
        })
    }
]),
services.factory("Shots", [
    "$resource",
    function (a) {
        return a("./api/shoot.php?player=:playerId", {}, {
            query: {
                cache: !0,
                method: "GET",
                params: {
                    playerId: 0
                },
                isArray: !0
            }
        })
    }
]),
services.factory("ShotAverages", [
    "$resource",
    function (a) {
        return a("./api/shot_average.php", {}, {
            query: {
                cache: !0,
                method: "GET",
                params: {
                    type: "league",
                    typeAux: null
                },
                isArray: !0
            }
        })
    }
]),
services.factory("DistanceAverages", [
    function () {
        var a = BucketsData.distanceAverages,
            b = a.reduce(function (a, b) {
                var c = a[b.SEASON] = a[b.SEASON] || {};
                return c[b.TYPE] = c[b.TYPE] || [],
                c[b.TYPE].push(b),
                a
            }, {});
        return {data: b}
    }
]),
services.factory("LeagueAverages", [
    function () {
        var a = BucketsData
                .binMetadata
                .reduce(function (a, b) {
                    return a[b.ROW] = a[b.ROW] || [],
                    a[b.ROW][b.COL] = b,
                    a
                }, []),
            b = 47,
            c = 50,
            d = function (b, c, d) {
                var e,
                    f,
                    g,
                    h,
                    i = {};
                for (e = 0; c > e; e++) 
                    for (f = 0; d > f; f++) 
                        if (g = b[e][f]) {
                            var j = a[e][f];
                            h = j.RNG + j.AREA,
                            i[h] || (i[h] = {
                                count: 0,
                                made: 0,
                                zone: h
                            }),
                            i[h].count += g.count,
                            i[h].made += g.made,
                            g.zoneStats = i[h]
                        }
                    },
            e = BucketsData.overallAverages;
        e.forEach(function (a) {
            a.MADE = parseInt(a.MADE, 10)
        });
        var f = e.reduce(function (a, b) {
                return a[b.SEASON] = b,
                a
            }, {}),
            g = BucketsData.leagueAverages,
            h = g.reduce(function (a, b) {
                return a[b.SEASON] = a[b.SEASON] || {},
                a[b.SEASON].general = a[b.SEASON].general || [],
                a[b.SEASON].general[b.ROW] = a[b.SEASON].general[b.ROW] || [],
                a[b.SEASON].general[b.ROW][b.COL] = {
                    count: b.COUNT,
                    made: b.MADE,
                    ROW: b.ROW,
                    COL: b.COL
                },
                a[b.SEASON].eff = a[b.SEASON].eff || [],
                a[b.SEASON].eff[b.ROW] = a[b.SEASON].eff[b.ROW] || [],
                a[b.SEASON].eff[b.ROW][b.COL] = b.EFF,
                a[b.SEASON].eff_weighted = a[b.SEASON].eff_weighted || [],
                a[b.SEASON].eff_weighted[b.ROW] = a[b.SEASON].eff_weighted[b.ROW] || [],
                a[b.SEASON].eff_weighted[b.ROW][b.COL] = b.WEIGHTED_EFF,
                a
            }, {});
        return Object
            .keys(h)
            .forEach(function (a) {
                d(h[a].general, b, c)
            }), {
            overall: f,
            league: h
        }
    }
]),
services.factory("Team", [
    function () {
        var a = BucketsData.teams;
        a.forEach(function (a) {
            a.FULL_NAME = a.TEAM_CITY + " " + a.TEAM_NAME
        });
        var b = a.reduce(function (a, b) {
            return a[b.TEAM_ID] = b,
            a
        }, {});
        return {
            byId: function (a) {
                return b[a]
            },
            teamsList: function () {
                return a
            }
        }
    }
]),
services.factory("CurrentTop", [
    function () {
        var a = BucketsData.topPoints,
            b = BucketsData.topFga;
        return {points: a, fga: b}
    }
]),
services.factory("Season", [
    function () {
        var a = [
                {
                    id: "2011",
                    label: "2011-12"
                }, {
                    id: "2012",
                    label: "2012-13"
                }, {
                    id: "2013",
                    label: "2013-14"
                }, {
                    id: "2014",
                    label: "2014-15"
                }, {
                    id: "2015",
                    label: "2015-16"
                }
            ],
            b = a[a.length - 1];
        return {
            list: function () {
                return a
            },
            "default": function () {
                return b
            },
            byId: function (b) {
                for (var c = 0; c < a.length; c++) 
                    if (a[c].id === String(b)) 
                        return a[c];
            return null
            },
            label: function (a) {
                var b = this.byId(a);
                return b
                    ? b.label
                    : ""
            }
        }
    }
]),
services.factory("PlayerGameStats", [
    "$resource",
    function (a) {
        return a("./api/player_game_stats.php?player=:playerId", {}, {
            query: {
                cache: !0,
                method: "GET",
                params: {
                    playerId: 0
                },
                isArray: !0,
                transformResponse: function (a) {
                    var b = JSON.parse(a);
                    return b.forEach(function (a) {
                        a.OPPONENT_ID = a.IS_HOME
                            ? a.VISITOR_TEAM_ID
                            : a.HOME_TEAM_ID
                    }),
                    b
                }
            }
        })
    }
]),
services.factory("NearRanks", [
    "$resource",
    function (a) {
        var b = function (a, b) {
                var c = b[a],
                    d = c - 5,
                    e = c + 5;
                return 1 > d && (e += 1 - d, d = 1),
                function (b) {
                    return b[a] >= d && b[a] <= e
                }
            },
            c = function (a) {
                return function (b, c) {
                    return b[a] - c[a]
                }
            };
        return a("./api/player_near_ranks.php?player=:playerId", {}, {
            query: {
                cache: !0,
                method: "GET",
                params: {
                    playerId: 0
                },
                isArray: !1,
                transformResponse: function (a) {
                    a = JSON.parse(a);
                    var d = a.player,
                        e = a.near,
                        f = {
                            TOTAL_FGM: e
                                .filter(b("FGM_RANK", d))
                                .sort(c("FGM_RANK")),
                            TOTAL_FGA: e
                                .filter(b("FGA_RANK", d))
                                .sort(c("FGA_RANK")),
                            TOTAL_FG3M: e
                                .filter(b("FG3M_RANK", d))
                                .sort(c("FG3M_RANK")),
                            TOTAL_FG3A: e
                                .filter(b("FG3A_RANK", d))
                                .sort(c("FG3A_RANK")),
                            PTS: e
                                .filter(b("PTS_RANK", d))
                                .sort(c("PTS_RANK")),
                            SECONDS: e
                                .filter(b("SECONDS_RANK", d))
                                .sort(c("SECONDS_RANK")),
                            GP: e
                                .filter(b("GP_RANK", d))
                                .sort(c("GP_RANK")),
                            FGPCT: e
                                .filter(b("FGPCT_RANK", d))
                                .sort(c("FGPCT_RANK")),
                            FG3PCT: e
                                .filter(b("FG3PCT_RANK", d))
                                .sort(c("FG3PCT_RANK"))
                        };
                    return e.forEach(function (a) {
                        a.FGPCT = a.TOTAL_FGM / a.TOTAL_FGA,
                        a.FG3PCT = a.TOTAL_FG3M / a.TOTAL_FG3A
                    }),
                    f
                }
            }
        })
    }
]),
services.factory("VsTeam", [
    "Team",
    "$resource",
    function (a, b) {
        return b("./api/vs_team_stats.php", {}, {
            query: {
                cache: !0,
                method: "GET",
                params: {
                    playerId: 0
                },
                isArray: !0,
                transformResponse: function (b) {
                    var c = JSON.parse(b);
                    return c.sort(function (b, c) {
                        return a
                            .byId(b.OPPONENT_ID)
                            .TEAM_NAME > a
                            .byId(c.OPPONENT_ID)
                            .TEAM_NAME
                                ? 1
                                : -1
                    }),
                    c
                }
            }
        })
    }
]),
services.factory("ShotData", [
    function () {
        var a = function (a, b, c) {
                for (var d = 2, e = 0; e < a.length; e++) {
                    var f = a[e];
                    f[c] = f[b];
                    for (var g = 1, h = 1; d >= h; h++) {
                        var i = 1 / h,
                            j = a[e + h],
                            k = a[e - h],
                            l = 0,
                            m = 0;
                        j && (l += j[b], m++),
                        k && (l += k[b], m++),
                        m && (l /= m, f[c] += l * i, g += i),
                        f[c] /= g
                    }
                }
            },
            b = function (b, c, d, e) {
                function f(a, b, c) {
                    a.values[b] = g[a.name][c] || {
                        distance: c,
                        count: 0,
                        made: 0,
                        weightedCount: 0,
                        weightedMade: 0
                    },
                    a.totalShots += a
                        .values[b]
                        .count
                }
                var g = {
                    overall: {},
                    league: {},
                    active: {}
                };
                b.forEach(function (a) {
                    var b = a.SHOT_MADE_FLAG
                            ? 1
                            : 0,
                        c = g.overall[a.SHOT_DISTANCE] || {
                            distance: a.SHOT_DISTANCE,
                            count: 0,
                            made: 0,
                            weightedCount: 0,
                            weightedMade: 0
                        };
                    if (
                        c.count++,
                        c.made += b,
                        g.overall[a.SHOT_DISTANCE] = c,
                        e && e[a.GAME_ID] !== !1
                    ) {
                        var d = g.active[a.SHOT_DISTANCE] || {
                            distance: a.SHOT_DISTANCE,
                            count: 0,
                            made: 0,
                            weightedCount: 0,
                            weightedMade: 0
                        };
                        d.count++,
                        d.made += b,
                        g.active[a.SHOT_DISTANCE] = d
                    }
                });
                var h = ["league"];
                void 0 !== d && (h[1] = d.split("-")[0].toLowerCase()),
                h.forEach(function (a) {
                    g[a] = {},
                    c[a].forEach(function (b) {
                        g[a][b.SHOT_DISTANCE] = {
                            distance: b.SHOT_DISTANCE,
                            count: b.COUNT,
                            made: b.MADE,
                            weightedCount: b.COUNT,
                            weightedMade: b.MADE
                        }
                    })
                });
                var i = Object.keys(g.league),
                    j = {
                        name: "overall",
                        values: [],
                        totalShots: 0
                    },
                    k = {
                        name: "active",
                        values: [],
                        totalShots: 0
                    },
                    l = [];
                h.forEach(function (a, b) {
                    l[b] = {
                        name: a,
                        values: [],
                        totalShots: 0
                    }
                });
                for (var m, n = 0; n < i.length; n++) {
                    m = parseInt(i[n], 10),
                    f(j, n, m),
                    f(k, n, m);
                    for (var o = 0; o < l.length; o++) 
                        f(l[o], n, m)
                }
                var p = [j].concat(l);
                e && (p = p.concat([k]));
                return p.forEach(function (b) {
                    a(b.values, "count", "weightedCount"),
                    a(b.values, "made", "weightedMade"),
                    b
                        .values
                        .forEach(function (a) {
                            a.freq = a.count / b.totalShots,
                            a.weightedFreq = a.weightedCount / b.totalShots
                        })
                }),
                p
            },
            c = function (b, c) {
                var d = {};
                c && (b = b.filter(function (a) {
                    return c[a.GAME_ID] !== !1
                }));
                for (var e = {
                    leftCount: 0,
                    leftMade: 0,
                    rightCount: 0,
                    rightMade: 0,
                    count: b.length
                }, f = 0; 30 >= f; f++) 
                    d[f] = {
                        distance: f,
                        leftCount: 0,
                        rightCount: 0,
                        leftMade: 0,
                        rightMade: 0,
                        lrCount: 0
                    };
                b.forEach(function (a) {
                    var b = a.SHOT_MADE_FLAG
                            ? 1
                            : 0,
                        c = d[a.SHOT_DISTANCE] || {
                            distance: a.SHOT_DISTANCE,
                            leftCount: 0,
                            rightCount: 0,
                            leftMade: 0,
                            rightMade: 0,
                            lrCount: 0
                        };
                    a.LOC_X < 0
                        ? (c.leftCount++, c.lrCount--, c.leftMade += b, e.leftCount++, e.leftMade += b)
                        : (
                            c.rightCount++,
                            c.lrCount++,
                            c.rightMade += b,
                            e.rightCount++,
                            e.rightMade += b
                        ),
                    d[a.SHOT_DISTANCE] = c
                });
                for (var g, h = [], i = Object.keys(d), f = (b.length, 0); f < i.length; f++) {
                    g = parseInt(i[f], 10);
                    var j = d[g];
                    j.lrFreq = j.lrCount / (j.leftCount + j.rightCount);
                    var k = 0 === j.leftCount
                            ? 0
                            : j.leftMade / j.leftCount,
                        l = 0 === j.rightCount
                            ? 0
                            : j.rightMade / j.rightCount;
                    j.leftEff = k,
                    j.rightEff = l,
                    j.lrEff = l - k,
                    h[f] = j
                }
                for (
                    a(h, "leftCount", "weightedLeftCount"),
                    a(h, "rightCount", "weightedRightCount"),
                    a(h, "leftMade", "weightedLeftMade"),
                    a(h, "rightMade", "weightedRightMade"),
                    f = 0;
                    f < h.length;
                    f++
                ) {
                    var j = h[f];
                    j.leftWeightedEff = 0 === j.weightedLeftCount
                        ? 0
                        : j.weightedLeftMade / j.weightedLeftCount,
                    j.rightWeightedEff = 0 === j.weightedRightCount
                        ? 0
                        : j.weightedRightMade / j.weightedRightCount,
                    j.lrWeightedEff = j.rightWeightedEff - j.leftWeightedEff
                }
                return {values: h, total: e}
            };
        return {prepareDistanceData: b, prepareLeftRightDistanceData: c}
    }
]),
services.factory("ReportPlayers", [
    "$resource",
    function (a) {
        return a(
            "./api/report_players.php?season=:season&numPlayers=:numPlayers",
            {},
            {
                query: {
                    cache: !0,
                    method: "GET",
                    params: {
                        season: 2015,
                        numPlayers: 10
                    },
                    isArray: !0
                }
            }
        )
    }
]);
var services = angular.module("myApp.services.util", ["ngResource"]);
services.factory("Util", [
    function () {
        function a() {
            return !!navigator
                .userAgent
                .match(/Version\/[\d\.]+.*Safari/)
        }
        function b(b, c, d) {
            a() && b
                .attr("width", c)
                .attr("height", d)
        }
        function c(a) {
            var b = a
                .attr("version", 1.1)
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .style("background", a.style("background"))
                .node()
                .parentNode
                .innerHTML;
            return "data:image/svg+xml;base64," + btoa(b)
        }
        function d(a, b) {
            var c = document.createElement("a");
            c.download = b,
            c.href = a,
            c.click()
        }
        function e() {
            var a,
                b,
                c,
                d,
                e;
            for (a = "", b = 0; b < document.styleSheets.length; b++) 
                if (
                    d = document.styleSheets[b].href,
                    d && ("/app.css" === d.substr(d.length - 8) || "/main.css" === d.substr(d.length - 9))
                ) 
                    for (e = document.styleSheets[b].rules, c = 0; c < e.length; c++) 
                        a += e[c].cssText + "\n";
        return a
        }
        function f(a, b) {
            function c() {
                if (
                    n.font = "12px sans-serif",
                    n.fillStyle = "#aaa",
                    n.fillText("http://peterbeshai.com/buckets/", 6, m - i + 12),
                    n.fillText("Visualization by @pbesh", l - 139, m - i + 12),
                    "0px" !== a.style("border-width")
                ) {
                    var c = a.style("border-color");
                    n.strokeStyle = c,
                    n.strokeRect(0, 0, l, m)
                }
                var e = g[0].toDataURL("image/png");
                d(e, b)
            }
            a
                .select(".export-markings")
                .style("opacity", 1),
            a
                .select("style")
                .text(e());
            var f = a
                .attr("version", 1.1)
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .style("background", a.style("background"))
                .node()
                .parentNode
                .innerHTML
                .replace(/>\s+/g, ">")
                .replace(/\s+</g, "<");
            a
                .select(".export-markings")
                .style("opacity", 0);
            var g = $("#image-saver-canvas"),
                h = a
                    .node()
                    .getBoundingClientRect(),
                i = 16,
                j = h.width,
                k = h.height,
                l = 600,
                m = l / j * k + i;
            g.attr("width", l),
            g.attr("height", m);
            var n = g[0].getContext("2d");
            n.fillStyle = "#fff",
            n.fillRect(0, 0, l, m),
            canvg("image-saver-canvas", f, {
                renderCallback: c,
                ignoreClear: !0,
                ignoreMouse: !0,
                ignoreAnimation: !0,
                scaleWidth: l,
                scaleHeight: m - i,
                ignoreDimensions: !0
            })
        }
        return {saveSvgAsPng: f, svgImgSrc: c, isSafari: a, safariSvg: b}
    }
]),
services.factory("Location", [
    "$location",
    "$route",
    "$rootScope",
    "$routeParams",
    function (a, b, c, d) {
        var e = b.current;
        if (a.skipReload = function () {
            var f = c.$on("$locationChangeSuccess", function () {
                angular.copy(b.current.params, d),
                b.current = e,
                f()
            });
            return a
        }, a.intercept) 
            throw "$location.intercept is already defined";
        return a.intercept = function (f, g) {
            function h() {
                var b = a
                    .path()
                    .match(f);
                return b
                    ? (b.shift(), b)
                    : void 0
            }
            var i = c.$on("$locationChangeSuccess", function () {
                var a = h();
                return a && g(a) !== !1
                    ? (angular.copy(b.current.params, d), void(b.current = e))
                    : i()
            })
        },
        a
    }
]),
services.factory("Url", [
    "Location",
    function (a) {
        function b(a) {
            return f[a]
                ? d(f[a])
                : a
        }
        function c(b, c, e) {
            var g = f[b];
            void 0 === g && (f[b] = g = {}),
            g.base = c,
            g.params = e;
            var h = d(g);
            return a.url() !== h
                ? (a.skipReload().url(h), h)
                : !1
        }
        function d(a) {
            var b;
            b = JSON.stringify(a),
            b = a.base;
            var c = Object
                .keys(a.params)
                .map(function (b) {
                    return b + "=" + a.params[b]
                })
                .join("&");
            return c.length && (b += "?" + c),
            b
        }
        function e(b) {
            b = b || a.url();
            var c = {},
                d = b.split("?")[1];
            if (!d) 
                return c;
            var e = d.split("&");
            return e.forEach(function (a) {
                var b = a.split("=");
                c[b[0]] = b[1]
            }),
            c
        }
        var f = {
            "/playerView": {
                base: "/playerView/",
                params: {}
            },
            "/compareView": {
                base: "/compareView/",
                params: {}
            },
            "/leagueView": {
                base: "/leagueView/",
                params: {}
            }
        };
        return {getUrl: b, updateUrl: c, urlString: d, urlToParams: e}
    }
]),
angular
    .module("myApp.leagueView", ["ngRoute"])
    .config([
        "$routeProvider",
        function (a) {
            a
                .when("/leagueView", {
                    templateUrl: "pages/leagueView/leagueView.html",
                    controller: "LeagueViewCtrl"
                })
                .when("/leagueView/:season", {
                    templateUrl: "pages/leagueView/leagueView.html",
                    controller: "LeagueViewCtrl"
                })
        }
    ])
    .controller("LeagueViewCtrl", [
        "$scope",
        "ShotAverages",
        "ShotChartUtil",
        "Url",
        "Season",
        "$routeParams",
        function (a, b, c, d, e, f) {
            function g() {
                b.query({
                    season: a.selectedSeason
                }, function (b) {
                    a.avgData = b
                }),
                b.query({
                    type: "position",
                    season: a.selectedSeason
                }, function (b) {
                    a.guardData = b.filter(function (a) {
                        return "guard" === a.TYPE_AUX
                    }),
                    a.forwardData = b.filter(function (a) {
                        return "forward" === a.TYPE_AUX
                    }),
                    a.centerData = b.filter(function (a) {
                        return "center" === a.TYPE_AUX
                    })
                }),
                a.teamsLoaded && a.loadTeams()
            }
            function h() {
                var b = "/leagueView/" + a.selectedSeason,
                    e = {},
                    f = c.shotChartFiltersAsParams(
                        a.leagueFilters,
                        n.league.defaults,
                        n.league.prefix
                    ),
                    g = c.shotChartFiltersAsParams(
                        a.positionFilters,
                        n.position.defaults,
                        n.position.prefix
                    ),
                    h = c.shotChartFiltersAsParams(a.teamFilters, n.team.defaults, n.team.prefix),
                    i = j(),
                    k = l(),
                    m = c.shotChartHeatmapFiltersAsParams(
                        a.heatmapLeagueFilters,
                        o.league.defaults,
                        o.league.prefix
                    ),
                    p = c.shotChartHeatmapFiltersAsParams(
                        a.heatmapPositionFilters,
                        o.position.defaults,
                        o.position.prefix
                    ),
                    q = c.shotChartHeatmapFiltersAsParams(
                        a.heatmapTeamFilters,
                        o.team.defaults,
                        o.team.prefix
                    );
                $.extend(e, f, g, h, i, k, m, p, q),
                d.updateUrl("/leagueView", b, e)
            }
            function i() {
                var b = d.urlToParams();
                a.chartType = "heatmap" === b.chartType
                    ? "heatmap"
                    : "shot-chart"
            }
            function j() {
                return "heatmap" === a.chartType
                    ? {
                        chartType: "heatmap"
                    }
                    : {}
            }
            function k() {
                var b = d.urlToParams();
                a.teamsLoaded = "true" === b.teams
            }
            function l() {
                return a.teamsLoaded
                    ? {
                        teams: !0
                    }
                    : {}
            }
            a.seasons = e.list();
            var m = f.season;
            e.byId(m) || (m = e.default().id),
            a.selectedSeason = m;
            var n = {
                league: {
                    defaults: {
                        count: {
                            min: 100
                        },
                        dataType: "raw",
                        colorRange: "six"
                    },
                    prefix: "l_"
                },
                position: {
                    defaults: {
                        count: {
                            min: 50
                        },
                        dataType: "raw",
                        colorRange: "six"
                    },
                    prefix: "p_"
                },
                team: {
                    defaults: {
                        count: {
                            min: 5
                        },
                        showLegend: !1,
                        dataType: "zones",
                        colorRange: "six"
                    },
                    prefix: "t_"
                }
            };
            a.leagueFilters = {},
            c.shotChartFiltersFromUrl(a.leagueFilters, n.league.defaults, n.league.prefix),
            a.positionFilters = {},
            c.shotChartFiltersFromUrl(
                a.positionFilters,
                n.position.defaults,
                n.position.prefix
            ),
            a.teamFilters = {},
            c.shotChartFiltersFromUrl(a.teamFilters, n.team.defaults, n.team.prefix);
            var o = {
                league: {
                    defaults: {},
                    prefix: "l_"
                },
                position: {
                    defaults: {},
                    prefix: "p_"
                },
                team: {
                    defaults: {},
                    prefix: "t_"
                }
            };
            a.heatmapLeagueFilters = {},
            c.shotChartHeatmapFiltersFromUrl(
                a.heatmapLeagueFilters,
                o.league.defaults,
                o.league.prefix
            ),
            a.heatmapPositionFilters = {},
            c.shotChartHeatmapFiltersFromUrl(
                a.heatmapPositionFilters,
                o.position.defaults,
                o.position.prefix
            ),
            a.heatmapTeamFilters = {},
            c.shotChartHeatmapFiltersFromUrl(
                a.heatmapTeamFilters,
                o.team.defaults,
                o.team.prefix
            ),
            a.binHighlight = null,
            i(),
            a.toggleChartType = function () {
                a.chartType = "shot-chart" === a.chartType
                    ? "heatmap"
                    : "shot-chart"
            },
            a.$watch("selectedSeason", function () {
                g(),
                h()
            }),
            a.teamsData = {},
            a.loadTeams = function () {
                a.teamsLoaded = !0,
                a
                    .teams
                    .forEach(function (c) {
                        b.query({
                            type: "team",
                            typeAux: c.TEAM_ID,
                            season: a.selectedSeason
                        }, function (b) {
                            var d = b.reduce(function (a, b) {
                                return a.count += b.COUNT,
                                a.made += b.MADE,
                                a
                            }, {
                                count: 0,
                                made: 0
                            });
                            a.teamsData[c.TEAM_ID] = {
                                data: b,
                                count: d.count,
                                made: d.made
                            }
                        })
                    })
            },
            k(),
            g(),
            a.toggleZoomTeam = function (b) {
                a.zoomTeam = a.zoomTeam === b
                    ? null
                    : b
            },
            a.$watch("leagueFilters", h, !0),
            a.$watch("positionFilters", h, !0),
            a.$watch("teamFilters", h, !0),
            a.$watch("teamsLoaded", h),
            a.$watch("chartType", h),
            a.$watch("heatmapLeagueFilters", h, !0),
            a.$watch("heatmapPositionFilters", h, !0),
            a.$watch("heatmapTeamFilters", h, !0)
        }
    ]),
angular
    .module("myApp.playerView", ["ngRoute"])
    .config([
        "$routeProvider",
        function (a) {
            a.when("/playerView/:playerId", {
                templateUrl: "pages/playerView/playerView.html",
                controller: "PlayerViewCtrl"
            }),
            a.when("/playerView/", {
                templateUrl: "pages/playerView/playerView.html",
                controller: "PlayerViewCtrl"
            })
        }
    ])
    .controller("PlayerViewCtrl", [
        "$scope",
        "$rootScope",
        "Player",
        "Team",
        "Shots",
        "DistanceAverages",
        "ShotData",
        "VsTeam",
        "NearRanks",
        "PlayerGameStats",
        "$routeParams",
        "Location",
        "Url",
        "ShotChartUtil",
        "PlayerSelectorUtil",
        "GameSelectorUtil",
        "Season",
        "CurrentTop",
        function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r) {
            function s(b, c) {
                if (b = b || a.shots, c = c || a.player, b && c) {
                    var d = a.gameFilteringActive();
                    a.shots = b,
                    a.distanceData = g.prepareDistanceData(
                        b,
                        a.leagueDistanceAverages,
                        c.POSITION,
                        d
                            ? a.activeGames
                            : void 0
                    ),
                    a.leftRightDistanceData = g.prepareLeftRightDistanceData(
                        b,
                        d
                            ? a.activeGames
                            : void 0
                    ),
                    window.distanceData = a.distanceData
                }
            }
            function t(b) {
                if (b) {
                    var c = b.SEASON;
                    a.activeSeason.id !== c && (a.activeSeason = q.byId(c)),
                    v
                        ? (v = !1, a.activeGames = p.activeGamesFromUrl())
                        : a.activeGames = {},
                    u(),
                    e.query({
                        playerId: b.PLAYER_ID,
                        season: c
                    }, function (a) {
                        s(a, b)
                    }),
                    h.query({
                        playerId: b.PLAYER_ID,
                        season: c
                    }, function (b) {
                        a.vsTeamStats = b
                    }),
                    i.query({
                        playerId: b.PLAYER_ID,
                        season: c
                    }, function (b) {
                        a.nearRanks = b
                    }),
                    j.query({
                        playerId: b.PLAYER_ID,
                        season: c
                    }, function (b) {
                        a.gameStats = b
                    }),
                    a.distanceHighlight = null
                }
            }
            function u() {
                var b = a.player;
                if (b) {
                    var c = "/playerView/" + b.PLAYER_ID + "_" + b.SEASON,
                        d = {},
                        e = o.playerSelectorAsParams(a.playerSelectorVisible),
                        f = n.shotChartFiltersAsParams(a.shotChartFilters),
                        g = p.activeGamesAsParams(a.activeGames);
                    $.extend(d, e, f, g),
                    m.updateUrl("/playerView", c, d)
                }
            }
            var v = !0;
            a.activeGames = {},
            a.playerSelectorVisible = o
                .playerSelectorFromUrl()
                .playerSelector,
            a.shotChartFilters = {},
            n.shotChartFiltersFromUrl(a.shotChartFilters);
            var w = k.playerId || r
                    .fga[0]
                    .PLAYER_ID,
                x = String(w).split("_"),
                y = x[0],
                z = x[1] || q
                    .default()
                    .id;
            a.activeSeason = q.byId(z),
            a.seasons = q.list(),
            c.get({
                playerId: y,
                season: z
            }, function (b) {
                a.player = b
            }),
            a.leagueDistanceAverages = f.data[z.id],
            a.$watch("activeSeason", function (b) {
                a.leagueDistanceAverages = f.data[b.id],
                a.shots && (a.distanceData = g.prepareDistanceData(
                    a.shots,
                    a.leagueDistanceAverages,
                    a.player.POSITION,
                    a.gameFilteringActive()
                        ? a.activeGames
                        : void 0
                ))
            }),
            a.$watchCollection("activeGames", function () {
                s(),
                u()
            }),
            a.$watch("player", t),
            a.$watch("shotChartFilters", u, !0),
            a.$watch("playerSelectorVisible", u),
            a.setPlayer = function (b) {
                a.player = b
            },
            a.showPlayerSelector = function () {
                a.playerSelectorVisible = !a.playerSelectorVisible
            },
            a.getTeamName = function (a) {
                return a
                    ? d
                        .byId(a)
                        .FULL_NAME
                    : void 0
            },
            a.getTeamAbbrev = function (a) {
                return a
                    ? d
                        .byId(a)
                        .TEAM_ABBREVIATION
                    : void 0
            },
            a.gameFilteringActive = function () {
                return 0 !== Object
                    .keys(a.activeGames)
                    .length
            },
            a.switchSeason = function (b) {
                c.get({
                    playerId: a.player.PLAYER_ID,
                    season: b
                }, function (b) {
                    a.player = b
                })
            }
        }
    ]),
angular
    .module("myApp.compareView", ["ngRoute"])
    .config([
        "$routeProvider",
        function (a) {
            a
                .when("/compareView", {
                    templateUrl: "pages/compareView/compareView.html",
                    controller: "CompareViewCtrl"
                })
                .when("/compareView/:playerIds", {
                    templateUrl: "pages/compareView/compareView.html",
                    controller: "CompareViewCtrl"
                })
        }
    ])
    .controller("CompareViewCtrl", [
        "$scope",
        "$rootScope",
        "Player",
        "Team",
        "Shots",
        "DistanceAverages",
        "ShotData",
        "VsTeam",
        "NearRanks",
        "PlayerGameStats",
        "$routeParams",
        "Location",
        "Url",
        "ShotChartUtil",
        "PlayerSelectorUtil",
        "GameSelectorUtil",
        "$timeout",
        "Season",
        "CurrentTop",
        function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s) {
            function t(a, b) {
                b && (
                    b.shots = a,
                    b.distanceData = g.prepareDistanceData(a, f.data[b.details.SEASON], b.details.POSITION),
                    b.leftRightDistanceData = g.prepareLeftRightDistanceData(a)
                )
            }
            function u(b) {
                b && (z && (z = !1), a.$emit("layout-change"), x(), b.forEach(function (a) {
                    a.details && e.query({
                        playerId: a.details.PLAYER_ID,
                        season: a.details.SEASON
                    }, function (b) {
                        t(b, a)
                    })
                }))
            }
            function v() {
                var b = m.urlToParams();
                a.shotChartFiltersVisible = "true" === b.shotFilters
            }
            function w() {
                return a.shotChartFiltersVisible
                    ? {
                        shotFilters: !0
                    }
                    : {}
            }
            function x() {
                var b = a.players,
                    c = b
                        .map(function (a) {
                            return a && a.details && a.details.PLAYER_ID
                                ? a.details.PLAYER_ID + "_" + a.details.SEASON
                                : "x"
                        })
                        .join(",");
                if (0 !== c.length) {
                    var d = "/compareView/" + c,
                        e = {},
                        f = o.playerSelectorAsParams(a.playerSelectorVisible, a.selectedPlayer),
                        g = n.shotChartFiltersAsParams(a.shotChartFilters),
                        h = w();
                    $.extend(e, f, h, g),
                    m.updateUrl("/compareView", d, e)
                }
            }
            var y,
                z = !0;
            y = k.playerIds
                ? k
                    .playerIds
                    .split(",")
                : s
                    .points
                    .map(function (a) {
                        return a.PLAYER_ID
                    }),
            a.maxNumPlayers = 10,
            a.minNumPlayers = 2,
            a.activeGames = {};
            var A = o.playerSelectorFromUrl();
            a.playerSelectorVisible = A.playerSelector,
            a.selectedPlayer = A.selectedPlayer,
            a.seasons = r.list(),
            a.shotChartFilters = {},
            n.shotChartFiltersFromUrl(a.shotChartFilters),
            v(),
            a.players = y.map(function (b) {
                var c = String(b).split("_"),
                    d = c[0],
                    e = c[1] || r
                        .default()
                        .id;
                return a.activeSeason = r.byId(e),
                null == d || isNaN(parseInt(d, 10))
                    ? {}
                    : {
                        details: {
                            PLAYER_ID: d,
                            SEASON: e
                        }
                    }
            }),
            a
                .players
                .forEach(function (b, d) {
                    b.details && c.get({
                        playerId: b.details.PLAYER_ID,
                        season: b.details.SEASON
                    }, function (b) {
                        a.players[d] = {
                            details: b,
                            shots: null
                        }
                    })
                }),
            a.distanceHighlight = null,
            a.$watchCollection("players", u),
            a.$watch("shotChartFilters", x, !0),
            a.$watch("playerSelectorVisible", x),
            a.$watch("selectedPlayer", x),
            a.$watch("shotChartFiltersVisible", x),
            a.setPlayer = function (b) {
                a.players[a.selectedPlayer] = {
                    details: b,
                    shots: null
                }
            },
            a.selectPlayer = function (b) {
                a.selectedPlayer = b
            },
            a.showPlayerSelector = function (b) {
                a.selectPlayer(b),
                a.playerSelectorVisible = !a.playerSelectorVisible
            },
            a.removePlayer = function (b) {
                var c = a
                    .players
                    .indexOf(b);
                a.players.length <= a.minNumPlayers
                    ? a.players[c] = {}
                    : (
                        a.players.splice(c, 1),
                        a.$emit("layout-change"),
                        a.$broadcast("resize-chart")
                    )
            },
            a.addPlayer = function () {
                a.players.length < a.maxNumPlayers && (
                    a.playerSelectorVisible = !0,
                    a.players.push({}),
                    a.selectPlayer(a.players.length - 1),
                    a.$emit("layout-change"),
                    q(function () {
                        a.$broadcast("resize-chart")
                    }, 0)
                )
            },
            a.getTeamName = function (a) {
                return a
                    ? d
                        .byId(a)
                        .FULL_NAME
                    : void 0
            },
            a.getTeamAbbrev = function (a) {
                return a
                    ? d
                        .byId(a)
                        .TEAM_ABBREVIATION
                    : void 0
            },
            a.seasonLabel = function (a) {
                return r.label(a)
            },
            a.switchSeason = function (b) {
                var d = a
                    .players
                    .indexOf(b);
                -1 !== d && c.get({
                    playerId: b.details.PLAYER_ID,
                    season: b.details.SEASON
                }, function (b) {
                    a.players[d] = {
                        details: b,
                        shots: null
                    }
                })
            }
        }
    ])
    .directive("stickem", [
        "$timeout",
        function (a) {
            return {
                restrict: "A",
                link: function (b, c) {
                    var d,
                        e = {
                            start: 100
                        };
                    b.$on("layout-change", function () {
                        d && d.destroy(),
                        a(function () {
                            d = $(c[0]).stickem(e)
                        }, 0)
                    })
                }
            }
        }
    ]),
angular
    .module("myApp.reports", ["ngRoute"])
    .config([
        "$routeProvider",
        function (a) {
            a
                .when("/reports", {
                    templateUrl: "pages/reports/reports.html",
                    controller: "ReportsCtrl"
                })
                .when("/reports/:season", {
                    templateUrl: "pages/reports/reports.html",
                    controller: "ReportsCtrl"
                })
        }
    ])
    .controller("ReportsCtrl", [
        "$scope",
        "$rootScope",
        "Player",
        "Team",
        "Shots",
        "DistanceAverages",
        "ShotData",
        "ReportPlayers",
        "$routeParams",
        "Location",
        "Url",
        "Season",
        function (a, b, c, d, e, f, g, h, i, j, k, l) {
            function m(a, b) {
                b && (
                    b.shots = a,
                    b.distanceData = g.prepareDistanceData(a, f.data[b.details.SEASON], b.details.POSITION)
                )
            }
            function n(a) {
                a && (p && (p = !1), a.forEach(function (a) {
                    a.details && e.query({
                        playerId: a.details.PLAYER_ID,
                        season: a.details.SEASON
                    }, function (b) {
                        m(b, a)
                    })
                }))
            }
            var o,
                p = !0;
            o = i.season
                ? i.season
                : l
                    .default()
                    .id;
            var q = k
                .urlToParams()
                .numPlayers || 10;
            a.activeSeason = l.byId(o),
            a.players = [],
            h.query({
                season: o,
                numPlayers: q
            }, function (b) {
                a.players = b.map(function (a) {
                    return {details: a, shots: null}
                })
            }),
            a.$watchCollection("players", n),
            a.getTeamName = function (a) {
                return a
                    ? d
                        .byId(a)
                        .FULL_NAME
                    : void 0
            },
            a.getTeamAbbrev = function (a) {
                return a
                    ? d
                        .byId(a)
                        .TEAM_ABBREVIATION
                    : void 0
            },
            a.seasonLabel = function (a) {
                return l.label(a)
            }
        }
    ]),
angular
    .module("myApp.filters", [])
    .filter("minutes", function () {
        return function (a) {
            if (!a) 
                return "0:00";
            var b = Math.floor(a / 60),
                c = a % 60;
            return 10 > c && (c = "0" + c),
            b + ":" + c
        }
    }),
angular.module("myApp.shotChart", [
    "myApp.shotChart.shotChart-util",
    "myApp.shotChart.shotChart-directive",
    "myApp.shotChart.shotChartAvg-directive",
    "myApp.shotChart.shotChartHeatmap-directive",
    "myApp.shotChart.shotChartFilters-directive",
    "myApp.shotChart.shotChartHeatmapFilters-directive"
]),
angular
    .module("myApp.shotChart.shotChart-directive", [])
    .directive("pbShotChart", [
        "Shots",
        "ShotChartUtil",
        "Util",
        "$timeout",
        function (a, b, c, d) {
            function e(a, b, c) {
                var d = c.weighted,
                    e = c.zone;
                return e
                    ? a.zoneStats[q[b].value]
                    : d
                        ? a[q[b].weightedValue]
                        : a[q[b].value]
            }
            function f(a, b, c) {
                var d = c.weighted,
                    e = c.zone;
                return e
                    ? a.zoneStats[q[b].delta]
                    : d
                        ? a[q[b].weightedDelta]
                        : a[q[b].delta]
            }
            function g(a, b) {
                return b
                    ? q[a].longLabel
                    : q[a].label
            }
            function h(a, b) {
                return b
                    ? q[a].formatShort
                    : q[a].format
            }
            function i(a) {
                return q[a].colorDomain
            }
            function j(a, b) {
                var c = Math.max(10 * b, 5);
                d3
                    .select(a[0])
                    .select(".court-distance-marker")
                    .style("display", null)
                    .attr("r", c)
            }
            function k(a) {
                d3
                    .select(a[0])
                    .select(".court-distance-marker")
                    .style("display", "none")
            }
            function l(a, d, e, f) {
                e.width = d[0].offsetWidth;
                var g = b.computeDimensions(e),
                    h = d3
                        .select(d[0])
                        .select("svg")
                        .attr("preserveAspectRatio", "xMinYMin meet")
                        .attr("viewBox", "0 0 " + g.courtWidth + " " + g.clippedHeight);
                return c.safariSvg(h, g.courtWidth, g.clippedHeight),
                h
                    .selectAll("*")
                    .remove(),
                b.drawCourt(h, g.courtWidth, g.courtHeight),
                h = h.select("g.global"),
                $.extend(f, {
                    binSize: n,
                    filters: a.filters,
                    yClamp: g.yClamp,
                    dim: g,
                    activeGames: a.activeGames
                }),
                a.shotData && r(a.shotData, h, f, a),
                h
            }
            var m = b.domain,
                n = 10,
                o = {
                    width: 170,
                    height: 75
                },
                p = d3.format(".1%"),
                q = {
                    fgpct: {
                        value: "eff",
                        delta: "eff_delta",
                        weightedValue: "eff_weighted",
                        weightedDelta: "eff_weighted_delta",
                        label: "FG%",
                        longLabel: "Field Goal %",
                        format: p,
                        formatShort: d3.format(".0%"),
                        colorDomain: [-.15, .15]
                    },
                    pps: {
                        value: "pps",
                        delta: "pps_delta",
                        weightedValue: "pps_weighted",
                        weightedDelta: "pps_weighted_delta",
                        label: "PPS",
                        longLabel: "Points Per Shot",
                        format: d3.format(".2f"),
                        formatShort: d3.format(".2f"),
                        colorDomain: [-.45, .45]
                    }
                },
                r = function (a, c, d, i) {
                    function j(a) {
                        i.$apply(function () {
                            i.binHighlight = a
                                ? a.binId
                                : null
                        })
                    }
                    var k = d.filters,
                        l = d.binSize,
                        m = (d.minCount, d.yClamp);
                    d.activeGames && (a = a.filter(function (a) {
                        return d.activeGames[a.GAME_ID] !== !1
                    }));
                    var n = b.makeScales(l, m),
                        p = n.x,
                        q = n.y,
                        r = d.makeBins(a, n, l);
                    i.bins = r;
                    var s = d.colorDomain,
                        t = b.getColorRange(k.colorRange, k),
                        u = d3
                            .scale
                            .quantize()
                            .domain(s)
                            .range(t);
                    d.colorScale = u;
                    var v;
                    v = k.sizeEncode
                        ? d3
                            .scale
                            .log()
                            .domain(d.sizeDomain)
                            .range([
                                l / 4,
                                l
                            ])
                        : function () {
                            return l
                        };
                    var w = r.filter(function (a) {
                        var b = e(a, "fgpct", {
                                weighted: d.useWeighted,
                                zone: d.useZone
                            }),
                            c = a.count,
                            f = (
                                null === k.efficiency.min || null !== k.efficiency.min && b >= k.efficiency.min
                            ) && (
                                null === k.efficiency.max || null !== k.efficiency.max && b <= k.efficiency.max
                            ) && (null === k.count.min || null !== k.count.min && c >= k.count.min) && (
                                null === k.count.max || null !== k.count.max && c <= k.count.max
                            );
                        return f
                    });
                    i.filteredBins = w,
                    c
                        .select(".export-markings")
                        .remove();
                    var x = c
                        .append("g")
                        .attr("class", "export-markings")
                        .style("opacity", 0);
                    if (i.exportTitle) {
                        var y = d3.extent(p.range())[1] + l,
                            z = x
                                .append("rect")
                                .attr("x", 0)
                                .attr("y", 3)
                                .attr("rx", 3)
                                .style("fill", "#fff")
                                .style("stroke-width", 0),
                            A = x
                                .append("text")
                                .attr("x", y / 2)
                                .attr("y", 5)
                                .style("alignment-baseline", "hanging")
                                .style("text-anchor", "middle")
                                .style("font-size", "12px")
                                .style("fill", "#666")
                                .text(i.exportTitle),
                            B = A
                                .node()
                                .getBBox();
                        z
                            .attr("width", B.width + 2)
                            .attr("height", B.height + 2)
                            .attr("x", y / 2 - B.width / 2)
                    }
                    c
                        .select(".color-legend")
                        .remove();
                    var C = 180,
                        D = 31,
                        E = 30,
                        F = 16;
                    if (k.showLegend) {
                        var G = c
                            .select(".legends")
                            .append("g")
                            .attr("class", "color-legend")
                            .attr("transform", "translate(5 " + (
                                d3.extent(q.range())[1] + l - D
                            ) + ")");
                        G
                            .selectAll(".legend-mark")
                            .data(t)
                            .enter()
                            .append("rect")
                            .attr("class", "legend-mark")
                            .attr("width", E)
                            .attr("height", F)
                            .attr("x", function (a, b) {
                                return b * E
                            })
                            .attr("y", 0)
                            .attr("fill", function (a) {
                                return a
                            });
                        var H = t.map(function (a, b) {
                            var c = s[0],
                                d = s[1],
                                e = t.length,
                                f = (d - c) / e;
                            return e % 2 === 1 && b === Math.floor(e / 2)
                                ? null
                                : e / 2 > b
                                    ? c + (b + 1) * f
                                    : c + b * f
                        });
                        G
                            .selectAll(".legend-mark-text")
                            .data(H)
                            .enter()
                            .append("text")
                            .style("alignment-baseline", "hanging")
                            .style("text-anchor", "middle")
                            .attr("class", "legend-mark-text")
                            .attr("x", function (a, b) {
                                return b * E + E / 2
                            })
                            .attr("y", F / 2 - 5)
                            .attr("fill", "#fff")
                            .text(function (a) {
                                return null === a
                                    ? ""
                                    : a > 0
                                        ? "+" + h(d.stat, !0)(a)
                                        : h(d.stat, !0)(a)
                            });
                        var I = g(d.stat, !0) + " vs. " + d.vsLabel;
                        G
                            .append("text")
                            .attr("class", "legend-label")
                            .style("alignment-baseline", "hanging")
                            .style("font-size", "12px")
                            .style("fill", "#666")
                            .attr("y", F + 3)
                            .text(I)
                    }
                    if (c.select(".size-legend").remove(), k.sizeEncode && k.showLegend) {
                        C = 170;
                        var J = c
                            .select(".legends")
                            .append("g")
                            .attr("class", "size-legend")
                            .attr("transform", "translate(" + (
                                d3.extent(p.range())[1] + l - C
                            ) + " " + (
                                d3.extent(q.range())[1] + l - D
                            ) + ")");
                        J
                            .selectAll(".legend-mark")
                            .data([
                                1,
                                2,
                                3,
                                4,
                                5,
                                10
                            ])
                            .enter()
                            .append("rect")
                            .attr("class", "legend-mark")
                            .attr("width", function (a) {
                                return v(a)
                            })
                            .attr("height", function (a) {
                                return v(a)
                            })
                            .attr("rx", function (a) {
                                return v(a) / 5
                            })
                            .attr("ry", function (a) {
                                return v(a) / 5
                            })
                            .attr("x", function (a, b) {
                                return b * E
                            })
                            .attr("y", function (a) {
                                return (F - v(a)) / 2
                            })
                            .attr("fill", "#333"),
                        J
                            .append("text")
                            .attr("class", "legend-label")
                            .attr("y", F + 3)
                            .attr("x", C - 6)
                            .style("alignment-baseline", "hanging")
                            .style("font-size", "12px")
                            .style("fill", "#666")
                            .style("text-anchor", "end")
                            .text("Shot Frequency: Low to High")
                    }
                    var K = c
                        .select("g.shots")
                        .selectAll(".shot-mark")
                        .data(w, function (a) {
                            return a.binId
                        });
                    K
                        .enter()
                        .append("rect")
                        .attr("class", "shot-mark")
                        .attr("width", function () {
                            return 0
                        })
                        .attr("height", function () {
                            return 0
                        })
                        .attr("x", function (a) {
                            return a.x + l / 2
                        })
                        .attr("y", function (a) {
                            return a.y + l / 2
                        })
                        .attr("rx", function (a) {
                            return k.sizeEncode
                                ? v(a.count) / 5
                                : 0
                        })
                        .attr("ry", function (a) {
                            return k.sizeEncode
                                ? v(a.count) / 5
                                : 0
                        })
                        .style("fill", function (a) {
                            return u(f(a, d.stat, {
                                weighted: d.useWeighted,
                                zone: d.useZone
                            }))
                        })
                        .on("click", function (a) {
                            console.log(a)
                        })
                        .on("mouseover", function (a) {
                            j(a)
                        })
                        .on("mouseout", function () {
                            j(null)
                        }),
                    K
                        .transition()
                        .duration(600)
                        .attr("width", function (a) {
                            return v(a.count)
                        })
                        .attr("height", function (a) {
                            return v(a.count)
                        })
                        .attr("x", function (a) {
                            return a.x + (l - v(a.count)) / 2
                        })
                        .attr("y", function (a) {
                            return a.y + (l - v(a.count)) / 2
                        })
                        .attr("rx", function (a) {
                            return k.sizeEncode
                                ? v(a.count) / 5
                                : 0
                        })
                        .attr("ry", function (a) {
                            return k.sizeEncode
                                ? v(a.count) / 5
                                : 0
                        })
                        .style("fill", function (a) {
                            return u(f(a, d.stat, {
                                weighted: d.useWeighted,
                                zone: d.useZone
                            }))
                        }),
                    K
                        .exit()
                        .transition()
                        .duration(400)
                        .attr("width", function () {
                            return 0
                        })
                        .attr("height", function () {
                            return 0
                        })
                        .attr("x", function (a) {
                            return a.x + l / 2
                        })
                        .attr("y", function (a) {
                            return a.y + l / 2
                        })
                        .style("opacity", 0)
                        .remove(),
                    c
                        .select(".court-distance-marker")
                        .remove(),
                    c
                        .select(".highlighters")
                        .append("circle")
                        .attr("class", "court-distance-marker")
                        .style("display", "none")
                        .attr("cx", n.linear.x(0))
                        .attr("cy", n.linear.y(0) - 2)
                        .attr("r", 10),
                    c
                        .select(".shot-tooltip")
                        .remove();
                    var L = c
                        .select(".highlighters")
                        .append("g")
                        .attr("class", "shot-tooltip")
                        .style("opacity", 0);
                    L
                        .append("rect")
                        .attr("class", "shot-tooltip-bin-mark")
                        .attr("rx", 2)
                        .attr("width", 10)
                        .attr("height", 10),
                    L = L
                        .append("g")
                        .attr("class", "shot-tooltip-box");
                    var M = 62,
                        N = M - 5,
                        O = 22;
                    L
                        .append("rect")
                        .attr("width", o.width)
                        .attr("height", o.height)
                        .attr("rx", 5)
                        .attr("ry", 5);
                    var P = L
                        .append("g")
                        .attr("class", "shot-tooltip-shots-group");
                    P
                        .append("text")
                        .attr("class", "shot-tooltip-shots shot-tooltip-line-left")
                        .attr("x", N)
                        .attr("y", 8)
                        .text("10/18"),
                    P
                        .append("text")
                        .attr("class", "shot-tooltip-line-right")
                        .attr("x", M)
                        .attr("y", 8)
                        .text("Shots"),
                    L
                        .append("text")
                        .attr("class", "shot-tooltip-fgpct shot-tooltip-line-left")
                        .attr("x", N)
                        .attr("y", 8 + O)
                        .text("30%"),
                    L
                        .append("text")
                        .attr("class", "shot-tooltip-line-right")
                        .attr("x", M)
                        .attr("y", 8 + O)
                        .text(g(d.stat) + (
                            d.useWeighted
                                ? " (~3ft)"
                                : ""
                        )),
                    L
                        .append("text")
                        .attr("class", "shot-tooltip-league-fgpct shot-tooltip-line-left")
                        .attr("x", N)
                        .attr("y", 8 + 2 * O)
                        .text("25%"),
                    L
                        .append("text")
                        .attr("class", "shot-tooltip-line-right")
                        .attr("x", M)
                        .attr("y", 8 + 2 * O)
                        .text("League " + g(d.stat)),
                    L
                        .append("rect")
                        .attr("class", "shot-indicator")
                        .attr("width", 16)
                        .attr("height", 16)
                        .attr("x", o.width - 21)
                        .attr("y", 5)
                        .attr("rx", 2)
                        .attr("ry", 2)
                },
                s = function (a, b, c) {
                    var d = c.made,
                        g = c.count;
                    b.useZone && (d = c.zoneStats.made, g = c.zoneStats.count);
                    var i = e(c, b.stat, {
                            weighted: b.useWeighted,
                            zone: b.useZone
                        }),
                        j = i - f(c, b.stat, {
                            weighted: b.useWeighted,
                            zone: b.useZone
                        }),
                        k = Math.max(350 / a.node().getBoundingClientRect().width, 1),
                        l = o.width * k,
                        n = o.height * k,
                        p = Math.min(Math.max(c.x - l / 2, 0), m.width - l),
                        q = c.y + 15;
                    (q + n + 5) * (b.dim.courtHeight / m.height) > b.dim.clippedHeight && (
                        q = c.y - n - 5
                    );
                    var r = a.select(".shot-tooltip");
                    r
                        .select(".shot-tooltip-box")
                        .attr("transform", "translate(" + p + " " + q + ") scale(" + k + ")"),
                    g >= 1e4
                        ? r
                            .select(".shot-tooltip-shots-group")
                            .attr("transform", "translate(30 0)")
                        : g >= 1e3
                            ? r
                                .select(".shot-tooltip-shots-group")
                                .attr("transform", "translate(20 0)")
                            : r
                                .select(".shot-tooltip-shots-group")
                                .attr("transform", null),
                    r
                        .select(".shot-tooltip-shots")
                        .text(d + "/" + g),
                    r
                        .select(".shot-tooltip-fgpct")
                        .text(h(b.stat)(i)),
                    r
                        .select(".shot-tooltip-league-fgpct")
                        .text(h(b.stat)(j)),
                    r
                        .select(".shot-indicator")
                        .style("fill", b.colorScale(f(c, b.stat, {
                            weighted: b.useWeighted,
                            zone: b.useZone
                        }))),
                    r
                        .select(".shot-tooltip-bin-mark")
                        .attr("x", c.x)
                        .attr("y", c.y),
                    r
                        .interrupt()
                        .transition()
                        .duration(100)
                        .style("opacity", 1)
                },
                t = function (a) {
                    a
                        .select(".shot-tooltip")
                        .transition()
                        .delay(200)
                        .duration(200)
                        .style("opacity", 0)
                };
            return {
                restrict: "E",
                template: '<div><svg></svg></div><div class="chart-actions"><pb-png-saver data-filename="' +
                        'shotchart_{{exportFilename}}.png"></pb-png-saver></div>',
                scope: {
                    filters: "=",
                    shotData: "=",
                    distanceHighlight: "=",
                    activeGames: "=",
                    binHighlight: "=",
                    makeBins: "=",
                    colorDomain: "=",
                    colorRange: "=",
                    sizeDomain: "=",
                    vsLabel: "=",
                    exportFilename: "@",
                    exportTitle: "@",
                    stat: "@"
                },
                link: function (a, e, f) {
                    e.addClass("shot-chart");
                    var g = [
                            "#5357A1", "#6389BA", "#F9DC96", "#F0825F", "#AE2A47"
                        ],
                        h = {
                            stat: a.stat || "fgpct",
                            makeBins: a.makeBins || b.binShots,
                            colorDomain: a.colorDomain,
                            colorRange: a.colorRange || g,
                            sizeDomain: a.sizeDomain || [
                                1, 10
                            ],
                            useWeighted: "weighted" === a.filters.dataType,
                            useZone: "zones" === a.filters.dataType,
                            vsLabel: a.vsLabel || "League Average"
                        };
                    h.colorDomain = h.colorDomain || i(h.stat);
                    var m = l(a, e, f, h);
                    if (
                        a.$watch("filters", function (b) {
                            h.filters = b,
                            b.stat && (h.stat = b.stat, h.colorDomain = i(h.stat)),
                            h.useWeighted = "weighted" === b.dataType,
                            h.useZone = "zones" === b.dataType,
                            a.shotData && r(a.shotData, m, h, a)
                        }, !0),
                        a.$watchCollection("activeGames", function (b) {
                            h.activeGames = b,
                            a.shotData && r(a.shotData, m, h, a)
                        }),
                        a.$watch("shotData", function (b) {
                            b && r(b, m, h, a)
                        }),
                        a.$watch("distanceHighlight", function (a) {
                            null == a
                                ? k(e)
                                : j(e, a)
                        }),
                        a.$watch("binHighlight", function (b) {
                            if (null != b && null != a.filteredBins) 
                                for (var c = 0; c < a.filteredBins.length; c++) {
                                    var d = a.filteredBins[c];
                                    if (d.binId === b) 
                                        return void s(m, h, d)
                                }
                            t(m)
                        }),
                        c.isSafari()
                    ) {
                        var n = null;
                        $(window).on("resize", function () {
                            n && d.cancel(n),
                            d(function () {
                                n = null,
                                m = l(a, e, f, h)
                            }, 500)
                        }),
                        a.$on("resize-chart", function () {
                            n && d.cancel(n),
                            d(function () {
                                n = null,
                                m = l(a, e, f, h)
                            }, 500)
                        })
                    }
                }
            }
        }
    ]),
angular
    .module("myApp.shotChart.shotChart-util", [])
    .factory("ShotChartUtil", [
        "Url",
        "LeagueAverages",
        "Season",
        function (a, b, c) {
            function d(a) {
                return a = a || c
                    .default()
                    .id,
                b
                    .league[a]
                    .eff
            }
            function e(a) {
                a = a || c
                    .default()
                    .id;
                var d = b.overall[a];
                return d.MADE / d.COUNT
            }
            function f(a) {
                return a = a || c
                    .default()
                    .id,
                b
                    .league[a]
                    .eff
            }
            function g(a) {
                return a = a || c
                    .default()
                    .id,
                b
                    .league[a]
                    .general
            }
            function h(a) {
                a = a || c
                    .default()
                    .id;
                var d = b.overall[a],
                    e = parseInt(d.PT3_COUNT, 10),
                    f = d.COUNT - e;
                return (2 * f + 3 * e) / (f + e)
            }
            function i(a, b) {
                a = a || w.colorRange;
                var c = [
                        "#5357A1", "#6389BA", "#F9DC96", "#F0825F", "#AE2A47"
                    ],
                    d = [
                        "#405A7C",
                        "#7092C0",
                        "#BDD9FF",
                        "#FFA39E",
                        "#F02C21",
                        "#B80E05"
                    ];
                return "six" === a
                    ? d
                    : "custom" === a && b && b.colorsCustom
                        ? b.colorsCustom
                        : c
            }
            function j(a, b, c) {
                var d = {};
                return c = c || "",
                b = $.extend(!0, {}, w, b),
                a.sizeEncode !== b.sizeEncode && (d[c + "sizeEncode"] = a.sizeEncode),
                a.count.min !== b.count.min && (d[c + "countMin"] = a.count.min),
                a.count.max !== b.count.max && (d[c + "countMax"] = a.count.max),
                a.efficiency.min !== b.efficiency.min && (
                    d[c + "effMin"] = Math.round(100 * a.efficiency.min)
                ),
                a.efficiency.max !== b.efficiency.max && (
                    d[c + "effMax"] = Math.round(100 * a.efficiency.max)
                ),
                a.showLegend !== b.showLegend && (d[c + "showLegend"] = a.showLegend),
                a.stat !== b.stat && (d[c + "stat"] = a.stat),
                a.dataType !== b.dataType && (d[c + "dataType"] = a.dataType),
                a.colorRange !== b.colorRange && (
                    d[c + "colors"] = "custom" === a.colorRange && a.colorsCustom
                        ? a.colorsCustom.join("_").replace(/#/g, "")
                        : a.colorRange
                ),
                d
            }
            function k(b, c, d) {
                var e = a.urlToParams();
                if (
                    d = d || "",
                    $.extend(!0, b, w, c),
                    void 0 !== e[d + "sizeEncode"] && (b.sizeEncode = "true" === e[d + "sizeEncode"]),
                    void 0 === e[d + "countMin"] || isNaN(parseInt(e[d + "countMin"], 10)) || (b.count.min = e[d + "countMin"]),
                    void 0 === e[d + "countMax"] || isNaN(parseInt(e[d + "countMax"], 10)) || (b.count.max = e[d + "countMax"]),
                    void 0 === e[d + "effMin"] || isNaN(parseInt(e[d + "effMin"], 10)) || (b.efficiency.min = e[d + "effMin"] / 100),
                    void 0 === e[d + "effMax"] || isNaN(parseInt(e[d + "effMax"], 10)) || (b.efficiency.max = e[d + "effMax"] / 100),
                    void 0 !== e[d + "showLegend"] && (b.showLegend = "true" === e[d + "showLegend"]),
                    "pps" === e[d + "stat"] && (b.stat = e[d + "stat"]),
                    void 0 !== e[d + "smooth"]
                ) {
                    var f = "true" === e[d + "smooth"];
                    b.dataType = f
                        ? "weighted"
                        : "raw"
                }
                if (void 0 !== e[d + "dataType"]) {
                    var g = e[d + "dataType"];
                    -1 !== v.indexOf(g) && (b.dataType = g)
                }
                if (void 0 !== e[d + "colors"]) {
                    var h = e[d + "colors"];
                    "five" === h || "six" === h
                        ? b.colorRange = h
                        : (b.colorRange = "custom", b.colorsCustom = h.split("_").map(function (a) {
                            return 3 === a.length || 6 === a.length
                                ? "#" + a
                                : a
                        }))
                }
            }
            function l(a, b, c) {
                var d = {};
                return c = c || "",
                b = $.extend(!0, {}, x, b),
                a.count.min !== b.count.min && (d[c + "hmCountMin"] = a.count.min),
                a.count.max !== b.count.max && (d[c + "hmCountMax"] = a.count.max),
                d
            }
            function m(b, c, d) {
                var e = a.urlToParams();
                d = d || "",
                $.extend(!0, b, x, c),
                void 0 === e[d + "hmCountMin"] || isNaN(parseInt(e[d + "hmCountMin"], 10)) || (
                    b.count.min = e[d + "hmCountMin"]
                ),
                void 0 === e[d + "hmCountMax"] || isNaN(parseInt(e[d + "hmCountMax"], 10)) || (
                    b.count.max = e[d + "hmCountMax"]
                )
            }
            var n = {
                xMin: -250,
                xMax: 250,
                yMin: -50,
                yMax: 420
            };
            n.width = n.xMax - n.xMin,
            n.height = n.yMax - n.yMin;
            var o = function (a, b) {
                    b = b || n.yMax;
                    var c = n.xMax - n.xMin,
                        d = Math.min(n.yMax - n.yMin, b - n.yMin);
                    return {
                        x: d3
                            .scale
                            .quantize()
                            .domain([n.xMin, n.xMax])
                            .range(d3.range(0, c, a)),
                        y: d3
                            .scale
                            .quantize()
                            .domain([
                                n.yMin,
                                Math.min(n.yMax, b)
                            ])
                            .range(d3.range(0, d, a)),
                        linear: {
                            x: d3
                                .scale
                                .linear()
                                .domain([n.xMin, n.xMax])
                                .range([0, c]),
                            y: d3
                                .scale
                                .linear()
                                .domain([
                                    n.yMin,
                                    Math.min(n.yMax, b)
                                ])
                                .range([0, d])
                        }
                    }
                },
                p = function (a, b, c, d) {
                    var e,
                        f,
                        g,
                        h,
                        i = {};
                    for (e = 0; b > e; e++) 
                        for (f = 0; c > f; f++) 
                            g = a[e][f],
                            g && (h = g.zoneRange + g.zoneArea, i[h] || (i[h] = {
                                count: 0,
                                made: 0,
                                leagueCount: d[e][f].zoneStats.count,
                                leagueMade: d[e][f].zoneStats.made
                            }), i[h].count += g.count, i[h].made += g.made, g.zoneStats = i[h]);
                Object
                        .keys(i)
                        .forEach(function (a) {
                            i[a].eff = i[a].made / i[a].count,
                            i[a].leagueEff = i[a].leagueMade / i[a].leagueCount,
                            i[a].eff_delta = i[a].eff - i[a].leagueEff
                        })
                },
                q = function (a, b, c, d, e, f) {
                    for (var g = 2, h = 0; b > h; h++) 
                        for (var i = 0; c > i; i++) {
                            var j = a[h][i];
                            if (j) {
                                for (
                                    var k = j[e] > 0
                                        ? j[d] / j[e]
                                        : 0,
                                    l = 1,
                                    m = 1; g >= m; m++
                                ) {
                                    var n = r(a, h, i, m, b, c, d, e);
                                    if (null !== n) {
                                        var o = 1 / m;
                                        l += o,
                                        k += o * n
                                    }
                                }
                                j[f] = k / l
                            }
                        }
                    },
                r = function (a, b, c, d, e, f, g, h) {
                    var i,
                        j,
                        k,
                        l = 2 * d + 1,
                        m = 0,
                        n = 0,
                        o = b - d;
                    for (j = 0; l > j && o > 0; j++) 
                        i = c - d + j,
                        i > 0 && f > i && (k = a[o][i], k && (m += k[g], n += k[h]));
                    for (i = c + d, j = 0; l - 1 > j && f > i; j++) 
                        o = b - d + j + 1,
                        o > 0 && e > o && (k = a[o][i], k && (m += k[g], n += k[h]));
                    for (o = b + d, j = 0; l - 1 > j && e > o; j++) 
                        i = c - d + j,
                        i > 0 && f > i && (k = a[o][i], k && (m += k[g], n += k[h]));
                    for (i = c - d, j = 0; l - 2 > j && i > 0; j++) 
                        o = b - d + j + 1,
                        o > 0 && e > o && (k = a[o][i], k && (m += k[g], n += k[h]));
                    return n > 0
                        ? m / n
                        : null
                },
                s = function (a, b) {
                    for (
                        var c,
                        e,
                        h = b.x,
                        i = b.y,
                        j = [],
                        k = h.range().length,
                        l = i.range().length,
                        m = h.copy().range(d3.range(0, k, 1)),
                        n = i.copy().range(d3.range(0, l, 1)),
                        o = 0;
                        l > o;
                        o++
                    ) 
                        j[o] = [];
                    for (c = 0; c < a.length; c++) {
                        var r = a[c],
                            s = r.LOC_X,
                            t = r.LOC_Y,
                            u = m(s),
                            v = n(t);
                        e = j[v][u],
                        void 0 === e && (e = {
                            binId: "[" + v + "][" + u + "]",
                            shotX: s,
                            shotY: t,
                            distance: r.SHOT_DISTANCE,
                            shotValue: "2PT Field Goal" === r.SHOT_TYPE
                                ? 2
                                : 3,
                            x: h(s),
                            y: i(t),
                            row: v,
                            col: u,
                            zoneArea: r.SHOT_ZONE_AREA,
                            zoneRange: r.SHOT_ZONE_RANGE,
                            count: 0,
                            made: 0
                        }, j[v][u] = e),
                        e.count += 1,
                        e.made += r.SHOT_MADE_FLAG
                            ? 1
                            : 0
                    }
                    q(j, l, k, "made", "count", "eff_weighted");
                    var w = null != a[0]
                            ? a[0].SEASON
                            : "2013",
                        x = d(w),
                        y = f(w),
                        z = g(w);
                    for (o = 0; l > o; o++) 
                        for (var A = 0; k > A; A++) 
                            if (e = j[o][A]) {
                                var B = x[o][A],
                                    C = y[o][A];
                                e.eff_weighted_delta = e.eff_weighted - B,
                                e.eff = e.count > 0
                                    ? e.made / e.count
                                    : 0,
                                e.eff_delta = e.eff - C,
                                e.pps = e.shotValue * e.eff,
                                e.pps_delta = e.pps - C * e.shotValue,
                                e.pps_weighted = e.shotValue * e.eff_weighted,
                                e.pps_weighted_delta = e.pps_weighted - B * e.shotValue
                            }
                        p(j, l, k, z);
                    var D,
                        E,
                        F,
                        G = j
                            .reduce(function (a, b) {
                                return b.length
                                    ? a.concat(b)
                                    : a
                            }, [])
                            .filter(function (a) {
                                return a
                            }),
                        H = a.length,
                        I = 0,
                        J = 0,
                        K = 0;
                    for (c = 0; c < G.length; c++) 
                        e = G[c],
                        e.freq = e.count / H,
                        e.eff = e.made / e.count,
                        D = D || e.freq,
                        E = E || e.eff,
                        I = Math.max(e.freq, I),
                        J = Math.max(e.eff, J),
                        K = Math.max(e.count, K),
                        D = Math.min(e.freq, D),
                        E = Math.min(e.eff, E),
                        e.eff > 0 && (F = F || e.eff, F = Math.min(e.eff, F));
                    return G.maxFreq = I,
                    G.maxEff = J,
                    G.maxCount = K,
                    G.minFreq = D,
                    G.minEff = E,
                    G.minEffNonZero = F,
                    G
                },
                t = function (a, b, c) {
                    var d = '<g class="highlighters"></g>',
                        e = '<g class="marks-below"></g>',
                        f = '<g class="legends"></g>',
                        g = '<g class="court">  <polyline fill="none" stroke="#999999" stroke-linecap="squa' +
                                're" stroke-linejoin="bevel" stroke-miterlimit="10" points="470.364,137.064 470' +
                                '.364,0 30.059,0 30.059,137.064     "/> <rect x="170.196" fill="none" stroke="#' +
                                '999999" stroke-linecap="square" stroke-linejoin="bevel" stroke-miterlimit="10"' +
                                ' width="160.033" height="189.945"/> <line fill="none" stroke="#999999" stroke-' +
                                'linecap="square" stroke-linejoin="bevel" stroke-miterlimit="10" x1="310.331" y' +
                                '1="189.945" x2="310.331" y2="0"/> <line fill="none" stroke="#999999" stroke-li' +
                                'necap="square" stroke-linejoin="bevel" stroke-miterlimit="10" x1="190.094" y1=' +
                                '"189.945" x2="190.094" y2="0"/> <path fill="none" stroke="#999999" stroke-line' +
                                'cap="square" stroke-linejoin="bevel" stroke-miterlimit="10" d="M190.518,189.94' +
                                '5 c0,32.943,26.726,59.65,59.694,59.65c32.97,0,59.695-26.707,59.695-59.65"/> <p' +
                                'ath fill="none" stroke="#999999" stroke-linecap="square" stroke-linejoin="beve' +
                                'l" stroke-miterlimit="10" d="M210.729,52.773 c2.745,21.792,22.653,37.229,44.45' +
                                '9,34.486c18.033-2.269,32.236-16.464,34.509-34.486"/> <path fill="none" stroke=' +
                                '"#999999" stroke-linecap="square" stroke-linejoin="bevel" stroke-miterlimit="1' +
                                '0" stroke-dasharray="13.33,11.67" d="M309.907,189.945c0-32.943-26.726-59.649-5' +
                                '9.695-59.649c-32.969,0-59.694,26.706-59.694,59.649"/> <line fill="none" stroke' +
                                '="#999999" stroke-linecap="square" stroke-linejoin="bevel" stroke-miterlimit="' +
                                '10" x1="330.229" y1="0" x2="340.391" y2="0"/> <line fill="none" stroke="#99999' +
                                '9" stroke-linecap="square" stroke-linejoin="bevel" stroke-miterlimit="10" x1="' +
                                '340.391" y1="145.95" x2="330.229" y2="145.95"/> <line fill="none" stroke="#999' +
                                '999" stroke-linecap="square" stroke-linejoin="bevel" stroke-miterlimit="10" x1' +
                                '="340.391" y1="114.223" x2="330.229" y2="114.223"/> <line fill="none" stroke="' +
                                '#999999" stroke-linecap="square" stroke-linejoin="bevel" stroke-miterlimit="10' +
                                '" x1="340.391" y1="82.495" x2="330.229" y2="82.495"/> <line fill="none" stroke' +
                                '="#999999" stroke-linecap="square" stroke-linejoin="bevel" stroke-miterlimit="' +
                                '10" x1="340.391" y1="71.071" x2="330.229" y2="71.071"/> <line fill="none" stro' +
                                'ke="#999999" stroke-linecap="square" stroke-linejoin="bevel" stroke-miterlimit' +
                                '="10" x1="160.032" y1="145.95" x2="170.196" y2="145.95"/> <line fill="none" st' +
                                'roke="#999999" stroke-linecap="square" stroke-linejoin="bevel" stroke-miterlim' +
                                'it="10" x1="160.032" y1="114.223" x2="170.196" y2="114.223"/> <line fill="none' +
                                '" stroke="#999999" stroke-linecap="square" stroke-linejoin="bevel" stroke-mite' +
                                'rlimit="10" x1="160.032" y1="82.495" x2="170.196" y2="82.495"/> <line fill="no' +
                                'ne" stroke="#999999" stroke-linecap="square" stroke-linejoin="bevel" stroke-mi' +
                                'terlimit="10" x1="160.032" y1="71.071" x2="170.196" y2="71.071"/> <path fill="' +
                                'none" stroke="#999999" stroke-linecap="square" stroke-linejoin="bevel" stroke-' +
                                'miterlimit="10" d="M30.203,137.058 c49.417,121.198,187.98,179.485,309.489,130.' +
                                '194c59.332-24.068,106.401-71.017,130.529-130.194"/>  <path fill="none" stroke=' +
                                '"#999999" stroke-linecap="square" stroke-linejoin="bevel" stroke-miterlimit="1' +
                                '0" d="M309.907,470 c0-32.945-26.726-59.65-59.695-59.65c-32.969,0-59.694,26.705' +
                                '-59.694,59.65"/></g>',
                        h = '<g class="shots"></g>',
                        i = '<g class="hoop"><line class="backboard" fill="none" stroke="#999999" stroke-wi' +
                                'dth="1.5" stroke-linecap="square" stroke-linejoin="bevel" stroke-miterlimit="1' +
                                '0" x1="280.271" y1="40.19" x2="220.151" y2="40.19"/> <path class="rim" fill="n' +
                                'one" stroke="#F9A01B" stroke-linecap="square" stroke-linejoin="bevel" stroke-m' +
                                'iterlimit="10" stroke-width="1.5" d="M250.212,54.993 c3.977,0,7.197-3.215,7.19' +
                                '7-7.188c0-3.977-3.221-7.192-7.197-7.192c-3.976,0-7.197,3.216-7.197,7.192 C243.' +
                                '015,51.778,246.236,54.993,250.212,54.993z"/></g>',
                        j = '<g class="global" transform="scale(' + b / n.width + " " + c / n.height + ')">' + e + g + f + h + d + i + "</g>",
                        k = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1' +
                                '//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg  xmlns="http://w' +
                                'ww.w3.org/2000/svg" version="1.1">' + j + "</svg>",
                        l = document.importNode($.parseXML(k).documentElement, !0);
                    a
                        .node()
                        .appendChild(l.childNodes[0])
                },
                u = function (a) {
                    var b = n.width,
                        c = n.height,
                        d = n.height;
                    a.width && !a.height
                        ? (b = a.width, c = a.width / n.width * n.height)
                        : !a.width && a.height
                            ? (c = a.height, b = a.height / n.height * n.width)
                            : a.width && a.height && (b = a.width, c = a.height),
                    b = parseInt(b, 10),
                    c = parseInt(c, 10),
                    d = c;
                    var e = parseInt(a.yclamp, 10) || n.height;
                    return a.yclamp && (
                        d = Math.min(d, b / n.width * (parseInt(a.yclamp, 10) - n.yMin))
                    ), {
                        courtWidth: b,
                        courtHeight: c,
                        clippedHeight: d,
                        yClamp: e
                    }
                },
                v = [
                    "raw", "weighted", "zones"
                ],
                w = {
                    sizeEncode: !0,
                    showLegend: !0,
                    dataType: "weighted",
                    stat: "fgpct",
                    count: {
                        min: 2,
                        max: 1e11
                    },
                    efficiency: {
                        min: 0,
                        max: 1
                    },
                    colorRange: "five"
                },
                x = {
                    count: {
                        min: 1,
                        max: 1e11
                    }
                };
            return {
                computeWeightedAverage: q,
                makeScales: o,
                binShots: s,
                drawCourt: t,
                domain: n,
                computeDimensions: u,
                shotChartFiltersFromUrl: k,
                shotChartFiltersAsParams: j,
                getLeagueAverageWeighted: d,
                getOverallLeagueAverage: e,
                getLeagueAverage: f,
                getLeagueStats: g,
                getOverallShotValue: h,
                shotChartHeatmapFiltersAsParams: l,
                shotChartHeatmapFiltersFromUrl: m,
                getColorRange: i
            }
        }
    ]),
angular
    .module("myApp.shotChart.shotChartAvg-directive", [])
    .directive("pbShotChartAverage", [
        "ShotChartUtil",
        function (a) {
            function b(b) {
                return function (c, d) {
                    var e;
                    c.length && (e = c[0].SEASON);
                    var f,
                        g = a.getOverallLeagueAverage(e),
                        h = a.getOverallShotValue(e),
                        i = a.getLeagueAverage(e),
                        j = a.getLeagueStats(e),
                        k = d.x,
                        l = d.y,
                        m = {},
                        n = c.map(function (a) {
                            var c,
                                d,
                                e = b
                                    ? i[a.ROW][a.COL]
                                    : g,
                                n = 0 === a.MADE
                                    ? 0
                                    : a.MADE / a.COUNT,
                                o = a.WEIGHTED_EFF,
                                p = a.SHOT_VALUE;
                            return b
                                ? (c = p * (n - e), d = p * (o - e))
                                : (c = p * n - h * g, d = p * o - h * g),
                            f = j[a.ROW][a.COL].zoneStats.zone,
                            m[f] || (m[f] = {
                                count: 0,
                                made: 0,
                                leagueCount: j[a.ROW][a.COL].zoneStats.count,
                                leagueMade: j[a.ROW][a.COL].zoneStats.made,
                                zone: f
                            }),
                            m[f].count += a.COUNT,
                            m[f].made += a.MADE, {
                                binId: "[" + a.ROW + "][" + a.COL + "]",
                                x: k(a.X_MIN),
                                y: l(a.Y_MIN),
                                shotValue: p,
                                count: a.COUNT,
                                made: a.MADE,
                                eff: n,
                                eff_delta: n - e,
                                eff_weighted: o,
                                eff_weighted_delta: o - e,
                                pps: p * n,
                                pps_delta: c,
                                pps_weighted: p * o,
                                pps_weighted_delta: c,
                                zoneStats: m[f]
                            }
                        });
                    return Object
                        .keys(m)
                        .forEach(function (a) {
                            m[a].eff = m[a].made / m[a].count,
                            m[a].leagueEff = m[a].leagueMade / m[a].leagueCount,
                            m[a].eff_delta = m[a].eff - m[a].leagueEff
                        }),
                    n
                }
            }
            return {
                restrict: "E",
                template: '<pb-shot-chart yclamp="{{yclamp}}" stat="{{stat}}" export-filename="{{exportFi' +
                        'lename}}" export-title="{{exportTitle}}" filters="filters" shot-data="shotData' +
                        '" distance-highlight="distanceHighlight" bin-highlight="binHighlight"make-bins' +
                        '="makeBins" color-domain="colorDomain" color-range="colorRange" size-domain="s' +
                        'izeDomain" vs-label="vsLabel"></pb-shot-chart>',
                scope: {
                    filters: "=",
                    shotData: "=",
                    distanceHighlight: "=",
                    activeGames: "=",
                    binHighlight: "=",
                    yclamp: "@",
                    useBinLeagueAverage: "@",
                    exportFilename: "@",
                    exportTitle: "@",
                    stat: "@",
                    sizeDomain: "="
                },
                link: {
                    pre: function (a) {
                        a.useBinLeagueAverage = "true" === a.useBinLeagueAverage,
                        a.makeBins = b(a.useBinLeagueAverage),
                        a.sizeDomain = a.sizeDomain || [
                            1, 900
                        ],
                        a.vsLabel = a.useBinLeagueAverage
                            ? "League Average"
                            : "Overall League Average"
                    }
                }
            }
        }
    ]),
angular
    .module("myApp.shotChart.shotChartFilters-directive", [])
    .directive("pbShotChartFilters", [
        "ShotChartUtil",
        function (a) {
            return {
                restrict: "E",
                templateUrl: "components/shotChart/shotChartFilters.html",
                scope: {
                    filters: "=model",
                    countMax: "@",
                    countClampMax: "@",
                    countStep: "@"
                },
                link: {
                    pre: function (b, c, d) {
                        b.showStat = "true" === d.showStat,
                        b.showSmooth = "false" !== d.showSmooth,
                        b.showZone = "false" !== d.showZone,
                        b.showDataTypes = "false" !== d.showDataTypes,
                        b.showColors = "false" !== d.showColors,
                        b.colorSchemes = {
                            five: a.getColorRange("five"),
                            six: a.getColorRange("six")
                        },
                        void 0 === b.countMax && (b.countMax = 15),
                        void 0 === b.countClampMax && (b.countClampMax = b.countMax),
                        void 0 === b.countStep && (b.countStep = 1)
                    }
                }
            }
        }
    ]),
angular
    .module("myApp.shotChart.shotChartHeatmap-directive", [])
    .directive("pbShotChartHeatmap", [
        "Shots",
        "ShotAverages",
        "ShotChartUtil",
        "Util",
        "$timeout",
        function (a, b, c, d, e) {
            function f(a, b, d, e) {
                var f = (e.find("canvas")[0], d.binSize),
                    g = d.yClamp,
                    h = c.makeScales(f, g),
                    i = a
                        .filter(function (a) {
                            return a.Y_MAX < 300
                        })
                        .map(function (a) {
                            var b = d.value(a);
                            return {
                                x: d.scaleFactor * (5 + h.x(a.X_MIN)),
                                y: d.scaleFactor * (5 + h.y(a.Y_MIN)),
                                value: b
                            }
                        });
                if (d.threshold) {
                    var j = d.threshold(k);
                    i.forEach(function (a) {
                        a.value = Math.min(a.value, j)
                    })
                }
                d.filters && (i = i.filter(function (a) {
                    return a.value >= d.filters.count.min && a.value <= d.filters.count.max
                }));
                var k = i.reduce(function (a, b) {
                        return Math.max(a, b.value)
                    }, 0),
                    l = {
                        max: k,
                        data: i
                    };
                b.setData(l)
            }
            function g(a, b, e, g) {
                e.width = b[0].offsetWidth;
                var i = c.computeDimensions(e),
                    j = d3
                        .select(b[0])
                        .select("svg")
                        .attr("preserveAspectRatio", "xMinYMin meet")
                        .attr("viewBox", "0 0 " + i.courtWidth + " " + i.clippedHeight);
                d.safariSvg(j, i.courtWidth, i.clippedHeight),
                j
                    .selectAll("*")
                    .remove(),
                b.addClass("shot-chart-avg shot-chart"),
                c.drawCourt(j, i.courtWidth, i.courtHeight),
                $.extend(g, {
                    filters: a.filters,
                    dim: i,
                    binSize: h,
                    yClamp: i.yClamp,
                    scaleFactor: e.width / c.domain.width
                }),
                g.value = function (a) {
                    return a.COUNT
                },
                g.threshold = function (b) {
                    return null == a.maxThreshold
                        ? b / 10
                        : a.maxThreshold
                },
                g.radius = Math.ceil(i.courtWidth / 28);
                var k = {
                    container: b[0],
                    radius: g.radius
                };
                k.gradient = g.gradient
                    ? g.gradient
                    : {
                        .25: "#443df4",
                        .55: "#2ea61b",
                        .85: "#e6cc35",
                        "1.0": "#f9422a"
                    },
                b
                    .find("canvas")
                    .remove();
                var l = h337.create(k),
                    m = b.find(".heatmap-canvas");
                return m.css("width", "100%"),
                m.css("height", "100%"),
                a.avgData && f(a.avgData, l, g, b),
                l
            } {
                var h = 10;
                c.domain
            }
            return {
                restrict: "E",
                template: "<div><svg></svg></div>",
                scope: {
                    avgData: "=",
                    maxThreshold: "@",
                    filters: "="
                },
                link: function (a, b, c) {
                    var h = {},
                        i = g(a, b, c, h);
                    if (
                        a.$watch("filters", function (c) {
                            a.avgData && (h.filters = c, f(a.avgData, i, h, b))
                        }, !0),
                        a.$watch("avgData", function (a) {
                            a && f(a, i, h, b)
                        }),
                        d.isSafari()
                    ) {
                        var j = null;
                        $(window).on("resize", function () {
                            j && e.cancel(j),
                            e(function () {
                                j = null,
                                i = g(a, b, c, h)
                            }, 500)
                        }),
                        a.$on("resize-chart", function () {
                            j && e.cancel(j),
                            e(function () {
                                j = null,
                                i = g(a, b, c, h)
                            }, 500)
                        })
                    }
                }
            }
        }
    ]),
angular
    .module("myApp.shotChart.shotChartHeatmapFilters-directive", [])
    .directive("pbShotChartHeatmapFilters", [
        function () {
            return {
                restrict: "E",
                templateUrl: "components/shotChart/shotChartHeatmapFilters.html",
                scope: {
                    filters: "=model",
                    countMax: "@",
                    countClampMax: "@",
                    countStep: "@"
                },
                link: {
                    pre: function (a) {
                        void 0 === a.countMax && (a.countMax = 1e3),
                        void 0 === a.countClampMax && (a.countClampMax = a.countMax),
                        void 0 === a.countStep && (a.countStep = 10)
                    }
                }
            }
        }
    ]),
angular.module("myApp.signature", ["myApp.signature.signature-directive"]),
angular
    .module("myApp.signature.signature-directive", [])
    .directive("pbSignature", [
        "Util",
        "$timeout",
        "Season",
        function (a, b) {
            function c(a, b, c, f) {
                var g = 200;
                $.extend(f, {
                    maxDistance: 30,
                    maxCount: 250,
                    width: c.width || b[0].offsetWidth,
                    height: g,
                    value: function (a) {
                        return 0 === a.weightedMade
                            ? 0
                            : a.weightedMade / a.weightedCount
                    }
                });
                var h = {
                    buckets: {
                        domain: [
                            -.15, .15
                        ],
                        range: [
                            "#405A7C",
                            "#7092C0",
                            "#BDD9FF",
                            "#FFA39E",
                            "#F02C21",
                            "#B80E05"
                        ]
                    },
                    goldsberry: {
                        domain: [
                            -.1125, -.05625, 0, .05625, .1125
                        ],
                        range: ["#5357A1", "#6389BA", "#F9DC96", "#F0825F", "#AE2A47"]
                    }
                };
                f.colorScheme = f.colorScheme || h.goldsberry;
                var i = d(b, f);
                return a.filteredData && e(a.filteredData[0], a.filteredData[1], i, f),
                i
            }
            function d(a, b) {
                var c = {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    },
                    d = b.width - c.left - c.right,
                    e = .3 * b.width - c.top - c.bottom,
                    f = b.value,
                    g = d3
                        .scale
                        .linear()
                        .domain([0, 30])
                        .range([0, d]),
                    h = d3
                        .scale
                        .linear()
                        .domain([0, 30])
                        .range([0, 100]),
                    i = d3
                        .scale
                        .linear()
                        .domain([0, 1])
                        .range([e, 0]),
                    j = e / 3,
                    k = 1,
                    l = d3
                        .scale
                        .linear()
                        .domain([0, b.maxCount])
                        .range([k, j]),
                    m = d3
                        .scale
                        .linear()
                        .domain(b.colorScheme.domain)
                        .range(b.colorScheme.range),
                    n = d3
                        .svg
                        .area()
                        .x(function (a) {
                            return g(a.distance)
                        })
                        .y0(function (a) {
                            return i(f(a)) - l(a.count)
                        })
                        .y1(function (a) {
                            return Math.ceil(i(f(a)))
                        })
                        .interpolate("basis"),
                    o = d3
                        .svg
                        .area()
                        .x(function (a) {
                            return g(a.distance)
                        })
                        .y0(function (a) {
                            return i(f(a)) + l(a.count)
                        })
                        .y1(function (a) {
                            return Math.floor(i(f(a)))
                        })
                        .interpolate("basis"),
                    p = d3
                        .select(a[0])
                        .select("svg")
                        .attr("width", d + c.left + c.right)
                        .attr("height", e + c.top + c.bottom);
                return p
                    .selectAll("*")
                    .remove(),
                p = p
                    .append("g")
                    .attr("transform", "translate(" + c.left + "," + c.top + ")"), {
                    margin: c,
                    width: d,
                    height: e,
                    x: g,
                    y: i,
                    color: m,
                    areaAbove: n,
                    areaBelow: o,
                    offset: h,
                    w: l,
                    svg: p
                }
            }
            function e(a, b, c, d) {
                var e = c.svg,
                    f = (c.x, c.y, c.height, c.width, c.color),
                    g = c.offset,
                    h = c.areaAbove,
                    i = c.areaBelow;
                e
                    .selectAll("*")
                    .remove(),
                e
                    .append("g")
                    .attr("class", "css")
                    .append("style")
                    .attr("type", "text/css");
                for (
                    var j = function (a, c) {
                        return f(d.value(a) - d.value(b.values[c]))
                    },
                    k = "area-gradient-" + Math.floor(1 + 68719476736 * Math.random()).toString(
                        16
                    ),
                    l = e.append("g").attr("class", "area-group"),
                    m = (
                        l.append("path").datum(a.values).attr("class", "area area-above").attr("id", "area-above-test").attr("d", h).style("fill", "url(#" + k + ")"),
                        l.append("path").datum(a.values).attr("class", "area area-below").attr("d", i).style("fill", "url(#" + k + ")"),
                        []
                    ),
                    n = !1,
                    o = 0; o < a.values.length; o++
                ) {
                    var p = a.values[o - 1],
                        q = a.values[o];
                    n && p && m.push({
                        offset: g(q.distance) + "%",
                        stopColor: j(p, o - 1)
                    }),
                    m.push({
                        offset: g(q.distance) + "%",
                        stopColor: j(q, o)
                    })
                }
                l
                    .append("linearGradient")
                    .attr("id", k)
                    .attr("gradientUnits", "userSpaceOnUse")
                    .attr("y1", 0)
                    .attr("y2", 0)
                    .selectAll("stop")
                    .data(m)
                    .enter()
                    .append("stop")
                    .attr("offset", function (a) {
                        return a.offset
                    })
                    .attr("stop-color", function (a) {
                        return a.stopColor
                    })
            }
            function f(a, b) {
                return a.forEach(function (a) {
                    a.values = a
                        .values
                        .filter(function (a) {
                            return a.distance <= b.maxDistance
                        })
                }),
                a
            }
            return {
                restrict: "E",
                template: '<div><div class="signature-explanation-toggle">?<img src="img/signature_explan' +
                        'ation.png" class="signature-explanation"></div><svg></svg></div>',
                scope: {
                    shotData: "="
                },
                link: function (a, d, g) {
                    var h = {},
                        i = c(a, d, g, h),
                        j = null;
                    $(window).on("resize", function () {
                        j && b.cancel(j),
                        j = b(function () {
                            j = null,
                            i = c(a, d, g, h)
                        }, 500)
                    }),
                    a.$on("resize-chart", function () {
                        j && b.cancel(j),
                        j = b(function () {
                            j = null,
                            i = c(a, d, g, h)
                        }, 500)
                    }),
                    a.$watch("shotData", function (b) {
                        b && (
                            a.filteredData = f(b, h),
                            h.player = a.player,
                            e(a.filteredData[0], a.filteredData[1], i, h)
                        )
                    })
                }
            }
        }
    ]),
angular.module(
    "myApp.lineChart",
    ["myApp.lineChart.lineChart-directive", "myApp.lineChart.leftRightChart-directive", "myApp.lineChart.vsTeamChart-directive"]
),
angular
    .module("myApp.lineChart.lineChart-directive", [])
    .directive("pbLineChart", [
        "Util",
        "$timeout",
        "Season",
        function (a, b, c) {
            function d(a, b, c, d, e) {
                var f = c.x(b),
                    g = d3
                        .select(a[0])
                        .select(".crosshair");
                g
                    .style("display", null)
                    .attr("transform", "translate(" + f + " 0)"),
                b > 25
                    ? g
                        .select(".crosshair-aux")
                        .attr("transform", "translate(-82 12)")
                    : g
                        .select(".crosshair-aux")
                        .attr("transform", "translate(4 12)");
                var h = ["Distance: " + b + "ft"];
                d.forEach(function (a) {
                    var c = e.value(a.values[b]);
                    c = isNaN(c)
                        ? 0
                        : c;
                    var d = i[a.name] + ": " + j(c);
                    h.push(d)
                }),
                g
                    .selectAll(".crosshair-text")
                    .data(h)
                    .text(function (a) {
                        return a
                    })
                    .style("fill", function (a, b) {
                        return 0 === b
                            ? null
                            : c.color(d[b - 1].name)
                    });
                var k = d[0].values[b];
                g
                    .select(".crosshair-point")
                    .attr("cy", c.y(e.value(k)))
            }
            function e(a) {
                d3
                    .select(a[0])
                    .select(".crosshair")
                    .style("display", "none")
            }
            function f(a, b) {
                return a.forEach(function (a) {
                    a.values = a
                        .values
                        .filter(function (a) {
                            return a.distance <= b.maxDistance
                        })
                }),
                a
            }
            function g(a, b, c, d) {
                $.extend(d, {
                    stat: c.stat || "frequency",
                    maxDistance: 30,
                    yMin: 0,
                    yMax: 1,
                    xAxisLabel: "Distance",
                    width: c.width || b[0].offsetWidth,
                    height: c.height,
                    maxHeight: 320,
                    minHeight: 175,
                    minWidth: 250,
                    player: a.player
                }),
                a.stat = d.stat,
                "efficiency" === d.stat
                    ? (
                        d.value = function (a) {
                            return 0 === a.made
                                ? 0
                                : a.made / a.count
                        },
                        d.value = function (a) {
                            return 0 === a.weightedMade
                                ? 0
                                : a.weightedMade / a.weightedCount
                        },
                        d.yAxisLabel = "Field Goal %",
                        d.title = "Field Goal % by Distance",
                        d.percent = !0
                    )
                    : (
                        d.value = function (a) {
                            return a.freq
                        },
                        d.yAxisLabel = "Frequency %",
                        d.title = "Shot Frequency % by Distance",
                        d.percent = !0,
                        d.yMax = .26
                    );
                var e = l(b, d);
                return m(e, a),
                a.filteredData && n(a.filteredData, e, d),
                e
            }
            var h = 23.75,
                i = {
                    overall: "Player",
                    league: "League",
                    guard: "Guards",
                    center: "Centers",
                    forward: "Forwards",
                    active: "Filtered"
                },
                j = d3.format(".0%"),
                k = function (a, b, c, d, e) {
                    var f = a
                            .append("g")
                            .attr("class", "legend")
                            .attr("transform", "translate(" + d + " " + e + ")"),
                        g = f
                            .selectAll("g.legend-group")
                            .data(b)
                            .enter(),
                        h = g
                            .append("g")
                            .attr("class", "legend-group")
                            .attr("transform", function (a, b) {
                                return "translate(" + 80 * b + " 0)"
                            });
                    h
                        .append("line")
                        .attr("class", "legend-line")
                        .attr("x1", 0)
                        .attr("x2", 10)
                        .attr("y1", 8)
                        .attr("y2", 2)
                        .style("stroke", function (a) {
                            return c(a.name)
                        }),
                    h
                        .append("text")
                        .attr("class", "legend-label")
                        .attr("transform", "translate(14 0)")
                        .text(function (a) {
                            return i[a.name]
                        })
                },
                l = function (b, c) {
                    var d = {
                            top: 35,
                            right: 20,
                            bottom: 50,
                            left: 55
                        },
                        e = c.width - d.left - d.right,
                        f = Math.min(c.maxHeight, .7 * c.width) - d.top - d.bottom;
                    a.isSafari() || (e = Math.max(c.minWidth, e), f = Math.max(c.minHeight, f));
                    var g = d3
                            .scale
                            .linear()
                            .domain([0, 30])
                            .range([0, e]),
                        h = d3
                            .scale
                            .linear()
                            .range([f, 0]),
                        i = d3
                            .scale
                            .ordinal()
                            .domain([
                                "overall",
                                "active",
                                "league",
                                "guard",
                                "center",
                                "forward"
                            ])
                            .range([
                                "#d62728",
                                "rgba(36, 195, 36,0.8)",
                                "#17becf",
                                "#7f7f7f",
                                "#7f7f7f",
                                "#7f7f7f"
                            ]),
                        j = d3
                            .svg
                            .axis()
                            .scale(g)
                            .orient("bottom"),
                        k = d3
                            .svg
                            .axis()
                            .scale(h)
                            .ticks(5)
                            .orient("left");
                    c.percent && k.tickFormat(d3.format(".0%"));
                    var l = d3
                            .svg
                            .line()
                            .interpolate("monotone")
                            .x(function (a) {
                                return g(a.distance)
                            })
                            .y(function (a) {
                                var b = c.value(a);
                                return h(
                                    isNaN(b)
                                        ? 0
                                        : b
                                )
                            }),
                        m = d3
                            .select(b[0])
                            .select("svg")
                            .attr("preserveAspectRatio", "xMinYMin meet")
                            .attr("viewBox", "0 0 " + (
                                e + d.left + d.right
                            ) + " " + (
                                f + d.top + d.bottom
                            ));
                    return a.safariSvg(m, e + d.left + d.right, f + d.top + d.bottom),
                    m
                        .selectAll("*")
                        .remove(),
                    m = m
                        .append("g")
                        .attr("transform", "translate(" + d.left + "," + d.top + ")"), {
                        margin: d,
                        width: e,
                        height: f,
                        x: g,
                        y: h,
                        color: i,
                        xAxis: j,
                        yAxis: k,
                        line: l,
                        svg: m
                    }
                },
                m = function (a, b) {
                    function c(a) {
                        b.$apply(function () {
                            b.distanceHighlight = a
                        })
                    }
                    var d = a.svg,
                        e = a.x;
                    d
                        .on("mousemove", function () {
                            var a = d3.mouse(this)[0],
                                b = e.invert(a);
                            b = Math.round(b),
                            (b < e.domain()[0] || b > e.domain()[1]) && (b = null),
                            c(b)
                        })
                        .on("mouseout", function () {
                            c(null)
                        })
                },
                n = function (a, b, d) {
                    var e = b.svg,
                        f = b.x,
                        g = b.y,
                        i = b.height,
                        j = b.width,
                        l = b.color,
                        m = b.xAxis,
                        n = b.yAxis,
                        o = b.line;
                    e
                        .selectAll("*")
                        .remove(),
                    e
                        .append("g")
                        .attr("class", "css")
                        .append("style")
                        .attr("type", "text/css"),
                    g.domain([
                        Math.min(d.yMin, d3.min(a, function (a) {
                            return d3.min(a.values, d.value)
                        })),
                        Math.max(d.yMax, d3.max(a, function (a) {
                            return d3.max(a.values, d.value)
                        }))
                    ]),
                    e
                        .append("rect")
                        .attr("class", "chart-inner")
                        .attr("width", j)
                        .attr("height", i)
                        .style("fill", "#fff"),
                    e
                        .append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + i + ")")
                        .call(m)
                        .append("text")
                        .attr("y", 35)
                        .attr("x", j / 2)
                        .text(d.xAxisLabel)
                        .attr("class", "axis-label"),
                    e
                        .append("g")
                        .attr("class", "y axis")
                        .call(n)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", -40)
                        .attr("x", -i / 2)
                        .text(d.yAxisLabel)
                        .attr("class", "axis-label"),
                    e
                        .selectAll(".axis path")
                        .classed({
                            "axis-path": !0
                        }),
                    e
                        .selectAll(".axis line")
                        .classed({
                            "axis-line": !0
                        }),
                    e
                        .selectAll(".tick text")
                        .classed({
                            "tick-text": !0
                        });
                    var p = e
                        .append("g")
                        .attr("class", "pt3-line")
                        .attr("transform", "translate(" + f(h) + " 0)");
                    p
                        .append("line")
                        .attr("class", "reference-line")
                        .attr("x1", 0)
                        .attr("x2", 0)
                        .attr("y1", g(g.domain()[0]))
                        .attr("y2", g(g.domain()[1])),
                    p
                        .append("text")
                        .attr("class", "pt3-line-text")
                        .text("3pt")
                        .attr("x", 3)
                        .attr(
                            "y",
                            4 === a.length || f(h) < 245
                                ? 14
                                : 0
                        ),
                    k(e, a, l, 20, 0);
                    for (var q = [], r = [
                        "active",
                        "overall",
                        "league",
                        "guard",
                        "center",
                        "forward"
                    ], s = 0; s < r.length; s++) 
                        for (var t = 0; t < a.length; t++) 
                            if (a[t].name === r[s]) {
                                q.push(a[t]);
                                break
                            }
                        e
                        .select(".series-group")
                        .remove();
                    var u = e
                            .append("g")
                            .attr("class", "series-group"),
                        v = u
                            .selectAll(".series")
                            .data(q);
                    v
                        .enter()
                        .insert("g", ":first-child")
                        .attr("class", "series")
                        .append("path")
                        .attr("class", function (a) {
                            return "line-" + a.name + " line"
                        })
                        .attr("d", function (a) {
                            return o(a.values)
                        })
                        .style("stroke", function (a) {
                            return l(a.name)
                        }),
                    e
                        .select(".export-markings")
                        .remove();
                    var w = e
                        .append("g")
                        .attr("class", "export-markings")
                        .style("opacity", 0);
                    if (d.player) {
                        var x = "translate(" + b.width / 2 + " " + (-b.margin.top + 7) + ")",
                            y = w
                                .append("text")
                                .attr("transform", x)
                                .style("alignment-baseline", "hanging")
                                .style("text-anchor", "middle")
                                .style("font-size", "12px")
                                .style("font-weight", "bold")
                                .style("fill", "#333")
                                .text(
                                    d.title + " - " + d.player.DISPLAY_FIRST_LAST + " " + c.label(d.player.SEASON)
                                ),
                            z = y
                                .node()
                                .getBoundingClientRect()
                                .width;
                        z > b.width && y.attr("transform", x + " scale(" + b.width / z + ")")
                    }
                    var A = e
                        .append("g")
                        .attr("class", "crosshair")
                        .style("display", "none");
                    A
                        .append("line")
                        .attr("x1", f(0))
                        .attr("x2", f(0))
                        .attr("y1", g.range()[0])
                        .attr("y2", g.range()[1]);
                    var B = A
                        .append("g")
                        .attr("transform", "translate(4 12)")
                        .attr("class", "crosshair-aux");
                    B
                        .append("rect")
                        .attr("width", 85)
                        .attr("height", 65)
                        .attr("y", -12)
                        .attr("x", -4)
                        .attr("class", "crosshair-aux-bg"),
                    B
                        .selectAll("text")
                        .data(d3.range(a.length + 1))
                        .enter()
                        .append("text")
                        .attr("y", function (a, b) {
                            return 15 * b
                        })
                        .attr("class", "crosshair-text"),
                    A
                        .append("circle")
                        .attr("class", "crosshair-point")
                        .attr("cx", 0)
                        .attr("cy", 0)
                        .attr("r", 3)
                };
            return {
                restrict: "E",
                template: '<div><svg></svg></div><div class="chart-actions"><pb-png-saver data-filename="' +
                        'distance_chart_{{stat}}_{{player.PLAYERCODE}}_{{player.SEASON}}.png"></pb-png-' +
                        'saver></div>',
                scope: {
                    stat: "@",
                    player: "=",
                    shotData: "=",
                    distanceHighlight: "="
                },
                link: function (a, c, h) {
                    var i = {},
                        j = g(a, c, h, i),
                        k = null;
                    $(window).on("resize", function () {
                        k && b.cancel(k),
                        k = b(function () {
                            k = null,
                            j = g(a, c, h, i)
                        }, 500)
                    }),
                    a.$on("resize-chart", function () {
                        k && b.cancel(k),
                        k = b(function () {
                            k = null,
                            j = g(a, c, h, i)
                        }, 500)
                    }),
                    a.$watch("distanceHighlight", function (b) {
                        null == b
                            ? e(c)
                            : d(c, b, j, a.filteredData, i)
                    }),
                    a.$watch("shotData", function (b) {
                        b && (a.filteredData = f(b, i), i.player = a.player, n(a.filteredData, j, i))
                    })
                }
            }
        }
    ]),
angular
    .module("myApp.lineChart.leftRightChart-directive", [])
    .directive("pbLeftRightChart", [
        "Util",
        "$timeout",
        "Season",
        function (a, b, c) {
            function d(a, b, c, d, e) {
                var f = c.y(b),
                    g = d3.select(a[0]),
                    h = g
                        .select(".crosshair")
                        .style("display", null)
                        .attr("transform", "translate(0 " + f + ")"),
                    i = d.values[b];
                g
                    .selectAll(".bg-bar.highlight")
                    .classed({
                        highlight: !1
                    }),
                g
                    .selectAll(".bg-bar.distance-" + b)
                    .classed({
                        highlight: !0
                    });
                var j,
                    k = e.value(i);
                j = 0 > k
                    ? "+" + e.format(Math.abs(k)) + " Left"
                    : k > 0
                        ? "+" + e.format(k) + " Right"
                        : "--";
                var l = [
                    "Distance: " + b + "ft",
                    "Left: " + e.format(e.barValueLeft(i)),
                    "Right: " + e.format(e.barValueRight(i)),
                    "Difference: " + j
                ];
                6 > b
                    ? h
                        .select(".crosshair-aux")
                        .attr("transform", "translate(4 -60)")
                    : h
                        .select(".crosshair-aux")
                        .attr("transform", "translate(4 12)"),
                h
                    .selectAll(".crosshair-text")
                    .data(l)
                    .text(function (a) {
                        return a
                    })
                    .style("fill", function (a, b) {
                        var d = null;
                        return 1 === b || 3 === b && 0 > k
                            ? d = c.color.left.dark
                            : (2 === b || 3 === b && k > 0) && (d = c.color.right.dark),
                        d
                    });
                var m = h.select(".crosshair-point");
                m.attr("cx", c.x(e.value(i)))
            }
            function e(a) {
                var b = d3.select(a[0]);
                b
                    .select(".crosshair")
                    .style("display", "none"),
                b
                    .selectAll(".bg-bar.highlight")
                    .classed({
                        highlight: !1
                    })
            }
            function f(a, b, c, d) {
                $.extend(d, {
                    stat: c.stat || "frequency",
                    maxDistance: 30,
                    xMin: -1,
                    xMax: 1,
                    yAxisLabel: "Distance",
                    width: c.width || b[0].offsetWidth,
                    height: c.height,
                    maxHeight: 400,
                    minHeight: 175,
                    minWidth: 250,
                    player: a.player
                }),
                a.stat = d.stat,
                "efficiency" === d.stat
                    ? (
                        d.value = function (a) {
                            return a.lrEff
                        },
                        d.barValueLeft = function (a) {
                            return a.leftEff
                        },
                        d.barValueRight = function (a) {
                            return a.rightEff
                        },
                        d.value = function (a) {
                            return void 0 === a
                                ? 0
                                : a.lrWeightedEff
                        },
                        d.barValueLeft = function (a) {
                            return void 0 === a
                                ? 0
                                : a.leftWeightedEff
                        },
                        d.barValueRight = function (a) {
                            return void 0 === a
                                ? 0
                                : a.rightWeightedEff
                        },
                        d.xAxisLabel = "Field Goal %",
                        d.percent = !0,
                        d.totalLeft = function (a) {
                            return a.total.leftMade / a.total.leftCount
                        },
                        d.totalRight = function (a) {
                            return a.total.rightMade / a.total.rightCount
                        },
                        d.format = d3.format(".0%"),
                        d.title = "Field Goal %: Left Side vs. Right Side"
                    )
                    : (
                        d.value = function (a) {
                            return void 0 === a
                                ? 0
                                : a.lrCount
                        },
                        d.barValueLeft = function (a) {
                            return void 0 === a
                                ? 0
                                : a.leftCount
                        },
                        d.barValueRight = function (a) {
                            return void 0 === a
                                ? 0
                                : a.rightCount
                        },
                        d.xAxisLabel = "# of Shots",
                        d.percent = !1,
                        d.xMax = 120,
                        d.xMin = -120,
                        d.totalLeft = function (
                            a
                        ) {
                            return a.total.leftCount / a.total.count
                        },
                        d.totalRight = function (a) {
                            return a.total.rightCount / a.total.count
                        },
                        d.format = d3.format(".0f"),
                        d.title = "Shot Frequency: Left Side vs. Right Side"
                    );
                var e = i(b, d);
                return j(e, a),
                a.shotData && k(a.shotData, e, d),
                e
            }
            var g = 23.75,
                h = function (a, b, c, d, e, f) {
                    var g = a
                            .append("g")
                            .attr("class", "legend")
                            .attr("transform", "translate(" + d + " " + e + ")"),
                        h = [
                            {
                                label: "Left",
                                fill: c.left.light,
                                stroke: c.left.dark,
                                type: "rect"
                            }, {
                                label: "Right",
                                fill: c.right.light,
                                stroke: c.right.dark,
                                type: "rect"
                            }, {
                                label: "Difference",
                                stroke: c.left.dark,
                                stroke2: c.right.dark,
                                type: "line"
                            }
                        ],
                        i = g
                            .selectAll("g.legend-group")
                            .data(h)
                            .enter(),
                        j = i
                            .append("g")
                            .attr("class", function (a) {
                                return "legend-group legend-group-" + a
                                    .label
                                    .toLowerCase()
                            })
                            .attr("transform", function (a, b) {
                                var c = 2 !== b
                                    ? 60 * b
                                    : f.x(f.x.domain()[1]) - 95;
                                return "translate(" + c + " 0)"
                            });
                    j
                        .append("path")
                        .attr("class", function (a) {
                            return "rect" === a.type
                                ? "legend-box"
                                : "legend-double-line"
                        })
                        .attr("d", function (a) {
                            return "rect" === a.type
                                ? "M 0 0 L 0 10 L 10 10 L 10 0 z"
                                : "M 0 9 L 10 4"
                        })
                        .style("stroke", function (a) {
                            return a.stroke
                        })
                        .style("fill", function (a) {
                            return a.fill
                        }),
                    g
                        .select(".legend-group-difference")
                        .append("path")
                        .attr("class", "legend-double-line")
                        .attr("d", "M 0 5 L 10 0")
                        .style("stroke", h[2].stroke2),
                    j
                        .append("text")
                        .attr("class", "legend-label")
                        .attr("transform", "translate(14 0)")
                        .text(function (a) {
                            return a.label
                        })
                },
                i = function (b, c) {
                    var d = {
                            top: 60,
                            right: 20,
                            bottom: 60,
                            left: 55
                        },
                        e = c.width - d.left - d.right,
                        f = Math.min(c.maxHeight, .9 * c.width) - d.top - d.bottom;
                    a.isSafari() || (e = Math.max(c.minWidth, e), f = Math.max(c.minHeight, f));
                    var g = d3
                            .scale
                            .linear()
                            .domain([0, 30])
                            .range([f, 0]),
                        h = d3
                            .scale
                            .linear()
                            .range([0, e]),
                        i = {
                            left: {
                                dark: "#2ca02c",
                                light: "#DFF7DF"
                            },
                            right: {
                                dark: "#9467bd",
                                light: "#EEE4F7"
                            }
                        },
                        j = d3
                            .svg
                            .axis()
                            .scale(h)
                            .tickFormat(function (a) {
                                return Math.abs(a)
                            })
                            .ticks(5)
                            .orient("bottom"),
                        k = d3
                            .svg
                            .axis()
                            .scale(g)
                            .orient("left");
                    c.percent && j.tickFormat(function (a) {
                        return d3.format(".0%")(Math.abs(a))
                    });
                    var l = d3
                            .svg
                            .line()
                            .interpolate("monotone")
                            .x(function (a) {
                                var b = c.value(a);
                                return h(
                                    isNaN(b)
                                        ? 0
                                        : b
                                )
                            })
                            .y(function (a) {
                                return g(a.distance)
                            }),
                        m = d3
                            .select(b[0])
                            .select("svg")
                            .attr("preserveAspectRatio", "xMinYMin meet")
                            .attr("viewBox", "0 0 " + (
                                e + d.left + d.right
                            ) + " " + (
                                f + d.top + d.bottom
                            ));
                    return a.safariSvg(m, e + d.left + d.right, f + d.top + d.bottom),
                    m
                        .selectAll("*")
                        .remove(),
                    m = m
                        .append("g")
                        .attr("transform", "translate(" + d.left + "," + d.top + ")"), {
                        margin: d,
                        width: e,
                        height: f,
                        x: h,
                        y: g,
                        color: i,
                        xAxis: j,
                        yAxis: k,
                        line: l,
                        svg: m
                    }
                },
                j = function (a, b) {
                    function c(a) {
                        b.$apply(function () {
                            b.distanceHighlight = a
                        })
                    }
                    var d = a.svg,
                        e = a.y;
                    d
                        .on("mousemove", function () {
                            var a = d3.mouse(this)[1],
                                b = e.invert(a);
                            b = Math.round(b),
                            (b < e.domain()[0] || b > e.domain()[1]) && (b = null),
                            c(b)
                        })
                        .on("mouseout", function () {
                            c(null)
                        })
                },
                k = function (a, b, d) {
                    var e = b.svg,
                        f = b.x,
                        i = b.y,
                        j = b.height,
                        k = b.width,
                        l = b.color,
                        m = b.xAxis,
                        n = b.yAxis,
                        o = b.line;
                    e
                        .selectAll("*")
                        .remove(),
                    e
                        .append("g")
                        .attr("class", "css")
                        .append("style")
                        .attr("type", "text/css"),
                    a.values = a
                        .values
                        .filter(function (a) {
                            return a.distance <= d.maxDistance
                        });
                    var p = Math.max(
                        Math.abs(d.xMin),
                        Math.abs(d3.min(a.values, d.value)),
                        Math.abs(d3.min(a.values, d.barValueLeft)),
                        Math.abs(d3.min(a.values, d.barValueRight)),
                        d.xMax,
                        d3.max(a.values, d.value),
                        d3.max(a.values, d.barValueLeft),
                        d3.max(a.values, d.barValueRight)
                    );
                    f.domain([
                        -p,
                        p
                    ]),
                    e
                        .append("rect")
                        .attr("class", "chart-inner")
                        .attr("width", k)
                        .attr("height", j)
                        .style("fill", "#fff"),
                    e
                        .append("g")
                        .attr("class", "bg-bars"),
                    e
                        .append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + j + ")")
                        .call(m)
                        .append("text")
                        .attr("y", 50)
                        .attr("x", k / 2)
                        .text(d.xAxisLabel)
                        .attr("class", "axis-label"),
                    e
                        .select(".x.axis")
                        .append("text")
                        .attr("y", 35)
                        .attr("x", k / 4)
                        .text("Left")
                        .attr("class", "axis-label"),
                    e
                        .select(".x.axis")
                        .append("text")
                        .attr("y", 35)
                        .attr("x", 3 * k / 4)
                        .text("Right")
                        .attr("class", "axis-label"),
                    e
                        .append("g")
                        .attr("class", "y axis")
                        .call(n)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", -35)
                        .attr("x", -j / 2)
                        .text(d.yAxisLabel)
                        .attr("class", "axis-label"),
                    e
                        .selectAll(".axis path")
                        .classed({
                            "axis-path": !0
                        }),
                    e
                        .selectAll(".axis line")
                        .classed({
                            "axis-line": !0
                        }),
                    e
                        .selectAll(".tick text")
                        .classed({
                            "tick-text": !0
                        }),
                    e
                        .append("linearGradient")
                        .attr("id", "left-right-gradient")
                        .attr("gradientUnits", "userSpaceOnUse")
                        .attr("x1", f(-1))
                        .attr("y1", 0)
                        .attr("x2", f(1))
                        .attr("y2", 0)
                        .selectAll("stop")
                        .data([
                            {
                                offset: "0%",
                                color: l.left.dark
                            }, {
                                offset: "50%",
                                color: l.left.dark
                            }, {
                                offset: "50%",
                                color: l.right.dark
                            }, {
                                offset: "100%",
                                color: l.right.dark
                            }
                        ])
                        .enter()
                        .append("stop")
                        .attr("offset", function (a) {
                            return a.offset
                        })
                        .attr("stop-color", function (a) {
                            return a.color
                        });
                    var q = e
                        .append("g")
                        .attr("class", "pt3-line")
                        .attr("transform", "translate(0 " + i(g) + ")");
                    q
                        .append("text")
                        .attr("class", "pt3-line-text")
                        .text("3pt")
                        .attr("x", 3)
                        .attr("y", 3),
                    q
                        .append("line")
                        .attr("class", "reference-line")
                        .attr("x1", f(f.domain()[0]))
                        .attr("x2", f(f.domain()[1]))
                        .attr("y1", 0)
                        .attr("y2", 0),
                    e
                        .append("line")
                        .attr("class", "guide-line")
                        .attr("x1", f(0))
                        .attr("x2", f(0))
                        .attr("y1", i(0))
                        .attr("y2", i(30)),
                    h(e, a, l, 20, 0, b);
                    var r = 0,
                        s = Math.ceil(i(0) - i(1)) - r;
                    e
                        .select(".bg-bars")
                        .selectAll("rect.bg-bar.left-bar")
                        .data(a.values)
                        .enter()
                        .append("rect")
                        .attr("class", function (a) {
                            return "bg-bar left-bar distance-" + a.distance
                        })
                        .attr("x", function (a) {
                            return 2 * f(0) - f(d.barValueLeft(a))
                        })
                        .attr("y", function (a) {
                            return i(a.distance) - s
                        })
                        .attr("width", function (a) {
                            return f(d.barValueLeft(a)) - f(0)
                        })
                        .attr("height", s),
                    e
                        .select(".bg-bars")
                        .selectAll("rect.bg-bar.right-bar")
                        .data(a.values)
                        .enter()
                        .append("rect")
                        .attr("class", function (a) {
                            return "bg-bar right-bar distance-" + a.distance
                        })
                        .attr("x", f(0))
                        .attr("y", function (a) {
                            return i(a.distance) - s
                        })
                        .attr("width", function (a) {
                            return f(d.barValueRight(a)) - f(0)
                        })
                        .attr("height", s),
                    e
                        .append("g")
                        .attr("class", "series")
                        .append("path")
                        .attr("class", "left-right-line")
                        .style("fill", "none")
                        .style("stroke-width", 2)
                        .attr("d", o(a.values)),
                    e
                        .select(".y.axis")
                        .append("text")
                        .attr("y", -20)
                        .attr("x", -20)
                        .text("Overall %")
                        .attr("class", "axis-label");
                    var t = e
                            .append("g")
                            .attr("class", "overall-bars"),
                        u = f
                            .copy()
                            .domain([-1, 1]),
                        v = 14,
                        w = [
                            {
                                x: 2 * f(0) - u(d.totalLeft(a)),
                                width: u(d.totalLeft(a)) - u(0),
                                side: "left",
                                value: d.totalLeft(a)
                            }, {
                                x: u(0),
                                width: u(d.totalRight(a)) - u(0),
                                side: "right",
                                value: d.totalRight(a)
                            }
                        ],
                        x = d3.format(".0%"),
                        y = t
                            .selectAll("g")
                            .data(w)
                            .enter()
                            .append("g")
                            .attr("transform", function (a) {
                                var b = isNaN(a.x)
                                    ? 0
                                    : a.x;
                                return "translate(" + b + " -30)"
                            });
                    y
                        .append("rect")
                        .attr("class", "overall-bar")
                        .style("stroke", function (a) {
                            return l[a.side].dark
                        })
                        .style("fill", function (a) {
                            return l[a.side].light
                        })
                        .attr("width", function (a) {
                            var b = isNaN(a.width)
                                ? 0
                                : a.width;
                            return b
                        })
                        .attr("height", v),
                    y
                        .append("text")
                        .attr("class", "overall-bar-text")
                        .style("opacity", function (a) {
                            return isNaN(a.value)
                                ? 0
                                : 1
                        })
                        .text(function (a) {
                            return x(a.value)
                        })
                        .attr("x", function (a, b) {
                            return 0 === b || isNaN(a.width)
                                ? 3
                                : a.width - 3
                        })
                        .style("text-anchor", function (a, b) {
                            return 0 === b
                                ? "start"
                                : "end"
                        })
                        .attr("y", 2)
                        .style("fill", function (a) {
                            return l[a.side].dark
                        }),
                    e
                        .select(".export-markings")
                        .remove();
                    var z = e
                        .append("g")
                        .attr("class", "export-markings")
                        .style("opacity", 0);
                    if (d.player) {
                        var A = "translate(" + b.width / 2 + " " + (-b.margin.top + 7) + ")",
                            B = z
                                .append("text")
                                .attr("transform", A)
                                .style("alignment-baseline", "hanging")
                                .style("text-anchor", "middle")
                                .style("font-size", "12px")
                                .style("font-weight", "bold")
                                .style("fill", "#333")
                                .text(
                                    d.title + " - " + d.player.DISPLAY_FIRST_LAST + " " + c.label(d.player.SEASON)
                                ),
                            C = B
                                .node()
                                .getBoundingClientRect()
                                .width;
                        C > b.width && B.attr("transform", A + " scale(" + b.width / C + ")")
                    }
                    var D = e
                        .append("g")
                        .attr("class", "crosshair")
                        .style("display", "none");
                    D
                        .append("line")
                        .attr("x1", f.range()[0])
                        .attr("x2", f.range()[1])
                        .attr("y1", i.range()[1])
                        .attr("y2", i.range()[1]);
                    var E = D
                        .append("g")
                        .attr("transform", "translate(4 12)")
                        .attr("class", "crosshair-aux");
                    E
                        .append("rect")
                        .attr("width", 135)
                        .attr("height", 61)
                        .attr("y", -12)
                        .attr("x", -4)
                        .attr("class", "crosshair-aux-bg"),
                    E
                        .selectAll("text")
                        .data(d3.range(4))
                        .enter()
                        .append("text")
                        .attr("y", function (a, b) {
                            return 15 * b
                        })
                        .attr("class", "crosshair-text"),
                    D
                        .append("circle")
                        .attr("class", "crosshair-point")
                        .attr("cx", 0)
                        .attr("cy", 0)
                        .attr("r", 3)
                };
            return {
                restrict: "E",
                scope: {
                    stat: "@",
                    player: "=",
                    shotData: "=",
                    distanceHighlight: "="
                },
                template: '<div><svg></svg></div><div class="chart-actions"><pb-png-saver data-filename="' +
                        'left_right_{{stat}}_{{player.PLAYERCODE}}_{{player.SEASON}}.png"></pb-png-save' +
                        'r></div>',
                link: function (a, c, g) {
                    var h = {},
                        i = f(a, c, g, h),
                        j = null;
                    $(window).on("resize", function () {
                        j && b.cancel(j),
                        j = b(function () {
                            j = null,
                            i = f(a, c, g, h)
                        }, 500)
                    }),
                    a.$on("resize-chart", function () {
                        j && b.cancel(j),
                        j = b(function () {
                            j = null,
                            i = f(a, c, g, h)
                        }, 500)
                    }),
                    a.$watch("distanceHighlight", function (b) {
                        null == b
                            ? e(c)
                            : d(c, b, i, a.shotData, h)
                    }),
                    a.$watch("shotData", function (b) {
                        b && (h.player = a.player, k(b, i, h))
                    })
                }
            }
        }
    ]),
angular
    .module("myApp.lineChart.vsTeamChart-directive", [])
    .directive("pbVsTeamChart", [
        "Team",
        "Util",
        function (a, b) {
            var c = function (c, d, e) {
                {
                    var f = e.yAxisLabel,
                        g = e.value;
                    e.maxDistance
                }
                d
                    .selectAll("*")
                    .remove();
                var h = {
                        top: 20,
                        right: 20,
                        bottom: 80,
                        left: 50
                    },
                    i = e.width - h.left - h.right,
                    j = e.height - h.top - h.bottom,
                    k = d3
                        .scale
                        .ordinal()
                        .rangeRoundBands([
                            0, i
                        ], .1),
                    l = d3
                        .scale
                        .linear()
                        .range([j, 0]),
                    m = (d3.scale.category10(), d3.svg.axis().scale(k).orient("bottom")),
                    n = d3
                        .svg
                        .axis()
                        .scale(l)
                        .ticks(5)
                        .orient("left");
                e.percent && n.tickFormat(d3.format(".0%")),
                d
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 " + (
                        i + h.left + h.right
                    ) + " " + (
                        j + h.top + h.bottom
                    )),
                b.safariSvg(d, i + h.left + h.right, j + h.top + h.bottom),
                d = d
                    .append("g")
                    .attr("transform", "translate(" + h.left + "," + h.top + ")"),
                k.domain(c.map(function (b) {
                    return a
                        .byId(b.OPPONENT_ID)
                        .TEAM_NAME
                })),
                l.domain([
                    0,
                    Math.max(e.yMax, d3.max(c, g))
                ]),
                d
                    .append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + j + ")")
                    .call(m)
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", function () {
                        return "rotate(-65)"
                    }),
                d
                    .append("g")
                    .attr("class", "y axis")
                    .call(n)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -40)
                    .attr("x", -j / 2)
                    .attr("class", "axis-label")
                    .text(f);
                var o = d
                    .selectAll(".bar-group")
                    .data(c)
                    .enter()
                    .append("g")
                    .attr("class", "bar-group")
                    .attr("transform", function (b) {
                        var c = k(a.byId(b.OPPONENT_ID).TEAM_NAME),
                            d = l(g(b));
                        return "translate(" + c + " " + d + ")"
                    });
                o
                    .append("rect")
                    .attr("class", "bar")
                    .attr("width", k.rangeBand())
                    .attr("height", function (a) {
                        return j - l(g(a))
                    })
                    .style("fill", e.barColor)
                    .on("mouseover", function (a) {
                        d
                            .select(".bar-reference-line")
                            .transition()
                            .duration(100)
                            .style("opacity", 1)
                            .attr("transform", "translate(0 " + l(g(a)) + ")")
                    })
                    .on("mouseout", function () {
                        d
                            .select(".bar-reference-line")
                            .transition()
                            .delay(50)
                            .duration(100)
                            .style("opacity", 0)
                    }),
                o
                    .append("text")
                    .attr("class", "bar-text")
                    .text(function (a) {
                        return e.format(g(a))
                    })
                    .attr("x", k.rangeBand() / 2)
                    .attr("y", function (a) {
                        return j - l(g(a)) >= 15
                            ? 3
                            : -12
                    })
                    .style("fill", function (a) {
                        return j - l(g(a)) >= 15
                            ? null
                            : "#666"
                    }),
                d
                    .append("line")
                    .attr("class", "player-avg reference-line")
                    .attr("x1", 0)
                    .attr("x2", i)
                    .attr("y1", l(e.playerValue()))
                    .attr("y2", l(e.playerValue())),
                d
                    .append("line")
                    .attr("class", "bar-reference-line")
                    .attr("x1", 0)
                    .attr("x2", i)
                    .attr("y1", 0)
                    .attr("y2", 0)
                    .style("opacity", 0)
            };
            return {
                restrict: "E",
                scope: {
                    vsTeamStats: "=",
                    player: "="
                },
                link: function (a, b, d) {
                    var e = d3
                            .select(b[0])
                            .append("svg"),
                        f = {
                            stat: d.stat || "points",
                            maxDistance: 30,
                            yMin: 0,
                            yMax: 1,
                            series: [
                                "overall", "league"
                            ],
                            width: d.width || b[0].offsetWidth,
                            height: d.height || 250
                        };
                    "efficiency" === f.stat
                        ? (
                            f.value = function (a) {
                                return 0 == a.TOTAL_FGA || null == a.TOTAL_FGA
                                    ? 0
                                    : parseInt(a.TOTAL_FGM, 10) / parseInt(a.TOTAL_FGA, 0)
                            },
                            f.playerValue = function () {
                                var b = a.player;
                                return b.FGM / b.FGA
                            },
                            f.percent = !0,
                            f.yAxisLabel = "Field Goal %",
                            f.yMax = .7,
                            f.barColor = "rgb(44, 160, 44)",
                            f.format = d3.format(
                                ".0%"
                            )
                        )
                        : (
                            f.value = function (a) {
                                return 0 == a.NUM_GAMES || null == a.TOTAL_PTS
                                    ? 0
                                    : parseInt(a.TOTAL_PTS, 10) / a.NUM_GAMES
                            },
                            f.playerValue = function () {
                                var b = a.player;
                                return b.PTS
                            },
                            f.yAxisLabel = "Average Points",
                            f.yMax = 25,
                            f.barColor = "rgb(31, 119, 180)",
                            f.format = d3.format(
                                ".1f"
                            )
                        ),
                    a.$watch("vsTeamStats", function (b) {
                        b && c(b, e, f, a)
                    })
                }
            }
        }
    ]),
angular.module("myApp.ranks", ["myApp.ranks.ranks-directive"]),
angular
    .module("myApp.ranks.ranks-directive", [])
    .directive("pbRanks", [
        function () {
            return {
                restrict: "E",
                templateUrl: "components/ranks/ranks.html",
                scope: {
                    stat: "@",
                    rankName: "@",
                    label: "@",
                    formatter: "=",
                    player: "=",
                    nearRanks: "=",
                    highlightPlayerId: "=",
                    season: "@"
                },
                link: function () {},
                controller: [
                    "$scope",
                    function (a) {
                        a.highlight = function (b) {
                            a.highlightPlayerId = b
                        }
                    }
                ]
            }
        }
    ])
    .directive("pbRankLists", [
        "$filter",
        function (a) {
            function b(a) {
                return d(100 * a)
            }
            var c = a("number"),
                d = function (a) {
                    return c(a, 1)
                };
            return {
                restrict: "E",
                scope: {
                    nearRanks: "=",
                    player: "=",
                    season: "@"
                },
                template: '<div class="rank-box" ng-repeat="stat in stats"><pb-ranks player="player" seas' +
                        'on="{{season}}" highlight-player-id="$parent.highlightPlayerId" near-ranks="ne' +
                        'arRanks" stat="{{stat.name}}" rank-name="{{stat.rankName}}" label="{{stat.labe' +
                        'l}}" formatter="stat.formatter"></pb-ranks></div>',
                link: function (e) {
                    e.stats = [
                        {
                            name: "PTS",
                            rankName: "PTS_RANK",
                            label: "PTS",
                            formatter: d
                        }, {
                            name: "SECONDS",
                            rankName: "SECONDS_RANK",
                            label: "MIN",
                            formatter: a("minutes")
                        }, {
                            name: "GP",
                            rankName: "GP_RANK",
                            label: "GAMES",
                            formatter: c
                        }, {
                            name: "FGPCT",
                            rankName: "FGPCT_RANK",
                            label: "FG%",
                            formatter: b
                        }, {
                            name: "TOTAL_FGM",
                            rankName: "FGM_RANK",
                            label: "FGM",
                            formatter: c
                        }, {
                            name: "TOTAL_FGA",
                            rankName: "FGA_RANK",
                            label: "FGA",
                            formatter: c
                        }, {
                            name: "FG3PCT",
                            rankName: "FG3PCT_RANK",
                            label: "3FG%",
                            formatter: b
                        }, {
                            name: "TOTAL_FG3M",
                            rankName: "FG3M_RANK",
                            label: "3FGM",
                            formatter: c
                        }, {
                            name: "TOTAL_FG3A",
                            rankName: "FG3A_RANK",
                            label: "3FGA",
                            formatter: c
                        }
                    ],
                    e.highlightPlayerId = null
                }
            }
        }
    ]),
angular.module(
    "myApp.playerSelector",
    ["myApp.playerSelector.playerSelector-directive", "myApp.playerSelector.playerSelector-util"]
),
angular
    .module("myApp.playerSelector.playerSelector-directive", [])
    .directive("pbPlayerLink", [
        "Season",
        function (a) {
            return {
                restrict: "A",
                scope: {
                    player: "=",
                    season: "@"
                },
                link: function (b, c) {
                    var d = b.season || a
                        .default()
                        .id;
                    c.attr("href", "#/playerView/" + b.player.PLAYER_ID + "_" + d)
                }
            }
        }
    ])
    .directive("pbPlayerSelector", [
        "Team",
        "Season",
        function (a, b) {
            return {
                restrict: "E",
                templateUrl: "components/playerSelector/playerSelector.html",
                scope: {
                    setPlayer: "=",
                    season: "="
                },
                link: {
                    pre: function (a) {
                        a.seasons = b.list();
                        var c = a.season || b.default();
                        a.selectedSeason = c.id,
                        a.sortables = [
                            {
                                label: "First",
                                attr: "DISPLAY_FIRST_LAST"
                            }, {
                                label: "Last",
                                attr: "DISPLAY_LAST_COMMA_FIRST"
                            }, {
                                label: "Position",
                                attr: "POSITION",
                                cssClass: "position-sorted"
                            }, {
                                label: "Team",
                                attr: "team",
                                cssClass: "team-sorted"
                            }, {
                                label: "PTS",
                                attr: "PTS_RANK"
                            }, {
                                label: "MIN",
                                attr: "SECONDS_RANK"
                            }, {
                                label: "GAMES",
                                attr: "GP_RANK"
                            }, {
                                label: "FG%",
                                attr: "FGPCT_RANK"
                            }, {
                                label: "FGM",
                                attr: "FGM_RANK"
                            }, {
                                label: "FGA",
                                attr: "FGA_RANK"
                            }, {
                                label: "3FG%",
                                attr: "FG3PCT_RANK"
                            }, {
                                label: "3FGM",
                                attr: "FG3M_RANK"
                            }, {
                                label: "3FGA",
                                attr: "FG3A_RANK"
                            }
                        ],
                        a.activeSortable = a.sortables[0],
                        a.playerQuery = ""
                    }
                },
                controller: [
                    "$scope",
                    "Player",
                    "Team",
                    function (a, b, c) {
                        function d(b) {
                            a.allPlayers && (
                                a.activePlayers = a.allPlayers.filter(function (a) {
                                    return a.SEASON === b
                                }),
                                a.groupedPlayers = e(a.activePlayers)
                            )
                        }
                        function e(a) {
                            for (var b = 10, c = Math.ceil(a.length / b), d = [], e = 0; c > e; e++) {
                                d[e] = {
                                    players: [],
                                    start: e * b
                                };
                                for (var f = 0; b > f; f++) {
                                    var g = a[e * b + f];
                                    g && (d[e].players.push(g), g.index = e * b + f)
                                }
                            }
                            return i(d),
                            d
                        }
                        function f(a) {
                            for (var b = [], d = 0, e = 0; a[e];) {
                                var f = a[e].TEAM_ID;
                                for (b[d] = {
                                    players: [],
                                    start: 0,
                                    header: c
                                        .byId(f)
                                        .FULL_NAME
                                }; a[e] && a[e].TEAM_ID === f;) 
                                    b[d]
                                        .players
                                        .push(a[e]),
                                    a[e].index = b[d].players.length - 1,
                                    e++;
                                d++
                            }
                            return i(b),
                            b
                        }
                        function g(a) {
                            console.log("group players by position");
                            for (var b = [], c = 0, d = 0; a[d];) {
                                var e = a[d].POSITION;
                                for (b[c] = {
                                    players: [],
                                    start: 0,
                                    header: e
                                }; a[d] && a[d].POSITION === e;) 
                                    b[c]
                                        .players
                                        .push(a[d]),
                                    a[d].index = b[c].players.length - 1,
                                    d++;
                                c++
                            }
                            return i(b),
                            b
                        }
                        function h(b) {
                            var d = b
                                    .DISPLAY_FIRST_LAST
                                    .toLowerCase(),
                                e = b
                                    .POSITION
                                    .toLowerCase(),
                                f = c
                                    .byId(b.TEAM_ID)
                                    .FULL_NAME
                                    .toLowerCase(),
                                g = a.playerQuery || "";
                            return g = g.toLowerCase(),
                            -1 !== d.indexOf(g) || -1 !== f.indexOf(g) || -1 !== e.indexOf(g)
                        }
                        function i(b) {
                            b = b || a.groupedPlayers,
                            b && b.forEach(function (a) {
                                for (var b = !1, c = 0; c < a.players.length; c++) {
                                    var d = h(a.players[c]);
                                    a
                                        .players[c]
                                        .visible = d,
                                    b = b || d
                                }
                                a.visible = b
                            })
                        }
                        b.query({
                            season: "all"
                        }, function (b) {
                            a.allPlayers = b,
                            d(a.selectedSeason)
                        }),
                        a.getTeamAbbrev = function (a) {
                            return a
                                ? c
                                    .byId(a)
                                    .TEAM_ABBREVIATION
                                : void 0
                        },
                        a.hide = function () {
                            a.$parent.playerSelectorVisible = !1
                        },
                        a.$watch("playerQuery", function () {
                            i()
                        }),
                        a.$watch("selectedSeason", function (a) {
                            d(a)
                        }),
                        a.selectPlayer = function (b, c) {
                            b && a.setPlayer(b, c)
                        },
                        a.autocomplete = function () {},
                        a.sortPlayers = function (b) {
                            a.activeSortable = b;
                            var d = b.attr;
                            return "team" === d
                                ? (a.activePlayers.sort(function (a, b) {
                                    return a.TEAM_ID === b.TEAM_ID
                                        ? a.DISPLAY_FIRST_LAST < b.DISPLAY_FIRST_LAST
                                            ? -1
                                            : 1
                                        : c
                                            .byId(a.TEAM_ID)
                                            .FULL_NAME < c
                                            .byId(b.TEAM_ID)
                                            .FULL_NAME
                                                ? -1
                                                : 1
                                }), void(a.groupedPlayers = f(a.activePlayers)))
                                : (a.activePlayers.sort(function (a, b) {
                                    return a[d] === b[d]
                                        ? a.DISPLAY_FIRST_LAST < b.DISPLAY_FIRST_LAST
                                            ? -1
                                            : 1
                                        : null == b[d]
                                            ? -1
                                            : null == a[d]
                                                ? 1
                                                : a[d] < b[d]
                                                    ? -1
                                                    : 1
                                }), void(
                                    a.groupedPlayers = "POSITION" === d
                                        ? g(a.activePlayers)
                                        : e(a.activePlayers)
                                ))
                        }
                    }
                ]
            }
        }
    ]),
angular
    .module("myApp.playerSelector.playerSelector-util", [])
    .factory("PlayerSelectorUtil", [
        "Url",
        function (a) {
            function b() {
                var b = a.urlToParams(),
                    c = {
                        playerSelector: "true" === b.playerSelector || b.playerSelector === !0,
                        selectedPlayer: parseInt(b.selectedPlayer, 10)
                    };
                return isNaN(c.selectedPlayer) && delete c.selectedPlayer,
                c
            }
            function c(a, b) {
                var c = {};
                return a && (
                    c.playerSelector = a,
                    void 0 !== b && 0 !== b && (c.selectedPlayer = b)
                ),
                c
            }
            return {playerSelectorFromUrl: b, playerSelectorAsParams: c}
        }
    ]),
angular.module(
    "myApp.gameSelector",
    ["myApp.gameSelector.gameSelector-directive", "myApp.gameSelector.gameSelector-util"]
),
angular
    .module("myApp.gameSelector.gameSelector-directive", [])
    .directive("pbGameSelector", [
        "Team",
        function (a) {
            var b = {
                selecting: 1,
                deselecting: 2
            };
            return {
                restrict: "E",
                scope: {
                    activeGames: "=",
                    gameStats: "=",
                    teams: "="
                },
                templateUrl: "components/gameSelector/gameSelector.html",
                link: function (a) {
                    a.selectedTeam = void 0,
                    a.selectedLastGames = void 0,
                    a.lastGameValues = [
                        1,
                        2,
                        3,
                        4,
                        5,
                        10,
                        20,
                        41
                    ].map(function (a) {
                        return {
                            label: a + " Games",
                            value: a
                        }
                    })
                },
                controller: [
                    "$scope",
                    function (c) {
                        function d(a) {
                            delete c.activeGames[a.GAME_ID]
                        }
                        function e(a) {
                            c.activeGames[a.GAME_ID] = !1
                        }
                        c.mouseOver = function (a) {
                            c.selecting && (
                                c.selecting === b.deselecting
                                    ? e(a)
                                    : d(a)
                            )
                        },
                        c.selectStart = function (a) {
                            c.isActive(a)
                                ? (c.selecting = b.deselecting, e(a))
                                : (c.selecting = b.selecting, d(a))
                        },
                        c.selectEnd = function () {
                            c.selecting = null,
                            c.selectedTeam = void 0
                        },
                        c.isActive = function (a) {
                            return c.activeGames[a.GAME_ID] !== !1
                        },
                        c.toggle = function () {};
                        var f = {
                            none: function () {
                                return !1
                            },
                            home: function (a) {
                                return a.IS_HOME
                            },
                            away: function (a) {
                                return !a.IS_HOME
                            },
                            wins: function (a) {
                                return a.WON
                            },
                            losses: function (a) {
                                return !a.WON
                            },
                            team: function (a) {
                                return function (b) {
                                    return b.OPPONENT_ID === a
                                }
                            },
                            last_games: function (a, b) {
                                return b >= c.gameStats.length - c.selectedLastGames
                            }
                        };
                        c.batchActivate = function (a) {
                            if ("all" === a || "team" === a && null == c.selectedTeam) 
                                return void(c.activeGames = {});
                            var b = f[a];
                            "team" === a
                                ? b = b(c.selectedTeam)
                                : (
                                    c.selectedTeam = void 0,
                                    "last_games" !== a && (c.selectedLastGames = void 0)
                                ),
                            c
                                .gameStats
                                .forEach(function (a, c) {
                                    b(a, c)
                                        ? d(a)
                                        : e(a)
                                })
                        },
                        c.getTeamAbbrev = function (b) {
                            return b
                                ? a
                                    .byId(b)
                                    .TEAM_ABBREVIATION
                                : void 0
                        }
                    }
                ]
            }
        }
    ]),
angular
    .module("myApp.gameSelector.gameSelector-util", [])
    .factory("GameSelectorUtil", [
        "Url",
        function (a) {
            function b(a) {
                var b,
                    c = Object.keys(a);
                return c.length && (b = {
                    inactiveGames: c.join(",")
                }),
                b
            }
            function c() {
                var b = a.urlToParams(),
                    c = {};
                if (b.inactiveGames) {
                    var d = b
                        .inactiveGames
                        .split(",");
                    c = {},
                    d.forEach(function (a) {
                        c[a] = !1
                    })
                }
                return c
            }
            return {activeGamesFromUrl: c, activeGamesAsParams: b}
        }
    ]),
angular
    .module("myApp.rangeSlider-directive", [])
    .directive("pbRangeSlider", [
        function () {
            return {
                restrict: "E",
                scope: {
                    model: "="
                },
                link: function (a, b, c) {
                    var d;
                    if (
                        d = "percent" === c.type
                            ? function (a) {
                                return Math.round(1e3 * a) / 10 + "%"
                            }
                            : Math.round,
                        null != c.clampMax
                    ) {
                        var e = parseInt(c.clampMax, 10),
                            f = d;
                        d = function (a) {
                            return a >= e
                                ? f(e) + "+"
                                : f(a)
                        }
                    }
                    b.rangeSlider({
                        arrows: !1,
                        bounds: {
                            min: parseInt(c.min, 10),
                            max: parseInt(c.max, 10)
                        },
                        defaultValues: {
                            min: a.model.min,
                            max: a.model.max
                        },
                        step: c.step,
                        formatter: d
                    }),
                    b.on("valuesChanged", function (b, c) {
                        a.$apply(function () {
                            a.model.min = c.values.min,
                            a.model.max = e && c.values.max >= e
                                ? 1e11
                                : c.values.max
                        })
                    })
                }
            }
        }
    ]),
!function (a) {
    a.widget("ui.rangeSliderMouseTouch", a.ui.mouse, {
        enabled: !0,
        _mouseInit: function () {
            var b = this;
            a
                .ui
                .mouse
                .prototype
                ._mouseInit
                .apply(this),
            this._mouseDownEvent = !1,
            this
                .element
                .bind("touchstart." + this.widgetName, function (a) {
                    return b._touchStart(a)
                })
        },
        _mouseDestroy: function () {
            a(document)
                .unbind("touchmove." + this.widgetName, this._touchMoveDelegate)
                .unbind("touchend." + this.widgetName, this._touchEndDelegate),
            a
                .ui
                .mouse
                .prototype
                ._mouseDestroy
                .apply(this)
        },
        enable: function () {
            this.enabled = !0
        },
        disable: function () {
            this.enabled = !1
        },
        destroy: function () {
            this._mouseDestroy(),
            a
                .ui
                .mouse
                .prototype
                .destroy
                .apply(this),
            this._mouseInit = null
        },
        _touchStart: function (b) {
            if (!this.enabled) 
                return !1;
            b.which = 1,
            b.preventDefault(),
            this._fillTouchEvent(b);
            var c = this,
                d = this._mouseDownEvent;
            this._mouseDown(b),
            d !== this._mouseDownEvent && (
                this._touchEndDelegate = function (a) {
                    c._touchEnd(a)
                },
                this._touchMoveDelegate = function (a) {
                    c._touchMove(a)
                },
                a(document).bind("touchmove." + this.widgetName, this._touchMoveDelegate).bind(
                    "touchend." + this.widgetName,
                    this._touchEndDelegate
                )
            )
        },
        _mouseDown: function (b) {
            return this.enabled
                ? a
                    .ui
                    .mouse
                    .prototype
                    ._mouseDown
                    .apply(this, [b])
                : !1
        },
        _touchEnd: function (b) {
            this._fillTouchEvent(b),
            this._mouseUp(b),
            a(document)
                .unbind("touchmove." + this.widgetName, this._touchMoveDelegate)
                .unbind("touchend." + this.widgetName, this._touchEndDelegate),
            this._mouseDownEvent = !1,
            a(document).trigger("mouseup")
        },
        _touchMove: function (a) {
            return a.preventDefault(),
            this._fillTouchEvent(a),
            this._mouseMove(a)
        },
        _fillTouchEvent: function (a) {
            var b;
            b = "undefined" == typeof a.targetTouches && "undefined" == typeof a.changedTouches
                ? a
                    .originalEvent
                    .targetTouches[0] || a
                    .originalEvent
                    .changedTouches[0]
                : a.targetTouches[0] || a.changedTouches[0],
            a.pageX = b.pageX,
            a.pageY = b.pageY
        }
    })
}(jQuery),
function (a) {
    a.widget("ui.rangeSliderDraggable", a.ui.rangeSliderMouseTouch, {
        cache: null,
        options: {
            containment: null
        },
        _create: function () {
            a
                .ui
                .rangeSliderMouseTouch
                .prototype
                ._create
                .apply(this),
            setTimeout(a.proxy(this._initElementIfNotDestroyed, this), 10)
        },
        destroy: function () {
            this.cache = null,
            a
                .ui
                .rangeSliderMouseTouch
                .prototype
                .destroy
                .apply(this)
        },
        _initElementIfNotDestroyed: function () {
            this._mouseInit && this._initElement()
        },
        _initElement: function () {
            this._mouseInit(),
            this._cache()
        },
        _setOption: function (b, c) {
            "containment" === b && (
                this.options.containment = null === c || 0 === a(c).length
                    ? null
                    : a(c)
            )
        },
        _mouseStart: function (a) {
            return this._cache(),
            this.cache.click = {
                left: a.pageX,
                top: a.pageY
            },
            this.cache.initialOffset = this
                .element
                .offset(),
            this._triggerMouseEvent("mousestart"),
            !0
        },
        _mouseDrag: function (a) {
            var b = a.pageX - this.cache.click.left;
            return b = this._constraintPosition(b + this.cache.initialOffset.left),
            this._applyPosition(b),
            this._triggerMouseEvent("sliderDrag"),
            !1
        },
        _mouseStop: function () {
            this._triggerMouseEvent("stop")
        },
        _constraintPosition: function (a) {
            return 0 !== this
                .element
                .parent()
                .length && null !== this.cache.parent.offset && (a = Math.min(
                    a,
                    this.cache.parent.offset.left + this.cache.parent.width - this.cache.width.outer
                ), a = Math.max(a, this.cache.parent.offset.left)),
            a
        },
        _applyPosition: function (a) {
            var b = {
                top: this.cache.offset.top,
                left: a
            };
            this
                .element
                .offset({left: a}),
            this.cache.offset = b
        },
        _cacheIfNecessary: function () {
            null === this.cache && this._cache()
        },
        _cache: function () {
            this.cache = {},
            this._cacheMargins(),
            this._cacheParent(),
            this._cacheDimensions(),
            this.cache.offset = this
                .element
                .offset()
        },
        _cacheMargins: function () {
            this.cache.margin = {
                left: this._parsePixels(this.element, "marginLeft"),
                right: this._parsePixels(this.element, "marginRight"),
                top: this._parsePixels(this.element, "marginTop"),
                bottom: this._parsePixels(this.element, "marginBottom")
            }
        },
        _cacheParent: function () {
            if (null !== this.options.parent) {
                var a = this
                    .element
                    .parent();
                this.cache.parent = {
                    offset: a.offset(),
                    width: a.width()
                }
            } else 
                this.cache.parent = null
        },
        _cacheDimensions: function () {
            this.cache.width = {
                outer: this
                    .element
                    .outerWidth(),
                inner: this
                    .element
                    .width()
            }
        },
        _parsePixels: function (a, b) {
            return parseInt(a.css(b), 10) || 0
        },
        _triggerMouseEvent: function (a) {
            var b = this._prepareEventData();
            this
                .element
                .trigger(a, b)
        },
        _prepareEventData: function () {
            return {
                element: this.element,
                offset: this.cache.offset || null
            }
        }
    })
}(jQuery),
function (a, b) {
    a.widget("ui.rangeSlider", {
        options: {
            bounds: {
                min: 0,
                max: 100
            },
            defaultValues: {
                min: 20,
                max: 50
            },
            wheelMode: null,
            wheelSpeed: 4,
            arrows: !0,
            valueLabels: "show",
            formatter: null,
            durationIn: 0,
            durationOut: 400,
            delayOut: 200,
            range: {
                min: !1,
                max: !1
            },
            step: !1,
            scales: !1,
            enabled: !0,
            symmetricPositionning: !1
        },
        _values: null,
        _valuesChanged: !1,
        _initialized: !1,
        bar: null,
        leftHandle: null,
        rightHandle: null,
        innerBar: null,
        container: null,
        arrows: null,
        labels: null,
        changing: {
            min: !1,
            max: !1
        },
        changed: {
            min: !1,
            max: !1
        },
        ruler: null,
        _create: function () {
            this._setDefaultValues(),
            this.labels = {
                left: null,
                right: null,
                leftDisplayed: !0,
                rightDisplayed: !0
            },
            this.arrows = {
                left: null,
                right: null
            },
            this.changing = {
                min: !1,
                max: !1
            },
            this.changed = {
                min: !1,
                max: !1
            },
            this._createElements(),
            this._bindResize(),
            setTimeout(a.proxy(this.resize, this), 1),
            setTimeout(a.proxy(this._initValues, this), 1)
        },
        _setDefaultValues: function () {
            this._values = {
                min: this.options.defaultValues.min,
                max: this.options.defaultValues.max
            }
        },
        _bindResize: function () {
            var b = this;
            this._resizeProxy = function (a) {
                b.resize(a)
            },
            a(window).resize(this._resizeProxy)
        },
        _initWidth: function () {
            this
                .container
                .css(
                    "width",
                    this.element.width() - this.container.outerWidth(!0) + this.container.width()
                ),
            this
                .innerBar
                .css(
                    "width",
                    this.container.width() - this.innerBar.outerWidth(!0) + this.innerBar.width()
                )
        },
        _initValues: function () {
            this._initialized = !0,
            this.values(this._values.min, this._values.max)
        },
        _setOption: function (a, b) {
            this._setWheelOption(a, b),
            this._setArrowsOption(a, b),
            this._setLabelsOption(a, b),
            this._setLabelsDurations(a, b),
            this._setFormatterOption(a, b),
            this._setBoundsOption(a, b),
            this._setRangeOption(a, b),
            this._setStepOption(a, b),
            this._setScalesOption(a, b),
            this._setEnabledOption(a, b),
            this._setPositionningOption(a, b)
        },
        _validProperty: function (a, b, c) {
            return null === a || "undefined" == typeof a[b]
                ? c
                : a[b]
        },
        _setStepOption: function (a, b) {
            "step" === a && (
                this.options.step = b,
                this._leftHandle("option", "step", b),
                this._rightHandle("option", "step", b),
                this._changed(!0)
            )
        },
        _setScalesOption: function (a, b) {
            "scales" === a && (
                b === !1 || null === b
                    ? (this.options.scales = !1, this._destroyRuler())
                    : b instanceof Array && (this.options.scales = b, this._updateRuler())
            )
        },
        _setRangeOption: function (a, b) {
            "range" === a && (
                this._bar("option", "range", b),
                this.options.range = this._bar("option", "range"),
                this._changed(!0)
            )
        },
        _setBoundsOption: function (a, b) {
            "bounds" === a && "undefined" != typeof b.min && "undefined" != typeof b.max && this.bounds(
                b.min,
                b.max
            )
        },
        _setWheelOption: function (a, b) {
            ("wheelMode" === a || "wheelSpeed" === a) && (
                this._bar("option", a, b),
                this.options[a] = this._bar("option", a)
            )
        },
        _setLabelsOption: function (a, b) {
            if ("valueLabels" === a) {
                if ("hide" !== b && "show" !== b && "change" !== b) 
                    return;
                this.options.valueLabels = b,
                "hide" !== b
                    ? (this._createLabels(), this._leftLabel("update"), this._rightLabel("update"))
                    : this._destroyLabels()
            }
        },
        _setFormatterOption: function (a, b) {
            "formatter" === a && null !== b && "function" == typeof b && "hide" !== this.options.valueLabels && (
                this._leftLabel("option", "formatter", b),
                this.options.formatter = this._rightLabel("option", "formatter", b)
            )
        },
        _setArrowsOption: function (a, b) {
            "arrows" !== a || b !== !0 && b !== !1 || b === this.options.arrows || (
                b === !0
                    ? (
                        this.element.removeClass("ui-rangeSlider-noArrow").addClass("ui-rangeSlider-withArrows"),
                        this.arrows.left.css("display", "block"),
                        this.arrows.right.css("display", "block"),
                        this.options.arrows = !0
                    )
                    : b === !1 && (
                        this.element.addClass("ui-rangeSlider-noArrow").removeClass("ui-rangeSlider-withArrows"),
                        this.arrows.left.css("display", "none"),
                        this.arrows.right.css("display", "none"),
                        this.options.arrows = !1
                    ),
                this._initWidth()
            )
        },
        _setLabelsDurations: function (a, b) {
            if ("durationIn" === a || "durationOut" === a || "delayOut" === a) {
                if (parseInt(b, 10) !== b) 
                    return;
                null !== this.labels.left && this._leftLabel("option", a, b),
                null !== this.labels.right && this._rightLabel("option", a, b),
                this.options[a] = b
            }
        },
        _setEnabledOption: function (a, b) {
            "enabled" === a && this.toggle(b)
        },
        _setPositionningOption: function (a, b) {
            "symmetricPositionning" === a && (
                this._rightHandle("option", a, b),
                this.options[a] = this._leftHandle("option", a, b)
            )
        },
        _createElements: function () {
            "absolute" !== this
                .element
                .css("position") && this
                .element
                .css("position", "relative"),
            this
                .element
                .addClass("ui-rangeSlider"),
            this.container = a("<div class='ui-rangeSlider-container' />")
                .css(
                    "position",
                    "absolute"
                )
                .appendTo(this.element),
            this.innerBar = a("<div class='ui-rangeSlider-innerBar' />")
                .css(
                    "position",
                    "absolute"
                )
                .css("top", 0)
                .css("left", 0),
            this._createHandles(),
            this._createBar(),
            this
                .container
                .prepend(this.innerBar),
            this._createArrows(),
            "hide" !== this.options.valueLabels
                ? this._createLabels()
                : this._destroyLabels(),
            this._updateRuler(),
            this.options.enabled || this._toggle(this.options.enabled)
        },
        _createHandle: function (b) {
            return a("<div />")[this._handleType()](b)
                .bind(
                    "sliderDrag",
                    a.proxy(this._changing, this)
                )
                .bind("stop", a.proxy(this._changed, this))
        },
        _createHandles: function () {
            this.leftHandle = this
                ._createHandle({
                    isLeft: !0,
                    bounds: this.options.bounds,
                    value: this._values.min,
                    step: this.options.step,
                    symmetricPositionning: this.options.symmetricPositionning
                })
                .appendTo(this.container),
            this.rightHandle = this
                ._createHandle({
                    isLeft: !1,
                    bounds: this.options.bounds,
                    value: this._values.max,
                    step: this.options.step,
                    symmetricPositionning: this.options.symmetricPositionning
                })
                .appendTo(this.container)
        },
        _createBar: function () {
            this.bar = a("<div />")
                .prependTo(this.container)
                .bind("sliderDrag scroll zoom", a.proxy(this._changing, this))
                .bind("stop", a.proxy(this._changed, this)),
            this._bar({
                leftHandle: this.leftHandle,
                rightHandle: this.rightHandle,
                values: {
                    min: this._values.min,
                    max: this._values.max
                },
                type: this._handleType(),
                range: this.options.range,
                wheelMode: this.options.wheelMode,
                wheelSpeed: this.options.wheelSpeed
            }),
            this.options.range = this._bar("option", "range"),
            this.options.wheelMode = this._bar("option", "wheelMode"),
            this.options.wheelSpeed = this._bar("option", "wheelSpeed")
        },
        _createArrows: function () {
            this.arrows.left = this._createArrow("left"),
            this.arrows.right = this._createArrow("right"),
            this.options.arrows
                ? this
                    .element
                    .addClass("ui-rangeSlider-withArrows")
                : (
                    this.arrows.left.css("display", "none"),
                    this.arrows.right.css("display", "none"),
                    this.element.addClass("ui-rangeSlider-noArrow")
                )
        },
        _createArrow: function (b) {
            var c,
                d = a("<div class='ui-rangeSlider-arrow' />")
                    .append(
                        "<div class='ui-rangeSlider-arrow-inner' />"
                    )
                    .addClass("ui-rangeSlider-" + b + "Arrow")
                    .css("position", "absolute")
                    .css(b, 0)
                    .appendTo(this.element);
            return c = "right" === b
                ? a.proxy(this._scrollRightClick, this)
                : a.proxy(this._scrollLeftClick, this),
            d.bind("mousedown touchstart", c),
            d
        },
        _proxy: function (a, b, c) {
            var d = Array
                .prototype
                .slice
                .call(c);
            return a && a[b]
                ? a[b].apply(a, d)
                : null
        },
        _handleType: function () {
            return "rangeSliderHandle"
        },
        _barType: function () {
            return "rangeSliderBar"
        },
        _bar: function () {
            return this._proxy(this.bar, this._barType(), arguments)
        },
        _labelType: function () {
            return "rangeSliderLabel"
        },
        _leftLabel: function () {
            return this._proxy(this.labels.left, this._labelType(), arguments)
        },
        _rightLabel: function () {
            return this._proxy(this.labels.right, this._labelType(), arguments)
        },
        _leftHandle: function () {
            return this._proxy(this.leftHandle, this._handleType(), arguments)
        },
        _rightHandle: function () {
            return this._proxy(this.rightHandle, this._handleType(), arguments)
        },
        _getValue: function (a, b) {
            return b === this.rightHandle && (a -= b.outerWidth()),
            a * (this.options.bounds.max - this.options.bounds.min) / (
                this.container.innerWidth() - b.outerWidth(!0)
            ) + this.options.bounds.min
        },
        _trigger: function (a) {
            var b = this;
            setTimeout(function () {
                b
                    .element
                    .trigger(a, {
                        label: b.element,
                        values: b.values()
                    })
            }, 1)
        },
        _changing: function () {
            this._updateValues() && (
                this._trigger("valuesChanging"),
                this._valuesChanged = !0
            )
        },
        _deactivateLabels: function () {
            "change" === this.options.valueLabels && (
                this._leftLabel("option", "show", "hide"),
                this._rightLabel("option", "show", "hide")
            )
        },
        _reactivateLabels: function () {
            "change" === this.options.valueLabels && (
                this._leftLabel("option", "show", "change"),
                this._rightLabel("option", "show", "change")
            )
        },
        _changed: function (a) {
            a === !0 && this._deactivateLabels(),
            (this._updateValues() || this._valuesChanged) && (
                this._trigger("valuesChanged"),
                a !== !0 && this._trigger("userValuesChanged"),
                this._valuesChanged = !1
            ),
            a === !0 && this._reactivateLabels()
        },
        _updateValues: function () {
            var a = this._leftHandle("value"),
                b = this._rightHandle("value"),
                c = this._min(a, b),
                d = this._max(a, b),
                e = c !== this._values.min || d !== this._values.max;
            return this._values.min = this._min(a, b),
            this._values.max = this._max(a, b),
            e
        },
        _min: function (a, b) {
            return Math.min(a, b)
        },
        _max: function (a, b) {
            return Math.max(a, b)
        },
        _createLabel: function (b, c) {
            var d;
            return null === b
                ? (
                    d = this._getLabelConstructorParameters(b, c),
                    b = a("<div />").appendTo(this.element)[this._labelType()](
                        d
                    )
                )
                : (d = this._getLabelRefreshParameters(b, c), b[this._labelType()](d)),
            b
        },
        _getLabelConstructorParameters: function (a, b) {
            return {
                handle: b,
                handleType: this._handleType(),
                formatter: this._getFormatter(),
                show: this.options.valueLabels,
                durationIn: this.options.durationIn,
                durationOut: this.options.durationOut,
                delayOut: this.options.delayOut
            }
        },
        _getLabelRefreshParameters: function () {
            return {formatter: this._getFormatter(), show: this.options.valueLabels, durationIn: this.options.durationIn, durationOut: this.options.durationOut, delayOut: this.options.delayOut}
        },
        _getFormatter: function () {
            return this.options.formatter === !1 || null === this.options.formatter
                ? this._defaultFormatter
                : this.options.formatter
        },
        _defaultFormatter: function (a) {
            return Math.round(a)
        },
        _destroyLabel: function (a) {
            return null !== a && (a[this._labelType()]("destroy"), a.remove(), a = null),
            a
        },
        _createLabels: function () {
            this.labels.left = this._createLabel(this.labels.left, this.leftHandle),
            this.labels.right = this._createLabel(this.labels.right, this.rightHandle),
            this._leftLabel("pair", this.labels.right)
        },
        _destroyLabels: function () {
            this.labels.left = this._destroyLabel(this.labels.left),
            this.labels.right = this._destroyLabel(this.labels.right)
        },
        _stepRatio: function () {
            return this._leftHandle("stepRatio")
        },
        _scrollRightClick: function (a) {
            return this.options.enabled
                ? (
                    a.preventDefault(),
                    this._bar("startScroll"),
                    this._bindStopScroll(),
                    void this._continueScrolling("scrollRight", 4 * this._stepRatio(), 1)
                )
                : !1
        },
        _continueScrolling: function (a, b, c, d) {
            if (!this.options.enabled) 
                return !1;
            this._bar(a, c),
            d = d || 5,
            d--;
            var e = this,
                f = 16,
                g = Math.max(1, 4 / this._stepRatio());
            this._scrollTimeout = setTimeout(function () {
                0 === d && (
                    b > f
                        ? b = Math.max(f, b / 1.5)
                        : c = Math.min(g, 2 * c),
                    d = 5
                ),
                e._continueScrolling(a, b, c, d)
            }, b)
        },
        _scrollLeftClick: function (a) {
            return this.options.enabled
                ? (
                    a.preventDefault(),
                    this._bar("startScroll"),
                    this._bindStopScroll(),
                    void this._continueScrolling("scrollLeft", 4 * this._stepRatio(), 1)
                )
                : !1
        },
        _bindStopScroll: function () {
            var b = this;
            this._stopScrollHandle = function (a) {
                a.preventDefault(),
                b._stopScroll()
            },
            a(document).bind("mouseup touchend", this._stopScrollHandle)
        },
        _stopScroll: function () {
            a(document).unbind("mouseup touchend", this._stopScrollHandle),
            this._stopScrollHandle = null,
            this._bar("stopScroll"),
            clearTimeout(this._scrollTimeout)
        },
        _createRuler: function () {
            this.ruler = a("<div class='ui-rangeSlider-ruler' />").appendTo(this.innerBar)
        },
        _setRulerParameters: function () {
            this
                .ruler
                .ruler(
                    {min: this.options.bounds.min, max: this.options.bounds.max, scales: this.options.scales}
                )
        },
        _destroyRuler: function () {
            null !== this.ruler && a.fn.ruler && (
                this.ruler.ruler("destroy"),
                this.ruler.remove(),
                this.ruler = null
            )
        },
        _updateRuler: function () {
            this._destroyRuler(),
            this.options.scales !== !1 && a.fn.ruler && (
                this._createRuler(),
                this._setRulerParameters()
            )
        },
        values: function (a, b) {
            var c;
            if ("undefined" != typeof a && "undefined" != typeof b) {
                if (!this._initialized) 
                    return this._values.min = a,
                    this._values.max = b,
                    this._values;
                this._deactivateLabels(),
                c = this._bar("values", a, b),
                this._changed(!0),
                this._reactivateLabels()
            } else 
                c = this._bar("values", a, b);
            return c
        },
        min: function (a) {
            return this._values.min = this
                .values(a, this._values.max)
                .min,
            this._values.min
        },
        max: function (a) {
            return this._values.max = this
                .values(this._values.min, a)
                .max,
            this._values.max
        },
        bounds: function (a, b) {
            return this._isValidValue(a) && this._isValidValue(b) && b > a && (
                this._setBounds(a, b),
                this._updateRuler(),
                this._changed(!0)
            ),
            this.options.bounds
        },
        _isValidValue: function (a) {
            return "undefined" != typeof a && parseFloat(a) === a
        },
        _setBounds: function (a, b) {
            this.options.bounds = {
                min: a,
                max: b
            },
            this._leftHandle("option", "bounds", this.options.bounds),
            this._rightHandle("option", "bounds", this.options.bounds),
            this._bar("option", "bounds", this.options.bounds)
        },
        zoomIn: function (a) {
            this._bar("zoomIn", a)
        },
        zoomOut: function (a) {
            this._bar("zoomOut", a)
        },
        scrollLeft: function (a) {
            this._bar("startScroll"),
            this._bar("scrollLeft", a),
            this._bar("stopScroll")
        },
        scrollRight: function (a) {
            this._bar("startScroll"),
            this._bar("scrollRight", a),
            this._bar("stopScroll")
        },
        resize: function () {
            this._initWidth(),
            this._leftHandle("update"),
            this._rightHandle("update"),
            this._bar("update")
        },
        enable: function () {
            this.toggle(!0)
        },
        disable: function () {
            this.toggle(!1)
        },
        toggle: function (a) {
            a === b && (a = !this.options.enabled),
            this.options.enabled !== a && this._toggle(a)
        },
        _toggle: function (a) {
            this.options.enabled = a,
            this
                .element
                .toggleClass("ui-rangeSlider-disabled", !a);
            var b = a
                ? "enable"
                : "disable";
            this._bar(b),
            this._leftHandle(b),
            this._rightHandle(b),
            this._leftLabel(b),
            this._rightLabel(b)
        },
        destroy: function () {
            this
                .element
                .removeClass(
                    "ui-rangeSlider-withArrows ui-rangeSlider-noArrow ui-rangeSlider-disabled"
                ),
            this._destroyWidgets(),
            this._destroyElements(),
            this
                .element
                .removeClass("ui-rangeSlider"),
            this.options = null,
            a(window).unbind("resize", this._resizeProxy),
            this._resizeProxy = null,
            this._bindResize = null,
            a
                .Widget
                .prototype
                .destroy
                .apply(this, arguments)
        },
        _destroyWidget: function (a) {
            this["_" + a]("destroy"),
            this[a].remove(),
            this[a] = null
        },
        _destroyWidgets: function () {
            this._destroyWidget("bar"),
            this._destroyWidget("leftHandle"),
            this._destroyWidget("rightHandle"),
            this._destroyRuler(),
            this._destroyLabels()
        },
        _destroyElements: function () {
            this
                .container
                .remove(),
            this.container = null,
            this
                .innerBar
                .remove(),
            this.innerBar = null,
            this
                .arrows
                .left
                .remove(),
            this
                .arrows
                .right
                .remove(),
            this.arrows = null
        }
    })
}(jQuery),
function (a) {
    a.widget("ui.rangeSliderHandle", a.ui.rangeSliderDraggable, {
        currentMove: null,
        margin: 0,
        parentElement: null,
        options: {
            isLeft: !0,
            bounds: {
                min: 0,
                max: 100
            },
            range: !1,
            value: 0,
            step: !1
        },
        _value: 0,
        _left: 0,
        _create: function () {
            a
                .ui
                .rangeSliderDraggable
                .prototype
                ._create
                .apply(this),
            this
                .element
                .css("position", "absolute")
                .css("top", 0)
                .addClass("ui-rangeSlider-handle")
                .toggleClass("ui-rangeSlider-leftHandle", this.options.isLeft)
                .toggleClass("ui-rangeSlider-rightHandle", !this.options.isLeft),
            this
                .element
                .append("<div class='ui-rangeSlider-handle-inner' />"),
            this._value = this._constraintValue(this.options.value)
        },
        destroy: function () {
            this
                .element
                .empty(),
            a
                .ui
                .rangeSliderDraggable
                .prototype
                .destroy
                .apply(this)
        },
        _setOption: function (b, c) {
            "isLeft" !== b || c !== !0 && c !== !1 || c === this.options.isLeft
                ? "step" === b && this._checkStep(c)
                    ? (this.options.step = c, this.update())
                    : "bounds" === b
                        ? (this.options.bounds = c, this.update())
                        : "range" === b && this._checkRange(c)
                            ? (this.options.range = c, this.update())
                            : "symmetricPositionning" === b && (
                                this.options.symmetricPositionning = c === !0,
                                this.update()
                            )
                : (
                    this.options.isLeft = c,
                    this.element.toggleClass("ui-rangeSlider-leftHandle", this.options.isLeft).toggleClass("ui-rangeSlider-rightHandle", !this.options.isLeft),
                    this._position(this._value),
                    this.element.trigger("switch", this.options.isLeft)
                ),
            a
                .ui
                .rangeSliderDraggable
                .prototype
                ._setOption
                .apply(this, [b, c])
        },
        _checkRange: function (a) {
            return a === !1 || !this._isValidValue(a.min) && !this._isValidValue(a.max)
        },
        _isValidValue: function (a) {
            return "undefined" != typeof a && a !== !1 && parseFloat(a) !== a
        },
        _checkStep: function (a) {
            return a === !1 || parseFloat(a) === a
        },
        _initElement: function () {
            a
                .ui
                .rangeSliderDraggable
                .prototype
                ._initElement
                .apply(this),
            0 === this.cache.parent.width || null === this.cache.parent.width
                ? setTimeout(a.proxy(this._initElementIfNotDestroyed, this), 500)
                : (this._position(this._value), this._triggerMouseEvent("initialize"))
        },
        _bounds: function () {
            return this.options.bounds
        },
        _cache: function () {
            a
                .ui
                .rangeSliderDraggable
                .prototype
                ._cache
                .apply(this),
            this._cacheParent()
        },
        _cacheParent: function () {
            var a = this
                .element
                .parent();
            this.cache.parent = {
                element: a,
                offset: a.offset(),
                padding: {
                    left: this._parsePixels(a, "paddingLeft")
                },
                width: a.width()
            }
        },
        _position: function (a) {
            var b = this._getPositionForValue(a);
            this._applyPosition(b)
        },
        _constraintPosition: function (a) {
            var b = this._getValueForPosition(a);
            return this._getPositionForValue(b)
        },
        _applyPosition: function (b) {
            a
                .ui
                .rangeSliderDraggable
                .prototype
                ._applyPosition
                .apply(this, [b]),
            this._left = b,
            this._setValue(this._getValueForPosition(b)),
            this._triggerMouseEvent("moving")
        },
        _prepareEventData: function () {
            var b = a
                .ui
                .rangeSliderDraggable
                .prototype
                ._prepareEventData
                .apply(this);
            return b.value = this._value,
            b
        },
        _setValue: function (a) {
            a !== this._value && (this._value = a)
        },
        _constraintValue: function (a) {
            if (
                a = Math.min(a, this._bounds().max),
                a = Math.max(a, this._bounds().min),
                a = this._round(a),
                this.options.range !== !1
            ) {
                var b = this.options.range.min || !1,
                    c = this.options.range.max || !1;
                b !== !1 && (a = Math.max(a, this._round(b))),
                c !== !1 && (a = Math.min(a, this._round(c))),
                a = Math.min(a, this._bounds().max),
                a = Math.max(a, this._bounds().min)
            }
            return a
        },
        _round: function (a) {
            return this.options.step !== !1 && this.options.step > 0
                ? Math.round(a / this.options.step) * this.options.step
                : a
        },
        _getPositionForValue: function (a) {
            if (!this.cache || !this.cache.parent || null === this.cache.parent.offset) 
                return 0;
            a = this._constraintValue(a);
            var b = (a - this.options.bounds.min) / (
                    this.options.bounds.max - this.options.bounds.min
                ),
                c = this.cache.parent.width,
                d = this.cache.parent.offset.left,
                e = this.options.isLeft
                    ? 0
                    : this.cache.width.outer;
            return this.options.symmetricPositionning
                ? b * (c - 2 * this.cache.width.outer) + d + e
                : b * c + d - e
        },
        _getValueForPosition: function (a) {
            var b = this._getRawValueForPositionAndBounds(
                a,
                this.options.bounds.min,
                this.options.bounds.max
            );
            return this._constraintValue(b)
        },
        _getRawValueForPositionAndBounds: function (a, b, c) {
            var d,
                e,
                f = null === this.cache.parent.offset
                    ? 0
                    : this.cache.parent.offset.left;
            return this.options.symmetricPositionning
                ? (
                    a -= this.options.isLeft
                        ? 0
                        : this.cache.width.outer,
                    d = this.cache.parent.width - 2 * this.cache.width.outer
                )
                : (
                    a += this.options.isLeft
                        ? 0
                        : this.cache.width.outer,
                    d = this.cache.parent.width
                ),
            0 === d
                ? this._value
                : (e = (a - f) / d, e * (c - b) + b)
        },
        value: function (a) {
            return "undefined" != typeof a && (
                this._cache(),
                a = this._constraintValue(a),
                this._position(a)
            ),
            this._value
        },
        update: function () {
            this._cache();
            var a = this._constraintValue(this._value),
                b = this._getPositionForValue(a);
            a !== this._value
                ? (
                    this._triggerMouseEvent("updating"),
                    this._position(a),
                    this._triggerMouseEvent("update")
                )
                : b !== this.cache.offset.left && (
                    this._triggerMouseEvent("updating"),
                    this._position(a),
                    this._triggerMouseEvent("update")
                )
        },
        position: function (a) {
            return "undefined" != typeof a && (
                this._cache(),
                a = this._constraintPosition(a),
                this._applyPosition(a)
            ),
            this._left
        },
        add: function (a, b) {
            return a + b
        },
        substract: function (a, b) {
            return a - b
        },
        stepsBetween: function (a, b) {
            return this.options.step === !1
                ? b - a
                : (b - a) / this.options.step
        },
        multiplyStep: function (a, b) {
            return a * b
        },
        moveRight: function (a) {
            var b;
            return this.options.step === !1
                ? (b = this._left, this.position(this._left + a), this._left - b)
                : (
                    b = this._value,
                    this.value(this.add(b, this.multiplyStep(this.options.step, a))),
                    this.stepsBetween(b, this._value)
                )
        },
        moveLeft: function (a) {
            return -this.moveRight(-a)
        },
        stepRatio: function () {
            if (this.options.step === !1) 
                return 1;
            var a = (this.options.bounds.max - this.options.bounds.min) / this.options.step;
            return this.cache.parent.width / a
        }
    })
}(jQuery),
function (a) {
    function b(a, b) {
        return "undefined" == typeof a
            ? b || !1
            : a
    }
    a.widget("ui.rangeSliderBar", a.ui.rangeSliderDraggable, {
        options: {
            leftHandle: null,
            rightHandle: null,
            bounds: {
                min: 0,
                max: 100
            },
            type: "rangeSliderHandle",
            range: !1,
            drag: function () {},
            stop: function () {},
            values: {
                min: 0,
                max: 20
            },
            wheelSpeed: 4,
            wheelMode: null
        },
        _values: {
            min: 0,
            max: 20
        },
        _waitingToInit: 2,
        _wheelTimeout: !1,
        _create: function () {
            a
                .ui
                .rangeSliderDraggable
                .prototype
                ._create
                .apply(this),
            this
                .element
                .css("position", "absolute")
                .css("top", 0)
                .addClass("ui-rangeSlider-bar"),
            this
                .options
                .leftHandle
                .bind("initialize", a.proxy(this._onInitialized, this))
                .bind("mousestart", a.proxy(this._cache, this))
                .bind("stop", a.proxy(this._onHandleStop, this)),
            this
                .options
                .rightHandle
                .bind("initialize", a.proxy(this._onInitialized, this))
                .bind("mousestart", a.proxy(this._cache, this))
                .bind("stop", a.proxy(this._onHandleStop, this)),
            this._bindHandles(),
            this._values = this.options.values,
            this._setWheelModeOption(this.options.wheelMode)
        },
        destroy: function () {
            this
                .options
                .leftHandle
                .unbind(".bar"),
            this
                .options
                .rightHandle
                .unbind(".bar"),
            this.options = null,
            a
                .ui
                .rangeSliderDraggable
                .prototype
                .destroy
                .apply(this)
        },
        _setOption: function (a, b) {
            "range" === a
                ? this._setRangeOption(b)
                : "wheelSpeed" === a
                    ? this._setWheelSpeedOption(b)
                    : "wheelMode" === a && this._setWheelModeOption(b)
        },
        _setRangeOption: function (a) {
            if (
                ("object" != typeof a || null === a) && (a = !1),
                a !== !1 || this.options.range !== !1
            ) {
                if (a !== !1) {
                    var c = b(a.min, this.options.range.min),
                        d = b(a.max, this.options.range.max);
                    this.options.range = {
                        min: c,
                        max: d
                    }
                } else 
                    this.options.range = !1;
                this._setLeftRange(),
                this._setRightRange()
            }
        },
        _setWheelSpeedOption: function (a) {
            "number" == typeof a && a > 0 && (this.options.wheelSpeed = a)
        },
        _setWheelModeOption: function (a) {
            (null === a || a === !1 || "zoom" === a || "scroll" === a) && (
                this.options.wheelMode !== a && this.element.parent().unbind("mousewheel.bar"),
                this._bindMouseWheel(a),
                this.options.wheelMode = a
            )
        },
        _bindMouseWheel: function (b) {
            "zoom" === b
                ? this
                    .element
                    .parent()
                    .bind("mousewheel.bar", a.proxy(this._mouseWheelZoom, this))
                : "scroll" === b && this
                    .element
                    .parent()
                    .bind("mousewheel.bar", a.proxy(this._mouseWheelScroll, this))
        },
        _setLeftRange: function () {
            if (this.options.range === !1) 
                return !1;
            var a = this._values.max,
                b = {
                    min: !1,
                    max: !1
                };
            b.max = "undefined" != typeof this.options.range.min && this.options.range.min !== !1
                ? this._leftHandle("substract", a, this.options.range.min)
                : !1,
            b.min = "undefined" != typeof this.options.range.max && this.options.range.max !== !1
                ? this._leftHandle("substract", a, this.options.range.max)
                : !1,
            this._leftHandle("option", "range", b)
        },
        _setRightRange: function () {
            var a = this._values.min,
                b = {
                    min: !1,
                    max: !1
                };
            b.min = "undefined" != typeof this.options.range.min && this.options.range.min !== !1
                ? this._rightHandle("add", a, this.options.range.min)
                : !1,
            b.max = "undefined" != typeof this.options.range.max && this.options.range.max !== !1
                ? this._rightHandle("add", a, this.options.range.max)
                : !1,
            this._rightHandle("option", "range", b)
        },
        _deactivateRange: function () {
            this._leftHandle("option", "range", !1),
            this._rightHandle("option", "range", !1)
        },
        _reactivateRange: function () {
            this._setRangeOption(this.options.range)
        },
        _onInitialized: function () {
            this._waitingToInit--,
            0 === this._waitingToInit && this._initMe()
        },
        _initMe: function () {
            this._cache(),
            this.min(this._values.min),
            this.max(this._values.max);
            var a = this._leftHandle("position"),
                b = this._rightHandle("position") + this
                    .options
                    .rightHandle
                    .width();
            this
                .element
                .offset({left: a}),
            this
                .element
                .css("width", b - a)
        },
        _leftHandle: function () {
            return this._handleProxy(this.options.leftHandle, arguments)
        },
        _rightHandle: function () {
            return this._handleProxy(this.options.rightHandle, arguments)
        },
        _handleProxy: function (a, b) {
            var c = Array
                .prototype
                .slice
                .call(b);
            return a[this.options.type].apply(a, c)
        },
        _cache: function () {
            a
                .ui
                .rangeSliderDraggable
                .prototype
                ._cache
                .apply(this),
            this._cacheHandles()
        },
        _cacheHandles: function () {
            this.cache.rightHandle = {},
            this.cache.rightHandle.width = this
                .options
                .rightHandle
                .width(),
            this.cache.rightHandle.offset = this
                .options
                .rightHandle
                .offset(),
            this.cache.leftHandle = {},
            this.cache.leftHandle.offset = this
                .options
                .leftHandle
                .offset()
        },
        _mouseStart: function (b) {
            a
                .ui
                .rangeSliderDraggable
                .prototype
                ._mouseStart
                .apply(this, [b]),
            this._deactivateRange()
        },
        _mouseStop: function (b) {
            a
                .ui
                .rangeSliderDraggable
                .prototype
                ._mouseStop
                .apply(this, [b]),
            this._cacheHandles(),
            this._values.min = this._leftHandle("value"),
            this._values.max = this._rightHandle("value"),
            this._reactivateRange(),
            this
                ._leftHandle()
                .trigger("stop"),
            this
                ._rightHandle()
                .trigger("stop")
        },
        _onDragLeftHandle: function (a, b) {
            if (this._cacheIfNecessary(), b.element[0] === this.options.leftHandle[0]) {
                if (this._switchedValues()) 
                    return this._switchHandles(),
                    void this._onDragRightHandle(a, b);
                this._values.min = b.value,
                this.cache.offset.left = b.offset.left,
                this.cache.leftHandle.offset = b.offset,
                this._positionBar()
            }
        },
        _onDragRightHandle: function (a, b) {
            if (this._cacheIfNecessary(), b.element[0] === this.options.rightHandle[0]) {
                if (this._switchedValues()) 
                    return this._switchHandles(),
                    void this._onDragLeftHandle(a, b);
                this._values.max = b.value,
                this.cache.rightHandle.offset = b.offset,
                this._positionBar()
            }
        },
        _positionBar: function () {
            var a = this.cache.rightHandle.offset.left + this.cache.rightHandle.width - this.cache.leftHandle.offset.left;
            this.cache.width.inner = a,
            this
                .element
                .css("width", a)
                .offset({left: this.cache.leftHandle.offset.left})
        },
        _onHandleStop: function () {
            this._setLeftRange(),
            this._setRightRange()
        },
        _switchedValues: function () {
            if (this.min() > this.max()) {
                var a = this._values.min;
                return this._values.min = this._values.max,
                this._values.max = a,
                !0
            }
            return !1
        },
        _switchHandles: function () {
            var a = this.options.leftHandle;
            this.options.leftHandle = this.options.rightHandle,
            this.options.rightHandle = a,
            this._leftHandle("option", "isLeft", !0),
            this._rightHandle("option", "isLeft", !1),
            this._bindHandles(),
            this._cacheHandles()
        },
        _bindHandles: function () {
            this
                .options
                .leftHandle
                .unbind(".bar")
                .bind(
                    "sliderDrag.bar update.bar moving.bar",
                    a.proxy(this._onDragLeftHandle, this)
                ),
            this
                .options
                .rightHandle
                .unbind(".bar")
                .bind(
                    "sliderDrag.bar update.bar moving.bar",
                    a.proxy(this._onDragRightHandle, this)
                )
        },
        _constraintPosition: function (b) {
            var c,
                d = {};
            return d.left = a
                .ui
                .rangeSliderDraggable
                .prototype
                ._constraintPosition
                .apply(this, [b]),
            d.left = this._leftHandle("position", d.left),
            c = this._rightHandle(
                "position",
                d.left + this.cache.width.outer - this.cache.rightHandle.width
            ),
            d.width = c - d.left + this.cache.rightHandle.width,
            d
        },
        _applyPosition: function (b) {
            a
                .ui
                .rangeSliderDraggable
                .prototype
                ._applyPosition
                .apply(this, [b.left]),
            this
                .element
                .width(b.width)
        },
        _mouseWheelZoom: function (b, c, d, e) {
            if (!this.enabled) 
                return !1;
            var f = this._values.min + (this._values.max - this._values.min) / 2,
                g = {},
                h = {};
            return this.options.range === !1 || this.options.range.min === !1
                ? (g.max = f, h.min = f)
                : (
                    g.max = f - this.options.range.min / 2,
                    h.min = f + this.options.range.min / 2
                ),
            this.options.range !== !1 && this.options.range.max !== !1 && (
                g.min = f - this.options.range.max / 2,
                h.max = f + this.options.range.max / 2
            ),
            this._leftHandle("option", "range", g),
            this._rightHandle("option", "range", h),
            clearTimeout(this._wheelTimeout),
            this._wheelTimeout = setTimeout(a.proxy(this._wheelStop, this), 200),
            this.zoomIn(e * this.options.wheelSpeed),
            !1
        },
        _mouseWheelScroll: function (b, c, d, e) {
            return this.enabled
                ? (
                    this._wheelTimeout === !1
                        ? this.startScroll()
                        : clearTimeout(this._wheelTimeout),
                    this._wheelTimeout = setTimeout(a.proxy(this._wheelStop, this), 200),
                    this.scrollLeft(e * this.options.wheelSpeed),
                    !1
                )
                : !1
        },
        _wheelStop: function () {
            this.stopScroll(),
            this._wheelTimeout = !1
        },
        min: function (a) {
            return this._leftHandle("value", a)
        },
        max: function (a) {
            return this._rightHandle("value", a)
        },
        startScroll: function () {
            this._deactivateRange()
        },
        stopScroll: function () {
            this._reactivateRange(),
            this._triggerMouseEvent("stop"),
            this
                ._leftHandle()
                .trigger("stop"),
            this
                ._rightHandle()
                .trigger("stop")
        },
        scrollLeft: function (a) {
            return a = a || 1,
            0 > a
                ? this.scrollRight(-a)
                : (
                    a = this._leftHandle("moveLeft", a),
                    this._rightHandle("moveLeft", a),
                    this.update(),
                    void this._triggerMouseEvent("scroll")
                )
        },
        scrollRight: function (a) {
            return a = a || 1,
            0 > a
                ? this.scrollLeft(-a)
                : (
                    a = this._rightHandle("moveRight", a),
                    this._leftHandle("moveRight", a),
                    this.update(),
                    void this._triggerMouseEvent("scroll")
                )
        },
        zoomIn: function (a) {
            if (a = a || 1, 0 > a) 
                return this.zoomOut(-a);
            var b = this._rightHandle("moveLeft", a);
            a > b && (b /= 2, this._rightHandle("moveRight", b)),
            this._leftHandle("moveRight", b),
            this.update(),
            this._triggerMouseEvent("zoom")
        },
        zoomOut: function (a) {
            if (a = a || 1, 0 > a) 
                return this.zoomIn(-a);
            var b = this._rightHandle("moveRight", a);
            a > b && (b /= 2, this._rightHandle("moveLeft", b)),
            this._leftHandle("moveLeft", b),
            this.update(),
            this._triggerMouseEvent("zoom")
        },
        values: function (a, b) {
            if ("undefined" != typeof a && "undefined" != typeof b) {
                var c = Math.min(a, b),
                    d = Math.max(a, b);
                this._deactivateRange(),
                this
                    .options
                    .leftHandle
                    .unbind(".bar"),
                this
                    .options
                    .rightHandle
                    .unbind(".bar"),
                this._values.min = this._leftHandle("value", c),
                this._values.max = this._rightHandle("value", d),
                this._bindHandles(),
                this._reactivateRange(),
                this.update()
            }
            return {min: this._values.min, max: this._values.max}
        },
        update: function () {
            this._values.min = this.min(),
            this._values.max = this.max(),
            this._cache(),
            this._positionBar()
        }
    })
}(jQuery),
function (a) {
    function b(b, c, d, e) {
        this.label1 = b,
        this.label2 = c,
        this.type = d,
        this.options = e,
        this.handle1 = this.label1[this.type]("option", "handle"),
        this.handle2 = this.label2[this.type]("option", "handle"),
        this.cache = null,
        this.left = b,
        this.right = c,
        this.moving = !1,
        this.initialized = !1,
        this.updating = !1,
        this.Init = function () {
            this.BindHandle(this.handle1),
            this.BindHandle(this.handle2),
            "show" === this.options.show
                ? (setTimeout(a.proxy(this.PositionLabels, this), 1), this.initialized = !0)
                : setTimeout(a.proxy(this.AfterInit, this), 1e3),
            this._resizeProxy = a.proxy(this.onWindowResize, this),
            a(window).resize(this._resizeProxy)
        },
        this.Destroy = function () {
            this._resizeProxy && (
                a(window).unbind("resize", this._resizeProxy),
                this._resizeProxy = null,
                this.handle1.unbind(".positionner"),
                this.handle1 = null,
                this.handle2.unbind(".positionner"),
                this.handle2 = null,
                this.label1 = null,
                this.label2 = null,
                this.left = null,
                this.right = null
            ),
            this.cache = null
        },
        this.AfterInit = function () {
            this.initialized = !0
        },
        this.Cache = function () {
            "none" !== this
                .label1
                .css("display") && (
                    this.cache = {},
                    this.cache.label1 = {},
                    this.cache.label2 = {},
                    this.cache.handle1 = {},
                    this.cache.handle2 = {},
                    this.cache.offsetParent = {},
                    this.CacheElement(this.label1, this.cache.label1),
                    this.CacheElement(this.label2, this.cache.label2),
                    this.CacheElement(this.handle1, this.cache.handle1),
                    this.CacheElement(this.handle2, this.cache.handle2),
                    this.CacheElement(this.label1.offsetParent(), this.cache.offsetParent)
                )
        },
        this.CacheIfNecessary = function () {
            null === this.cache
                ? this.Cache()
                : (
                    this.CacheWidth(this.label1, this.cache.label1),
                    this.CacheWidth(this.label2, this.cache.label2),
                    this.CacheHeight(this.label1, this.cache.label1),
                    this.CacheHeight(this.label2, this.cache.label2),
                    this.CacheWidth(this.label1.offsetParent(), this.cache.offsetParent)
                )
        },
        this.CacheElement = function (a, b) {
            this.CacheWidth(a, b),
            this.CacheHeight(a, b),
            b.offset = a.offset(),
            b.margin = {
                left: this.ParsePixels("marginLeft", a),
                right: this.ParsePixels("marginRight", a)
            },
            b.border = {
                left: this.ParsePixels("borderLeftWidth", a),
                right: this.ParsePixels("borderRightWidth", a)
            }
        },
        this.CacheWidth = function (a, b) {
            b.width = a.width(),
            b.outerWidth = a.outerWidth()
        },
        this.CacheHeight = function (a, b) {
            b.outerHeightMargin = a.outerHeight(!0)
        },
        this.ParsePixels = function (a, b) {
            return parseInt(b.css(a), 10) || 0
        },
        this.BindHandle = function (b) {
            b.bind("updating.positionner", a.proxy(this.onHandleUpdating, this)),
            b.bind("update.positionner", a.proxy(this.onHandleUpdated, this)),
            b.bind("moving.positionner", a.proxy(this.onHandleMoving, this)),
            b.bind("stop.positionner", a.proxy(this.onHandleStop, this))
        },
        this.PositionLabels = function () {
            if (this.CacheIfNecessary(), null !== this.cache) {
                var a = this.GetRawPosition(this.cache.label1, this.cache.handle1),
                    b = this.GetRawPosition(this.cache.label2, this.cache.handle2);
                this.label1[d]("option", "isLeft")
                    ? this.ConstraintPositions(a, b)
                    : this.ConstraintPositions(b, a),
                this.PositionLabel(this.label1, a.left, this.cache.label1),
                this.PositionLabel(this.label2, b.left, this.cache.label2)
            }
        },
        this.PositionLabel = function (a, b, c) {
            var d,
                e,
                f,
                g = this.cache.offsetParent.offset.left + this.cache.offsetParent.border.left;
            g - b >= 0
                ? (a.css("right", ""), a.offset({left: b}))
                : (
                    d = g + this.cache.offsetParent.width,
                    e = b + c.margin.left + c.outerWidth + c.margin.right,
                    f = d - e,
                    a.css("left", ""),
                    a.css("right", f)
                )
        },
        this.ConstraintPositions = function (a, b) {
            (
                a.center < b.center && a.outerRight > b.outerLeft || a.center > b.center && b.outerRight > a.outerLeft
            ) && (a = this.getLeftPosition(a, b), b = this.getRightPosition(a, b))
        },
        this.getLeftPosition = function (a, b) {
            var c = (b.center + a.center) / 2,
                d = c - a.cache.outerWidth - a.cache.margin.right + a.cache.border.left;
            return a.left = d,
            a
        },
        this.getRightPosition = function (a, b) {
            var c = (b.center + a.center) / 2;
            return b.left = c + b.cache.margin.left + b.cache.border.left,
            b
        },
        this.ShowIfNecessary = function () {
            "show" === this.options.show || this.moving || !this.initialized || this.updating || (
                this.label1.stop(!0, !0).fadeIn(this.options.durationIn || 0),
                this.label2.stop(!0, !0).fadeIn(this.options.durationIn || 0),
                this.moving = !0
            )
        },
        this.HideIfNeeded = function () {
            this.moving === !0 && (
                this.label1.stop(!0, !0).delay(this.options.delayOut || 0).fadeOut(this.options.durationOut || 0),
                this.label2.stop(!0, !0).delay(this.options.delayOut || 0).fadeOut(this.options.durationOut || 0),
                this.moving = !1
            )
        },
        this.onHandleMoving = function (a, b) {
            this.ShowIfNecessary(),
            this.CacheIfNecessary(),
            this.UpdateHandlePosition(b),
            this.PositionLabels()
        },
        this.onHandleUpdating = function () {
            this.updating = !0
        },
        this.onHandleUpdated = function () {
            this.updating = !1,
            this.cache = null
        },
        this.onHandleStop = function () {
            this.HideIfNeeded()
        },
        this.onWindowResize = function () {
            this.cache = null
        },
        this.UpdateHandlePosition = function (a) {
            null !== this.cache && (
                a.element[0] === this.handle1[0]
                    ? this.UpdatePosition(a, this.cache.handle1)
                    : this.UpdatePosition(a, this.cache.handle2)
            )
        },
        this.UpdatePosition = function (a, b) {
            b.offset = a.offset,
            b.value = a.value
        },
        this.GetRawPosition = function (a, b) {
            var c = b.offset.left + b.outerWidth / 2,
                d = c - a.outerWidth / 2,
                e = d + a.outerWidth - a.border.left - a.border.right,
                f = d - a.margin.left - a.border.left,
                g = b.offset.top - a.outerHeightMargin;
            return {
                left: d,
                outerLeft: f,
                top: g,
                right: e,
                outerRight: f + a.outerWidth + a.margin.left + a.margin.right,
                cache: a,
                center: c
            }
        },
        this.Init()
    }
    a.widget("ui.rangeSliderLabel", a.ui.rangeSliderMouseTouch, {
        options: {
            handle: null,
            formatter: !1,
            handleType: "rangeSliderHandle",
            show: "show",
            durationIn: 0,
            durationOut: 500,
            delayOut: 500,
            isLeft: !1
        },
        cache: null,
        _positionner: null,
        _valueContainer: null,
        _innerElement: null,
        _value: null,
        _create: function () {
            this.options.isLeft = this._handle("option", "isLeft"),
            this
                .element
                .addClass("ui-rangeSlider-label")
                .css("position", "absolute")
                .css("display", "block"),
            this._createElements(),
            this._toggleClass(),
            this
                .options
                .handle
                .bind("moving.label", a.proxy(this._onMoving, this))
                .bind("update.label", a.proxy(this._onUpdate, this))
                .bind("switch.label", a.proxy(this._onSwitch, this)),
            "show" !== this.options.show && this
                .element
                .hide(),
            this._mouseInit()
        },
        destroy: function () {
            this
                .options
                .handle
                .unbind(".label"),
            this.options.handle = null,
            this._valueContainer = null,
            this._innerElement = null,
            this
                .element
                .empty(),
            this._positionner && (this._positionner.Destroy(), this._positionner = null),
            a
                .ui
                .rangeSliderMouseTouch
                .prototype
                .destroy
                .apply(this)
        },
        _createElements: function () {
            this._valueContainer = a("<div class='ui-rangeSlider-label-value' />").appendTo(
                this.element
            ),
            this._innerElement = a("<div class='ui-rangeSlider-label-inner' />").appendTo(
                this.element
            )
        },
        _handle: function () {
            var a = Array
                .prototype
                .slice
                .apply(arguments);
            return this
                .options
                .handle[this.options.handleType]
                .apply(this.options.handle, a)
        },
        _setOption: function (a, b) {
            "show" === a
                ? this._updateShowOption(b)
                : ("durationIn" === a || "durationOut" === a || "delayOut" === a) && this._updateDurations(
                    a,
                    b
                ),
            this._setFormatterOption(a, b)
        },
        _setFormatterOption: function (a, b) {
            "formatter" === a && ("function" == typeof b || b === !1) && (
                this.options.formatter = b,
                this._display(this._value)
            )
        },
        _updateShowOption: function (a) {
            this.options.show = a,
            "show" !== this.options.show
                ? (this.element.hide(), this._positionner.moving = !1)
                : (
                    this.element.show(),
                    this._display(this.options.handle[this.options.handleType]("value")),
                    this._positionner.PositionLabels()
                ),
            this._positionner.options.show = this.options.show
        },
        _updateDurations: function (a, b) {
            parseInt(b, 10) === b && (
                this._positionner.options[a] = b,
                this.options[a] = b
            )
        },
        _display: function (a) {
            this._displayText(
                this.options.formatter === !1
                    ? Math.round(a)
                    : this.options.formatter(a)
            ),
            this._value = a
        },
        _displayText: function (a) {
            this
                ._valueContainer
                .text(a)
        },
        _toggleClass: function () {
            this
                .element
                .toggleClass("ui-rangeSlider-leftLabel", this.options.isLeft)
                .toggleClass("ui-rangeSlider-rightLabel", !this.options.isLeft)
        },
        _positionLabels: function () {
            this
                ._positionner
                .PositionLabels()
        },
        _mouseDown: function (a) {
            this
                .options
                .handle
                .trigger(a)
        },
        _mouseUp: function (a) {
            this
                .options
                .handle
                .trigger(a)
        },
        _mouseMove: function (a) {
            this
                .options
                .handle
                .trigger(a)
        },
        _onMoving: function (a, b) {
            this._display(b.value)
        },
        _onUpdate: function () {
            "show" === this.options.show && this.update()
        },
        _onSwitch: function (a, b) {
            this.options.isLeft = b,
            this._toggleClass(),
            this._positionLabels()
        },
        pair: function (a) {
            null === this._positionner && (
                this._positionner = new b(this.element, a, this.widgetName, {
                    show: this.options.show,
                    durationIn: this.options.durationIn,
                    durationOut: this.options.durationOut,
                    delayOut: this.options.delayOut
                }),
                a[this.widgetName]("positionner", this._positionner)
            )
        },
        positionner: function (a) {
            return "undefined" != typeof a && (this._positionner = a),
            this._positionner
        },
        update: function () {
            this._positionner.cache = null,
            this._display(this._handle("value")),
            "show" === this.options.show && this._positionLabels()
        }
    })
}(jQuery),
angular.module("myApp.chartUtil", ["myApp.chartUtil.pngSaver-directive"]),
angular
    .module("myApp.chartUtil.pngSaver-directive", [])
    .directive("pbPngSaver", [
        "Util",
        function (a) {
            return {
                restrict: "E",
                replace: !0,
                scope: {
                    filename: "@"
                },
                template: '<span class="png-saver chart-action" ng-click="save()">Export as PNG</span>',
                link: function (a, b) {
                    a.svg = d3
                        .select(b.parent().parent()[0])
                        .select("svg"),
                    b
                        .parent()
                        .parent()
                        .addClass("chart-action-hoverable")
                },
                controller: [
                    "$scope",
                    function (b) {
                        b.save = function () {
                            a.saveSvgAsPng(b.svg, b.filename)
                        }
                    }
                ]
            }
        }
    ]);