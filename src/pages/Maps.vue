<template>
  <div>
    <div>
      <p>fuck</p>
    </div>
    <div class="graphcontainer" style="width: 500px;height: 650px;"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "PatentKG",
  data() {
    return {
      colorList: [
        "#6fce7a",
        "#ff8373",
        "#f9c62c",
        "#a5ca34",
        "#70d3bd",
        "#ea91b0"
      ],
      svg: null,
      timer: null,
      editor: null,
      simulation: null,
      linkGroup: null,
      linktextGroup: null,
      nodeGroup: null,
      nodetextGroup: null,
      nodesymbolGroup: null,
      nodebuttonGroup: null,
      nodebuttonAction: "",
      txx: {},
      tyy: {},
      graph: {
        nodes: [],
        links: []
      }
    };
  },
  mounted() {
    this.getGraphData();
  },
  methods: {
    getGraphData() {
      var _this = this;
      var urlNode = "/patent_kg/query/人工智能/nodes";
      var urlLink = "/patent_kg/query/人工智能/links";
      this.axios.all([this.axios.get(urlNode), this.axios.get(urlLink)]).then(
        this.axios.spread(function(responseNodes, responseLinks) {
          console.log("responseNodes", responseNodes.data);
          console.log("responseLinks", responseLinks.data);
          _this.graph.nodes = responseNodes.data;
          _this.graph.links = responseLinks.data;
          _this.initGraph();
        })
      );
    },
    initGraph_new(data) {
      var graphcontainer = d3.select(".graphcontainer");
      var width = graphcontainer._groups[0][0].offsetWidth;
      var height = graphcontainer._groups[0][0].offsetHeight; //
      this.svg = graphcontainer.append("svg");
      this.svg.attr("width", width);
      this.svg.attr("height", height);
      this.simulation = d3
        .forceSimulation()
        .force(
          "link",
          d3
            .forceLink()
            .distance(function(d) {
              return Math.floor(Math.random() * (700 - 200)) + 200;
            })
            .id(function(d) {
              return d.id;
            })
        )
        .force("charge", d3.forceManyBody().strength(-400))
        .force("collide", d3.forceCollide().strength(-30))
        .force("center", d3.forceCenter(width / 2, (height - 200) / 2));
      this.linkGroup = this.svg.append("g").attr("class", "line");
      this.linktextGroup = this.svg.append("g").attr("class", "linetext");
      this.nodeGroup = this.svg.append("g").attr("class", "node");
      this.nodetextGroup = this.svg.append("g").attr("class", "nodetext");
      this.nodesymbolGroup = this.svg.append("g").attr("class", "nodesymbol");
      this.nodebuttonGroup = this.svg.append("g").attr("class", "nodebutton");
      this.addmaker();
      this.addnodebutton();
      this.svg.on(
        "click",
        function() {
          d3.selectAll("use").classed("circle_opreate", true);
        },
        "false"
      );
    },
    addmaker() {
      var arrowMarker = this.svg
        .append("marker")
        .attr("id", "arrow")
        .attr("markerUnits", "strokeWidth")
        .attr("markerWidth", "20") //
        .attr("markerHeight", "20")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", "22") // 13
        .attr("refY", "0")
        .attr("orient", "auto");
      var arrow_path = "M0,-5L10,0L0,5"; // 定义箭头形状
      arrowMarker
        .append("path")
        .attr("d", arrow_path)
        .attr("fill", "#fce6d4");
    },
    addnodebutton() {
      var _this = this;
      var nodebutton = this.svg
        .append("defs")
        .append("g")
        .attr("id", "out_circle");
      var database = [1, 1, 1, 1, 1];
      var pie = d3.pie();
      var piedata = pie(database);
      var buttonEnter = nodebutton
        .selectAll(".buttongroup")
        .data(piedata)
        .enter()
        .append("g")
        .attr("class", function(d, i) {
          return "action_" + i;
        });
      var arc = d3
        .arc()
        .innerRadius(30)
        .outerRadius(60);
      buttonEnter
        .append("path")
        .attr("d", function(d) {
          return arc(d);
        })
        .attr("fill", "#D2D5DA")
        .style("opacity", 0.6)
        .attr("stroke", "#f0f0f4")
        .attr("stroke-width", 2);
      buttonEnter
        .append("text")
        .attr("transform", function(d, i) {
          return "translate(" + arc.centroid(d) + ")";
        })
        .attr("text-anchor", "middle")
        .text(function(d, i) {
          var zi = new Array();
          zi[0] = "编辑";
          zi[1] = "展开";
          zi[2] = "追加";
          zi[3] = "连线";
          zi[4] = "删除";
          return zi[i];
        })
        .attr("font-size", 10);
    },

    initGraph() {
      var _this = this;
      console.log("testGraph", _this.graph.nodes);
      var nodes = _this.graph.nodes.map(d => Object.create(d));
      var links = _this.graph.links.map(d => Object.create(d));

      for (let i = 0; i < nodes.length; i++) {
        console.log("node", nodes[i].x);
      }
      console.log("linkes", links);
      console.log("nodes", nodes);

      _this.simulation = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3
            .forceLink(links)
            .id(d => d.id)
            .distance(150)
        )
        .force(
          "collide",
          d3.forceCollide().radius(() => 80)
        )
        .force("charge", d3.forceManyBody().strength(-10))
        .force("center", d3.forceCenter(_this.width / 2, _this.height / 2));

      var graphcontainer = d3.select(".graphcontainer");
      console.log("graphcontainer", graphcontainer);
      var width = graphcontainer._groups[0][0].offsetWidth;
      var height = graphcontainer._groups[0][0].offsetHeight;
      console.log(width);
      console.log(height);
      _this.svg = graphcontainer.append("svg");
      _this.svg.attr("width", width);
      _this.svg.attr("height", height);
      _this.svg.attr("viewBox", [0, 0, width, height]);
      // const svg = d3
      //   .select(".container")
      //   .append("svg")
      //   .attr("viewBox", [50, 50, _this.width, _this.height]);
      _this.svg.call(
        d3.zoom().on("zoom", function() {
          g.attr("transform", d3.event.transform);
        })
      );

      // eslint-disable-next-line no-unused-vars
      const positiveMarker = _this.svg
        .append("marker")
        .attr("id", "positiveMarker")
        .attr("orient", "auto")
        .attr("stroke-width", 2)
        .attr("markerUnits", "strokeWidth")
        .attr("markerUnits", "userSpaceOnUse")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 35) // 30 + 5
        .attr("refY", 0)
        .attr("markerWidth", 12)
        .attr("markerHeight", 12)
        .append("path")
        .attr("d", "M 0 -5 L 10 0 L 0 5")
        .attr("fill", "#999999")
        .attr("stoke-opacity", 0.6);
      // eslint-disable-next-line no-unused-vars
      const negativeMarker = _this.svg
        .append("marker")
        .attr("id", "negativeMarker")
        .attr("orient", "auto")
        .attr("stroke-width", 2)
        .attr("markerUnits", "strokeWidth")
        .attr("markerUnits", "userSpaceOnUse")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", -25) // -30 + (5)
        .attr("refY", 0)
        .attr("markerWidth", 12)
        .attr("markerHeight", 12)
        .append("path")
        .attr("d", "M 10 -5 L 0 0 L 10 5")
        .attr("fill", "#999999")
        .attr("stoke-opacity", 0.6);

      const g = _this.svg.append("g");

      _this.links = g
        .append("g")
        .attr("stroke", "#999999")
        .attr("stroke-opacity", 0.6)
        // .attr('marker-end', 'url(#positiveMarker)')
        .selectAll("path")
        .data(links, function(d) {
          if (typeof d.source === "object") {
            return d.source.id + "_" + d.relationship + "_" + d.target.id;
          } else {
            return d.source + "_" + d.relationship + "_" + d.target;
          }
        })
        .join("path")
        .attr("stroke-width", d => Math.sqrt(d.value))
        .attr("class", "link")
        // .attr('id', d => d.source + '_' + d.relationship + '_' + d.target)
        .attr("id", function(d) {
          if (typeof d.source === "object") {
            return d.source.id + "_" + d.relationship + "_" + d.target.id;
          } else {
            return d.source + "_" + d.relationship + "_" + d.target;
          }
        });

      _this.linksText = g
        .append("g")
        .selectAll("text")
        .data(links, function(d) {
          if (typeof d.source === "object") {
            return d.source.id + "_" + d.relationship + "_" + d.target.id;
          } else {
            return d.source + "_" + d.relationship + "_" + d.target;
          }
        })
        .join("text")
        .text(function(d) {
          return d.relationship;
        })
        .style("text-anchor", "middle")
        .style("fill", "black")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("text-anchor", function(d) {
          return "middle";
        })
        .append("textPath")
        .attr(
          "xlink:href",
          d => "#" + d.source + "_" + d.relationship + "_" + d.target
        );
      // .atter('class', 'link-text')

      _this.nodes = g
        .append("g")
        .attr("stroke", "#000000")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes, d => d.id)
        .join("circle")
        .attr("r", 30)
        .attr("fill", _this.color)
        .call(_this.drag(_this.simulation))
        .on("click", _this.selectNode);

      _this.nodes.append("title").text(d => d.id);

      _this.nodeText = g
        .append("g")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .text(function(d) {
          return d.id; // 效果与d => d.id相同
        })
        .style("text-anchor", function(d) {
          return "middle";
        })
        // .attr('dx', function () {
        //   return this.getBoundingClientRect().width / 2 * (-1)
        // })
        // .attr('dx', -50)
        .attr("dy", 45)
        .attr("class", "node-text");

      _this.simulation.on("tick", () => {
        // _this.links
        //   .attr('d', d => 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y)
        // line写法
        // .attr('x1', d => d.source.x)
        // .attr('y1', d => d.source.y)
        // .attr('x2', d => d.target.x)
        // .attr('y2', d => d.target.y)

        _this.links
          .attr("d", function(d) {
            if (d.source.x < d.target.x) {
              return (
                "M " +
                d.source.x +
                " " +
                d.source.y +
                " L " +
                d.target.x +
                " " +
                d.target.y
              );
            } else {
              return (
                "M " +
                d.target.x +
                " " +
                d.target.y +
                " L " +
                d.source.x +
                " " +
                d.source.y
              );
            }
          })
          .attr("marker-end", function(d) {
            if (d.source.x < d.target.x) {
              return "url(#positiveMarker)";
            } else {
              return null;
            }
          })
          .attr("marker-start", function(d) {
            if (d.source.x < d.target.x) {
              return null;
            } else {
              return "url(#negativeMarker)";
            }
          });

        _this.nodes.attr("cx", d => d.x).attr("cy", d => d.y);

        _this.nodeText.attr("x", d => d.x).attr("y", d => d.y);
      });
    },

    updateGraph(data) {
      var _this = this;
      const links = data.links;
      const nodes = data.nodes;

      _this.links = _this.links
        .data(links, function(d) {
          if (typeof d.source === "object") {
            return d.source.id + "_" + d.relationship + "_" + d.target.id;
          } else {
            return d.source + "_" + d.relationship + "_" + d.target;
          }
        })
        .join("path")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", d => Math.sqrt(d.value))
        .attr("marker-end", "url(#positiveMarker)")
        .merge(_this.links)
        .attr("class", "link")
        // .attr('id', d => d.source + '_' + d.relationship + '_' + d.target)
        .attr("id", function(d) {
          if (typeof d.source === "object") {
            return d.source.id + "_" + d.relationship + "_" + d.target.id;
          } else {
            return d.source + "_" + d.relationship + "_" + d.target;
          }
        });

      _this.linksText = _this.linksText
        .data(links, function(d) {
          if (typeof d.source === "object") {
            return d.source.id + "_" + d.relationship + "_" + d.target.id;
          } else {
            return d.source + "_" + d.relationship + "_" + d.target;
          }
        })
        .join("text")
        .style("text-anchor", "middle")
        .style("fill", "red")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .append("textPath")
        .attr(
          "xlink:href",
          d => "#" + d.source + "_" + d.relationship + "_" + d.target
        )
        .attr("startOffset", "50%")
        .merge(_this.linksText)
        .text(function(d) {
          return d.relationship;
        })
        .attr("class", "link-text");

      _this.nodes = _this.nodes
        .data(nodes, d => d.id)
        .join("circle")
        .attr("r", 30)
        .attr("fill", _this.color)
        .merge(_this.nodes)
        .on("click", _this.selectNode)
        .call(_this.drag(_this.simulation));

      _this.nodes.append("title").text(d => d.id);

      _this.nodeText = _this.nodeText
        .data(nodes)
        .join("text")
        .merge(_this.nodeText)
        .text(function(d) {
          return d.id;
        })
        .style("text-anchor", function(d) {
          return "middle";
        })
        // .attr('dx', function () {
        //   return this.getBoundingClientRect().width / 2 * (-1)
        // })
        // .attr('dx', -50)
        .attr("dy", 45)
        .attr("class", "node-text");

      _this.simulation.nodes(nodes);
      _this.simulation.force("link").links(links);
      _this.simulation.alpha(1).restart();
    },

    color(d) {
      // const scale = d3.scaleOrdinal(d3.schemeCategory10)
      // return scale(d.group)

      return this.colorList[d.group];
    },

    drag(simulation) {
      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  }
};
</script>
