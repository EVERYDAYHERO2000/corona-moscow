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
            
            function format(value) {

                value = (/\.\d/.test(value)) ? value + '' : value + '.00';
                value = (value).replace(/\d(?=(\d{3})+\.)/g, '$& ').split('.')[0]
                
                return value;
            }

            return `<div class="content__inner">       
            <div class="content__date">${current.date}</div>
            <div class="content__table">
                <div class="content__header">в Москве и Московской области</div>
                <div class="content__body">
                    <div class="content__cases">
                        <div class="content__title"><span>Заболело</span></div>
                        <div class="content__value content__cases-total">${format(current.cases.total)}</div>
                        <div class="content__cases-new">${format(current.cases.new)}</div>
                    </div>
                    <div class="content__recovered">
                        <div class="content__title"><span>Выздоровело</span></div>
                        <div class="content__value content__recovered-total">${format(current.recovered.total)}</div>
                        <div class="content__recovered-new">${format(current.recovered.new)}</div>
                    </div>  
                    <div class="content__deaths">
                        <div class="content__title"><span>Умерло</span></div>
                        <div class="content__value  content__deaths-total">${format(current.deaths.total)}</div>
                        <div class="content__deaths-new">${format(current.deaths.new)}</div>
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