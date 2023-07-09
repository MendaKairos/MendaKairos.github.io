var Ant = {
    ant_x: 0,
    ant_y: 0,
    dir: 0, 
    px: 0,
    py: 0,
    stop:false,
    boxc: "#ffffff",
    create: function (x, y,dir) {
        var obj = Object.create(this);
        obj.ant_x = x;
        obj.ant_y = y;
        obj.dir = dir;
        return obj;
    },
    draw: function (g,gird,width,height,s) {
        if(!this.stop){
        g.fillStyle = this.boxc;
        g.fillRect(this.px * s, this.py * s, s, s);

        g.fillStyle = "#FF0000";

        var d = 0;

        if (gird[this.ant_x + (((width / s)|0) )* this.ant_y] == 0) {
            d = 1;
            gird[this.ant_x + (((width / s)|0) ) * this.ant_y] = 1;
            this.boxc = "#000000";
        } else {
            d = -1;
            gird[this.ant_x + (((width / s)|0) ) * this.ant_y] = 0;
            this.boxc = "#ffffff";
        }
        this.px = this.ant_x;
        this.py = this.ant_y;
        this.dir = (this.dir + d + 4) % 4;
        if (this.dir == 0) this.ant_x += 1;
        if (this.dir == 2) this.ant_x -= 1;
        if (this.dir == 1) this.ant_y += 1;
        if (this.dir == 3) this.ant_y -= 1;
        if(this.ant_x<2)this.stop=true;
        if(this.ant_x>width / s-2)this.stop=true;        
        if(this.ant_y<2)this.stop=true;
        if(this.ant_y>height / s-2)this.stop=true;
        
        g.fillRect(this.ant_x * s, this.ant_y * s, s, s);
    }
    },

};
