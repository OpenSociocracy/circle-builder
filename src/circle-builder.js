// TODO
// 0. define 2 kinds of circle
// 1. click circle and get option dropdown
// 2.
randomColor=function(){var n=Math.random();return function(o,u){return function(n,o,u){var i=u+(u<.5?u:1-u)*o,a=2*u-i;return"#"+t(r(n>=240?n-240:n+120,a,i))+t(r(n,a,i))+t(r(n<120?n+240:n-120,a,i))}(.618034*++n%1*360,o,u)};function r(n,r,t){return 255*(n<60?r+(t-r)*n/60:n<180?t:n<240?r+(t-r)*(240-n)/60:r)}function t(n){return(n<16?"0":"")+(0|n).toString(16)}}();

nodes = [
  { data: { name: "General Circle", size: 50, type: "circle", index: 0, color: randomColor(0.9, 0.9) } }
];
links = [];

const width = 1000,
  height = 1000;

let i = 0;

let node, link;


function update() {

  // link = svg.selectAll(".link").data(links, function (d) {
  //   return d.target.id;
  // });

  // link.exit().remove();

  // const linkEnter = link
  //   .enter()
  //   .append("line")
  //   .attr("class", "link")
  //   .style("stroke", "#000")
  //   .style("opacity", "0.2")
  //   .style("stroke-width", 2);

  // link = linkEnter.merge(link);

  node = svg.selectAll(".node").data(nodes, function (d) {
    return d.id;
  });

  node.exit().remove();

  const nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("stroke", "#666")
    .attr("stroke-width", 2)
    .style("fill", d => d.data.color)
    .style("opacity", 0.8)
    .on("click", clicked)
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  nodeEnter
    .append("circle")
    .attr("r", function (d) {
      return d.data.size || 4.5;
    })
    .style("text-anchor", function (d) {
      return d.children ? "end" : "start";
    });

  nodeEnter.append("text")
    .text(function (d) {return d.data.name;})
    .attr("text-anchor", "middle")
    .style("font-size", "1px")
    // .each(getSize)
    .style("font-size", function(d) { return 15 + "px"; });

  node = nodeEnter.merge(node);
  simulation.nodes(nodes);
  simulation.force("link").links(links);
  simulation.alpha(0.05).restart();
}

function getSize(d) {
  var bbox = this.getBBox(),
      cbbox = this.parentNode.getBBox(),
      scale = Math.min(cbbox.width/bbox.width, cbbox.height/bbox.height);
  d.scale = scale;
};


function sizeContain(num) {
  num = num > 1000 ? num / 1000 : num / 100;
  if (num < 4) num = 4;
  return num;
}

function radius(d) {
  return d._children ? 8 : d.children ? 8 : 4;
}

function ticked() {
  // link
  //   .attr("x1", function (d) {
  //     return d.source.x;
  //   })
  //   .attr("y1", function (d) {
  //     return d.source.y;
  //   })
  //   .attr("x2", function (d) {
  //     return d.target.x;
  //   })
  //   .attr("y2", function (d) {
  //     return d.target.y;
  //   });

  node.attr("transform", function (d) {
    return `translate(${d.x}, ${d.y})`;
  });
}

function clicked(d) {

  if (!d3.event.defaultPrevented) {
    document.getElementById('index').value = d.data.index
    document.getElementById('username').value = d.data.name
    document.getElementById('modform').style.display='block'
    if(d.data.size==50){
      document.getElementById('circles_list_label_1').style.display='none'
      document.getElementById('circles_list_1').style.display='none'
      document.getElementById('circles_list_label_2').style.display='none'
      document.getElementById('circles_list_2').style.display='none'
      document.getElementById('member_name').style.display='none'
      document.getElementById('circle_name').style.display='block'
      document.getElementById('addmem').style.display='block'
      document.getElementById('addcirc').style.display='block'
    }else{
      source = d
      circle_1 = ''
      for (var i = 0; i < nodes.length; i++){
        if (!('parent_node' in nodes[i].data)){
          circle_1+='<option value="'+i+'">'+nodes[i].data.name+'</option>'
        }
      }

      circle_2 = '<option value="-1">None</option>'
      for (var i = 0; i < nodes.length; i++){
        if (!('parent_node' in nodes[i].data) && nodes[i].data.super_node==source.data.parent_node){
          circle_2+='<option value="'+i+'">'+nodes[i].data.name+'</option>'
        }
      }
      if ('super_node' in nodes[source.data.parent_node].data){
        super_node = nodes[source.data.parent_node].data.super_node
        circle_2+='<option value="'+super_node+'">'+nodes[super_node].data.name+'</option>'
      }

      document.getElementById('circles_list_1').innerHTML = circle_1
      document.getElementById('circles_list_1').value=source.data.parent_node;
      document.getElementById('circles_list_2').innerHTML = circle_2
      if ('child_node' in source.data){
        document.getElementById('circles_list_2').value=source.data.child_node;
      } else {
        document.getElementById('circles_list_2').value=-1
      }
      document.getElementById('circles_list_label_1').style.display='block'
      document.getElementById('circles_list_1').style.display='block'
      document.getElementById('circles_list_label_2').style.display='block'
      document.getElementById('circles_list_2').style.display='block'
      document.getElementById('member_name').style.display='block'
      document.getElementById('circle_name').style.display='none'
      document.getElementById('addmem').style.display='none'
      document.getElementById('addcirc').style.display='none'
    }
  }
}

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

