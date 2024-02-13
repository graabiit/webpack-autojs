"ui";

/** 关闭重复启动的脚本 */
function dedupScript(){
    /** 线程安全的深拷贝 */
    let engineList = engines.all();
    let me = engines.myEngine();
    for(let i = 0; i < engineList.length; ++i){
        if(engineList[i] == null || engineList[i] == me) continue;
        /** 当脚本名称相同，并且自身脚本是后启动的，则停止自己 */
        if(engineList[i].getSource().toString() == me.getSource().toString() && me.getId() > engineList[i].getId()){
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
                    <img w="40" h="40" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAFgAAABYAEg2RPaAAAIP0lEQVR4nO1d3XHjNhDey/Cd6uCUCs4FeOaYCk5XwSkVRB3EriC8Ck4uIBNdB3Li90gVhKzgxGdrRhlwFyIEgSBAAiRs45vBWCPxB+SH/cUCfnc6nSAiHPwUuQgLkZDAEAkJDJGQwBAJCQyRkMAQCQkMkZDAEAkJDJGQwBAJCQyRkMAQCQkMkZDAEAkJDJGQwBAJCQyRkMCQvMmnPlY3ADAHAPZ3Rn85tvT3AAC7uiXpYayuvZ059WO1BIAMABYAkFqevQeADQCsIUkLTz2s8boJOVZMCu56ktCGRwBY+iLmdRLSEPHF413uIUnvXF/0dRFyrJg9WAHA7wZHl2QvdtSgthtJuiMbM6PvbqippOwBknTp8hFeDyHH6o7I0KmmqrYDaAt2muPa7rGge3wUvnUqKS+fEHxJOQC81xxVkgrbOPGYjhUj5Q/hm59d2ZSXG4ccqwyOFVM5f3WQcV+rnCRdG5PBVNax2tTXx7Yiu4RI0pyuy7Ea+DRnvDwJQTuRGxjs/t4QEv1R+raqXzwjtjmuoMFQQpLOr67TA2FKCI7QRW0XjlVORpbbiaKDDKaePkOSZgPUiMq+MNv07dwXBCdHJ6FWmD5SR1WQUWMP+0H4FUc5+56pkO4Hv6+lZ6idSFKmotin3xS/zoTPW0OPzvzWLi9mBFQ5C4EE1Ut+JCNc0CiU1Yfq+FUvz6kNSEpOAyKjo5hTsFWcUTm7rasLaYFSwEn4pDmUE7EzjCeu9bpLoMrTubRcfalI6gV/hDSSsOgggeE7qZotubE7A/X0QGSMlvhTgHtXG1cXdE+IXf7ooT6WjUR2ntq7kbEnIpyNyl7AgfO+lmqHEurO7WVxARLR9UJLsguN8TWPsnMnUTG735DroPRzD+7GZaJxuIQgEbnkHanwSCmLdc9zh2dY8UVuBgVyeA0unUNcayX6E4L+eN4hEZUgDYVw7oykSeVWyuczIobraOzvplalfb0xvMaWJq8yp14dB1NZ1u35cHd6Ppw0bXd6PixPz4fZ1bWfD4vT86HoOJ+1XHl+v/4u6ZrLnufPqD+H+tld9Kml2UlII64qFVPRCMyVIwfPXRt4XCVJxXCjfXnPX62NLzooKwoGt/W0bx+v7mnOg98t3BZaFWdu1LFzO4XhLUl1tSfv0CNZG3hd7lLZaJ/W5AnZkwGkovqopaf5TAh8MyIz7yIDLG1ILr3QklzW9gc1TwTuSSqG6+RL+8Sk9pfe0mbTn6f5jRB3fTh7hYyQ28JYqmwkRDzwa51a0B8vjtA2VERqbtrhjnuKklh5M7xwloKFonCCE5HbEMFhQ4gYtHXZizuDtIe7YoFrj29PZLiN4q+lQMQgIjhsCOHqRz233OR8Nh1xhTupUBczdEuvDZ7mohSopN0JERz9I3Uk6Oasn80Mt6sAT0WEu5gFSVgYpH9wIBoYa1O4SZ1gmloX5LmRivbynuFEm5MA56z0beE8nzYsdWIWWwz3oNBGrBREDCMa44OVRh3JqIgIN06IAkNSJ7ogkWNYXIHln8uW9Mx3yvraSwUSYTLxJd9v6cJO6NCPEByxaw0ZFeWM7EW6iY6XLarDRSR/kKZidaiICGdzHjrY25Am9dymZx+JDPORhNfk0qAj2U36Hc4u7LbDXowiFSL6ELLTvDRzl7OZ1tWRABdupfu4Qi54E+/p1Va0wY4QfcCnzxehFGQdPr0If0SIeJpvJKekrPt3W/iJ8Dtga0PaRn9DBo78ubAQhjfT2qXrGUW/WEoqeD0VGdAj2/ufx75czyiOAbQlYs1XVQ+oEe2GCBsJ8dHBUsiJeV2ZpMSlYXeaAukLWxtiUhXShfK8PIypiqnKeDBby8uN7qcmgsPWhizoZdqQUtEoxCZG7MdqTTp8CmzIdmQuc1FD0S+XhYFhJhhuHmQV1PgK1qJVFXGblKTvRn/qp/ld3UedW9s4J6B9DsfoF6njKB/qibhLkdtjrZQKXZbgWO0pb+Y1Yp9ufQhfWzGFhKiAeTN5mlqFfvPzhpiGEFR5/9afQyAEbZnNil1nS9hkTLVgJzt/ulwAMz5QMr6Q9/e1XuzDCiOw3dP3Mrw5IlMt2BFJMM26ukdTod9WmbKlybcf0veZj+7AhBIirsebTkJYDJSk+mkCjJNkKRkai7UihDWGThZLeoazNYRdCIEQb+LvBFi8IcPZEjYZIRDy4WINeHhQxUvessGhLIueKn2iB1ZfquyFt+BwHEKYN3MpBfIIW5HHEw6aihoVXjAhOMv4o85bsei8WdQpIp04laJCW13yg8+8lv9IvSnS3gtJxz8B4G/F0Z9954qM0D5VXbleUyhjTBtS0HYXrJbqHyrDlLEOJHJvqxvwPpE2BiE8qPpED8uh0s8pRcfTkIL9+9by66OPHeRkjEGI+BDfzqRgdKySkrROPOKeVH6Am9pcenZ6MvaUYvGOcbK9uHGMWGqDJabdRXfdq7TM+8CL8VZn9dn81mSfr+FnrUkLxiJEtbRtTy/nYFBByOfht1ZGv9lpSNzeoyTDzDct6KpgfIWEcDRV7OIuQA9EVhcpIkqSrJ2iGkbcHFm+3p7KXNEwd5PB4WUHUhXC2VGuu4B7KL5TkfZBuOdaSG6qCOQYjZBwdpTDefpM2svQBUqadr0uAMctXndEik5K3vhW4252pN5T3NDtEGDOai41jo2zVcIGCH8TTEy18O3/dBNDe7IrW3qJwdRa2eBl7tuLIxox9b5ZjvF2/jvCC0H8hy6BIRISGCIhgSESEhgiIYEhEhIYIiGBIRISGCIhgSESEhgiIYEhEhIYIiGBIRISGCIhgSESEhgiISEBAP4HAHWkV2pGJEUAAAAASUVORK5CYII="/>
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

let main = new Main();
