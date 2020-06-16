<template>
  <md-card>
    <md-card-header :data-background-color="dataBackgroundColor">
      <h4 class="title">
        <a class="card-title" href="#">
          {{ this.keyword }}相关科技资源关联关系
        </a>
      </h4>
    </md-card-header>
    <md-card-content>
      <div class="container" id="container"></div>
    </md-card-content>
  </md-card>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "kg-card",
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    },
    keyword: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      width: 600,
      height: 450,
      colorList: [
        "#6fce7a",
        "#ff8373",
        "#f9c62c",
        "#a5ca34",
        "#70d3bd",
        "#ea91b0"
      ],
      links: [],
      nodes: [],
      nodesText: [],
      CountText: [],
      linksText: [],
      simulation: null,
      testGraph: {
        nodes: [],
        links: []
      }
    };
  },
  created() {
    this.getGraphData();
  },
  methods: {
    getGraphData() {
      var _this = this;
      var urlNode = "/patent_kg/query/" + this.keyword + "/nodes";
      var urlLink = "/patent_kg/query/" + this.keyword + "/links";
      this.axios.all([this.axios.get(urlNode), this.axios.get(urlLink)]).then(
        this.axios.spread(function(responseNodes, responseLinks) {
          // console.log(responseNodes.data)
          // console.log(responseLinks.data)
          _this.testGraph.nodes = responseNodes.data;
          _this.testGraph.links = responseLinks.data;
          _this.initGraph(_this.testGraph);
        })
      );
      // .then(this.axios.spread(function (nodes, links){}) {
      //   _this.testGraph.nodes = response.data
      //   _this.initGraph(_this.testGraph)
      //   // console.log(_this.response)
      // })
      // .catch(function (error) {
      //   console.log(error)
      // })
      // url = '/patent_kg/query/人工智能/links'
      // this.axios.get(url)
      //   .then(function (response) {
      //     _this.testGraph['links'] = response.data
      //     // _this.initGraph(_this.testGraph)
      //     // console.log(_this.response)
      //   })
      //   .catch(function (error) {
      //     console.log(error)
      //   })
      // _this.initGraph(_this.testGraph)
      // console.log(_this.testGraph)
    },

    initGraph(data) {
      var _this = this;
      console.log(_this.testGraph);
      console.log(data.nodes);
      const nodes = data.nodes.map(d => Object.create(d));
      const links = data.links.map(d => Object.create(d));

      console.log(links);
      console.log(nodes);

      _this.simulation = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3
            .forceLink(links)
            .id(d => d.id)
            .distance(100)
        )
        .force(
          "collide",
          d3.forceCollide().radius(() => 80)
        )
        .force("charge", d3.forceManyBody().strength(-500))
        .force("center", d3.forceCenter(_this.width / 2, _this.height / 2));

      var container = d3.select(".container");
      _this.width = container._groups[0][0].offsetWidth;
      // _this.height = container._groups[0][0].offsetHeight;
      console.log(_this.width);
      console.log(_this.height);

      const svg = d3
        .select(".container")
        .append("svg")
        .attr("width", _this.width)
        .attr("height", _this.height)
        .attr("viewBox", [0, 0, _this.width, _this.height]);
      svg.call(
        d3.zoom().on("zoom", function() {
          g.attr("transform", d3.event.transform);
        })
      );

      // eslint-disable-next-line no-unused-vars
      const positiveMarker = svg
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
      const negativeMarker = svg
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

      const g = svg.append("g");

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
          if (d.id === d.object) return d.id;
          return d.id + "\n(" + d.object + ")"; // 效果与d => d.id相同
        })
        .style("text-anchor", function(d) {
          return "middle";
        })
        // .attr('dx', function () {
        //   return this.getBoundingClientRect().width / 2 * (-1)
        // })
        // .attr('dx', -50)
        .attr("dy", 50)
        .attr("font-size", 18)
        .attr("font-weight", "bold")
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
    },

    queryNode(d) {
      var _this = this;
      let data = {};
      for (var element in d.object) {
        let isArray = d.object[element] instanceof Array;
        if (!isArray) {
          data[element] = d.object[element];
        }
      }
      _this.$refs.detailPanel.currentNode = data;
      // console.log(_this.$refs.detailPanel.currentNode)
      // console.log(d.object)
      var url = "person/actedby/" + d.id;
      this.axios
        .get(url)
        .then(function(response) {
          if (response.status === 200) {
            for (var i = 0; i < response.data.length; i++) {
              let flag = true;
              for (var j = 0; j < _this.testGraph.nodes.length; j++) {
                if (_this.testGraph.nodes[j].id === response.data[i].id) {
                  flag = false;
                  break;
                }
              }
              if (flag) {
                _this.testGraph.nodes.push(response.data[i]);
                _this.testGraph.links.push({
                  source: d.id,
                  target: response.data[i].id,
                  value: 5,
                  relationship: "ACTED_IN"
                });
              }
            }
            _this.updateGraph(_this.testGraph);
            // console.log(_this.testGraph)
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    selectNode(d) {
      var _this = this;
      let data = {};
      for (var element in d.object) {
        let isArray = d.object[element] instanceof Array;
        if (!isArray) {
          data[element] = d.object[element];
        }
      }
      _this.$refs.detailPanel.currentNode = data;
      _this.$refs.detailPanel.isShow = true;
    },

    getQueryResult(result, currentNode, currentType) {
      for (var i = 0; i < result.length; i++) {
        let flag = true;
        // let templinks = {
        //   'source': currentNode.name,
        //   'target': result[i].id,
        //   'value': 5,
        //   'relationship': currentType
        // }
        for (var j = 0; j < this.testGraph.nodes.length; j++) {
          if (this.testGraph.nodes[j].id === result[i].id) {
            flag = false;
            break;
          }
        }
        if (flag) {
          this.testGraph.nodes.push(result[i]);
        } else {
        }
        this.testGraph.links.push({
          source: currentNode.name,
          target: result[i].id,
          value: 5,
          relationship: currentType
        });
      }
      for (i = this.testGraph.links.length - 1; i >= 0; i--) {
        if (
          this.testGraph.links[i].source.id === currentNode.name &&
          this.testGraph.links[i].relationship !== currentType
        ) {
          let isRemove = true;
          for (var k = 0; k < result.length; k++) {
            if (result[k].id === this.testGraph.links[i].target.id) {
              isRemove = false;
              break;
            }
          }
          if (isRemove) {
            for (k = this.testGraph.nodes.length - 1; k >= 0; k--) {
              if (
                this.testGraph.nodes[k].id === this.testGraph.links[i].target.id
              ) {
                this.testGraph.nodes.splice(k, 1);
              }
            }
          }
          this.testGraph.links.splice(i, 1);
        }
      }
      this.updateGraph(this.testGraph);
      // console.log(_this.testGraph)
    }
  }
};
</script>
<style></style>