function zoomed() {
  svg.attr("transform", d3.event.transform);
}

function close_modal(){
    document.getElementById('modform').style.display = "none";
}

window.onclick = function(event) {
  if (event.target == document.getElementById('modform')) {
    close_modal()
  }
}


window.onload = function (){
  svg = d3
    .select("body")
    .append("svg")
    .call(
      d3
        .zoom()
        .scaleExtent([1 / 2, 8])
        .on("zoom", zoomed)
    )
    .append("g")
    .attr("transform", "translate(40,0)");


  simulation = d3
    .forceSimulation()
    .force("charge", d3.forceManyBody().strength(-100))
    .force("link", d3.forceLink(links).distance(d =>  d.link_length).strength(2))
    .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
    .on("tick", ticked);


  update()
}


function namechange(){
  curInd = document.getElementById('index').value
  nodes[curInd]['data']['name']=document.getElementById('username').value
  svg.selectAll(".node").select("text")
    .text(function(d) {
        return d.data.name;
    })
    // .each(getSize)
    .style("font-size", function(d) { return 15 + "px"; });
}

function add_subcircle(){
  curInd = document.getElementById('index').value
  source = { data: { name: "Untitled Circle", size: 50, type: "circle", index: nodes.length, color: randomColor(0.9, 0.9), super_node: curInd} }
  nodes.push(source);
  link_length = 100
  target = nodes[curInd]
  links.push({source, target, link_length});

  // link = svg.selectAll(".link").data(links, function (d) {
  //   return d.target.id;
  // });

  // link.exit().remove();

  // const linkEnter = link
  //   .enter()
  //   .append("line")
  //   .attr("class", "link")
  //   .style("stroke", "#000")
  //   .style("opacity", "0.2")
  //   .style("stroke-width", 2);

  // link = linkEnter.merge(link);

  node = svg.selectAll(".node").data(nodes, function (d) {
    return d.id;
  });

  node.exit().remove();

  nodeEnter = node
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("stroke", "#666")
    .attr("stroke-width", 2)
    .style("fill", d => d.data.color)
    .style("opacity", 0.8)
    .on("click", clicked)
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  nodeEnter
    .append("circle")
    .attr("r",0)
    .transition()
    .attr("r", function (d) {
      return d.data.size || 4.5;
    });

  nodeEnter.append("text")
    .text(function (d) {return d.data.name;})
    .attr("text-anchor", "middle")
    .style("font-size", "1px")
    // .each(getSize)
    .style("font-size", function(d) { return 15 + "px"; });

  document.getElementById('index').value = source.data.index
  document.getElementById('username').value = source.data.name


  document.getElementById('circles_list_label_1').style.display='none'
  document.getElementById('circles_list_1').style.display='none'
  document.getElementById('circles_list_label_2').style.display='none'
  document.getElementById('circles_list_2').style.display='none'
  document.getElementById('member_name').style.display='none'
  document.getElementById('actions').style.display='block'
  document.getElementById('circle_name').style.display='block'
  document.getElementById('addmem').style.display='block'
  document.getElementById('addcirc').style.display='block'
  document.getElementById('circles_list_label_1').style.display='none'

  node = nodeEnter.merge(node);
  simulation.nodes(nodes);
  simulation.force("link").links(links);
  simulation.alpha(0.05).restart();
}

