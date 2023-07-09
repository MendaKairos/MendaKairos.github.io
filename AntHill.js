window.onload = function () {
    window.addEventListener("click", myScript);
    function myScript() {
        // requestAnimationFrame(update);
        gird = [];
        for (var i = 0; i < (width / s) * (height / s); i++) {
            var hex = parseInt("FFFFFF", 16);
            var r = 0; //hex*Math.random();
            //console.log(toHexString(r));
            gird.push(r);
        }
    }

    var canvas = document.getElementById("canvas"),
        g = canvas.getContext("2d"),
        width = (canvas.width = window.innerWidth),
        height = (canvas.height = window.innerHeight);

    var gird = [];
    var gird2 = [];
    var Enviorment = [];
    var obsticles = [];
    var s = 10;
    var agent = [];
    var agNum = 500;

    // for (var i = 0; i < agNum; i++) {
    //     var angle = Math.random() * 360
    //     var choice = Math.random() < 0.5;
    //     console.log(choice);
    //     agent.push(Ant.create(
    //         (width / s / 2)/* + Math.cos(angle * Math.PI / 180) * (height / s / 4)*/,
    //         (height / s / 2)/* + Math.sin(angle * Math.PI / 180) * (height / s / 4)*/,
    //         angle));//(Math.random()*parseInt("FFFFFF", 16)).toString(16)));
    // }
    console.log(((width / s) | 0) + "," + ((height / s) | 0));

    var foodamount = 20;

    for (var i = 0; i < (width / s) * (height / s); i++) {
        var hex = parseInt("FFFFFF", 16);
        var r = 0; //hex*Math.random();
        //console.log(toHexString(r));
        gird.push(r);
        Enviorment.push(0); //Math.random()<0.1?foodamount:0);
        obsticles.push(0);
    }

    var foodamount = 5;
    var count = { food: 0 };
    for (var x = 0; x < 80; x++) {
        for (var y = 0; y < height / s - 1; y++) {
            Enviorment[x + ((width / s) | 0) * y] = foodamount;
            //obsticles[x+((width / s/2 -10) | 0) + ((width / s) | 0) * y]=1;
        }
    }

    // for (var x = 0; x < 10; x++) {
    //     for (var y = -5; y < 5; y++) {
    //         obsticles[x+((width / s/2 -10) | 0) + ((width / s) | 0) * ((height/s/2-10+y)|0)]=0;
    //     }
    // }
    // for (var x = 10; x < 20; x++) {
    //     for (var y = -5; y < 5; y++) {
    //         obsticles[x+((width / s/2 -10) | 0) + ((width / s) | 0) * ((height/s/2+10+y)|0)]=0;
    //     }
    // }
    // for (var x = 5; x < 15; x++) {
    //     for (var y = -5; y < 25; y++) {
    //         obsticles[x+((width / s/2 -10) | 0) + ((width / s) | 0) * ((height/s/2-10+y)|0)]=0;
    //     }
    // }

    var hill_x = width / s - 10,
        hill_y = height / s / 2;

    //gird[-50+(gird.length/2)|0  ]=0;
    var col = parseInt("FF00", 16);
    var q = 0,
        w = 0,
        length = (height / s / 4) | 0,
        agnle = 0;
    update();
    function update() {
        console.log(count.food);
        if (agent.length < agNum) {
            var angle = Math.random() * 360;
            agent.push(
                Ant.create(
                    hill_x /* + Math.cos(angle * Math.PI / 180) * (height / s / 4)*/,
                    hill_y /* + Math.sin(angle * Math.PI / 180) * (height / s / 4)*/,
                    angle,
                    hill_x,
                    hill_y
                )
            ); //(Math.random()*parseInt("FFFFFF", 16)).toString(16)));
        }
        var radius = 2;
        for (var i = 0 - radius; i <= 0 + radius; i++) {
            for (var j = 0 - radius; j <= 0 + radius; j++) {
                gird[
                    ((hill_x + i) | 0) + ((width / s) | 0) * ((j + hill_y) | 0)
                ] = parseInt("FF", 16);
            }
        }

        for (var x = 0; x < ((width / s) | 0); x++) {
            for (var y = 0; y < ((height / s) | 0); y++) {
                var c = gird[x + ((width / s) | 0) * y];
                g.fillStyle = toHexString(c | 0);
                g.fillRect(x * s, y * s, s, s);
                gird2[x + ((width / s) | 0) * y] = colorTransform(gird, x, y);
            }
        }
        gird = gird2;
        gird2 = [];

        for (var i = 0; i < agent.length; i++) {
            agent[i].update(
                g,
                s,
                gird,
                Enviorment,
                width,
                height,
                count,
                obsticles
            );
        }
        for (var x = 0; x < ((width / s) | 0); x++) {
            for (var y = 0; y < ((height / s) | 0); y++) {
                if (Enviorment[x + ((width / s) | 0) * y]) {
                    g.fillStyle = toHexString(parseInt("FF00", 16));
                    if (Enviorment[x + ((width / s) | 0) * y] > 0) {
                        gird[x + ((width / s) | 0) * y] = parseInt(
                            "FF0000",
                            16
                        );
                    }
                    g.fillRect(x * s, y * s, s, s);
                }
                if (obsticles[x + ((width / s) | 0) * y]) {
                    g.fillStyle = "#888888";
                    g.fillRect(x * s, y * s, s, s);
                }
            }
        }

        requestAnimationFrame(update);
    }

    function colorTransform(arrayC, x, y) {
        var colors = averageColor(arrayC, x, y);
        // console.log(colors);
        var rate = -4; //-4
        var r = colors[0] + rate;
        var g = colors[1] + rate;
        var b = colors[2] + rate;

        if (b <= 0) b = 0;
        if (g <= 0) g = 0;
        if (r <= 0) r = 0;
        if (b >= 255) b = 255;
        if (g >= 255) g = 255;
        if (r >= 255) r = 255;
        var rgb = (r << 16) + (g << 8) + b;
        return rgb;
    }

    function getrgbComp(arrayC, index) {
        var col = arrayC[index];
        var b = col & 255;
        var g = (col >> 8) & 255;
        var r = col >> 16;
        return [r, g, b];
    }

    function averageColor(arrayC, x, y) {
        var w = (width / s) | 0;
        var h = (height / s) | 0;
        var r = 0,
            g = 0,
            b = 0,
            num = 0;
        var radius = 1;
        for (var i = x - radius; i <= x + radius; i++) {
            /* If the pixel is outside the canvas, skip it */
            if (i < 0 || i >= w) continue;
            /* Get the color from the image, add to a running sum */
            var c = getrgbComp(arrayC, i + w * y);
            r += c[0] * c[0];
            g += c[1] * c[1];
            b += c[2] * c[2];
            num++;
        }
        for (var j = y - radius; j <= y + radius; j++) {
            /* If the pixel is outside the canvas, skip it */
            if (j < 0 || j >= h) continue;
            /* Get the color from the image, add to a running sum */
            var c = getrgbComp(arrayC, x + w * j);
            r += c[0] * c[0];
            g += c[1] * c[1];
            b += c[2] * c[2];
            num++;
        }
        return [Math.sqrt(r / num), Math.sqrt(g / num), Math.sqrt(b / num)];
        //return [(r / num) | 0,(g / num) | 0,(b / num) | 0];
    }

    function toHexString(dec) {
        var colorString = dec.toString(16);
        while (colorString.length < 6) {
            colorString = "0" + colorString;
        }

        return "#" + colorString;
    }
};
