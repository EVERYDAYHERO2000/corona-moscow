export default class Content {

    constructor() {

        this._container = document.querySelector('#content');

        this._current = {
            date: '',
            cases: {
                new: '',
                total: '',
                current: '' 
            },
            deaths: {
                new: '',
                total: ''
            },
            recovered: {
                new: '',
                total: ''
            },
            news : ''
        }

        this._tpl = function (current) {
            
            function format(value) {

                value = (/\.\d/.test(value)) ? value + '' : value + '.00';
                value = (value).replace(/\d(?=(\d{3})+\.)/g, '$& ').split('.')[0]
                
                return value;
            }
            
            let mortality = (current.deaths.total / ( current.deaths.total + current.recovered.total ) * 100).toFixed(2);
                mortality = (mortality == '0.00') ? 0 : mortality;
 
            return `<div class="content__inner">       
            <div class="content__date">${current.date}</div>
            <div class="content__table">
                <div class="content__header">в Москве и Московской области</div>
                <div class="content__body">
                    <div class="content__cases">
                        <div class="content__title"><span>Заболело</span></div>
                        <div class="content__value content__cases-total">${format(current.cases.new)}</div>
                        <div class="content__total content__cases-new">
                            <span data-legend="total-cases" ><b>${format(current.cases.total)}</b> за весь период</span><br>
                            <span data-legend="current-cases"><b>${format(current.cases.current)}</b> болеют</span></div>
                    </div>
                    <div class="content__recovered">
                        <div class="content__title"><span>Выздоровело</span></div>
                        <div class="content__value content__recovered-total">${format(current.recovered.new)}</div>
                        <div class="content__total content__recovered-new">
                            <span data-legend="total-recovered"><b>${format(current.recovered.total)}</b> за весь период</span></div>
                    </div>  
                    <div class="content__deaths">
                        <div class="content__title"><span>Умерло</span></div>
                        <div class="content__value  content__deaths-total">${format(current.deaths.new)}</div>
                        <div class="content__total content__deaths-new">
                            <span><b>${format(current.deaths.total)}</b> за весь период</span><br>
                            <span><b>${mortality}%</b> летальность</span></div>
                    </div>    
                </div> 
                <div class="content__footer">
                    <div class="content__news">${(current.news.text) ? `<span>${current.news.text}</span> <a target="_blank" href="${current.news.url}">источник</a>` : ''}</div>
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
                new: (this._data[step].moscowAndOblast.new.cases) ? '+' + this._data[step].moscowAndOblast.new.cases : '-',
                total: this._data[step].moscowAndOblast.total.cases,
                current: this._data[step].moscowAndOblast.total.cases - this._data[step].moscowAndOblast.total.deaths - this._data[step].moscowAndOblast.total.recovered
            },
            deaths: {
                new: (this._data[step].moscowAndOblast.new.deaths) ? '+' + this._data[step].moscowAndOblast.new.deaths : '-',
                total: this._data[step].moscowAndOblast.total.deaths
            },
            recovered: {
                new: (this._data[step].moscowAndOblast.new.recovered) ? '+' + this._data[step].moscowAndOblast.new.recovered : '-',
                total: this._data[step].moscowAndOblast.total.recovered
            },
            news : { 
                text : (this._data[step].news) ? this._data[step].news.text : '',
                url : (this._data[step].news) ? this._data[step].news.url : ''
            }

        }



        this._container.innerHTML = this._tpl(this._current);

        return this;

    }

}