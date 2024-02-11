"ui";

/** 关闭重复启动的脚本 */
function dedupScript(){
    /** 线程安全的深拷贝 */
    var engineList = engines.all();
    var me = engines.myEngine();
    console.log("[脚本去重] engineList = " + engineList);
    console.log("[脚本去重] me = " + me);
    for(var i = 0; i < engineList.length; ++i){
        if(engineList[i] == null || engineList[i] == me) continue;
        /** 当脚本名称相同，并且自身脚本是后启动的，则停止自己 */
        if(engineList[i].getSource().toString() == me.getSource().toString() && me.getId() > engineList[i].getId()){
            console.log("[脚本去重] 关闭重复启动的脚本: " + me);
            me.forceStop();
        }
    }
}
dedupScript();

/** 加载全局变量 */
require('./global.js');

class Main{

    /** 子页 */
    #_page_lock = threads.lock();
    #_page = null;

    constructor(){
        this.#load();
    }

    /** 加载主页面 */
    #load(){
        ui.statusBarColor(c_primary[0]);
        ui.layout(
            <vertical bg="{{c_gray[1]}}">
                <toolbar bg="{{c_primary[0]}}" padding="0 0 10 0">
                    <img w="40" h="40" src="data:image/png;base64,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"/>
                    <text text="GRabit" textColor="{{c_gray[2]}}" textSize="24" marginLeft="20"/>
                    <img id="exit" w="30" h="30" layout_gravity="right|center" src="@drawable/ic_clear_black_48dp" tint="{{c_gray[2]}}" foreground="?selectableItemBackground"/>
                </toolbar>
                <frame id="page_root" w="*" h="0" layout_weight="1"/>
            </vertical>
        )
        /** 结束程序 */
        ui.exit.on('click', (view) => {
            dialogs.build({
                title : "退出",
                content: "您确定要退出程序吗？",
                positive : "确定",
                negative : "取消"
            }).on("positive", (dialog) => {
                this.#unload();
            }).show();
        });

        this.#change(require("./dm/main.js").create());
    }

    /** 更换子页 */
    #change(page){
        if(page == null) return;
        page.load(ui.page_root);
        this.#_page_lock.lock();
        ui.page_root.removeAllViews();
        ui.page_root.addView(page.getLayout());
        if(this.#_page != null)
            this.#_page.unload();
        this.#_page = page;
        this.#_page_lock.unlock();
    }

    /** 卸载主页面  */
    #unload(){
        this.#_page_lock.lock();
        if(this.#_page != null){
            ui.page_root.removeAllViews();
            this.#_page.unload();
            this.#_page = null;
        }
        this.#_page_lock.unlock();
        ui.finish();
        // engines.myEngine().forceStop(); /** 结束当前脚本 */
        // engines.stopAll(); /** 结束所有脚本 */
    }

}

var main = new Main();
