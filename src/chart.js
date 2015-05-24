/// <reference path="../typings/d3/d3.d.ts"/>
var framework = framework || {};
(
    function () {

        var chart = {
            init: init,
            update: update
        };
////////////////////////////////////////////////////////////////////////////
        var _svg;
        var _horizontalAxis;
        var _verticalAxis;

        function update(width, height) {

        }

        function init(svg) {
            _svg = svg;
            _svg.append('circle')
                .attr({
                    'cx': 50,
                    'cy': 50,
                    'r': 5
                })
                .style({
                    'fill': 'pink'
                });
            initHorizontalAxis();
        }

        function initHorizontalAxis() {
            var group = _svg.append('g')
                .classed({
                    'axis': true,
                    'horizontal-axis': true
                });
            var scale = d3.scale.linear()
                .range([0, 300])
                .domain([0, 1]);
            _horizontalAxis = d3.svg.axis()
                .scale(scale)
                .orient('bottom');
            group.call(_horizontalAxis);
        }

        framework.chart = chart;
    }()
);