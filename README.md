# validate
此模块目前仅供PTFED内部使用

## 功能
- 无其他任何依赖
- 可自定义错误信息
- 支持回调

## 如何使用
```html
<script type="text/javascript" src="validate.min.js"></script>
<script type="text/javascript">
    validate({
        value: "",
        content: [{
            name: "isEmpty"
        },{
            name: "isEmail",
            message: "请您输入正确的邮箱地址"
        }],
        callback: function(errors){
            console.log(errors);
        }
    });
</script>
```

## 目前提供的验证方法
| 验证策略 | 说明 |
|:-------------|:-------|
| isEmpty | 验证是否为空 |
| isURL | 验证是否为URL |
| isEmail | 验证是否为Email |
| isMaxLength:num | 验证长度是否超过num |
| isMinLength:num | 验证长度是否小于num |
