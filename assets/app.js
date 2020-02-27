$(function() {
	CIRCLES.init();
});
var CIRCLES = {
	crosspoints: [0,0,0],
	crossareas:  [0,0,0],
	C: circles_data,
	intersectionResult: function(){
		var cA = this.C.C1;
		var cB = this.C.C2;
		var cC = this.C.C3;

		var res1 = this.getIntersectionDots(cA.x,cA.y,cA.r,cB.x,cB.y,cB.r);
		var are1 = this.getIntersectionArea(cA.x,cA.y,cA.r,cB.x,cB.y,cB.r);

		var res2 = this.getIntersectionDots(cA.x,cA.y,cA.r,cC.x,cC.y,cC.r);
		var are2 = this.getIntersectionArea(cA.x,cA.y,cA.r,cC.x,cC.y,cC.r);

		var res3 = this.getIntersectionDots(cB.x,cB.y,cB.r,cC.x,cC.y,cC.r);
		var are3 = this.getIntersectionArea(cB.x,cB.y,cB.r,cC.x,cC.y,cC.r);

		this.crosspoints = [res1,res2,res3];
		this.crossareas  = [are1,are2,are3];
		this.updateUiElements();
	},
	superIntersection: function(){
		/* Intersection of 3 circles, low performance 10000 eterations method */
		var point1 = CIRCLES.C.C1,
			point2 = CIRCLES.C.C2,
			point3 = CIRCLES.C.C3,
			r1 = CIRCLES.C.C1.r,
			r2 = CIRCLES.C.C2.r,
			r3 = CIRCLES.C.C3.r;

		// determine bounding rectangle
		var left   = Math.min(point1.x - r1, point2.x - r2, point3.x - r3);
		var right  = Math.max(point1.x + r1, point2.x + r2, point3.x + r3);
		var top    = Math.min(point1.y - r1, point2.y - r2, point3.y - r3);
		var bottom = Math.max(point1.y + r1, point2.y + r2, point3.y + r3);

		// area of bounding rectangle
		var rectArea = (right - left) * (bottom - top);

		var iterations = 10000;
		var pts = 0;
		for (i=0; i<iterations; i++) {

		// random point coordinates
		var x = left + Math.random() * (right - left);
		var y = top  + Math.random() * (bottom - top);

		// check if it is inside all the three circles (the intersecting area)
		if (Math.sqrt(Math.pow(x - point1.x, 2) + Math.pow(y - point1.y, 2)) <= r1 &&
			Math.sqrt(Math.pow(x - point2.x, 2) + Math.pow(y - point2.y, 2)) <= r2 &&
			Math.sqrt(Math.pow(x - point3.x, 2) + Math.pow(y - point3.y, 2)) <= r3)
		  pts++;
		}

		// the ratio of points inside the intersecting area will converge to the ratio
		// of the area of the bounding rectangle and the intersection
		return pts / iterations * rectArea;
	},
	getIntersectionDots: function(x0, y0, r0, x1, y1, r1) {
		var a, dx, dy, d, h, rx, ry;
		var x2, y2;
		/* dx and dy are the vertical and horizontal distances between the circle centers. */
		dx = x1 - x0;
		dy = y1 - y0;
		/* Determine the straight-line distance between the centers. */
		d = Math.sqrt((dy*dy) + (dx*dx));
		/* Check for solvability. */
		if (d > (r0 + r1)) {
			/* circles do not intersect. */
			return false;
		}
		if (d < Math.abs(r0 - r1)) {
			/* one circle is contained in the other */
			return false;
		}
		/* 'point 2' is the point where the line through the circle intersection points crosses the line between the circle centers.  */
		/* Determine the distance from point 0 to point 2. */
		a = ((r0*r0) - (r1*r1) + (d*d)) / (2.0 * d) ;
		/* Determine the coordinates of point 2. */
		x2 = x0 + (dx * a/d);
		y2 = y0 + (dy * a/d);
		/* Determine the distance from point 2 to either of the intersection points. */
		h = Math.sqrt((r0*r0) - (a*a));
		/* Now determine the offsets of the intersection points from point 2. */
		rx = -dy * (h/d);
		ry = dx * (h/d);

		/* Determine the absolute intersection points. */
		var xi = x2 + rx;
		var xi_prime = x2 - rx;
		var yi = y2 + ry;
		var yi_prime = y2 - ry;

		return [xi, xi_prime, yi, yi_prime];1
	},
	getIntersectionArea: function(x0, y0, r0, x1, y1, r1) {
		var rr0 = r0 * r0;
		var rr1 = r1 * r1;
		var d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
		// Circles do not overlap
		if (d > r1 + r0) {return 0;}
		// Circle1 is completely inside circle0
		else if (d <= Math.abs(r0 - r1) && r0 >= r1) {return Math.PI * rr1;}
		// Circle0 is completely inside circle1
		else if (d <= Math.abs(r0 - r1) && r0 < r1) {return Math.PI * rr0;}
		// Circles partially overlap
		else {
			var phi = (Math.acos((rr0 + (d * d) - rr1) / (2 * r0 * d))) * 2;
			var theta = (Math.acos((rr1 + (d * d) - rr0) / (2 * r1 * d))) * 2;
			var area1 = 0.5 * theta * rr1 - 0.5 * rr1 * Math.sin(theta);
			var area2 = 0.5 * phi * rr0 - 0.5 * rr0 * Math.sin(phi);
			// Return area of intersection
			return area1 + area2;
		}
	},
	triangleAreaValue: 0,
	triangleArea: function(){
		var aX = parseInt(CIRCLES.C.C1.x),
			aY = parseInt(CIRCLES.C.C1.y),
			bX = parseInt(CIRCLES.C.C2.x),
			bY = parseInt(CIRCLES.C.C2.y),
			cX = parseInt(CIRCLES.C.C3.x),
			cY = parseInt(CIRCLES.C.C3.y);
		var res = Math.abs(((aX * (bY - cY) + bX * (cY - aY) + cX * (aY - bY))) / 2);
		CIRCLES.triangleAreaValue = res;
		return res;
	},
	getReport: function(){
		var coeff = 100*15.5;
		/* Areas HTML report */
		var html = '';
		html += 'Points: <strong>' + (CIRCLES.maxPoints - CIRCLES.usedPoints)/multiplier + ' / ' + CIRCLES.maxPoints/multiplier + '</strong>';
		html += '<h2>CBE</h2>';
		for(var c in CIRCLES.C) { 
			var cir = CIRCLES.C[c];
			html += '<strong style="color:'+cir.color+'">'+cir.name+':</strong> '+cir.r/multiplier+'<br/>'; //parseInt(cir.r * cir.r * Math.PI,10)
		}

		/* Intersections HTML report */
		html += '<h2>Parameters</h2>';

		//Add triangle area
		html += '<strong style="color:purple"><strong>RANGE</strong>:</strong> '+parseFloat(CIRCLES.triangleAreaValue/coeff).toFixed(0)+'<br/>'; //parseInt(cir.r * cir.r * Math.PI,10)
		//intersection areas
		for (i=0;i<CIRCLES.crossareas.length;i++) {
			html += '<strong>ABILITY '+(i+1)+':</strong> ' + parseFloat(CIRCLES.crossareas[i]/coeff).toFixed(0) + '<br/>';
		}
		var super_intersection = CIRCLES.superIntersection() * multiplier;
		html += '<strong style="color:#1a6ef8">SUPER POWER:</strong> ' + parseFloat(super_intersection/coeff).toFixed(0) + '<br/>';
		//return html;
		$('#log').html(html);
	},
	dragUpdate: function(circle,y,x){
		CIRCLES.C[circle].y = y;
		CIRCLES.C[circle].x = x;
		this.intersectionResult();
	},

	updateUiElements: function(){
		this.triangleArea();
		this.svg.update();
		this.getReport();
	},
	svg: {
		update: function(initial){
			var svgcircles = CIRCLES.svg.getCircles();
			var svgtriangle = CIRCLES.svg.getMiddleTriangle();
			var svgpoints = CIRCLES.svg.getCrosspoints();
			$('#circles_extras').html(svgtriangle + svgpoints); //redaraw points and triangles
			if(initial) {
				/* main circles draw only once, since they are draggable */
				$('#circles_main').html(svgcircles);
			}
		},
		getMiddleTriangle: function(){
			//ADD TRIANGLE FROM CENTERS
			var points = '';
			for(var c in CIRCLES.C) { 
				var cir = CIRCLES.C[c];
				points += parseInt(cir.x, 10) + ',' + parseInt(cir.y,10) + ' ';
			}
			return '<polygon points="'+points+'" />';
		},
		getCircles: function(){
			var ciclesHTML = '';
			for(var c in CIRCLES.C) { 
				var cir = CIRCLES.C[c];
				ciclesHTML += '<circle id="'+cir.id+'" class="cir" cy="'+cir.y+'" cx="'+cir.x+'" r="'+cir.r+'" stroke="white" stroke-width="2" fill="'+cir.color+'" />'
			}
			return ciclesHTML;
		},
		getCrosspoints: function(){
			var crosspoints = '';
			for (i=0;i<CIRCLES.crosspoints.length;i++) {
				if (CIRCLES.crosspoints[i]) {
					crosspoints += '<circle id="scp'+i+'1" class="point" cy="'+CIRCLES.crosspoints[i][2]+'" cx="'+CIRCLES.crosspoints[i][0]+'" r="3" stroke="white" stroke-width="1" fill="black" />'
					crosspoints += '<circle id="scp'+i+'2" class="point" cy="'+CIRCLES.crosspoints[i][3]+'" cx="'+CIRCLES.crosspoints[i][1]+'" r="3" stroke="white" stroke-width="1" fill="black" />'
				}

			}
			return crosspoints;
		}
	},
	maxPoints: 0,
	usedPoints: 0,
	updateDom: function(initial){
		this.svg.update(initial);
		this.usedPoints = (CIRCLES.C.C1.r + CIRCLES.C.C2.r + CIRCLES.C.C3.r);
		this.getReport();
		//CREATING & UPDATING ELEMENTS
		if(initial) {
			this.maxPoints = (this.usedPoints + 0);
			for(var c in CIRCLES.C) { 
				var cir = CIRCLES.C[c];
				this.initSliderControl(cir);
			}
		}
	},
	initSliderControl: function(cir) {
		 //init SLIDERs and it's callbacks - to change values
		var controls = '<div id="'+cir.id+'Rt" class="slider-text"></div><div id="'+cir.id+'R"></div>';
		$('#conrol').append(controls);
		$('#'+cir.id+'Rt').html('<span>'+cir.min/multiplier+'</span><span>'+cir.name+'</span><span>'+(cir.r/multiplier)+'</span>');
		$('#'+cir.id+'R').data('id',cir.id).slider({
			min: cir.min,
			max: cir.r,
			step: multiplier,
			value: cir.r,
			slide: function( event, ui ) {
				var id = $(this).data('id');
				var cir = CIRCLES.C[id];
				var prev = cir.r;
				cir.r = ui.value;

				var diff = cir.r - prev;
				cir.x = cir.x + diff;
				cir.y = cir.y + diff;
				$('#'+cir.id).attr("cx",cir.x + diff).attr("cy",cir.y + diff).attr("r",cir.r);
				CIRCLES.updateDom();
				CIRCLES.intersectionResult();
			},
			change: function(){
				for(var c in CIRCLES.C) { 
					var cir = CIRCLES.C[c];
					var max = cir.r + (CIRCLES.maxPoints - CIRCLES.usedPoints);
					$('#'+cir.id+'R').slider( "option", "max", max);
					$('#'+cir.id+'Rt').html('<span>'+cir.min/multiplier+'</span><span>'+cir.name+'</span><span>'+(max/multiplier)+'</span>');
				}
			}
		});
	},
	init: function(){
		this.updateDom(true);
		//binding events
		for(var c in CIRCLES.C) { 
			var cir = CIRCLES.C[c];
			//ADD draggable
			$('#'+cir.id).data('id',cir.id).draggable({
				drag: function(event, ui) {
					var id = $(this).data('id'),	//circle ID
						cr = CIRCLES.C[id],			//circle data
						rd = cr.r,					//radius
						ps = ui.position,			//new coordinates
						x = ui.position.top  + rd,	//new circle center x
						y = ui.position.left + rd;	//new circle center y
					//update SVG on drag
					event.target.setAttribute('cx', ui.position.left  + rd);
					event.target.setAttribute('cy', ui.position.top  + rd);
					//callback on drag
					CIRCLES.dragUpdate(id,x,y);
				}
			});
		}
	}
}