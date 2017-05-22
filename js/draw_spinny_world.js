var width = 150,
    height = 150;

var radius = height / 2 - 5,
    scale = radius,
    velocity = 0.03;

var projection = d3.geoOrthographic()
    .translate([width / 2, height / 2])
    .scale(scale)
    .clipAngle(90);

var canvas = d3.select("#spinny-world").append("canvas")
    .attr("width", width)
    .attr("height", height);

var context = canvas.node().getContext("2d");

var path = d3.geoPath()
    .projection(projection)
    .context(context);
d3.json("./data/spinny-world.json", function(error, world) {
    if (error) throw error;

    var land = topojson.feature(world, world.objects.countries);
    var borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });
    d3.timer(function(elapsed) {
        context.clearRect(0, 0, width, height);

        projection.rotate([velocity * elapsed, 0]);
        var globe = {type: "Sphere"};
        context.beginPath();
        context.fillStyle = "#4591f5";
        path(land);
        context.fill();
        var top_attacker = [392, 12, 276, 180, 156, 124, 76];
        for (var i = 0; i < land.features.length; i++) {
            if(top_attacker.indexOf(land.features[i].id) > -1) {
                context.fillStyle = "#12f7ff", 
                context.beginPath(), 
                path(land.features[i]), 
                context.fill();
            } 
        }
        context.strokeStyle = "#4591f5", 
        context.lineWidth = .5, 
        context.beginPath(), 
        path(borders), 
        context.stroke();
        context.strokeStyle = "#4591f5", 
        context.lineWidth = 1, 
        context.beginPath(), 
        path(globe), 
        context.stroke();
    });

});

d3.select(self.frameElement).style("height", height + "px");