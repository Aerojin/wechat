#钱罐子Cookie方案
`现有的登录态是通过url共享的,这种方式的登录态很容易丢失,导致我们的活动页面需要反复登录,而且url这种方式表现的也不太友好,
现在整体改用cookie方案,可以避免这类问题,首先改造新旧版微信,其余的后续陆续改进`

#改造思路
* 一个站点登录, 在主域下写cookie,只要主域一致, cookie是可以共享的
* 提供一套统一的API, 避免登录态混乱
* 兼容url登录态方案, url登录态自动保存到cookie, 无缝对接



#API
```javascript
/*
    *写用户数据
    *@param {object} data           用户数据
    *@param {object} options        cookie参数
    *@param {int} options.expires   过期时间(单位:天),默认值: 1天
    *@param {string} options.path   cookie存储路径, 默认值:"/"
    *@param {string} options.domain domain, 默认值: "xiaoniuapp.com"
    *@param {bool} options.secure   是否是https, 默认值: 根据当前url判断
*/
window.user.setData({
    userId: "bb269bfd-a456-42d1-86af-54e40a7520d0",
    token: "bb269bfd-a456-42d1-86af-54e40a7520d0"
},{
    expires: 1,
    domain: "xiaoniuapp.com"
});

/*
    *获取用户数据
    *返回用户数据, 为空则返回空对象
*/
window.user.getData();

/*
    *判断用户是否登录
    *返回布尔类型, true: 已登录, false: 未登录
*/
window.user.isLogin();

```

#缺点
`主域下所有的http请求都会带上cookie, 会增加http协议的传输成本`
