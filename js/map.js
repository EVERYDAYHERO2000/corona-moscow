import Shader from "./shader.js";

export default class Map {

    constructor (options){
        
        const _this = this;
        
        this._tileUrl = `https://{s}.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1IjoiZ2xlYWZsZXQiLCJhIjoiY2lxdWxoODl0MDA0M2h4bTNlZ2I1Z3gycyJ9.vrEWCC2nwsGfAYKZ7c4HZA`;
        
        this._map = L.map('map',{
            attributionControl: false
        });
        
        L.control.attribution({
            position: 'bottomleft'
        }).addTo(this._map);
        
        this._tileLayer = L.tileLayer(this._tileUrl,{ 
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        
        this._map.setView([options.lat, options.lon], options.zoom);
        this._tileLayer.addTo(this._map);
        
        
        
        
        return this;
        
    }
    
    setData (data) {
        
        
        
        return this;
        
    }
    
}