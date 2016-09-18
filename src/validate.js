/**
 * Created by ligang on 16/9/8.
 */
(function(window){

    var defaults = {
        messages: {
            isEmpty: "不能输入为空",
            isURL: "输入有效的URL",
            isEmail: "输入有效的Email",
            isMaxLength: "输入的长度不符合",
            isMinLength: "输入的长度不符合"
        },
        callback: function(errors) {},
        errors: []
    };

    /*
     * 校验策略对象
     validateStrategies = {
         isEmpty: 是否为空，
         isURL: URL格式是否正确，
         isEmail：Email格式是否正确,
         isMaxLength: 最大长度,
         isMinLength: 最小长度,
     }
     */
    var validateStrategies = {
        isEmpty: function (val, errorMsg) {
            if (!val) {
                return errorMsg;
            }
        },
        isURL: function (val, errorMsg) {
            if (!/^(http:\/\/|https:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?$/.test(val)) {
                return errorMsg;
            }
        },
        isEmail: function (val, errorMsg) {
            if (!/\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/.test(val)) {
                return errorMsg;
            }
        },
        isMaxLength: function (val, length, errorMsg) {
            val = val || "";
            if (val.length > length) {
                return errorMsg;
            }
        },
        isMinLength: function (val, length, errorMsg) {
            val = val || "";
            if (val.length < length) {
                return errorMsg;
            }
        }
    };

    /**
     *  validator类
     *  @format [{name: "验证规则名称", fn: "验证方法"}]
     */
    var validator = function () {
        // 缓存验证策略
        this.cache = [];
    };

    /**
     * 添加要验证的策略
     * @param value 验证值
     * @param rules 验证规则 [{ name: "isEmpty", message: "不能为空" },{ name: "isMaxLength:2", message: "...."}]
     */
    validator.prototype.add = function (value, rules) {
        var self = this;
        for (var i = 0, rule; rule = rules[i++];) {
            (function (rule) {
                var strategyAry = rule.name.split(":"); // ["isMaxLength", 2]
                self.cache.push({
                    name: rule.name,
                    fn: function () {
                        var strategy = strategyAry.shift();     // [2]
                        strategyAry.unshift(value);             // [value, 2]
                        strategyAry.push(rule.message || defaults.messages[strategy]);  // [value, 2, errorMsg]
                        return validateStrategies[strategy].apply(null, strategyAry);
                    }
                });
            })(rule);
        }
    };

    /**
     * 开始验证
     * @returns {*}
     */
    validator.prototype.start = function () {
        for (var i = 0, validate; validate = this.cache[i++];) {
            var errorMsg = validate.fn();   // 执行验证策略的函数
            if (errorMsg) {
                // 将错误信息存放到errors中
                defaults.errors.push({
                    name: validate.name,
                    message: errorMsg
                });
            }
        }
    };

    /**
     * 验证
     * @param options 配置项
     *      { value: 验证值, content: { name: "isEmpty", message: "错误信息(可选)" }, callback: function(){}(可选)}
     *      { value: 验证值, content: [{ name: "isEmpty", message: "错误信息(可选)" },{ name: "isEmail" }], callback: function(){}(可选)}
     * @returns {result: 结果集(true:全部验证通过, false:存在验证不过的项), content:{name:验证未通过的策略类名, message: 错误信息}}
     */
    var validate = function (options){
        /* 清空错误信息 */
        defaults.errors = [];

        /* 初始化验证类 */
        var validatorInstance = new validator();

        /* 添加验证 */
        // 如果非Array,则表示传入单个验证策略;此处强制转化为数组便于统一处理
        var content = [];
        Object.prototype.toString.call(options.content) !== "[object Array]" ?
            content.push(options.content) : content = content.concat(options.content);
        validatorInstance.add(options.value, content);

        /* 开始验证 */
        validatorInstance.start();
        // 结果{true: 全部验证通过, false: 存在验证不通过的选项}
        var result = {
            result: defaults.errors.length == 0 ? true : false,
            content: defaults.errors
        };

        /* 执行回调 */
        typeof options.callback === "function" ? options.callback(result) : defaults.callback(result);
        /* 返回结果集 */
        return result;
    };


    /**
     * 根据指定name获取对应错误信息
     * @param name 验证类名称
     * @returns {string} 错误信息
     * 注意: 无错误信息时,返回""
     */
    validate.getErrorMsgByName = function(result, name){
        var errorContent = result.content;
        // 如果错误信息集为空,则直接返回结果
        if(errorContent.length === 0) {
            return "";
        }

        // 查找指定name的错误信息
        var errprMsg = "";
        errorContent.filter(function(obj, index, ary){
            if(obj.name === name) {
                errprMsg = obj.message;
                return;
            }
        });
        return errprMsg;
    };

    window.validate = validate;
})(window);

/*
 * 作为commonjs模块导出
 */
if(typeof module !== "undefined" && module.exports) {
    module.exports = validate;
}