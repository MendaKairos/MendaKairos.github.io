var Ant = {
    _x: 0,
    _y: 0,
    dir: 0,
    color: 0,
    track: 0,
    life: 0,
    foundFood: false,
    hill_x: 0,
    hill_y: 0,

    create: function (x, y, dir, hill_x, hill_y) {
        var obj = Object.create(this);
        obj._x = x;
        obj._y = y;
        obj.dir = dir;
        obj.color = (255 / 3) | 0;
        obj.track = parseInt("ff0000", 16);
        obj.foundFood = false;
        obj.hill_x = hill_x;
        obj.hill_y = hill_y;
        return obj;
    },

    sensor: function (
        g,
        s,
        gird,
        width,
        height,
        sensorAngle,
        DistanceFromBody,
        radius
    ) {
        //returns color
        var toReturn = 0;
        var x =
            Math.cos(((this.dir + sensorAngle) * Math.PI) / 180) *
                DistanceFromBody +
            this._x;
        var y =
            Math.sin(((this.dir + sensorAngle) * Math.PI) / 180) *
                DistanceFromBody +
            this._y;

        g.fillStyle = "#FF00FF";
        //
        for (var i = x - radius; i <= x + radius; i++) {
            for (var j = y - radius; j <= y + radius; j++) {
                /* If the pixel is outside the canvas, skip it */
                if (j < 0 || j >= height || i < 0 || i >= width) continue;
                /* Get the color from the image, add to a running sum */
                toReturn +=
                    gird[(i | 0) + ((width / s) | 0) * (j | 0)] &
                    parseInt(this.track, 16);

                //gird[(i | 0) + ((width / s) | 0) * (j | 0)]=parseInt("FF00FF", 16);
                // g.fillRect(i * s, j * s, s, s);
            }
        }

        return toReturn;
    },

    update: function (g, s, gird, Enviorment, width, height, count, obsticles) {
        var angle = 35,
            distance = 10,
            radius = 3;
        var rightSensor = this.sensor(
            g,
            s,
            gird,
            width,
            height,
            angle,
            distance,
            radius
        );
        var forwardSensor = this.sensor(
            g,
            s,
            gird,
            width,
            height,
            0,
            distance,
            radius
        );
        var leftSensor = this.sensor(
            g,
            s,
            gird,
            width,
            height,
            -angle,
            distance,
            radius
        );
        // console.log(this._x,this._y,rightSensor,forwardSensor,leftSensor);

        if (forwardSensor > leftSensor && forwardSensor > rightSensor) {
        } else if (rightSensor == leftSensor) {
            var turn = Math.random() > 0.5 ? -1 : 1;
            this.dir += turn * 10;
        } else if (rightSensor > leftSensor) {
            this.dir += 5;
            //console.log("right");
        } else if (rightSensor < leftSensor) {
            this.dir -= 5;
            //console.log("left");
        }

        // if (Math.random() < 0.5) {
        //     var turn = Math.random() > 0.5 ? -1 : 1;
        //     this.dir += turn * 5;
        // }
        this._x += Math.cos((this.dir * Math.PI) / 180);
        this._y += Math.sin((this.dir * Math.PI) / 180);
        if (obsticles[(this._x | 0) + ((width / s) | 0) * (this._y | 0)]) {
            this._x -= Math.cos((this.dir * Math.PI) / 180);
            this._y -= Math.sin((this.dir * Math.PI) / 180);
            this.dir = Math.random() * 360;
        }

        if (
            this._x < 0 ||
            this._x > width / s - 1 ||
            this._y < 0 ||
            this._y > height / s
        ) {
            // this._x = width/s;

            this._x = this.hill_x;
            this._y = this.hill_y;

            this.color = (255 / 2) | 0; //parseInt("ff", 16);
            this.track = parseInt("ff0000", 16);
            this.foundFood = false;
            // this.dir=Math.atan2(y2-y1,x2-x1)*(180/Math.PI);
            //count.food++;
            this.life = 0;
            this.dir = Math.random() * 360;
        }
        // if (this._x > width/s ){//|| this._x > width || this._y < 0 || this._y > height) {
        //     this._x = 0;
        // }
        // if (this._y < 0 ){//|| this._x > width || this._y < 0 || this._y > height) {
        //     this._y = height/s;
        // }
        // if (this._y > height/s){//|| this._x > width || this._y < 0 || this._y > height) {
        //     this._y = 0;
        // }

        var x1 = this._x,
            y1 = this._y,
            x2 = this.hill_x,
            y2 = this.hill_y;
        var length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

        var displayColor = this.color;
        this.life++;
        if (this.foundFood == false) {
            // displayColor= (this.color-
            //     length );

            if (
                Enviorment[(this._x | 0) + ((width / s) | 0) * (this._y | 0)] >
                0
            ) {
                Enviorment[
                    (this._x | 0) + ((width / s) | 0) * (this._y | 0)
                ] -= 1;
                this.color = parseInt("ff0000", 16);
                this.track = parseInt("ff", 16);
                this.foundFood = true;
                this.life = 0;
                this.dir = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
            }
        } else if (this.foundFood == true) {
            //displayColor= (this.color-(this.life<255?this.life<<16:parseInt("ff0000", 16)));

            //this.dir+=(Math.atan2(y2-y1,x2-x1)*(180/Math.PI)-this.dir)%360>180?+5:-5;

            if (length < 5) {
                this.color = (255 / 2) | 0; //.color=parseInt("ff", 16);
                this.track = parseInt("ff0000", 16);
                this.foundFood = false;
                count.food++;
                this.dir = Math.random() * 360;
                this.life = 0;
            }
        }
        //Enviorment[(this._x | 0) + ((width / s) | 0) * (this._y | 0)]=3;
        gird[(this._x | 0) + ((width / s) | 0) * (this._y | 0)] = displayColor;
    },
};
