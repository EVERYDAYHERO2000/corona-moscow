import Shader from "./shader.js";

export default class Map {

    constructor(options) {

        window.map = this;

        const _this = this;

        this._data = [];
        this._step = 0;
        this._points = [];


        this._tileUrl = `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`;

        this._map = L.map('map', {
            attributionControl: false
        });
        this._dpr = L.Browser.retina ? 2 : 1;

        L.control.attribution({
            position: 'bottomleft'
        }).addTo(this._map);

        this._tileLayer = L.tileLayer(this._tileUrl, {
            attribution: 'Участник &copy; <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Источники данных <a target="_blank" href="https://www.rospotrebnadzor.ru/">Роспотребнадзор</a>, <a target="_blank" href="https://ru.wikipedia.org/wiki/%D0%A5%D1%80%D0%BE%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D1%8F_%D1%80%D0%B0%D1%81%D0%BF%D1%80%D0%BE%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F_COVID-19_%D0%B2_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8">Wikipedia</a>, точки на карте <a target="_blank" href="https://mz.mosreg.ru/">Министерство здравоохранения МО</a>',
            subdomains: 'abcd',
            r: L.Browser.retina ? '@2x' : '',
            maxZoom: 13,
            minZoom: 6
        });


        this._map.setView([options.lat, options.lon], options.zoom);
        this._tileLayer.addTo(this._map);

        
        this._markers = L.layerGroup().addTo(this._map);
        
        const controlsContainer = document.querySelector('.leaflet-control-zoom a:last-child');
        const playButtonTpl = `<a class="leaflet-control-play" href="#" title="Play" role="button" aria-label="Play" data-state="pause"></a>`
        controlsContainer.insertAdjacentHTML('afterend', playButtonTpl);
        this._playButton = document.body.getElementsByClassName('leaflet-control-play')[0]
        this._playButton.addEventListener("click", function (e) {

            if (this.getAttribute('data-state') == 'pause') {
                _this.play();
                this.setAttribute('data-state', 'play');
            } else {
                _this.stop();
                this.setAttribute('data-state', 'pause');

            }

        });

        //const canvasElement = document.querySelector('.leaflet-heatmap-layer');
        this._map.on("click", function(e) {

            let clickPoint = {
                x : e.containerPoint.x,
                y : e.containerPoint.y
            }

            const popup = L.popup();

            if (_this._points.length) {

                for (var i = 0; i < _this._points.length; i++) {

                    if (clickPoint.x > _this._points[i].x - 6 &&
                        clickPoint.x < _this._points[i].x + 6 &&
                        clickPoint.y > _this._points[i].y - 6 &&
                        clickPoint.y < _this._points[i].y + 6) {

                        //popup.setLatLng(e.latlng).setContent(_this._points[i].label).openOn(_this._map);

                        break;

                    }

                }

            }

        }).on('zoomend', function(){

            _this._map.invalidateSize(true);

        });




        




        return this;

    }

    setChart(chart) {

        this._chart = chart;

        return this;
    }

    setData(data) {

        const _this = this;

        this._data = data

        this._step = this._data.length - 1;

        return this;

    }

    setContent(content) {

        this._content = content;

        return this;

    }

    drawData(step) {

        this._verts = [];
        this._vertsLength = 0;

        this._step = (typeof step == 'number') ? step : this._step;

        const _this = this;

        if (this._data) {

            for (var i = 0; i < this._data[this._step].points.total.length; i++) {

                addPoint(_this, this._step, i, false);

            }

            function addPoint(_this, d, i, now) {

                const dot = _this._data[d].points.total[i];
                const pixel = LatLongToPixelXY(dot[0], dot[1]);
                const color = (now) ? [1,0.01,0] : [1,0,0];

                _this._verts.push(pixel.x, pixel.y, color[0], color[1], color[2]);
                _this._vertsLength++;

            }


            //add markers
            this._markers.clearLayers();


            for (var i = 0; i < this._data[this._step].markers.length; i++){


                let data = this._data[this._step].markers[i];
                let total = (data.name == 'Москва') ? this._data[this._step].moscow.total.cases : data.total;
                let size = (function(total){

                    let _size = 8;
                    if (total > 1) {

                        _size = Math.max(20, 6 * Math.log(total) / Math.log(2))

                    }

                    return _size;

                })(total);

                let marker = new L.Marker(data.point, {
                    icon: new L.DivIcon({
                        className: 'marker',
                        html: `<div class="marker__inner" style="max-width:${size}px; max-height:${size}px; min-width:${size}px; min-height:${size}px;"><span>${(total > 1) ? format(total) : ''}</span></div>`
                    })
                }).bindPopup(`<div>${data.name}</div><div><b>${format(total)}</b> за весь период</div>`).addTo(this._markers);
                

            }



            


        }
        
        function format(value) {

            value = (/\.\d/.test(value)) ? value + '' : value + '.00';
            value = (value).replace(/\d(?=(\d{3})+\.)/g, '$& ').split('.')[0]
                
            return value;
        }







        return this;

    }

    play (fromStep) {

        const _this = this;
        const maxStep = this._data.length - 1;
        const speed = 300;



        if ( _this._step >= maxStep ) {
            _this._step = 0;

        }

        this._animationTimer = setInterval(function(){

            if ( _this._step <= maxStep ) {


                _this.drawData(_this._step);
                
                _this._chart.setStep(_this._step);

                _this._content.drawData(_this._step);

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
