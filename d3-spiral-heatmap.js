// A spiral heatmap
// The following options are available
// radius: radius of the overall plot, not including any labels. Default 250
// holeRadiusProportion: the proportion (0 to 1) of the radius (see above) that is left as a hole. Default 0.
// segmentsPerCoil: a 'coil' is one revolution of the spiral.  This sets how many segments (or arcs) you want per coil. Typically this would
//                  be set according to the periodicity of the data. For example, 12 for months per year, 24 for hours per day, etc
// coilPadding: the proportion (0 to 1) of the coil width that is used for padding between coils. Useful for making the spiral very noticeable
//

function spiralHeatmap () {
  
  // constants
  const radians = 0.0174532925

  // All options that are accessible to caller
  // Default values
  var radius = 250 //pixels
  var holeRadiusProportion = 0.3 //proportion of radius
  var segmentsPerCoil = 12 //assuming months per year
  var coilPadding = 0 //no padding
  var segmentLabelsData = []; //no labels

  function chart (selection) {
    
    selection.each(function (data) {

      const segmentAngle = 360 / segmentsPerCoil;
      const labelRadius = radius + 20;
      
      // Create/update the x/y coordinates for the vertices and control points for the paths
      // Stores the x/y coordinates on the data
      updatePathData(data)

      let thisSelection = d3.select(this);

      var segmentLabelsG = thisSelection.selectAll(".segment-label")
                .data(segmentLabels)
                .enter()
                .append("g")
                .attr("class", "segment-label");

            segmentLabelsG.append("text")
                .text(function (d) { return d; })
                .attr("x", function (d, i) {
                    let labelAngle = (i * segmentAngle) + (segmentAngle / 2);
                    return x(labelAngle, labelRadius);
                })
                .attr("y", function (d, i) {
                    let labelAngle = (i * segmentAngle) + (segmentAngle / 2);
                    return y(labelAngle, labelRadius);
                })
                .style("text-anchor", function (d, i) {
                    return i < (segmentLabels.length / 2) ? "start" : "end";
                });

            segmentLabelsG.append("line")
                .attr("x2", function (d, i) {
                    let lineAngle = (i * segmentAngle);
                    let lineRadius = chartRadius + 10;
                    return x(lineAngle, lineRadius);
                })
                .attr("y2", function (d, i) {
                    let lineAngle = (i * segmentAngle);
                    let lineRadius = chartRadius + 10;
                    return y(lineAngle, lineRadius);
                });

      var arcs = thisSelection.selectAll('.arc')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'arc')

      arcs.append('path').attr('d', function (d) {
        // start at vertice 1
        let start = 'M ' + d.x1 + ' ' + d.y1
        // inner curve to vertice 2
        let side1 =
          ' Q ' +
          d.controlPoint1x +
          ' ' +
          d.controlPoint1y +
          ' ' +
          d.x2 +
          ' ' +
          d.y2
        // straight line to vertice 3
        let side2 = 'L ' + d.x3 + ' ' + d.y3
        // outer curve vertice 4
        let side3 =
          ' Q ' +
          d.controlPoint2x +
          ' ' +
          d.controlPoint2y +
          ' ' +
          d.x4 +
          ' ' +
          d.y4
        // combine into string, with closure (Z) to vertice 1
        return start + ' ' + side1 + ' ' + side2 + ' ' + side3 + ' Z'
      })

    })

    function updatePathData (data) {

      let holeRadius = radius * holeRadiusProportion
      let segmentAngle = 360 / segmentsPerCoil
      let dataLength = data.length
      let coils = Math.ceil(dataLength / segmentsPerCoil) // number of coils, based on data.length / segmentsPerCoil
      let coilWidth = chartRadius * (1 - holeRadiusProportion) / (coils + 1) // remaining chartRadius (after holeRadius removed), divided by coils + 1. I add 1 as the end of the coil moves out by 1 each time

      data.forEach(function (d, i) {
        let coil = Math.floor(i / segmentsPerCoil)
        let position = i - coil * segmentsPerCoil
        let startAngle = position * segmentAngle
        let endAngle = (position + 1) * segmentAngle
        let startInnerRadius = holeRadius + i / segmentsPerCoil * coilWidth
        let startOuterRadius =
          holeRadius +
          i / segmentsPerCoil * coilWidth +
          coilWidth * (1 - coilPadding)
        let endInnerRadius = holeRadius + (i + 1) / segmentsPerCoil * coilWidth
        let endOuterRadius =
          holeRadius +
          (i + 1) / segmentsPerCoil * coilWidth +
          coilWidth * (1 - coilPadding)

        // vertices of each segment
        d.x1 = x(startAngle, startInnerRadius)
        d.y1 = y(startAngle, startInnerRadius)
        d.x2 = x(endAngle, endInnerRadius)
        d.y2 = y(endAngle, endInnerRadius)
        d.x3 = x(endAngle, endOuterRadius)
        d.y3 = y(endAngle, endOuterRadius)
        d.x4 = x(startAngle, startOuterRadius)
        d.y4 = y(startAngle, startOuterRadius)

        // CURVE CONTROL POINTS
        let midAngle = startAngle + segmentAngle / 2
        let midInnerRadius =
          holeRadius + (i + 0.5) / segmentsPerCoil * coilWidth
        let midOuterRadius =
          holeRadius +
          (i + 0.5) / segmentsPerCoil * coilWidth +
          coilWidth * (1 - coilPadding)

        // MID POINTS, WHERE THE CURVE WILL PASS THRU
        d.mid1x = x(midAngle, midInnerRadius)
        d.mid1y = y(midAngle, midInnerRadius)
        d.mid2x = x(midAngle, midOuterRadius)
        d.mid2y = y(midAngle, midOuterRadius)

        d.controlPoint1x = (d.mid1x - 0.25 * d.x1 - 0.25 * d.x2) / 0.5
        d.controlPoint1y = (d.mid1y - 0.25 * d.y1 - 0.25 * d.y2) / 0.5
        d.controlPoint2x = (d.mid2x - 0.25 * d.x3 - 0.25 * d.x4) / 0.5
        d.controlPoint2y = (d.mid2y - 0.25 * d.y3 - 0.25 * d.y4) / 0.5
      })

      return data
    }

    function x (angle, radius) {
      // change to clockwise
      let a = 360 - angle
      // start from 12 o'clock
      a = a + 180
      return radius * Math.sin(a * radians)
    }

    function y (angle, radius) {
      // change to clockwise
      let a = 360 - angle
      // start from 12 o'clock
      a = a + 180
      return radius * Math.cos(a * radians)
    }

    function chartWH (r) {
      return r * 2
    }

  }

  chart.radius = function (value) {
    if (!arguments.length) return radius
    radius = value
    return chart
  }

  chart.holeRadiusProportion = function (value) {
    if (!arguments.length) return holeRadiusProportion
    holeRadiusProportion = value
    return chart
  }

  chart.segmentsPerCoil = function (value) {
    if (!arguments.length) return segmentsPerCoil
    segmentsPerCoil = value
    return chart
  }

  chart.coilPadding = function (value) {
    if (!arguments.length) return coilPadding
    coilPadding = value
    return chart
  }

  chart.segmentLabels = function (value) {
    if (!arguments.length) return segmentLabels
    segmentLabels = value
    return chart
  }

  return chart
  
}
