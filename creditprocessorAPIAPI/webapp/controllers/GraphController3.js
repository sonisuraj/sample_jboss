/**
 * Created by Manisha on 11/6/2017.
 */
app.controller('graphController3', ['$scope','$http','$location','$rootScope','$interval','__env','callCount','Upload', '$timeout','$uibModal','$window',function($scope,$http,$location,$rootScope,$interval,__env,callCount,Upload, $timeout,$uibModal,$window) {
	$timeout(function () {
    ParentScope = $window.ScopeToShare;
    $scope = ParentScope;
    $scope.json = $window.ScopeToShare;
    console.log($scope.json);
    /*$rootScope.currentlydisplayedservice = window.opener.param1;
    $scope.json = $rootScope.currentlydisplayedservice;*/
    console.log('data==>>>'+$scope.json);
    showLabel = function(me) {
        var checked = !me.checked;
        if ((me.id == 'fLabelComponent') && (checked == true)) {
            $('g.Component text').hide();
        } else if ((me.id == 'fLabelComponent') && (checked == false)) {
            $('g.Component text').show();
        }
        if ((me.id == 'fLabelLogical_Device') && (checked == true)) {
            $('g.LD text').hide();
        } else if ((me.id == 'fLabelLogical_Device') && (checked == false)) {
            $('g.LD text').show();
        }
        if ((me.id == 'fLabelDeviceRelated_Service') && (checked == true)) {
            $('g.DRS text').hide();
        } else if ((me.id == 'fLabelDeviceRelated_Service') && (checked == false)) {
            $('g.DRS text').show();
        }
        if ((me.id == 'fLabelDeviceRelated_Component') && (checked == true)) {
            $('g.DRC text').hide();
        } else if ((me.id == 'fLabelDeviceRelated_Component') && (checked == false)) {
            $('g.DRC text').show();
        }
        if ((me.id == 'fLabelService') && (checked == true)) {
            $('g.Service text').hide();
        } else if ((me.id == 'fLabelService') && (checked == false)) {
            $('g.Service text').show();
        }
        if ((me.id == 'fLabelDependent_Component') && (checked == true)) {
            $('g.DC text').hide();
        } else if ((me.id == 'fLabelDependent_Component') && (checked == false)) {
            $('g.DC text').show();
        }
        if ((me.id == 'fLabelDependent_Service') && (checked == true)) {
            $('g.DS text').hide();
        } else if ((me.id == 'fLabelDependent_Service') && (checked == false)) {
            $('g.DS text').show();
        }
    }
    ShowCheckBoxOnClick = function(me) {
        var fUnChecked = !me.checked;
        $("#fLabel" + me.id.slice(5)).attr('disabled', fUnChecked);
        // if( me.id == "fShowComponent" ){
        // // DisableCBLabelled('Logical', fUnChecked);
        // }else if( me.id == "fShowLogical_Device" ){
        //  DisableCBLabelled( "Dependent_Component", fUnChecked );
        //  DisableCBLabelled( "Dependent_Service", fUnChecked );
        // } else if( me.id == "fShowDependent_Component" ){
        //  DisableCBLabelled( "Dependent_Service", fUnChecked );
        // }
        Showorhidenodes(me.id, fUnChecked);
    }
    DisableCBLabelled = function(label, fDisable) {
        $("#fShow" + label).attr('disabled', fDisable);
        $("#fLabel" + label).attr('disabled', fDisable);
    }
    HideUncheckedLinks = function() {
        if ($('#fShowDeviceRelated_Component').prop("checked") == false) {
            myList = document.querySelectorAll('[class^="link path_from"][class*="_6"]');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'none';
                }
            }
        }
        if ($('#fShowLogical_Device').prop("checked") == false) {
            myList = document.querySelectorAll('[class^="link path_from"][class*="_3"]');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'none';
                }
            }
        }
        if ($('#fShowComponent').prop("checked") == false) {
            myList = document.querySelectorAll('[class^="link path_from"][class*="_2"]');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'none';
                }
            }
        }
        if ($('#fShowDeviceRelated_Service').prop("checked") == false) {
            myList = document.querySelectorAll('[class^="link path_from"][class*="_7"]');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'none';
                }
            }
        }
        if ($('#fShowDependent_Service').prop("checked") == false) {
            myList = document.querySelectorAll('[class^="link path_from"][class*="_5"]');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'none';
                }
            }
        }
        if ($('#fShowDependent_Component').prop("checked") == false) {
            myList = document.querySelectorAll('[class^="link path_from"][class*="_4"]');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'none';
                }
            }
        }
    }
    Showorhidenodes = function(label, fUnChecked) {
        var myList;
        console.log(label + ': ' + fUnChecked);
        //Component
        if (label == 'fShowComponent' && fUnChecked) {
            myList = document.querySelectorAll('.Component');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'none';
                }
            }
            myList = document.querySelectorAll('[class^="link path_from_2"], [class$="_to_2"]');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'none';
                }
            }
        }
        if (label == 'fShowComponent' && !fUnChecked) {
            myList = document.querySelectorAll('.Component');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'block';
                }
            }
            myList = document.querySelectorAll('[class^="link path_from_2"], [class$="_to_2"]');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'block';
                }
            }
            HideUncheckedLinks();
        }
        //Dependent Component Checkbox
        if (label == 'fShowDependent_Component' && fUnChecked) {
            myList = document.querySelectorAll('.DC');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'none';
                }
            }
            myList = document.querySelectorAll('[class^="link path_from_4"], [class$="_to_4"]');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'none';
                }
            }
        }
        if (label == 'fShowDependent_Component' && !fUnChecked) {
            myList = document.querySelectorAll('.DC');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'block';
                }
            }
            myList = document.querySelectorAll('[class^="link path_from_4"], [class$="_to_4"]');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'block';
                }
            }
            HideUncheckedLinks();
        }
        //Dependent Service Checkbox
        if (label == 'fShowDependent_Service' && fUnChecked) {
            myList = document.querySelectorAll('.DS');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'none';
                }
            }
            myList = document.querySelectorAll('[class^="link path_from_5"], [class$="_to_5"]');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'none';
                }
            }
        }
        if (label == 'fShowDependent_Service' && !fUnChecked) {
            myList = document.querySelectorAll('.DS');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'block';
                }
            }
            myList = document.querySelectorAll('[class^="link path_from_5"], [class$="_to_5"]');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'block';
                }
            }
            HideUncheckedLinks();
        }
        // Device Related Service Checkbox
        if (label == 'fShowDeviceRelated_Service' && fUnChecked) {
            myList = document.querySelectorAll('.DRS');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'none';
                }
            }
            myList = document.querySelectorAll('[class^="link path_from_7"], [class$="_to_7"]');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'none';
                }
            }
        }
        if (label == 'fShowDeviceRelated_Service' && !fUnChecked) {
            myList = document.querySelectorAll('.DRS');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'block';
                }
            }
            myList = document.querySelectorAll('[class^="link path_from"][class*="_7"]');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'block';
                }
            }
            HideUncheckedLinks();
        }
        //Logical Devices
        if (label == 'fShowLogical_Device' && fUnChecked) {
            myList = document.querySelectorAll('.LD');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'none';
                }
            }
            myList = document.querySelectorAll('[class^="link path_from_3"], [class$="_to_3"]');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'none';
                }
            }
        }
        if (label == 'fShowLogical_Device' && !fUnChecked) {
            myList = document.querySelectorAll('.LD');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'block';
                }
            }
            myList = document.querySelectorAll('[class^="link path_from_3"], [class$="_to_3"]');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'block';
                }
            }
            HideUncheckedLinks();
        }

        //Device Related Components
        if (label == 'fShowDeviceRelated_Component' && fUnChecked) {
            myList = document.querySelectorAll('.DRC');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'none';
                }
            }
            myList = document.querySelectorAll('[class^="link path_from_6"], [class$="_to_6"]');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'none';
                }
            }
        }
        if (label == 'fShowDeviceRelated_Component' && !fUnChecked) {
            myList = document.querySelectorAll('.DRC');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'block';
                }
            }
            myList = document.querySelectorAll('[class^="link path_from_6"], [class$="_to_6"]');
            if (myList) {
                for (var i = 0; i < myList.length; i++) {
                    myList[i].style.display = 'block';
                }
            }
            HideUncheckedLinks();
        }
    }
    var
    // w = document.body.clientWidth,
    // h = document.body.clientHeight,
        w = $(window).width(),
        h = $(window).height(),
        fill = d3.scale.category20(),
        maxsize = d3.max($scope.json.nodes, function(d) {
            return d.size
        }),
        naCentre = $scope.json.nodes[0].name,
        dateProduced = new Date(),
        cDependents = $scope.json.nodes.reduce(function(c, el) {
            if (el.group === 7) {
                return c + 1;
            } else {
                return c;
            }
        }, 0);
    $(".info-box .title").html(naCentre);
    var vis_container = d3
        .select("#chart")
        .on('mousewheel', function() {
            d3.event.preventDefault()
        })
        .append('svg:svg')
        .attr('height', h)
        .attr('width', w)
        .attr("pointer-events", "all")
        .call(d3.behavior.zoom()
            .on("zoom", redraw))
    vis_container.append('svg:rect')
        .attr('height', h)
        .attr('width', w)
    vis = vis_container.append('svg:g')

    // Markers
    vis.append("svg:defs").selectAll("marker.arrow")
        .data(d3.range(1, Math.ceil(Math.sqrt(maxsize))))
        .enter().append("svg:marker")
        .attr("id", function(d) {
            return "arrow-" + d
        })
        .attr("class", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", function(d) {
            return 12 + d
        })
        .attr("refY", 0)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");
    vis.append("svg:defs").selectAll("marker.arrow-dark")
        .data(d3.range(1, Math.ceil(Math.sqrt(maxsize))))
        .enter().append("svg:marker")
        .attr("id", function(d) {
            return "arrow-dark-" + d
        })
        .attr("class", "arrow-dark")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", function(d) {
            return 12 + d
        })
        .attr("refY", 0)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

    var force = d3.layout
        .force()
        .friction(.6)
        .theta(0.1)
        .charge(-300)
        .gravity(0.3)
        .distance(70)
        .nodes($scope.json.nodes)
        .links($scope.json.links)
        .size([w, h])
        .start();

    var link = vis
        .selectAll("line.link")
        .data($scope.json.links)
        .enter().append("svg:line")
        .attr('class', "xyz")
        .style("stroke-width", function(d) {
            return Math.sqrt(d.value);
        })
        .attr("marker-end", function(d) {
            if (($scope.json.nodes[d.target.index]['group'] == 2) && ($scope.json.nodes[d.source.index]['group'] == 4))
                return "url(#arrow-" + Math.ceil(Math.sqrt($scope.json.nodes[d.target.index].size)) + ")";
        })
        .attr("x1", function(d) {
            return d.source.x;
        })
        .attr("y1", function(d) {
            return d.source.y;
        })
        .attr("x2", function(d) {
            return d.target.x;
        })
        .attr("class", function(d) {
            var myclass = '';

            myclass += 'link path_from_' + $scope.json.nodes[d.source.index]['group'] + '_to_' + $scope.json.nodes[d.target.index]['group'];

            return myclass;
        })
        .attr("y2", function(d) {
            return d.target.y;
        });

    var nodeGroups = vis.selectAll("g")
        .data($scope.json.nodes)
        .enter()
        .append("svg:g")
        .attr("class", "node-group")
        .attr("class", function(d) {
            switch (d.group) {
                case 1:
                    return 'Service';
                    break;
                case 2:
                    return 'Component';
                    break;
                case 3:
                    return 'LD';
                    break;
                case 4:
                    return 'DC';
                    break;
                case 5:
                    return 'DS';
                    break;
                case 6:
                    return 'DRC';
                    break;
                case 7:
                    return 'DRS';
                    break;
                default:
                    return 'anonymous';
                    break;
            }
        })
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
        .on('click', function(d) {
            run_find_node_script(d.group, d.id, d.name);
        })
        .call(force.drag);
    nodeGroups.each(function(d) {

        var curNode = d3.select(this);

        curNode
            .append("svg:path")
            .attr("class", "node")
            .attr("class", function(d) {
                return "group_" + d.group + " " + "error_" + d.error
            })
            .attr("d", d3.svg.symbol()
                .size(function(d) {
                    return d.size ? d.size : 200;
                })
                .type(function(d) {
                    return d.type ? d.type : "circle";
                }))
            .style("fill", function(d) {
                if (d.group == 4) return fill(2);
                if (d.group == 5) return fill(1);
                if (d.group == 6) return fill(2);
                if (d.group == 7) return fill(1);
                return fill(d.group);
            })
            .style("stroke", function(d) {
                return d.fullAccess ? "black" : "#fff";
            })
            .style("stroke-width", function(d) {
                return d.fullAccess ? "2px" : "1.5px";
            })

            .on("mouseover", function(d) {
                var nodeGroup = vis.selectAll("g.node-group");
                nodeGroup.style("opacity", 0.4);

                d3.select(this.parentNode).style("opacity", 1);
                link
                    .filter(function(l) {
                        return l.target == d;
                    })
                    .style("stroke", "#000")
                    .attr("marker-end", function(d) {
                        if (($scope.json.nodes[d.target.index]['group'] == 2) && ($scope.json.nodes[d.source.index]['group'] == 4))
                            return "url(#arrow-dark-" + Math.ceil(Math.sqrt($scope.json.nodes[d.target.index].size)) + ")";
                    })
                    .each(function(l) {
                        nodeGroup
                            .filter(function(d) {
                                return d.index == l.source.index
                            })
                            .style("opacity", 1);
                    });
                link
                    .filter(function(l) {
                        return l.source == d;
                    })
                    .style("stroke", "#000")
                    .attr("marker-end", function(d) {
                        if (($scope.json.nodes[d.target.index]['group'] == 2) && ($scope.json.nodes[d.source.index]['group'] == 4))
                            return "url(#arrow-dark-" + Math.ceil(Math.sqrt($scope.json.nodes[d.target.index].size)) + ")";
                    })
                    .each(function(l) {
                        nodeGroup
                            .filter(function(d) {
                                return d.index == l.target.index
                            })
                            .style("opacity", 1);
                    });
            })
            .on("mouseout", function(d) {
                vis.selectAll("g.node-group").style("opacity", 1);
                link
                    .attr("marker-end", function(d) {
                        if (($scope.json.nodes[d.target.index]['group'] == 2) && ($scope.json.nodes[d.source.index]['group'] == 4))
                            return "url(#arrow-" + Math.ceil(Math.sqrt($scope.json.nodes[d.target.index].size)) + ")";
                    })
                    .style("stroke", function(d) {
                        return d.fullAccess ? "black" : null;
                    })
            });

        if (d.error) {
            var size = d.size - (d.size * 0.8);
            curNode
                .append("svg:path")
                .attr("class", "error")
                .attr("d", d3.svg.symbol()
                    .size(size)
                    .type("circle")
            )
                .style("stroke", "white")
                .style("stroke-width", "0px")
                .style("fill", "red");
        }
    });
    nodeGroups
        .append("svg:title")
        .text(function(d) {
            return d.name
        });
    nodeGroups.append("text").attr("x", function(d) {
        return d.children || d._children ? -5 : 5;
    })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
        })
        .text(function(d) {
            return d.name
        })

        .style("fill-opacity", 1);

    vis
        .style("opacity", 1e-6)
        .transition()
        .duration(1000)
        .style("opacity", 1);

    force
        .on("tick", function() {
            nodeGroups.attr("transform", function(d) {
                d.x = Math.max(0, Math.min(w, d.x));
                d.y = Math.max(0, Math.min(h, d.y));
                return "translate(" + d.x + "," + d.y + ")";
            });
            link
                .attr("x1", function(d) {
                    return d.source.x;
                }) // TODO
                .attr("y1", function(d) {
                    return d.source.y;
                })
                .attr("x2", function(d) {
                    return d.target.x;
                })
                .attr("y2", function(d) {
                    return d.target.y;
                });
        });

    $(window).resize(function() {
        w = document.body.clientWidth;
        h = document.body.clientHeight;
        vis.attr("width", w).attr("height", h)
            .select("rect").attr("width", w).attr("height", h);
        force.size([w, h]);
    });

    $("#png-save").on("click", function() {
        vis.attr("transform", null);

        // Crop chart
        vis_container
            .attr("width", w)
            .attr("height", h);
        vis_container
            .append("text")
            .attr("x", (w / 2))
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .style("font-family", "Times New Roman")
            .style("font-size", "36px")
            .text("Starting node: " + naCentre);
        vis_container
            .append("text")
            .attr("x", (w / 2))
            .attr("y", 40)
            .attr("text-anchor", "middle")
            .style("font-family", "Times New Roman")
            .style("font-size", "34px")
            .text("Dependency Diagram with " + cDependents + " Services discovered");
        vis_container
            .append("text")
            .attr("x", (w / 2))
            .attr("y", 60)
            .attr("text-anchor", "middle")
            .style("font-family", "Times New Roman")
            .style("font-size", "10px")
            .text(dateProduced);
        vis_container
            .append("style")
            .text('line.link { stroke: #ddd; stroke-opacity: .6;} marker.arrow { fill: #999; fill-opacity: 0.6; } marker.arrow-dark { fill: #000; fill-opacity: 0.8; } svg { background-color: white; } path.error { pointer-events: none; } text { font: 5px sans-serif; } rect { fill: #fff ; }');
        //get svg source.
        var serializer = new XMLSerializer();
        var source = serializer.serializeToString(vis_container.node());
        //add name spaces.
        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }
        //add xml declaration
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        var _img = document.createElement("img");
        _img.setAttribute("src", "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source));

        _img.onload = function( ) {
            var x = document.createElement("canvas");
            x.width = w;
            x.height = h;
            var ctx = x.getContext("2d");
            ctx.drawImage( _img, 0, 0, w, h );
            document.body.innerHTML = '';
            document.body.appendChild(x);
        }
    });
    $("#svg-save").on("click", function() {
        vis.attr("transform", null);
        vis_container
            .attr("width", w)
            .attr("height", h)
            .append("style")
            .text(' \
  line.link { \
  stroke: #ddd; \
  stroke-opacity: .6; \
  } \
  marker.arrow { \
  fill: #999; \
  fill-opacity: 0.6; \
  } \
  marker.arrow-dark { \
  fill: #000; \
  fill-opacity: 0.8; \
  } \
  svg { \
  background-color: white; \
  } \
  path.error { \
  pointer-events: none; \
  } \
  text { \
  font: 5px sans-serif; \
  } \
  rect { \
  fill: #fff ; \
  } \
  // ');

        //get svg source.
        var serializer = new XMLSerializer();
        var source = serializer.serializeToString(vis_container.node());

        //add name spaces.
        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        //add xml declaration
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        var _img = document.createElement("img");
        _img.setAttribute("src", "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source));
        document.body.innerHTML = '';
        document.body.appendChild(_img);
    });

    function redraw() {
        vis.attr("transform",
            "translate(" + d3.event.translate + ")" +
            "scale(" + d3.event.scale + ")");
    }

        function run_find_node_script(context, id,name) {
            //alert(context+"zzzzzzzzzzzzzzzz" +id +"ggg"+name);
            if(context ==3){
                var device ='logicaldevices';
            }
            if(context == 1 || context == 5 || context == 7){
                var device ='services';
            }
            if(context == 2 || context == 4 || context == 6){
                var device ='components';
            }

            var url= __env.apiUrl+"/devices/"+device+'/'+name+"/rownum";
            console.log(url);
            $http.get(url).success(function (response) {
                console.log(response.ROWNUM);
                if(response.ROWNUM >= 0){
                    if(context !=3){
                        $window.open("#/otherDevices/"+device+"/first/"+response.ROWNUM+"/"+name+'/undefined/undefined');
                    }else{
                        $window.open("#/logicalDevices/LIST/"+response.ROWNUM+"/"+name);
                    }
                }else{
                    alert('Internal Error');
                }


            }).error(function(response){
                console.log(response);
                if(response.errorMessage){
                    alert(response.errorMessage);
                    return;
                }
            });

        }

	},3000);



}]);
