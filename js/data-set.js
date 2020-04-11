export default class DataSet {

    constructor(url) {

        this._url = url;

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


        this._dataRequest(this._url, function (data) {

            _this.data = data;

            callback(_this.data);

        });

        return this;

    }

}