function add_member(){
  curInd = document.getElementById('index').value
  source = { data: { name: "Member", size: 15, type: "circle", index: nodes.length, color: randomColor(0.9, 0.9), parent_node: curInd } }
  nodes.push(source);
  link_length = 50
  target = nodes[curInd]
  links.push({source, target, link_length});

  link = svg.selectAll(".link").data(links, function (d) {
    return d.target.id;
  });

  link.exit().remove();

  const linkEnter = link
    .enter()
    .append("line")
    .attr("class", "link")
    .style("stroke", "#000")
    .style("opacity", "0.2")
    .style("stroke-width", 2);

  link = linkEnter.merge(link);

  node = svg.selectAll(".node").data(nodes, function (d) {
    return d.id;
  });

  node.exit().remove();

  nodeEnter = node
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("stroke", "#666")
    .attr("stroke-width", 2)
    .style("fill", d => d.data.color)
    .style("opacity", 1)
    .on("click", clicked)
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  nodeEnter
    .append("circle")
    .attr("r",0)
    .transition()
    .attr("r", function (d) {
      return d.data.size || 4.5;
    });

  nodeEnter.append("text")
    .text(function (d) {return d.data.name;})
    .attr("text-anchor", "middle")
    .style("font-size", "1px")
    // .each(getSize)
    .style("font-size", function(d) { return 15 + "px"; });

  document.getElementById('index').value = source.data.index
  document.getElementById('username').value = source.data.name

  circle_1 = ''
  for (var i = 0; i < nodes.length; i++){
    if (!('parent_node' in nodes[i].data)){
      circle_1+='<option value="'+i+'">'+nodes[i].data.name+'</option>'
    }
  }

  circle_2 = '<option value="-1">None</option>'
  for (var i = 0; i < nodes.length; i++){
    if (!('parent_node' in nodes[i].data) && nodes[i].data.super_node==source.data.parent_node){
      circle_2+='<option value="'+i+'">'+nodes[i].data.name+'</option>'
    }
  }
  if ('super_node' in nodes[source.data.parent_node].data){
    super_node = nodes[source.data.parent_node].data.super_node
    circle_2+='<option value="'+super_node+'">'+nodes[super_node].data.name+'</option>'
  }

  document.getElementById('circles_list_1').innerHTML = circle_1
  document.getElementById('circles_list_1').value=source.data.parent_node;
  document.getElementById('circles_list_2').innerHTML = circle_2
  if ('child_node' in source.data){
    document.getElementById('circles_list_2').value=source.data.child_node;
  } else {
    document.getElementById('circles_list_2').value=-1
  }


  document.getElementById('circles_list_label_1').style.display='block'
  document.getElementById('circles_list_1').style.display='block'
  document.getElementById('circles_list_label_2').style.display='block'
  document.getElementById('circles_list_2').style.display='block'
  document.getElementById('member_name').style.display='block'
  document.getElementById('actions').style.display='none'
  document.getElementById('circle_name').style.display='none'
  document.getElementById('addmem').style.display='none'
  document.getElementById('addcirc').style.display='none'

  node = nodeEnter.merge(node);
  simulation.nodes(nodes);
  simulation.force("link").links(links);
  simulation.alpha(0.05).restart();
}

function circlelist_change(which){
  curInd = document.getElementById('index').value
  if(which==1){
    to_add = document.getElementById('circles_list_1').value
    old_one = nodes[curInd].data.parent_node
    nodes[curInd].data.parent_node = to_add
  } else {
    to_add = document.getElementById('circles_list_2').value
    old_one = nodes[curInd].data.child_node
    if (to_add == -1){
      delete nodes[curInd].data.child_node
    } else {
      nodes[curInd].data.child_node = to_add
    }
  }

  for (var i = links.length - 1; i >= 0; i--) {
    if ((links[i].source.data.index == curInd || links[i].target.data.index == curInd) && (links[i].source.data.index == old_one || links[i].target.data.index == old_one) ) {
      links.splice(i, 1);
    }
  }

  if (to_add != -1){
    link_length = 50

    source = nodes[curInd]
    target = nodes[to_add]
    links.push({source, target, link_length});
  }

  link = svg.selectAll(".link").data(links, function (d) {
    return d.target.id;
  });

  link.exit().remove();

  const linkEnter = link
    .enter()
    .append("line")
    .attr("class", "link")
    .style("stroke", "#000")
    .style("opacity", "0.2")
    .style("stroke-width", 2);

  link = linkEnter.merge(link);

  simulation.nodes(nodes);
  simulation.force("link").links(links);
  simulation.alpha(0.05).restart();
}

function download() {

  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify({'nodes': nodes, 'links': links})));
  element.setAttribute('download', "circle_builder_data.json");

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function delete_node(){
  curInd = document.getElementById('index').value
  if (curInd != 0){
    ind_list = []
    console.log(curInd)
    for (var i = links.length - 1; i >= 0; i--) {
      console.log(links[i].source.data.index + ' ' + links[i].target.data.index)
      if ((links[i].source.data.index == curInd || links[i].target.data.index == curInd)) {
        ind_list.push(i)
      }
    }
    console.log(ind_list)
    if (ind_list.length!=1 && nodes[curInd].data.size==50){
      alert("can only delete circles that don't have any subcircles or members")
    } else {
      for (i in ind_list){
        links.splice(i, 1);
      }

      nodes.splice(curInd,1)


      node = svg.selectAll(".node").data(nodes, function (d) {
        return d.id;
      });

      node.exit().remove();

      nodeEnter = node
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("stroke", "#666")
        .attr("stroke-width", 2)
        .style("fill", d => d.data.color)
        .style("opacity", 1)
        .on("click", clicked)
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

      nodeEnter
        .append("circle")
        .attr("r",0)
        .transition()
        .attr("r", function (d) {
          return d.data.size || 4.5;
        });

      nodeEnter.append("text")
        .text(function (d) {return d.data.name;})
        .attr("text-anchor", "middle")
        .style("font-size", "1px")
        // .each(getSize)
        .style("font-size", function(d) { return 15 + "px"; });
      node = nodeEnter.merge(node);
      simulation.nodes(nodes);
      simulation.force("link").links(links);
      simulation.alpha(0.05).restart();
    }
  }
}