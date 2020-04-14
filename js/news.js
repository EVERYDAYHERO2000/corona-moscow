export default class News {

    constructor(options) {
        
        this.data = {
            
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