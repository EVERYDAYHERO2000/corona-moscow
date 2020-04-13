export default class Content {

    constructor() {

        this._container = document.querySelector('#content');

        this._current = {
            date: '',
            cases: {
                new: '',
                total: ''
            },
            deaths: {
                new: '',
                total: ''
            },
            recovered: {
                new: '',
                total: ''
            }
        }

        this._tpl = function (current) {

            return `<div class="content__inner">       
            <div class="content__date">${current.date}</div>
            <div class="content__table">
                <div class="content__header">в Москве и Московской области</div>
                <div class="content__body">
                    <div class="content__cases">
                        <div class="content__title">Заболело</div>
                        <div class="content__value content__cases-total">${current.cases.total}</div>
                        <div class="content__cases-new">${current.cases.new}</div>
                    </div>
                    <div class="content__recovered">
                        <div class="content__title">Выздоровело</div>
                        <div class="content__value content__recovered-total">${current.recovered.total}</div>
                        <div class="content__recovered-new">${current.recovered.new}</div>
                    </div>  
                    <div class="content__deaths">
                        <div class="content__title">Умерло</div>
                        <div class="content__value  content__deaths-total">${current.deaths.total}</div>
                        <div class="content__deaths-new">${current.deaths.new}</div>
                    </div>    
                </div>    
            </div>
        </div>`
        };

        return this;
    }

    setData(data) {

        this._data = data;
        
        this.drawData(data.length - 1);

        return this;
    }

    drawData(step) {


        this._current = {

            date: this._data[step].date,
            cases: {
                new: (this._data[step].moscowAndOblast.new.cases) ? '+' + this._data[step].moscowAndOblast.new.cases : '',
                total: this._data[step].moscowAndOblast.total.cases
            },
            deaths: {
                new: (this._data[step].moscowAndOblast.new.deaths) ? '+' + this._data[step].moscowAndOblast.new.deaths : '',
                total: this._data[step].moscowAndOblast.total.deaths
            },
            recovered: {
                new: (this._data[step].moscowAndOblast.new.recovered) ? '+' + this._data[step].moscowAndOblast.new.recovered : '',
                total: this._data[step].moscowAndOblast.total.recovered
            }

        }



        this._container.innerHTML = this._tpl(this._current);

        return this;

    }

}