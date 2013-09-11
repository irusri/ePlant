/* 
* @author     Chanaka Mannapperuma <irusri@gmail.com>
* @date       2013-08-20
* @version    Beta 1.0
* @usage      Expression view create new elements
* @licence    GNU GENERAL PUBLIC LICENSE
* @link       http://irusri.com
*/

//Create expressiontable
function createexpressiontable(data){
	removexpressiontable();
	if(private_mode=="relative"){
	var expressiontable = tabulate(data.popdata, ["sample", "log2fc"]);
	}else{
	var expressiontable = tabulate(data.popdata, ["sample", "log2"]);	
	}
	
	// uppercase the column headers
expressiontable.selectAll("thead th")
    .text(function(column) {
        return column.charAt(0).toUpperCase() + column.substr(1);
    });
	
// sort by age
expressiontable.selectAll("tbody tr")
    .sort(function(a, b) {
        return chanaka.descending(a.log2, b.log2);
    });
}
 

//Tabulate data table
function tabulate(data, columns) {
    var table = chanaka.select("#table_container").append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody")
		table.attr("id","hor-minimalist-a");
		

    // append the header row
  /*  thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
		.attr("scope","col")
            .text(function(column) { return column; });*/

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
            .text(function(d) { if(isNaN(d.value)==true){
				//return d.value;
				return d.value.charAt(0).toUpperCase() +  d.value.substr(1);
			}else{
				return roundNumber(d.value,2);
			}
			
			 });
    
    return table;
}
	
	


//Create main legend holder(g) to root SVG
function createlegendholder(w,h){
	var rootsvg = chanaka.select(document.getElementById("viz")).selectAll("svg")
	rootsvg.selectAll("g#legend").remove();
   	var legend_g=rootsvg.append("g")
	.attr('width', w)
	.attr('height', h)
 	.attr("id","legend");
}

//Create legend items to main legend holder
function createlegends(color,name,k){
	var legend = chanaka.select(document.getElementById("viz")).selectAll("svg").selectAll("g#legend")
	.attr('class', 'legend')
	.attr("transform", "translate(0,660)")
	legend.append('rect')
	.attr('x', 50)
	.attr('y', 10+k*20)
	.attr('width', 16)
	.attr('height', 16)
	.style('fill', color);
			 
	legend.append('text')
	.attr('x', 80)
	.attr('fill', "black")
	.attr("font-family", "sans-serif")
	
	.attr('y',24+k*20)
	.attr("font-family", "Georgia")
	.attr("font-size", "15px")
	.attr("font-style", "normal")
	.attr("font-variant", "normal")
	.attr("font-weight", "normal")
	.attr("text-rendering", "optimizeLegibility")
	.attr("shape-rendering", "default")
	.text(name);
			
}

//Remove root SVG
function removerootsvg(){
	chanaka.select(document.getElementById("viz")).selectAll("svg").remove();
}
//Remove root Expressiontable
function removexpressiontable(){
	chanaka.select(document.getElementById("table_container")).selectAll("table").remove();
}

//Create loading box
function progressbox(){
  var rootsvg = chanaka.select(document.getElementById("viz")).selectAll("svg");
	 rootsvg.selectAll("rect#animatebox").remove();
   var mySquare=rootsvg.append("rect")
   .attr("id","animatebox")
  .attr("x",0)
  .attr("y",0)
  .style("fill","#CCCCFF")
  .style("fill-opacity","0.9")
  .attr("width","100%")
  .attr("height","100%");

mySquare.transition()
  .duration(600)
  .delay(0)
  .attrTween("y", myTweenFunction ); 

function myTweenFunction(d, i, a) {
  console.log( a ); // returns 60, the current value (value at start)
  return chanaka.interpolate(a, 1400);
  
}

}