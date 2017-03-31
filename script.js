var renderBubbles = function(container_id, data, mouseClickCallback){

	d3.selection.prototype.moveToFront = function() {
	  return this.each(function(){
	    this.parentNode.appendChild(this);
	  });
	};

	d3.selection.prototype.moveToBack = function() { 
    return this.each(function() { 
        var firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
    }); 
};

	var bbox = d3.select(container_id).node().getBoundingClientRect()
	var width = bbox.width
	var height = bbox.height

	var color = d3.scaleOrdinal(d3.schemeCategory20c);

	var root = d3.hierarchy(data)
				.sum(function(d) { return d.z; })

	var pack = d3.pack().size([width,height]);

	var canvas = d3.select(container_id)
	  .append("svg:svg")
	  .attr('width', width)
	  .attr('height', height);

	var node = canvas.selectAll(".node")
	    .data(pack(root).leaves())
	    .enter().append("g")
	      .attr("class", "node")
	      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	        .on("click", function(d,i,evt) {
	        	var node = this;
	         	var selectedNode = d3.select(node);

	         	// If shift key not pressed and user selects an active node, 
	         	// restore to default
        		if (!d3.event.shiftKey && d.is_active) {
        			reset_all()
        			restore_opacity()
        			restore_size()
        			return
        		}

				// If shift is not held and user selects an inactive node set.
		        // clear all active nodes
	        	if (!d3.event.shiftKey && !d.is_active) {
	        		reset_all()
	        	}

	        	// This allows deselection if shift is held
	        	if (d.is_active){
	        		d.is_active = false;	
	        		selectedNode.moveToBack()
	        	} 
	        	else{
	        		d.is_active = true;	
	        		selectedNode.moveToFront()
	        	}

         		// Fade out all other nodes
         		d3.selectAll('.node')
         			.transition()
         			.duration(130)
         			.style('opacity',function (d) {
         				return (d.is_active) ? 1 : 0.4
    				});
				
         		d3.selectAll('circle').transition()
         			.ease(d3.easeElastic)
         			.delay(0)
         			.duration(800)
         			.attr('r',function (d) {
         				return (d.is_active ) ? d.r * 1.05 : d.r;
			  		 })
			     })

	        // Fire user event
	        .on("click.user", mouseClickCallback)

	// Add all circles
	node.append("circle")
	    .attr('r', function(d) { return d.r; })
	  	.style("fill", function(d,i) { return color(i); })
	    .attr('stroke', 'grey')
	
	// Add text box
	node.append("clipPath")
	      .attr("id", function(d) {return "clip-" + d.data.country; })
	    .append("use")
	      .attr("xlink:href", function(d) { return "#" + d.data.country; })
    
    // Add text
	node.append("text")
	     .attr("text-anchor", "middle")
	     .attr("class", "bubble_text")
	     .style("font-size", function(d) {return Math.max(10, d.r/4) + "px"})
	     .text(function(d) {
	       return d.data.country;
	  })


	 function reset_all(){
	 	d3.selectAll('.node').each(function(dd){dd.is_active = false})
	 }

	 function restore_opacity(){
	 	d3.selectAll('.node')
 			.transition()
 			.duration(130)
 			.style('opacity',1);
	 }
	
	function restore_size(){
	 	d3.selectAll('circle').transition()
 			.ease(d3.easeElastic)
 			.delay(0)
 			.duration(800)
 			.attr('r',function (d){return d.r;})
     }

     
}
// ================================================================================
// ------------------------------------Demo----------------------------------------
// ================================================================================

var data = {
  name: "root",
  children: [
    {z: 13.8, name: 'BE',country: 'Belgium'},
    {z: 4.7, name: 'DE',country: 'Germany'},
    {z: 15.8, name: 'FI',country: 'Finland'},
    {z: 12, name: 'NL',country: 'Netherlands'},
    {z: 11.8, name: 'SE',country: 'Sweden'},
    {z: 16.6, name: 'ES',country: 'Spain'},
    {z: 14.5, name: 'FR',country: 'France'},
    {z: 10, name: 'NO',country: 'Norway'},
    {z: 204.7, name: 'UK',country: 'UnitedKingdom'},
    {z: 10.4, name: 'IT',country: 'Italy'},
    {z: 16, name: 'RU',country: 'Russia'},
    {z: 35.3, name: 'US',country: 'UnitedStates'},
    {z: 28.5, name: 'HU',country: 'Hungary'},
    {z: 15.4, name: 'PT',country: 'Portugal'},
    {z: 31.3, name: 'NZ',country: 'NewZealand'
    }
   ]
}


// Use text class '.bubble_text' to style text 
// eg:
// .bubble_text {
//      fill: blue;
//      font-family: Helvetica;
// }

