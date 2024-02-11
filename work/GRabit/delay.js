/** 延时模块 */

/** 【线程安全】时钟延时模块 */
class Clock{
    /** 启用或停止 */
    #_c_enable = false;
    /** 远程时钟地址 */
    #_c_url = "";
    /** 老化因子 */
    #_c_factor = 0.5;
    /** 解析器，从应答中解析出远程时钟毫秒级时间戳 */
    #_c_parser = null;
    /** 比远程时钟慢的毫秒数 */
    #_delay = null;
    /** 报文记录 */
    #_response = "";
    /** 最近失败次数 */
    #_failed = 0;
    /** 最近更新时间 */
    #_time = null;

    constructor(){}
    reset(){
        this.#_c_enable = false;
        this.#_c_url = "";
        this.#_c_factor = 0.5;
        this.#_c_parser = null;
        this.#_delay = null;
        this.#_response = "";
        this.#_failed = 0;
        this.#_time = null;
    }
    setEnable(enable){
        this.#_c_enable = enable;
    }
    setUrl(url){
        this.#_c_url = url;
    }
    setFactor(factor){
        this.#_c_factor = factor;
    }
    setParser(parser){
        this.#_c_parser = parser;
    }
    getEnable(){
        return this.#_c_enable;
    }
    getUrl(){
        return this.#_c_url;
    }
    getFactor(){
        return this.#_c_factor;
    }
    getDelay(){
        return this.#_delay;
    }
    getResponse(){
        return this.#_response;
    }
    getFailed(){
        return this.#_failed;
    }
    getTime(){
        return this.#_time;
    }
    calc(){
        if(!this.#_c_enable || this.#_c_url === "") return;
        /** 防多线程竞争，先缓存变量，运算后再赋值 */
        var url = this.#_c_url;
        var factor = this.#_c_factor;
        var parser = this.#_c_parser;
        var delay = this.#_delay;
        var response = "";
        var failed = this.#_failed;
        try{
            var st = (new Date()).getTime();
            var ret = http.get(url);
            var et = (new Date()).getTime();
            var body = ret.body.string();
            response = JSON.stringify(ret) + "\n\n" + body;
            if(ret.statusCode != 200){
                this.#_response = response;
                failed += 1;
                this.#_failed = failed;
                return;
            }
            var lt = st + (et - st) / 2;
            var rt;
            try{
                rt = parseInt(parser(body));
            } catch(err){
                console.error(err);
                response += "\n\n" + err.toString();
                this.#_response = response;
                failed += 1;
                this.#_failed = failed;
                return;
            }
            if(delay === null) delay = rt-lt; /** 首次计算延时 */
            delay = delay*factor + (1-factor)*(rt-lt);
            this.#_delay = Math.trunc(delay);
            this.#_response = response;
            this.#_failed = 0;
            this.#_time = new Date();
        } catch(err){
            console.error(err);
            this.#_response = err.toString();
            failed += 1;
            this.#_failed = failed;
        }
    }

}


/** 【线程安全】网络延时模块 */
class Server{
    /** 启用或停止 */
    #_c_enable = false;
    /** 服务器地址 */
    #_c_url = "";
    /** 老化因子 */
    #_c_factor = 0.5;
    /** 比服务器慢的毫秒数 */
    #_delay = null;
    /** 报文记录 */
    #_response = "";
    /** 最近失败次数 */
    #_failed = 0;
    /** 最近更新时间 */
    #_time = null;

    constructor(){}
    reset(){
        this.#_c_enable = false;
        this.#_c_url = "";
        this.#_c_factor = 0.5;
        this.#_delay = null;
        this.#_response = "";
        this.#_failed = 0;
        this.#_time = null;
    }
    setEnable(enable){
        this.#_c_enable = enable;
    }
    setUrl(url){
        this.#_c_url = url;
    }
    setFactor(factor){
        this.#_c_factor = factor;
    }
    getEnable(){
        return this.#_c_enable;
    }
    getUrl(){
        return this.#_c_url;
    }
    getFactor(){
        return this.#_c_factor;
    }
    getDelay(){
        return this.#_delay;
    }
    getResponse(){
        return this.#_response;
    }
    getFailed(){
        return this.#_failed;
    }
    getTime(){
        return this.#_time;
    }
    calc(){
        if(!this.#_c_enable || this.#_c_url === "") return;
        /** 防多线程竞争，先缓存变量，运算后再赋值 */
        var url = this.#_c_url;
        var factor = this.#_c_factor;
        var delay = this.#_delay;
        var response = "";
        var failed = this.#_failed;
        try{
            var st = (new Date()).getTime();
            var ret = http.get(url);
            var et = (new Date()).getTime();
            var body = ret.body.string();
            response = JSON.stringify(ret) + "\n\n" + body;
            if(ret.statusCode != 200){
                this.#_response = response;
                failed += 1;
                this.#_failed = failed;
                return;
            }
            if(delay === null) delay = (et - st) / 2; /** 首次计算延时 */
            delay = delay*factor + (1-factor)*(et-st)/2;
            this.#_delay = Math.trunc(delay);
            this.#_response = response;
            this.#_failed = 0;
            this.#_time = new Date();
        } catch(err){
            console.error(err);
            this.#_response = err.toString();
            failed += 1;
            this.#_failed = failed;
        }
    }
}

/** 【线程安全】延时模块 */
class Delay{
    /** 时钟延时子模块 */
    _clock = new Clock();
    /** 网络延时子模块 */
    _server = new Server();
    /** 启用或停止 */
    #_c_enable = false;
    /** 总延时 */
    #_all = null;
    /** 最近更新时间 */
    #_time = null;

    constructor(){}
    reset(){
        this.#_c_enable = false;
        this.#_all = null;
        this.#_time = null;
    }
    getEnable(){
        return this.#_c_enable;
    }
    setEnable(enable){
        this.#_c_enable = enable;
    }
    getAll(){
        return this.#_all;
    }
    getTime(){
        return this.#_time;
    }
    /** 自动调用_clock与_server子模块的calc方法 */
    calc(){
        if(!this.#_c_enable) return;
        var all = null;
        try{
            var delay = 0;
            var all = null;
            var time = null;
            if(this._clock.getEnable()){
                this._clock.calc();
                delay = this._clock.getDelay();
                if(delay != null){
                    if(all == null) all = 0;
                    all += delay;
                    if(time == null || time.getTime() < this._clock.getTime().getTime())
                        time = this._clock.getTime();
                }
            }
            if(this._server.getEnable()){
                this._server.calc();
                delay = this._server.getDelay();
                if(delay != null){
                    if(all == null) all = 0;
                    all += delay;
                    if(time == null || time.getTime() < this._server.getTime().getTime())
                        time = this._server.getTime();
                }
            }
            if(all != null){
                this.#_all = all;
                this.#_time = time;
            }
        } catch(err){
            console.error(err);
        }
    }
}

var _manager = {
    create : function(){
        return new Delay();
    }
}

module.exports = _manager;
