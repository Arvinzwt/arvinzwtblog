'use client';
import React, {useEffect, useRef} from 'react';
import * as d3 from "d3";
import graph from './graph.json'

export default function Clock() {
  const data = graph
  const width = 928;
  const height = 680;
  const svgRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;

      console.log('执行了几次？')

      const svg = d3.select(svgRef.current);

      // Specify the color scale.
      const color = d3.scaleOrdinal(d3.schemeCategory10);

      // The force simulation mutates links and nodes, so create a copy
      // so that re-evaluating this cell produces the same result.
      const links = data.links.map(d => ({...d}));
      const nodes = data.nodes.map(d => ({...d}));

      // Create a simulation with several forces.
      const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("x", d3.forceX())
        .force("y", d3.forceY());

      // Create the SVG container.
      // const svg = d3.create("svg")
      //   .attr("width", width)
      //   .attr("height", height)
      //   .attr("viewBox", [-width / 2, -height / 2, width, height])
      //   .attr("style", "max-width: 100%; height: auto;");

      // Add a line for each link, and a circle for each node.
      const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

      const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 5)
        .attr("fill", d => color(d.group));

      node.append("title")
        .text(d => d.id);

      // Add a drag behavior.
      node.call(d3.drag()
        .on("start", function dragstarted(event) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        })
        .on("drag", function dragged(event) {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
        .on("end", function dragended(event) {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        }));

      // Set the position attributes of links and nodes each time the simulation ticks.
      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
      });

      simulation.on('end', () => {
        console.log('end')
        simulation.stop()
      });
    }
  }, []);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      viewBox={[-width / 2, -height / 2, width, height]}
      style={{maxWidth: '100%', height: 'auto'}}
    />
  );
}