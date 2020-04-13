export default class DataSet {

    constructor(url) {

        this._url = ['./data/data.json', './data/stats.json'];

        const _this = this;


        this._dataRequest = function (url, callback) {

            if (window.fetch) {
                fetch(url)
                    .then(response => response.json())
                    .then(function (data) {

                        callback(data);

                    });

            } else {
                $.ajax({
                    type: 'GET',
                    url: url,
                    dataType: 'json',
                    success: function (data) {

                        callback(JSON.parse(data));

                    }
                });
            }

        }

        return this;

    }

    load(callback) {

        const _this = this;


        this._dataRequest(this._url[0], function (data) {

            _this._dataRequest(_this._url[1], function (stats) {
                
                _this.data = [data,stats];

                callback( [data,stats] );
                
            });

        });

        return this;

    }

}