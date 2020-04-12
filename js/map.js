import Shader from "./shader.js";

export default class Map {

    constructor(options) {
        
        window.map = this;

        const _this = this;

        this._data = [];
        this._step = 0;

        this._tileUrl = `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`;

        this._map = L.map('map', {
            attributionControl: false
        });

        L.control.attribution({
            position: 'bottomleft'
        }).addTo(this._map);

        this._tileLayer = L.tileLayer(this._tileUrl, {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Data source from <a href="https://coronavirus.mash.ru">mash</a>',
            subdomains: 'abcd',
            r: '',
            maxZoom: 19
        });
        
        this._canvasOverlay = L.canvasOverlay();
        this._map.setView([options.lat, options.lon], options.zoom);
        this._tileLayer.addTo(this._map);
        this._canvasOverlay.addTo(this._map);
        this._canvas = this._canvasOverlay.canvas();

        const controlsContainer = document.querySelector('.leaflet-control-zoom a:last-child');
        const playButtonTpl = `<a class="leaflet-control-play" href="#" title="Play" role="button" aria-label="Play" data-state="pause">▶</a>`
        controlsContainer.insertAdjacentHTML('afterend', playButtonTpl);
        this._playButton = document.body.getElementsByClassName('leaflet-control-play')[0]
        this._playButton.addEventListener("click", function () {

            if (this.getAttribute('data-state') == 'pause') {
                _this.play();
                this.setAttribute('data-state', 'play');
            } else {
                _this.stop();
                this.setAttribute('data-state', 'pause');

            }

        });

        this._gl = this._canvas.getContext('experimental-webgl', {
            antialias: true
        });
        this._pixelsToWebGLMatrix = new Float32Array(16);
        this._mapMatrix = new Float32Array(16);

        const shader = new Shader();

        const vertexShader = this._gl.createShader(this._gl.VERTEX_SHADER);
        this._gl.shaderSource(vertexShader, shader.vertex);
        this._gl.compileShader(vertexShader);

        const fragmentShader = this._gl.createShader(this._gl.FRAGMENT_SHADER);
        this._gl.shaderSource(fragmentShader, shader.fragment);
        this._gl.compileShader(fragmentShader);

        const program = this._gl.createProgram();
        this._gl.attachShader(program, vertexShader);
        this._gl.attachShader(program, fragmentShader);
        this._gl.linkProgram(program);
        this._gl.useProgram(program);

        this._gl.blendFunc(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA);
        this._gl.enable(this._gl.BLEND);

        this._u_matLoc = this._gl.getUniformLocation(program, "u_matrix");
        this._colorLoc = this._gl.getAttribLocation(program, "a_color");

        this._vertLoc = this._gl.getAttribLocation(program, "a_vertex");
        this._gl.aPointSize = this._gl.getAttribLocation(program, "a_pointSize");

        this._pixelsToWebGLMatrix.set([2 / this._canvas.width, 0, 0, 0, 0, -2 / this._canvas.height, 0, 0, 0, 0, 0, 0, -1, 1, 0, 1]);
        this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);

        this._gl.uniformMatrix4fv(this._u_matLoc, false, this._pixelsToWebGLMatrix);



