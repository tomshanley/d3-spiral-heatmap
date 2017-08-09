# d3-spiral-heatmap

A [reusable D3 chart](https://bost.ocks.org/mike/chart/) for creating SVG spiral heatmaps.

The chart was based on the answer given to [an R Stack Overflow question](https://stackoverflow.com/questions/41603341/spiral-barplot-using-ggplot-coord-polar-condegram).

A spiral heatmap is useful for displaying periodic datasets, and you want a continuous series without visual breaks at certain points (for example at the end and beginning of the calendar year). 

# Example

[<img alt="Spiral heatmap" src="/img/spiral-heatmap.png">](https://bl.ocks.org/tomshanley/4080b28445785939b3f043b8c5b63e22)

----------

# Usage

## Pre-requesisites

The chart uses [version 4 of D3.js](https://github.com/d3/d3/), which must be loaded.

The dataset must be sorted before calling the chart. The heatmap will be created from the centre of the spiral, circling outwards.

## API

var chart = **spiralHeatmap()**

Creates a new instance of the spiral heatmap with default settings.

When the chart is called on a selection with data attached, a spiral heatmap is created within a "g" element with the class ".spiral-heatmap".

    selection.datum(data).call(chart)

Each arc of the spiral is path element contained within a "g" element with the class ".arc", which can be selected and styled after it is created. For example:

    g.selectAll(".arc")
        .selectAll("path")
        .style("fill", function (d) { return colour(d.value); })

*chart*.**radius**(r)

The radius (r) of the spiral chart. The radius is from the centre of the chart to the widest point of the spiral. Default is 250.

*chart*.**holeRadiusProportion**(p)

The proportion (p) of the radius which will be left as a hole in the centre of the chart. Must be between 0 and 1.

0 will mean the spiral starts at the centre of the chart, which produces pointed arcs at the centre. Default is 0.3.

*chart*.**arcsPerCoil**(s)

The number of arcs per coil of the spiral. Usually this is set to match the number of intervals in the period you are charting, eg <b>12</b> months per year, <b>24</b> hours per day, etc. Default is 12.

*chart*.**coilPadding**(p)

The proportion (0 to 1) of the coil width that will be used as padding between coils. Padding is useful if you want to highlight the spiral rather than the segments of arcs. Must be between 0 and 1. Default is 0 (no padding).

*chart*.**arcLabel**(fieldname)

The field in the data that will label each segment of arcs in the spiral. The label will have the class ".arc-label" for selection and styling. Defaults to no field (no labels).

*chart*.**coilLabel**(fieldname)

The field in the data that will label each coil. The label will have the class ".coil-label" for selection and styling.  Defaults to no field (no labels).

*chart*.**startAngle**(fieldname)

The angle, in degrees starting from the 12 o'clock position, from which the first segment will be drawn.

startAngle
