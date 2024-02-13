/** 线程监控器 */

class Monitor{ 
    /** 锁 */
    #_t_lock = threads.lock();
    /** 被监控的线程，Thread数组 */
    #_t = [];
    /** 被监控的线程对应的名称 */
    #_t_name = [];
    /** 被监控线程对应的状态，1是状态正常，2是状态异常 */
    #_t_state = [];
    /** 上次正常时间 */
    #_t_time = [];

    #_m_lock = threads.lock();
    /** 监视器线程 */
    #_m = null;
    /** 监视器上次响应时间 */
    #_m_time = null;
    /** 关闭信号 */
    #_m_shut = false;
    /** 监视器更新间隔毫秒 */
    #_m_period = 2000;

    constructor(){}
    /** 【线程安全】开始监视线程 */
    addThread(thread, name){
        this.#_t_lock.lock();
        for(let idx = 0; idx < this.#_t.length; ++idx){
            if(this.#_t[idx] == thread){
                this.#_t_lock.unlock();
                return;
            }
        }
        this.#_t.push(thread);
        this.#_t_name.push(name);
        this.#_t_state.push(1);
        this.#_t_time.push(new Date());
        this.#_t_lock.unlock();
    }
    /** 【线程安全】停止监控线程 */
    removeThread(thread){
        this.#_t_lock.lock();
        for(let idx = 0; idx < this.#_t.length; ++idx){
            if(this.#_t[idx] != thread) continue;
            this.#_t[idx] = this.#_t[this.#_t.length-1];
            this.#_t_name[idx] = this.#_t_name[this.#_t.length-1];
            this.#_t_state[idx] = this.#_t_state[this.#_t.length-1];
            this.#_t_time[idx] = this.#_t_time[this.#_t.length-1];
            this.#_t.pop();
            this.#_t_name.pop();
            this.#_t_state.pop();
            this.#_t_time.pop();
            break;
        }
        this.#_t_lock.unlock();
    }
    /** 【线程安全】开始周期性监控 */
    startWatch(){
        this.#_m_lock.lock();
        if(this.#_m != null) return;
        this.#_m = threads.start(() => {
            while(!this.#_m_shut){
                let time = new Date();
                this.#_t_lock.lock();
                for(let idx = 0; idx < this.#_t.length; ++idx){
                    if(this.#_t[idx].isAlive()){
                        this.#_t_state[idx] = 1;
                        this.#_t_time[idx] = time;
                    } else this.#_t_state[idx] = 2;
                }
                this.#_t_lock.unlock();
                this.#_m_time = time;
                sleep(this.#_m_period);
            }
            this.#_m_lock.lock();
            this.#_m = null;
            this.#_m_lock.unlock();
        })
        this.#_m_lock.unlock();
    }
    /** 【线程安全】停止监控 */
    stopWatch(){
        this.#_m_shut = true;
    }
}

let _manager = {
    create: function(){
        return new Monitor();
    }
};

module.exports = _manager;