        return this;

    }

    setData(data) {
        
        const _this = this;
        
        this._data = (function(data){
            
            const cloneData = JSON.parse(JSON.stringify(data));
            const byDate = {};
            const result = [];
            let count = 0;
            
            for (var i = 0; i < cloneData.length; i++){
                
                if (!byDate[cloneData[i].date]) {
                    byDate[cloneData[i].date] = [];
                    count++;
                }
                
                byDate[cloneData[i].date].push(cloneData[i]);
                
            }
            
            let prev = null;
            
            for (var d in byDate ){
                
                result.push(byDate[d]);
                
            }
                        
            return result;
            
        })(data);
                
        this._step = this._data.length - 1;
        
        return this;

    }

    drawData(step, point) {

        this._verts = [];
        this._vertsLength = 0;
        
        this._step = (typeof step == 'number') ? step : this._step;
        this._point = (typeof point == 'number') ? point : null; 
        
        const _this = this;
        
        if (this._data) {
            
            for (var d = 0; d < this._data.length; d++) {
                
                
                if (d < this._step) {
                    
                    for (var i = 0; i < this._data[d].length; i++) {
                        
                        addPoint(_this, d, i)
                        
                    }
                    
                }
                
                if (d <= this._step) {
                    
                    for (var i = 0; i < this._data[d].length; i++) {
                        
                       
                        
                            if (i <= this._point){
                                
                                addPoint(_this, d, i)

                            }
                            
                        

                    }
                    
                }
                
                
                
            }
            
            function addPoint(_this, d, i) {
                
                const dot = _this._data[d][i].point;
                const pixel = LatLongToPixelXY(dot[0], dot[1]);
                const color = [1,0,0];

                _this._verts.push(pixel.x, pixel.y, color[0], color[1], color[2]);
                _this._vertsLength++;
                
            }
            

            const vertBuffer = this._gl.createBuffer();
            const vertArray = new Float32Array(this._verts);
            const fsize = vertArray.BYTES_PER_ELEMENT;

            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vertBuffer);
            this._gl.bufferData(this._gl.ARRAY_BUFFER, vertArray, this._gl.STATIC_DRAW);
            this._gl.vertexAttribPointer(this._vertLoc, 2, this._gl.FLOAT, false, fsize * 5, 0);
            this._gl.enableVertexAttribArray(this._vertLoc);
            
            this._gl.vertexAttribPointer(this._colorLoc, 3, this._gl.FLOAT, false, fsize * 5, fsize * 2);
            this._gl.enableVertexAttribArray(this._colorLoc);

            this._canvasOverlay.drawing(drawingOnCanvas);

            this._canvasOverlay.redraw();

        }

        function drawingOnCanvas(canvasOverlay, params) {

            _this._gl.clear(_this._gl.COLOR_BUFFER_BIT);

            _this._pixelsToWebGLMatrix.set([2 / _this._canvas.width, 0, 0, 0, 0, -2 / _this._canvas.height, 0, 0, 0, 0, 0, 0, -1, 1, 0, 1]);
            _this._gl.viewport(0, 0, _this._canvas.width, _this._canvas.height);

            const pointSize = Math.max(_this._map.getZoom() - 4.0, 1.0);

            _this._gl.vertexAttrib1f(_this._gl.aPointSize, pointSize);

            _this._mapMatrix.set(_this._pixelsToWebGLMatrix);

            const bounds = _this._map.getBounds();
            const topLeft = new L.LatLng(bounds.getNorth(), bounds.getWest());
            const offset = LatLongToPixelXY(topLeft.lat, topLeft.lng);

            var scale = Math.pow(2, _this._map.getZoom());
            scaleMatrix(_this._mapMatrix, scale, scale);

            translateMatrix(_this._mapMatrix, -offset.x, -offset.y);

            _this._gl.uniformMatrix4fv(_this._u_matLoc, false, _this._mapMatrix);
            _this._gl.drawArrays(_this._gl.POINTS, 0, _this._vertsLength);


            function translateMatrix(matrix, tx, ty) {
                
                matrix[12] += matrix[0] * tx + matrix[4] * ty;
                matrix[13] += matrix[1] * tx + matrix[5] * ty;
                matrix[14] += matrix[2] * tx + matrix[6] * ty;
                matrix[15] += matrix[3] * tx + matrix[7] * ty;
            }

            function scaleMatrix(matrix, scaleX, scaleY) {
                
                matrix[0] *= scaleX;
                matrix[1] *= scaleX;
                matrix[2] *= scaleX;
                matrix[3] *= scaleX;

                matrix[4] *= scaleY;
                matrix[5] *= scaleY;
                matrix[6] *= scaleY;
                matrix[7] *= scaleY;
            }

        }

        

        function LatLongToPixelXY(latitude, longitude) {
            var pi_180 = Math.PI / 180.0;
            var pi_4 = Math.PI * 4;
            var sinLatitude = Math.sin(latitude * pi_180);
            var pixelY = (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (pi_4)) * 256;
            var pixelX = ((longitude + 180) / 360) * 256;

            var pixel = {
                x: pixelX,
                y: pixelY
            };

            return pixel;
        }

        return this;

    }
    
    play (fromStep) {

        const _this = this;
        const maxStep = this._data.length - 1;
        const speed = 1000;

        if ( _this._step >= maxStep ) _this._step = 0;

        this._animationTimer = setInterval(function(){
            
            if ( _this._step <= maxStep ) {
                
                const pointsLength = _this._data[_this._step].length;
            
                for (var i = pointsLength; i--;) {

                    
                    
                    setTimeout(function(i){
                        
                        //console.log(i)
                            
                        _this.drawData(_this._step, i);
                        
                    }, (speed / pointsLength) * i, i)
                    
                }
                
                _this._step++;

            } else {

                _this._playButton.setAttribute('data-state', 'pause');
                clearInterval(_this._animationTimer);

            }

        },speed);

        return this;
    }

    stop () {

        const _this = this;

        clearInterval(_this._animationTimer);

        return this;
    }

}