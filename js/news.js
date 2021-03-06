export default class News {

    constructor(options) {
        
        
        this.data = {
            20200520 : ["Число поборовших COVID-19 в России впервые превысило число новых случаев","https://www.gazeta.ru/social/news/2020/05/20/n_14443501.shtml"],
            20200513 : ["Депздрав опроверг заявления о некорректности подсчета смертности от COVID-19","https://mosgorzdrav.ru/ru-RU/news/default/card/3952.html"],
            20200512 : ["Россия вышла на второе место в мире по числу заразившихся коронавирусом", "https://www.rbc.ru/society/12/05/2020/5eba523a9a794742936e04f3"],
            20200511 : ["Путин объявил о завершении 12 мая периода нерабочих дней в России","https://www.interfax.ru/russia/708138"],
            20200509 : ["В больнице для пациентов с коронавирусом на севере Москвы произошел пожар", "https://tass.ru/proisshestviya/8437241"],
            20200508 : ["Роспотребнадзор рекомендовал приостановить раздельный сбор мусора на время пандемии","https://tjournal.ru/news/166786-rospotrebnadzor-rekomendoval-priostanovit-razdelnyy-sbor-musora-na-vremya-pandemii"],
            20200507 : ["Собянин: по выявляемости COVID-19 Москва превысила показатели Нью-Йорка", "https://ria.ru/20200507/1571087992.html"],
            20200506 : ["Россия стала пятой в мире по числу заболевших коронавирусом","https://www.fontanka.ru/2020/05/06/69243418/"],
            20200505 : ["Временные госпитали в Москве строят круглосуточно около 10 тысяч человек", "https://360tv.ru/news/obschestvo/vremennye-gospitali-v-moskve-strojat-kruglosutochno-okolo-10-tysjach-chelovek/"],
            20200504 : ["В Москве определены 44 площадки для развертывания временных госпиталей", "https://www.1tv.ru/news/2020-05-04/385215-v_moskve_opredeleny_44_ploschadki_dlya_razvertyvaniya_vremennyh_gospitaley"],
            20200503 : ["Эксперт Минздрава спрогнозировал пик эпидемии коронавируса в России", "https://www.m24.ru/news/obshchestvo/03052020/116599"],
            20200502 : ["Штрафы за нарушения самоизоляции в Москве пойдут на борьбу с COVID-19","https://www.rbc.ru/rbcfreenews/5ead3a7a9a79473382020fd0"],
            20200501 : ["Скворцова заявила о выходе на плато по заболеваемости коронавирусом", "https://www.kommersant.ru/doc/4335500"],
            20200429 : ["Глава Подмосковья заявил о выходе на плато по приросту заболевших коронавирусом", "https://forbes-ru.turbopages.org/s/forbes.ru/newsroom/obshchestvo/399417-glava-podmoskovya-zayavil-o-vyhode-na-plato-po-prirostu-zabolevshih"],
            20200428 : ["Обращение Владимира Путина по ситуации с коронавирусом", "https://youtu.be/cXraExKxJe8"],
            20200427 : ["Власти Москвы назвали условия для снятия ограничений из-за коронавируса","https://www.rbc.ru/rbcfreenews/5ea733899a7947c27e2cfdf7"],
            20200426 : ["Эксперт назвал возможные сроки завершения пандемии в России","https://tass.ru/obschestvo/8339541"],
            20200425 : ["Обнародован список российских врачей, погибших в период пандемии COVID-19", "https://regnum.ru/news/2929037.html"],
            20200422 : ["Начала работу автоматизированная система контроля пропусков","https://echo.msk.ru/news/2629676-echo.html"],
            20200421 : ["Построенная за месяц инфекционная больница в ТиНАО начала принимать пациентов","https://www.mos.ru/news/item/72917073/"],
            20200419 : ["Россия вошла в «десятку» стран с наибольшим числом зараженных коронавирусом", "https://www.rosbalt.ru/world/2020/04/19/1839182.html"],
            20200418 : ["В Москве аннулировали 554 пропуска у нарушителей карантина","https://ria.ru/20200418/1570236210.html"],
            20200417 : ["В Москве донорам плазмы для заразившихся коронавирусом будут выплачивать деньги","https://tass.ru/obschestvo/8267599"],
            20200416 : ["В Москве пациенты с ОРВИ будут получать предписание об обязательной самоизоляции","https://mosgorzdrav.ru/ru-RU/news/default/card/3791.html"],
            20200415 : ["Очереди в метро и пробки на въездах в город. В Москве запустили пропускной режим","https://www.forbes.ru/newsroom/obshchestvo/398031-ocheredi-v-metro-i-probki-na-vezdah-kak-v-moskve-zapustili-propusknoy"],
            20200414 : ["В Москве оформили 3,2 млн цифровых пропусков. 55 нарушителей карантина оштрафованы", "https://tass.ru/moskva/8238201"],
            20200413 : ["Введен пропускной режим для передвижения по городу на личном или общественном транспорте. Проверять цифровые пропуска в столице начнут с 15 апреля", "https://www.mos.ru/news/item/72567073/"],
            20200412 : ["Составлено 1 358 протоколов за нарушение социальной дистанции", "https://ria.ru/20200412/1569928872.html"],
            20200411 : ["В Москве возле больницы образовалась пробка из скорых с зараженными", "https://lenta.ru/news/2020/04/10/probka/"],
            20200410 : ["Власти сообщили о работающих на пределе московских больницах","https://lenta.ru/news/2020/04/10/skoraya/"],
            20200409 : ["Столичные кладбища закроют для посещений из-за коронавируса", "https://www.interfax.ru/moscow/703422"],
            20200407 : ["Более 7 тысяч онлайн-консультаций провели врачи для больных коронавирусом", "https://www.mos.ru/news/item/72292073/"],
            20200406 : ["Почти 85% заболевших младше 65 лет", "https://mosgorzdrav.ru/ru-RU/news/default/card/3731.html"],
            20200405 : ["Москва технически готова к запуску умной системы контроля самоизоляции в случае необходимости","https://www.mos.ru/news/item/72153073/"],
            20200404 : ["Вступили в силу поправки в КоАП, устанавливающие ответственность за нарушение режима повышенной готовности","https://www.msk.kp.ru/daily/27113/4191433/"],
            20200403 : ["90% людей старше 65 лет соблюдают режим самоизоляции","https://iz.ru/995361/2020-04-03/pochti-90-liudei-starshe-65-let-sobliudaiut-rezhim-samoizoliatcii"],
            20200402 : ["Президент Владимир Путин подписал указ о продлении нерабочих дней до 1 мая","https://www.sobyanin.ru/koronavirus-prodlenie-domr-perenos-vvedeniya-propuskov"],
            20200401 : ["Шереметьево временно закрывает международный терминал D","https://www.interfax.ru/moscow/701861"],
            20200331 : ["Более 10 тысяч человек обратились в службу занятости за выплатами для безработных","https://rg.ru/2020/03/31/reg-cfo/rakova-bolee-10-tysiach-chelovek-obratilis-za-vyplatami-dlia-bezrabotnyh.html"],
            20200330 : ["Большинство новых заболевших - молодые люди от 18 до 40 лет","https://www.mskagency.ru/materials/2988293"],
            20200329 : ["Первый день нерабочей недели. Почти 40% пациентов на ИВЛ в Москве моложе 40 лет", "https://ria.ru/20200329/1569313597.html"],
            20200328 : ["В Москве провели 6,5 тысяч исследований на короновирус за сутки", "https://mosgorzdrav.ru/ru-RU/news/default/card/3683.html"],
            20200327 : ["Около 100 человек в Москве проходят лечение от коронавируса на дому","https://rg.ru/2020/03/26/okolo-100-chelovek-v-moskve-prohodiat-lechenie-ot-koronavirusa-na-domu.html"],
            20200326 : ["Вводится обязательный домашний карантин для жителей старше 65 лет, а также для москвичей с хроническими заболеваниями", "https://mosgorzdrav.ru/ru-RU/news/default/card/3658.html"],
            20200325 : ["Президент объявил о предстоящей нерабочей неделе и призвал всех побыть дома", "https://www.rbc.ru/society/25/03/2020/5e7b5c939a7947f15a9150f0"],
            20200323 : ["Отменяется льготный проезд в общественном транспорте для школьников","https://www.rbc.ru/society/23/03/2020/5e7866169a794714f57c5718"],
            20200320 : ["Шереметьево приостановило работу международных терминалов E и С","https://www.kp.ru/daily/27106/4181082/"],
            20200318 : ["Сергей Собянин попросил столичные компании перевести сотрудников на удаленную работу","https://www.mskagency.ru/materials/2983669"],
            20200317 : ["В СМИ распространялась информация, якобы Москву закроют на карантин","https://www.gazeta.ru/social/2020/03/17/13009513.shtml"],
            20200316 : ["Запрещается проведение любых досуговых мероприятий с участием более 50 человек","https://www.interfax.ru/russia/699385"],
            20200315 : ["Из больницы в Коммунарке выписаны 52 человека, у них не подтвердился коронавирус","https://www.interfax.ru/russia/699176"],
            20200314 : ["Вводится свободное посещение школ. Школы продолжают работать","https://ria.ru/20200314/1568602956.html"],
            20200313 : ["В московские больницы временно прекращён доступ посетителей к пациентам","https://www.mos.ru/news/item/71009073/"],
            20200310 : ["Определена площадка для строительства новой инфекционной больницы в новой Москве","https://www.mos.ru/news/item/70762073/"],
            20200307 : ["Выписан первый в Москве выздоровевший пациент","https://www.mos.ru/news/item/70707073/"],
            20200306 : ["У большинства заболевших коронавирусом легкие симптомы болезни","https://mosgorzdrav.ru/ru-RU/news/default/card/3577.html"],
            20200305 : ["Москва ввела режим готовности для профилактики коронавируса","https://www.sobyanin.ru/koronavirus-o-dopmerah-po-predotvrascheniyu-rasprostraneniya-infektsii"],
            20200304 : ["Все прибывающие из Китая, Южной Кореи и Ирана получают постановление об обязательной изоляции на дому","https://mosgorzdrav.ru/ru-RU/news/default/card/3573.html"],
            20200303 : ["В Коммунарке оборудован новый больничный комплекс для пациентов с подозрением на коронавирус","https://www.mskagency.ru/materials/2978415"],
            20200302 : ["Первый заболевший москвич находится в инфекционной больнице и получает необходимое лечение","https://www.interfax.ru/russia/697390"]
    
        }
        
        
        
        return this;
    }
    
}