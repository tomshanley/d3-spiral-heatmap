# d3-spiral-heatmap

A [reusable D3 chart](https://bost.ocks.org/mike/chart/) for creating SVG spiral heatmaps.

The chart was based on the answer given to [an R Stack Overflow question](https://stackoverflow.com/questions/41603341/spiral-barplot-using-ggplot-coord-polar-condegram).

# Example

[<img alt="Spiral heatmap" src="/img/spiral-heatmap.png">](https://bl.ocks.org/tomshanley/4080b28445785939b3f043b8c5b63e22)

----------

# Usage

var chart = **spiralHeatmap()**

Creates a new instance of the spiral heatmap with default settings.

When the chart is called on a selection, a spiral heatmap is created within a "g" element with the class ".spiral-heatmap".

    selection.call(chart)

Each arc (or segments) of the spiral is path element contained within a "g" element with the class ".arc", which can be selected and styled after it is created. For example:

    g.selectAll(".arc")
        .selectAll("path")
        .style("fill", function (d) { return colour(d.value); })

*chart*.**radius**(r)

The radius (r) of the spiral chart. The radius is from the centre of the chart to the widest point of the spiral. Default is 250.

*chart*.**holeRadiusProportion**(p)

The proportion (p) of the radius which will be left as a hole in the centre of the chart. Must be between 0 and 1.

0 will mean the spiral starts at the centre of the chart, which produces pointed segments. Default is 0.3.

*chart*.**segmentsPerCoil**(s)

The number of segments per coil of the spiral. Usually this is set to match the number of intervals in the period you are charting, eg <b>12</b> months per year, <b>24</b> hours per day, etc. Default is 12.

*chart*.**coilPadding**(p)

The proportion (0 to 1) of the coil width that will be used as padding between coils. Padding is useful if you want to highlight the spiral rather than the segments. Must be between 0 and 1. Default is 0 (no padding).

*chart*.**segmentLabels**(array)

An array of labels that will be placed around the circumference of the spiral. Typically you would have the same number of values in the array as segmentsPerCoil. Default is an empty array (no labels).