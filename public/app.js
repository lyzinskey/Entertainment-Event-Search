// MODULE
var myApp = angular.module("myApp", [
    "ngResource",
    "ngMessages",
    "ngAnimate",
    "igTruncate",
    "angular-svg-round-progressbar"
]);

// CONTROLLERS
myApp.controller("myController", function ($scope, $http, $timeout) {
    $scope.defaultForm = {
        keyword: "",
        category: "all",
        distance: "",
        milesOrKilometer: "miles",
        location: "currentLocation"
    };

    $scope.form = angular.copy($scope.defaultForm);

    $scope.show_result_Table = false;
    $scope.show_detail_Table_tabs = false;
    $scope.show_detail_Table = false;
    $scope.getGeoLocation = false;
    $scope.noSearchResult = false;
    $scope.isMusic = false;
    $scope.noArtistOrTeams = false;
    $scope.noVenue = false;
    $scope.noUpcomingEvents = false;
    $scope.limitNumber = 5;
    $scope.upcomingEventsSorting = "default";
    $scope.ascendingOrDescending = "";
    var emptyStar = true;
    $scope.showResultsBoolean = true;
    $scope.showFavoriteBoolean = false;
    $scope.noneEventClicked = true;
    $scope.noFavoriteResult = true;
    $scope.showFavoriteTable = false;

    $http.get("http://ip-api.com/json").then(function (result) {
        geoLat = result.data.lat;
        geoLon = result.data.lon;
        $scope.form.latlng = geoLat + "," + geoLon;
        $scope.getGeoLocation = true;
        $scope.showResultTableProgressBar = false;
        $scope.showDetailTableProgressBar = false;
    });

    $scope.complete = function (string) {
        $scope.hidethis = false;
        var url = "http://localhost:8080/autoComplete?" + "&autoComplete=" + string;

        $http.get(url).then(function (result) {
            $scope.keywordList = result.data._embedded.attractions;
        });

        console.log("keywordList");
        console.log($scope.keywordList);

        var output = [];
        if ($scope.keywordList !== undefined) {
            for (var i = 0; i < $scope.keywordList.length; i++) {
                output.push($scope.keywordList[i].name);
            }
            $scope.filterAutocomplete = output;
        }
    };

    $scope.fillTextbox = function (string) {
        $scope.form.keyword = string;
        $scope.hidethis = true;
    };

    $scope.submit = function () {
        $scope.showResultTableProgressBar = true;
        var url =
            "http://localhost:8080/geocode?" +
            "&enteredLocation=" +
            $scope.form.enteredLocation +
            "&latlng=" +
            $scope.form.latlng;

        $http.get(url).then(function (result) {
            $scope.form.lat = result.data.results[0].geometry.location.lat;
            $scope.form.lng = result.data.results[0].geometry.location.lng;
            $scope.showResultTable();
        });
    };

    $scope.showResultTable = function () {
        var url =
            "http://localhost:8080/resultTable?" +
            "keyword=" +
            $scope.form.keyword +
            "&category=" +
            $scope.form.category +
            "&distance=" +
            $scope.form.distance +
            "&milesOrKilometer=" +
            $scope.form.milesOrKilometer +
            "&location=" +
            $scope.form.location +
            "&enteredLocation=" +
            $scope.form.enteredLocation +
            "&lat=" +
            $scope.form.lat +
            "&lng=" +
            $scope.form.lng;

        $http.get(url).then(function (result) {
            if (result.data._embedded !== undefined) {
                $scope.searchResultArray = result.data._embedded.events;

                $timeout(function () {
                    $scope.showResultTableProgressBar = false;
                    $scope.show_result_Table = true;
                }, 500);
            } else {
                $scope.showResultTableProgressBar = false;
                $scope.noSearchResult = true;
            }
        });
    };

    $scope.clear = function () {
        $scope.show_result_Table = false;
        $scope.show_detail_Table_tabs = false;
        $scope.show_detail_Table = false;
        $scope.noSearchResult = false;
        $scope.isMusic = false;
        $scope.noArtistOrTeams = false;
        $scope.noVenue = false;
        $scope.noUpcomingEvents = false;
        $scope.limitNumber = 5;
        $scope.upcomingEventsSorting = "default";
        $scope.ascendingOrDescending = "";
        $scope.showResultsBoolean = true;
        $scope.showFavoriteBoolean = false;
        $scope.noneEventClicked = true;
        $scope.noFavoriteResult = true;
        $scope.showFavoriteTable = false;
        document.getElementById("search-form").reset();
        $scope.form = angular.copy($scope.defaultForm);
        $scope.searchForm.keywordInput.$touched = false;
        document.getElementById("other-location-Input").disabled = true;
        $scope.searchForm.locationInput.$touched = false;

        $http.get("http://ip-api.com/json").then(function (result) {
            geoLat = result.data.lat;
            geoLon = result.data.lon;
            $scope.form.latlng = geoLat + "," + geoLon;
            $scope.getGeoLocation = true;
            $scope.showResultTableProgressBar = false;
            $scope.showDetailTableProgressBar = false;
        });
    };

    $scope.showEventDetail = function (eventID) {
        $scope.show_result_Table = false;
        $scope.show_detail_Table = false;
        $scope.show_detail_Table_tabs = true;
        $scope.showDetailTableProgressBar = true;
        $scope.noneEventClicked = false;
        $scope.showResultsBoolean = true;
        $scope.showFavoriteBoolean = false;

        var element = document.getElementById(eventID + "clicked");
        element.classList.add("table-warning");

        var result = document.getElementById("resultTable");
        result.classList.remove("w3-animate-right");

        var table = document.getElementById("event-detail-table");
        table.classList.add("w3-animate-left");

        $scope.finalResultForAllArtistOrTeam = [];
        $scope.spotifyResultArrayFinalResult = [];

        $scope.eventID = eventID;
        var url = "http://localhost:8080/eventID?" + "eventID=" + $scope.eventID;
        $http.get(url).then(function (result) {
            $scope.eventDetail = result.data;
            console.log("eventDetail");
            console.log($scope.eventDetail);
            $scope.eventName = result.data.name;

            $scope.eventArtistOrTeam = "";
            $scope.artistOrTeamNameList = [];
            if (result.data._embedded.attractions != undefined) {
                for (var i = 0; i < result.data._embedded.attractions.length; i++) {
                    $scope.eventArtistOrTeam += result.data._embedded.attractions[i].name;
                    $scope.artistOrTeamNameList.push(
                        result.data._embedded.attractions[i].name
                    );
                    if (i < result.data._embedded.attractions.length - 1) {
                        $scope.eventArtistOrTeam += " | ";
                    }
                }

                if (result.data.classifications[0].segment.name === "Music") {
                    $scope.isMusic = true;
                    for (var n = 0; n < $scope.artistOrTeamNameList.length; n++) {
                        $scope.spotifyName = $scope.artistOrTeamNameList[n];
                        // $scope.spotify(result.data._embedded.attractions[i].name);
                        var spotifyUrl =
                            "http://localhost:8080/spotify?" +
                            "artistOrTeamName=" +
                            $scope.spotifyName;

                        $http.get(spotifyUrl).then(function (spotifyResult) {
                            $scope.spotifyResultArrayFinalResult.push(spotifyResult.data);
                        });
                    }
                }
            }

            $scope.eventVenue = "";
            $scope.eventVenue = result.data._embedded.venues[0].name;

            $scope.eventTime = "";
            $scope.eventTime = result.data.dates.start.dateTime;

            $scope.eventCategory = "";
            $scope.eventCategory =
                result.data.classifications[0].segment.name +
                " | " +
                result.data.classifications[0].genre.name;

            $scope.eventPriceRange = "";
            if (result.data.priceRanges != undefined) {
                if (
                    result.data.priceRanges[0].min != undefined &&
                    result.data.priceRanges[0].max != undefined
                ) {
                    $scope.eventPriceRange =
                        "$" +
                        result.data.priceRanges[0].min +
                        " ~ " +
                        "$" +
                        result.data.priceRanges[0].max;
                } else if (result.data.priceRanges[0].max != undefined) {
                    $scope.eventPriceRange = "$" + result.data.priceRanges[0].max;
                } else {
                    $scope.eventPriceRange = "$" + result.data.priceRanges[0].min;
                }
            }

            $scope.eventTicketStatus = "";
            $scope.eventTicketStatus = result.data.dates.status.code;

            $scope.eventBuyTicketAt = "";
            $scope.eventBuyTicketAt = result.data.url;

            $scope.eventSeatMap = "";
            if (result.data.seatmap != undefined) {
                $scope.eventSeatMap = result.data.seatmap.staticUrl;
            }

            $scope.twitterUrl =
                "https://twitter.com/intent/tweet?text=Check out " +
                $scope.eventName +
                " located at " +
                $scope.eventVenue +
                ". Website: " +
                $scope.eventBuyTicketAt +
                " %23CSCI571EventSearch";

            $scope.favoriteBesideTwitter = $scope.eventID + "favorite";

            $scope.showDetailTableProgressBar = false;
            $scope.show_detail_Table = true;
            $scope.artistOrTeamTab(
                $scope.artistOrTeamNameList,
                result.data.classifications[0].segment.name
            );
            $scope.venueTab($scope.eventVenue);
            $scope.upcomingEventsTab($scope.eventVenue);
        });
    };

    $scope.favorite = function (starID) {
        if (emptyStar) {
            document.getElementById(starID).classList.remove("far");
            document.getElementById(starID).classList.add("fas");

            if (starID.length > 13) {
                starID = starID.substring(0, 13);
                document.getElementById(starID).classList.remove("far");
                document.getElementById(starID).classList.add("fas");
            }
            $scope.addTofavoriteTable(starID);
        } else {
            document.getElementById(starID).classList.remove("fas");
            document.getElementById(starID).classList.add("far");

            if (starID.length > 13) {
                starID = starID.substring(0, 13);
                document.getElementById(starID).classList.remove("far");
                document.getElementById(starID).classList.add("fas");
            }
            $scope.removeFromfavoriteTable(starID);
        }
        emptyStar = !emptyStar;
    };

    $scope.artistOrTeamTab = function (name) {
        if (name.length === 0) {
            $scope.noArtistOrTeams = true;
        } else {
            $scope.googleCustomSearch();
        }
    };

    $scope.googleCustomSearch = function () {
        for (var i = 0; i < $scope.artistOrTeamNameList.length; i++) {
            var artistOrTeamName = $scope.artistOrTeamNameList[i];

            $scope.googleCustomSearchResultArray = {
                artistOrTeamName: "",
                link: []
            };

            var googleCustomSearchUrl =
                "http://localhost:8080/googleCustomSearch?" +
                "artistOrTeamName=" +
                artistOrTeamName;
            $http.get(googleCustomSearchUrl).then(function (result) {
                $scope.googleCustomSearchResult = [];
                for (var j = 0; j < result.data.items.length; j++) {
                    $scope.googleCustomSearchResult.push(result.data.items[j].link);
                    // $scope.finalResultJSON.photos.push(result.data.items[j].link);
                }
                $scope.googleCustomSearchResultArray.artistOrTeamName =
                    result.data.queries.request[0].searchTerms;
                $scope.googleCustomSearchResultArray.link =
                    $scope.googleCustomSearchResult;
                $scope.buildFinalResult();
            });
        }
    };

    $scope.buildFinalResult = function () {
        $scope.finalResultJSON = {
            artistOrTeamName: $scope.googleCustomSearchResultArray.artistOrTeamName,
            artistName: "",
            artistFollowers: "",
            artistPopularity: "",
            spotifyUrl: "",
            photos: []
        };

        loop1: for (
            var i = 0;
            i < $scope.spotifyResultArrayFinalResult.length;
            i++
        ) {
            loop2: for (
                var j = 0;
                j < $scope.spotifyResultArrayFinalResult[i].length;
                j++
            ) {
                if (
                    $scope.spotifyResultArrayFinalResult[i][j].name ===
                    $scope.googleCustomSearchResultArray.artistOrTeamName
                ) {
                    $scope.finalResultJSON.artistName =
                        $scope.spotifyResultArrayFinalResult[i][j].name;
                    $scope.finalResultJSON.artistFollowers =
                        $scope.spotifyResultArrayFinalResult[i][j].followers.total;
                    $scope.finalResultJSON.artistPopularity =
                        $scope.spotifyResultArrayFinalResult[i][j].popularity;
                    $scope.finalResultJSON.spotifyUrl =
                        $scope.spotifyResultArrayFinalResult[i][j].external_urls.spotify;
                    break loop2;
                }
            }
        }

        $scope.finalResultJSON.photos = $scope.googleCustomSearchResultArray.link;
        $scope.finalResultForAllArtistOrTeam.push($scope.finalResultJSON);
        console.log("finalResultForAllArtistOrTeam");
        console.log($scope.finalResultForAllArtistOrTeam);
    };

    $scope.venueTab = function (venueName) {
        if (venueName !== "") {
            var url = "http://localhost:8080/venue?" + "&venueName=" + venueName;

            $http.get(url).then(function (result) {
                if (result.data._embedded !== undefined) {
                    $scope.venueDetail = result.data._embedded.venues;
                    if (result.data._embedded.venues !== undefined) {
                        // venueAddress
                        $scope.venueAddress = "";
                        if ($scope.venueDetail[0].address !== undefined) {
                            $scope.venueAddress = $scope.venueDetail[0].address.line1;
                        }

                        // venueCity
                        $scope.venueCity = "";
                        if (
                            $scope.venueDetail[0].city !== undefined &&
                            $scope.venueDetail[0].state !== undefined
                        ) {
                            $scope.venueCity =
                                $scope.venueDetail[0].city.name +
                                ", " +
                                $scope.venueDetail[0].state.name;
                        }

                        // venuePhoneNumber && venueOpenHours
                        $scope.venuePhoneNumber = "";
                        $scope.venueOpenHours = "";
                        if ($scope.venueDetail[0].boxOfficeInfo !== undefined) {
                            $scope.venuePhoneNumber =
                                $scope.venueDetail[0].boxOfficeInfo.phoneNumberDetail;
                            $scope.venueOpenHours =
                                $scope.venueDetail[0].boxOfficeInfo.openHoursDetail;
                        }

                        // venueGeneralRule && venueChildRule
                        $scope.venueGeneralRule = "";
                        $scope.venueChildRule = "";
                        if ($scope.venueDetail[0].generalInfo !== undefined) {
                            $scope.venueGeneralRule =
                                $scope.venueDetail[0].generalInfo.generalRule;
                            $scope.venueChildRule =
                                $scope.venueDetail[0].generalInfo.childRule;
                        }

                        // google map latitude && longitude
                        $scope.googleMapLat = "";
                        $scope.googleMapLon = "";
                        if ($scope.venueDetail[0].location !== undefined) {
                            $scope.googleMapLat = $scope.venueDetail[0].location.latitude;
                            $scope.googleMapLon = $scope.venueDetail[0].location.longitude;
                            initMap($scope.googleMapLat, $scope.googleMapLon);
                        }
                    }
                }
            });
        } else {
            $scope.noVenue = true;
        }
    };

    $scope.upcomingEventsTab = function (venueName) {
        if (venueName !== "") {
            var url =
                "http://localhost:8080/upcomingEventsID?" + "&venueName=" + venueName;

            $http.get(url).then(function (result) {
                $scope.upcomingEventsID = result.data.resultsPage.results.venue[0].id;
                var url =
                    "http://localhost:8080/upcomingEventsDetail?" +
                    "&upcomingEventsID=" +
                    $scope.upcomingEventsID;

                $http.get(url).then(function (result) {
                    $scope.upcomingEventsDetail = result.data.resultsPage.results.event;
                });
            });
        } else {
            $scope.noUpcomingEvents = true;
        }
    };

    $scope.showMoreOrLess = function () {
        if ($scope.limitNumber === 5) {
            $scope.limitNumber = 100;
            document.getElementById("show-more-less").innerText = "Show Less";
        } else {
            $scope.limitNumber = 5;
            document.getElementById("show-more-less").innerText = "Show More";
        }
    };

    $scope.listButton = function () {
        var table = document.getElementById("event-detail-table");
        table.classList.remove("w3-animate-left");

        var result = document.getElementById("resultTable");
        result.classList.add("w3-animate-right");

        $scope.show_detail_Table_tabs = false;
        if ($scope.showResultsBoolean) {
            $scope.showFavoriteTable = false;
            $scope.show_result_Table = true;
        } else {
            $scope.show_result_Table = false;
            $scope.showFavoriteTable = true;
        }
    };

    $scope.detailsButton = function () {
        var result = document.getElementById("resultTable");
        result.classList.remove("w3-animate-right");

        var table = document.getElementById("event-detail-table");
        table.classList.add("w3-animate-left");

        $scope.show_result_Table = false;
        $scope.show_detail_Table_tabs = true;
    };

    $scope.showResults = function () {
        var resultsButton = document.getElementById("resultsButton");
        resultsButton.classList.remove("btn-light");
        resultsButton.classList.add("btn-primary");

        var favoriteButton = document.getElementById("favoritesButton");
        favoriteButton.classList.remove("btn-primary");
        favoriteButton.classList.add("btn-light");
        $scope.showResultsBoolean = true;
        $scope.showFavoriteBoolean = false;
    };

    $scope.showFavorites = function () {
        var favoriteButton = document.getElementById("favoritesButton");
        favoriteButton.classList.remove("btn-light");
        favoriteButton.classList.add("btn-primary");

        var resultsButton = document.getElementById("resultsButton");
        resultsButton.classList.remove("btn-primary");
        resultsButton.classList.add("btn-light");
        $scope.showFavoriteBoolean = true;
        $scope.showResultsBoolean = false;

        if (localStorage.length !== 0) {
            $scope.noFavoriteResult = false;
            $scope.showFavoriteTable = true;
        } else {
            $scope.showFavoriteTable = false;
            $scope.noFavoriteResult = true;
        }

        $scope.drawFavoriteTable();
    };

    $scope.addTofavoriteTable = function (eventID) {
        if (localStorage.length !== 0) {
            $scope.noFavoriteResult = false;
            $scope.showFavoriteTable = true;
        }
        var url =
            "http://localhost:8080/favoriteEventID?" + "favoriteEventID=" + eventID;
        $http.get(url).then(function (result) {
            console.log("favoriteEventID");
            console.log(eventID);
            // $scope.favoriteEventDetail = result.data;
            localStorage.setItem(eventID, JSON.stringify(result.data));
        });
    };

    $scope.removeFromfavoriteTable = function (eventID) {
        document.getElementById(eventID).classList.remove("fas");
        document.getElementById(eventID).classList.add("far");
        localStorage.removeItem(eventID);

        if (localStorage.length === 0) {
            $scope.showFavoriteTable = false;
            $scope.noFavoriteResult = true;
        }
        $scope.drawFavoriteTable();
    };

    $scope.drawFavoriteTable = function () {
        if (localStorage.length === 0) {
            $scope.showFavoriteTable = false;
            $scope.noFavoriteResult = true;
        }
        $scope.favoriteEvents = [];
        for (var i = 0; i < localStorage.length; i++) {
            $scope.favoriteEventsJSON = JSON.parse(
                localStorage.getItem(localStorage.key(i))
            );
            $scope.favoriteEvents.push($scope.favoriteEventsJSON);
        }
    };
});
